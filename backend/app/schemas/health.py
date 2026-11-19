from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    database: str
    model_loaded: bool
    model_version: str
    environment: str
    timestamp: datetime
