# cost_api/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import model_runner


@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs once when the server starts up
    # Trains the ML model before accepting any requests
    print("[startup] Training model on dummy_data.csv ...")
    model_runner.load_and_train("data/dummy_data.csv")
    print("[startup] Model is ready. Server accepting requests.")
    yield


app = FastAPI(lifespan=lifespan)

# Allow your Vite frontend (port 5173) to call this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server default port
        "http://localhost:3000",  # fallback if you use port 3000
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


# This matches exactly the payload your CostCalculation.jsx sends
class PredictRequest(BaseModel):
    distance_km: float
    electricity_price_per_kwh: float
    ice_eff_l_per_100km: float
    petrol_price_per_l: float


# This matches exactly what costComparisionTool.js reads back:
# response.predicted_savings, response.currency, response.model_version
@app.post("/predict")
def predict(req: PredictRequest):
    try:
        savings = model_runner.predict(
            distance_km=req.distance_km,
            electricity_price_per_kwh=req.electricity_price_per_kwh,
            ice_eff_l_per_100km=req.ice_eff_l_per_100km,
            petrol_price_per_l=req.petrol_price_per_l,
        )
        return {
            "predicted_savings": round(savings, 2),
            "currency": "AUD",
            "model_version": model_runner.get_model_name(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Optional health check - visit http://127.0.0.1:8000/health in browser to confirm server is up
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": model_runner.get_model_name()
    }