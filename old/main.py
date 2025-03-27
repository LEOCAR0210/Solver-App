from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Problema(BaseModel):
    descripcion: str
    observaciones: str

@app.post("/iniciar")
def iniciar_analisis(problema: Problema):
    return {"mensaje": "Análisis iniciado", "problema": problema}