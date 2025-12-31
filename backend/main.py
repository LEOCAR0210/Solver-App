from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from datetime import datetime
import os

app = FastAPI()

# Habilitar CORS (útil para desarrollo desde http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # ajustar en producción
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
        f"Cómodo: {entrada.como}\n"
        f"Cuándo: {entrada.cuando}\n"
        f"Quién: {entrada.quien}\n"
        f"Qué pasó: {entrada.quePaso}\n"
        f"Respuesta generada:\n{respuesta}\n"
    )
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(log_entry)

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

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Eres un experto en resolución de problemas, metodologías 5 Porqués, Ishikawa, FMEA y mejora continua."},
                {"role": "user", "content": prompt}
            ]
        )
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
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_KEY:
    # Reemplaza la llamada real por una función mock para pruebas locales
    def generar_respuesta_mock(prompt: str) -> str:
        return (
            "Respuesta mock: análisis simulado. Si quieres la respuesta real, "
            "configura la variable de entorno OPENAI_API_KEY con tu clave."
        )

    # Ajustamos el endpoint para usar el mock en lugar de OpenAI
    @app.post("/analizar-problema-mock")
    async def analizar_problema_mock(datos: ProblemaInput):
        resultado = generar_respuesta_mock(str(datos))
        registrar_auditoria(datos, resultado)
        return {"analisis": resultado}
