from fastapi import FastAPI

# from app.components.problema import *
# from app.components.conclusion import *

from components import problema, conclusion

app = FastAPI()

# Registrar los routers
app.include_router(problema.router)
app.include_router(conclusion.router)
