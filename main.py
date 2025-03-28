from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Modelo de cliente para los datos que recibiremos
class Cliente(BaseModel):
    nombre: str
    email: str
    pregunta: str

# Ruta para recibir las preguntas
@app.post("/pregunta/")
async def recibir_pregunta(cliente: Cliente):
    # Aquí se hace la interacción con el modelo LLM
    respuesta = obtener_respuesta_IA(cliente.pregunta)  # Función que conecta con tu IA
    # Guardamos los datos en la base de datos (ejemplo simplificado)
    guardar_en_base_datos(cliente)
    return {"respuesta": respuesta}

def obtener_respuesta_IA(pregunta: str):
    # Aquí iría tu lógica para llamar al LLM, como OpenAI o un modelo local
    return "Esta es la respuesta generada por la IA para: " + pregunta

def guardar_en_base_datos(cliente: Cliente):
    # Aquí conectas tu base de datos para guardar la información
    # Por ejemplo, podrías guardar en una base de datos SQL, MongoDB, etc.
    pass
