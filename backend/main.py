from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os

# Intentamos importar la nueva clase OpenAI (openai>=1.0.0)
try:
    from openai import OpenAI
    openai_client_available = True
except Exception:
    # Si falla la importación, marcamos que no hay cliente moderno instalado
    openai_client_available = False

app = FastAPI()

# Habilitar CORS (útil para desarrollo desde http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Aseguramos que el directorio de logs exista
LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "analisis_log.txt")
os.makedirs(LOG_DIR, exist_ok=True)

class ProblemaInput(BaseModel):
    problema: str
    ubicacion: str
    como: str
    cuando: str
    quien: str
    quePaso: str

def registrar_auditoria(entrada: ProblemaInput, respuesta: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = (
        f"---\n"
        f"Fecha y hora: {timestamp}\n"
        f"Problema: {entrada.problema}\n"
        f"Ubicación: {entrada.ubicacion}\n"
        f"Cómo: {entrada.como}\n"
        f"Cuándo: {entrada.cuando}\n"
        f"Quién: {entrada.quien}\n"
        f"Qué pasó: {entrada.quePaso}\n"
        f"Respuesta generada:\n{respuesta}\n"
    )
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(log_entry)

# Prepara cliente OpenAI si existe clave y la librería moderna está disponible
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
client = None
if OPENAI_KEY and openai_client_available:
    client = OpenAI(api_key=OPENAI_KEY)

@app.post("/analizar-problema")
async def analizar_problema(datos: ProblemaInput):
    prompt = (
        "Un usuario ha reportado un problema con los siguientes detalles:\n"
        f"- Problema: {datos.problema}\n"
        f"- Ubicación: {datos.ubicacion}\n"
        f"- Cómo ocurrió: {datos.como}\n"
        f"- Cuándo ocurrió: {datos.cuando}\n"
        f"- Quién estuvo involucrado: {datos.quien}\n"
        f"- Qué pasó exactamente: {datos.quePaso}\n\n"
        "Como experto en resolución de problemas y metodologías como los 5 Porqués, Ishikawa y FMEA, "
        "describe la causa raíz más probable y sugiere un enfoque de análisis estructurado."
    )

    # Si no tenemos cliente moderno disponible, indicamos el problema
    if not client:
        raise HTTPException(
            status_code=500,
            detail=(
                "El cliente moderno de OpenAI no está disponible o no se encontró OPENAI_API_KEY. "
                "Asegúrate de tener openai>=1.0.0 y la variable OPENAI_API_KEY configurada.\n"
                "Alternativa temporal: pip install openai==0.28 (pero lo recomendado es actualizar el código)."
            ),
        )

    try:
        # Usando la nueva interfaz: client.chat.completions.create(...)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Eres un experto en resolución de problemas, metodologías 5 Porqués, Ishikawa, FMEA y mejora continua."},
                {"role": "user", "content": prompt}
            ],
        )

        # Extraer texto de la respuesta (compatibilidades con la estructura de retorno)
        try:
            resultado = response.choices[0].message.content
        except Exception:
            # fallback a forma estilo diccionario si aplica
            resultado = response["choices"][0]["message"]["content"]

        # Registrar en el log
        registrar_auditoria(datos, resultado)

        return {"analisis": resultado}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar el análisis: {str(e)}")

# Ruta raíz simple
@app.get("/")
def root():
    return {"mensaje": "Backend activo. Usa POST /analizar-problema para probar."}

# Fallback: si no hay clave de OpenAI, devolvemos una respuesta mock simple
if not OPENAI_KEY:
    def generar_respuesta_mock(prompt: str) -> str:
        return (
            "Respuesta mock: análisis simulado. Si quieres la respuesta real, "
            "configura la variable de entorno OPENAI_API_KEY con tu clave."
        )

    @app.post("/analizar-problema-mock")
    async def analizar_problema_mock(datos: ProblemaInput):
        resultado = generar_respuesta_mock(str(datos))
        registrar_auditoria(datos, resultado)
        return {"analisis": resultado}
