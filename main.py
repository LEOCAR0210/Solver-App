from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Habilitar CORS para permitir el acceso desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite cualquier origen (ajústalo en producción)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Problema(BaseModel):
    descripcion: str

class Metodologia(BaseModel):
    metodo: str
    respuesta: str

class Solucion(BaseModel):
    propuesta: str

@app.post("/problema/")
def recibir_problema(problema: Problema):
    return {"mensaje": "Problema recibido", "descripcion": problema.descripcion}

@app.post("/metodologia/")
def aplicar_metodologia(metodologia: Metodologia):
    return {"mensaje": f"Metodología {metodologia.metodo} aplicada", "respuesta": metodologia.respuesta}

@app.post("/solucion/")
def recibir_solucion(solucion: Solucion):
    return {"mensaje": "Solución propuesta recibida", "propuesta": solucion.propuesta}

@app.get("/")
def home():
    return {"mensaje": "Bienvenido a la aplicación para su solucion"}

