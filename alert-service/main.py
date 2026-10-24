import asyncio
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Any, Dict, List
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [Alert-Service]: %(message)s"
)
logger = logging.getLogger("alert-service")

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
CHECK_INTERVAL = int(os.getenv("CHECK_INTERVAL", "30"))
LOW_STOCK_THRESHOLD = int(os.getenv("LOW_STOCK_THRESHOLD", "10"))

# In-memory storage for detected low-stock alerts
active_alerts: List[Dict[str, Any]] = []

def check_low_stock():
    global active_alerts
    url = f"{BACKEND_URL.rstrip('/')}/products"
    logger.info(f"Checking inventory at {url} (Threshold: <= {LOW_STOCK_THRESHOLD})...")

    try:
        response = requests.get(url, timeout=5)
        if response.status_code != 200:
            logger.warning(f"Backend returned status {response.status_code}")
            return active_alerts

        products = response.json()
        current_alerts = []

        if isinstance(products, list):
            for product in products:
                try:
                    qty = int(product.get("quantity", 0))
                    if qty <= LOW_STOCK_THRESHOLD:
                        alert = {
                            "product_id": product.get("id"),
                            "name": product.get("name"),
                            "quantity": qty,
                            "threshold": LOW_STOCK_THRESHOLD,
                            "severity": "CRITICAL" if qty == 0 else "WARNING",
                            "timestamp": datetime.now(timezone.utc).isoformat()
                        }
                        current_alerts.append(alert)
                        logger.warning(
                            f"[{alert['severity']}] Low Stock Alert: Product '{alert['name']}' "
                            f"(ID: {alert['product_id']}) has only {alert['quantity']} items left!"
                        )
                except (ValueError, TypeError) as parse_err:
                    logger.debug(f"Could not parse product quantity: {parse_err}")

        active_alerts = current_alerts
        logger.info(f"Inventory check completed. Active low-stock alerts: {len(active_alerts)}")
        return active_alerts

    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to connect to backend service at {url}: {e}")
        return active_alerts

async def periodic_checker():
    # Wait a few seconds on startup for backend to come up
    await asyncio.sleep(5)
    while True:
        try:
            check_low_stock()
        except Exception as e:
            logger.error(f"Unexpected error in alert checker loop: {e}")
        await asyncio.sleep(CHECK_INTERVAL)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: spawn background task
    task = asyncio.create_task(periodic_checker())
    yield
    # Shutdown
    task.cancel()

app = FastAPI(
    title="Inventory Low-Stock Alert Service",
    description="Microservice that monitors inventory levels and generates alerts for low stock",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "Inventory Alert Service",
        "status": "running",
        "threshold": LOW_STOCK_THRESHOLD,
        "check_interval_seconds": CHECK_INTERVAL,
        "backend_url": BACKEND_URL
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/alerts")
def get_alerts():
    return {
        "count": len(active_alerts),
        "threshold": LOW_STOCK_THRESHOLD,
        "alerts": active_alerts
    }

@app.post("/alerts/check")
def trigger_check():
    alerts = check_low_stock()
    return {
        "message": "Manual check triggered",
        "count": len(alerts),
        "alerts": alerts
    }
