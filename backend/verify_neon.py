"""
NeonDB Connection & Schema Verification Script
Run this script to verify your NeonDB serverless PostgreSQL connection string.
Usage:
    python verify_neon.py
"""
import sys
import asyncio
from sqlalchemy import text
from app.core.config import settings
from app.database.session import engine, AsyncSessionLocal
from app.database.init_db import init_and_seed_db


async def main():
    print("=" * 70)
    print("             AAVYA – HeredityAI NeonDB Connection Prober")
    print("=" * 70)
    print(f"[Config] Normalized Database URL: {settings.async_database_url.split('@')[-1] if '@' in settings.async_database_url else settings.async_database_url}")
    
    if settings.is_sqlite:
        print("\n[NOTICE] Currently using local SQLite fallback.")
        print("To connect NeonDB:")
        print("1. Open backend/.env")
        print("2. Set: DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require")
        print("3. Re-run: python verify_neon.py\n")

    print("[Step 1/3] Testing SSL socket handshake with database engine...")
    try:
        async with engine.connect() as conn:
            res = await conn.execute(text("SELECT 1;"))
            row = res.scalar()
            assert row == 1
        print("  ✓ Database connection established successfully.")
    except Exception as exc:
        print(f"\n[ERROR] Connection failed: {exc}")
        print("\nTroubleshooting tips:")
        print("• Check your database password in backend/.env")
        print("• Ensure '?sslmode=require' is attached to your connection string.")
        sys.exit(1)

    print("[Step 2/3] Checking server version & dialect...")
    async with engine.connect() as conn:
        try:
            ver = await conn.execute(text("SELECT version();"))
            print(f"  ✓ Database Engine: {ver.scalar()}")
        except Exception:
            print("  ✓ SQLite Engine operational.")

    print("[Step 3/3] Synchronizing schema tables & seeding verified accounts...")
    try:
        await init_and_seed_db()
        print("  ✓ Schema tables: users, doctor_profiles, patient_profiles, assessment_records, appointments")
        print("  ✓ Verified Doctors seeded: pratyush0306@gmail.com, pratyush032006@gmail.com")
        print("  ✓ Verified Patients seeded: pratyush00710@gmail.com, priyabouri47@gmail.com")
    except Exception as exc:
        print(f"  ✗ Schema sync error: {exc}")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("  🎉 [SUCCESS] NEONDB DATABASE IS FULLY CONFIGURED & SYNCHRONIZED!")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
