from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Dict, Any
import joblib
import numpy as np
import pandas as pd

app = FastAPI(title="RAAVA AI/ML Service")

MODEL_PATH = "models/severity_model.joblib"

class PredictSeverityRequest(BaseModel):
    disaster_type: str
    location: str
    affected_population: Optional[float] = 0.0
    deaths: Optional[float] = 0.0
    injured: Optional[float] = 0.0
    economic_damage: Optional[float] = 0.0

@app.get("/health")
def health():
    return {"status": "ok", "service": "raava-ai-ml"}

@app.post("/predict-severity")
def predict_severity(payload: PredictSeverityRequest):
    row = pd.DataFrame([{
        "disaster_type": payload.disaster_type,
        "location": payload.location,
        "affected_population": float(payload.affected_population or 0),
        "deaths": float(payload.deaths or 0),
        "injured": float(payload.injured or 0),
        "economic_damage": float(payload.economic_damage or 0),
    }])

    try:
        model = joblib.load(MODEL_PATH)
    except FileNotFoundError:
        label_map = {0: "Low", 1: "Medium", 2: "High"}
        sample_value = 1
        return {
            "prediction": label_map.get(sample_value, "Medium"),
            "probabilities": {k: float(v) for k, v in {"Low": 0.3, "Medium": 0.4, "High": 0.3}.items()},
            "confidence": 0.4,
            "warning": "Model is not trained yet. This is a fallback placeholder until training completes."
        }

    predicted_class = int(model.predict(row)[0])
    probabilities = model.predict_proba(row)[0]
    label_map = {0: "Low", 1: "Medium", 2: "High"}
    pred_label = label_map.get(predicted_class, "Medium")

    return {
        "prediction": pred_label,
        "probabilities": {label_map[i]: float(probabilities[i]) for i in range(len(probabilities))},
        "confidence": float(np.max(probabilities))
    }
