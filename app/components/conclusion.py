from fastapi import APIRouter

router = APIRouter()

# Endpoint para obtener la causa raíz
@router.get("/causa-raiz")
def obtener_causa_raiz():
    return {"causa_raiz": "Posible causa determinada por la IA"}

# Endpoint para obtener la conclusión y soluciones
@router.get("/conclusion")
def obtener_conclusion():
    return {
        "conclusion": "La causa raíz principal ha sido identificada.",
        "soluciones": ["Solución 1", "Solución 2", "Solución 3"]
    }
