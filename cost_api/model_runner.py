# cost_api/model_runner.py
import warnings
warnings.filterwarnings("ignore")

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import r2_score
from sklearn.linear_model import Ridge, LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

EV_KWH_PER_KM = 0.15
FEATURES = [
    "distance_km", "electricity_price_per_kwh", "ice_eff_l_per_100km",
    "petrol_price_per_l", "fuel_cost_per_km", "ev_cost_per_km",
    "distance_x_petrol", "distance_x_elec", "eff_ratio",
]

_model = None
_model_name = None


def load_and_train(data_path: str = "data/dummy_data.csv"):
    global _model, _model_name

    # Load CSV
    df = pd.read_csv(data_path)

    # Same clipping as your original model.py
    df["petrol_price_per_l"]        = df["petrol_price_per_l"].clip(0, 5.0)
    df["electricity_price_per_kwh"] = df["electricity_price_per_kwh"].clip(0, 2.0)
    df["distance_km"]               = df["distance_km"].clip(0, df["distance_km"].quantile(0.99))
    df["ice_eff_l_per_100km"]       = df["ice_eff_l_per_100km"].clip(lower=0)

    # Same target winsorization as your original model.py
    y = df["savings_ice_minus_ev"].copy()
    q_low, q_high = y.quantile([0.01, 0.99])
    y = y.clip(q_low, q_high)

    # Same feature engineering as your original model.py
    df["fuel_cost_per_km"]  = (df["ice_eff_l_per_100km"] / 100.0) * df["petrol_price_per_l"]
    df["ev_cost_per_km"]    = df["electricity_price_per_kwh"] * EV_KWH_PER_KM
    df["distance_x_petrol"] = df["distance_km"] * df["petrol_price_per_l"]
    df["distance_x_elec"]   = df["distance_km"] * df["electricity_price_per_kwh"]
    df["eff_ratio"]          = df["ice_eff_l_per_100km"] / (EV_KWH_PER_KM * 100)

    X = df[FEATURES]

    # Same train/test split as your original model.py
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42
    )

    # Same preprocessing pipeline as your original model.py
    preprocess = ColumnTransformer(
        [("num", Pipeline([("scaler", StandardScaler())]), FEATURES)],
        remainder="drop",
    )

    # Same 3 candidate models as your original model.py
    candidates = {
        "GradientBoosting": Pipeline([
            ("pre", "passthrough"),
            ("reg", GradientBoostingRegressor(
                n_estimators=350, learning_rate=0.05,
                max_depth=3, subsample=0.9, random_state=42
            )),
        ]),
        "RandomForest": Pipeline([
            ("pre", "passthrough"),
            ("reg", RandomForestRegressor(
                n_estimators=400, min_samples_leaf=2,
                random_state=42, n_jobs=-1
            )),
        ]),
        "Ridge": Pipeline([
            ("pre", preprocess),
            ("reg", Ridge(alpha=1.0)),
        ]),
    }

    # Train all, pick best by R2 - same as your original model.py
    best, best_score, best_name = None, -999, ""
    for name, pipe in candidates.items():
        pipe.fit(X_train, y_train)
        score = r2_score(y_test, pipe.predict(X_test))
        print(f"[model_runner] {name}: R²={score:.4f}")
        if score > best_score:
            best, best_score, best_name = pipe, score, name

    _model = best
    _model_name = best_name
    print(f"[model_runner] Selected: {best_name} (R²={best_score:.4f})")


def predict(
    distance_km: float,
    electricity_price_per_kwh: float,
    ice_eff_l_per_100km: float,
    petrol_price_per_l: float
) -> float:
    global _model
    if _model is None:
        raise RuntimeError("Model not loaded. Call load_and_train() first.")

    # Build feature row - same engineering as training
    row = pd.DataFrame([{
        "distance_km":                distance_km,
        "electricity_price_per_kwh":  electricity_price_per_kwh,
        "ice_eff_l_per_100km":        ice_eff_l_per_100km,
        "petrol_price_per_l":         petrol_price_per_l,
        "fuel_cost_per_km":           (ice_eff_l_per_100km / 100.0) * petrol_price_per_l,
        "ev_cost_per_km":             electricity_price_per_kwh * EV_KWH_PER_KM,
        "distance_x_petrol":          distance_km * petrol_price_per_l,
        "distance_x_elec":            distance_km * electricity_price_per_kwh,
        "eff_ratio":                  ice_eff_l_per_100km / (EV_KWH_PER_KM * 100),
    }], columns=FEATURES)

    return float(_model.predict(row)[0])


def get_model_name() -> str:
    return _model_name or "unknown"