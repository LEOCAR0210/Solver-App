from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Modelo de datos
class Problema(BaseModel):
    descripcion: str

# Modelo de datos
class solutionproposal(BaseModel):
    propuesta: str

@app.get("/")
def home():
    return {"mensaje": "Bienvenido a la aplicacion de Soluciones"}
    @app.post("/problema/")
    def recibir_problema(problema: Problema):
        return {"mensaje": "Problema recibido", "descripcion": problema.descripcion}
    @app.post("/solutionproposal/")
    def recibir_solucion(solucion: solutionproposal):
       return {"mensaje": "Solución propuesta recibida", "propuesta": solucion.propuesta}