import sys
from pathlib import Path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import pytest_asyncio
from sqlalchemy import text
from app.database.session import AsyncSessionLocal
from app.database.init_db import init_and_seed_db


@pytest_asyncio.fixture(autouse=True, scope="function")
async def setup_test_db():
    await init_and_seed_db()
    async with AsyncSessionLocal() as session:
        try:
            await session.execute(text("DELETE FROM appointments;"))
            await session.execute(text("DELETE FROM doctor_schedules;"))
            await session.commit()
        except Exception:
            pass
    await init_and_seed_db()
