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

class problema(BaseModel):
    Problem: str
    descripcion: str

class expertopinions(BaseModel):
    metodo: str
    respuesta: str

class fivewhysanalysis(BaseModel):
    metodo: str
    respuesta: str

class fmeaanalysis(BaseModel):
    metodo: str
    respuesta: str

class ishikawadiagram(BaseModel):
    metodo: str
    respuesta: str

class paretoanalysis(BaseModel):
    metodo: str
    respuesta: str

class rootcauseconclusionsal(BaseModel):
    respuesta: str

class conclusion(BaseModel):
    respuesta: str

class solutionproposal(BaseModel):
    propuesta: str

@app.post("/problema/")
def recibir_problema(problema: problema):
    return {"mensaje": "Problema recibido", "descripcion": problema.descripcion}

@app.post("/expertopinions/")
def aplicar_metodologia(metodologia: expertopinions):
    return {"mensaje": f"Metodología {metodologia.metodo} aplicada", "respuesta": metodologia.respuesta}

@app.post("/fivewhysanalysis/")
def aplicar_metodologia(metodologia: fivewhysanalysis):
    return {"mensaje": f"Metodología {metodologia.metodo} aplicada", "respuesta": metodologia.respuesta}

@app.post("/fmeaanalysis/")
def aplicar_metodologia(metodologia: fmeaanalysis):
    return {"mensaje": f"Metodología {metodologia.metodo} aplicada", "respuesta": metodologia.respuesta}

@app.post("/ishikawadiagram/")
def aplicar_metodologia(metodologia: ishikawadiagram):
    return {"mensaje": f"Metodología {metodologia.metodo} aplicada", "respuesta": metodologia.respuesta}

@app.post("/paretoanalysis/")
def aplicar_metodologia(metodologia: paretoanalysis):
    return {"mensaje": f"Metodología {metodologia.metodo} aplicada", "respuesta": metodologia.respuesta}

@app.post("/rootcauseconclusionsal/")
def aplicar_metodologia(metodologia:  rootcauseconclusionsal):
    return {"mensaje": f"Metodología {metodologia.metodo} aplicada", "respuesta": metodologia.respuesta}

@app.post("/conclusion/")
def recibir_conclusion(respuesta: conclusion):
    return {"mensaje": "Conclusion recibida", "respuesta": conclusion}

@app.post("/solutionproposal/")
def recibir_solucion(solucion: solutionproposal):
    return {"mensaje": "Solución propuesta recibida", "propuesta": solucion.propuesta}

@app.get("/")
def home():
    return {"mensaje": "Bienvenido a la aplicación para su solucion"}
    @app.post("/solutionproposal/")
    def recibir_solucion(solucion: solutionproposal):
        return {"mensaje": "Solución propuesta recibida", "propuesta": solucion.propuesta}