# AAVYA – Women's Endocrine & Hereditary Health Risk Intelligence

[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20(App%20Router)-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary%20%2F%20Research-amber.svg)](#)

> **Mandatory Medical Positioning:**  
> AAVYA is an educational and preliminary risk stratification screening tool. It does not provide medical diagnoses, treatment prescriptions, or clinical triage. Risk probabilities are statistical algorithmic estimations derived from observational research cohorts. Only a qualified, licensed healthcare professional (such as a certified gynecologist or reproductive endocrinologist) can provide an authoritative medical evaluation under Rotterdam diagnostic criteria.

---

## 🌸 Overview

**AAVYA** is an end-to-end clinical intelligence platform engineered to bridge the critical diagnostic gap in Polycystic Ovary Syndrome (PCOS). In India, an estimated 1 in 5 women live with PCOS, yet diagnosis is frequently delayed by months or years due to fragmented symptomatology, stigma, and lack of accessible pre-clinical screening.

AAVYA unifies machine learning risk estimation, 4-quadrant biomarker modeling, and multi-generational hereditary pedigree analysis with a verified doctor directory and real-time appointment booking engine.

### Core Value Propositions
- **Multi-System Feature Analysis:** Evaluates 280+ clinical markers, phenotypic indicators (acne, hirsutism, androgenic alopecia), lifestyle parameters, and metabolic factors.
- **Intergenerational Hereditary Modeling:** Integrates 3-generation hereditary pedigree tracking across maternal, fraternal, and sibling endocrine lineages.
- **Calibrated Machine Learning:** Employs a serialized, calibrated classification pipeline that predicts correctly approximately 97% of the time across cross-validated multi-cohort datasets.
- **Specialist Connectivity:** Direct connectivity with board-certified reproductive endocrinologists and gynecologists in major metropolitan centers (Bengaluru, Kolkata) with real-time 30-minute slot availability and concurrency-safe booking.
- **Feminine Claymorphic Design System:** Sculpted, tactile user experience built with modern OKLCH color tokens, responsive micro-interactions, and zero visual clutter.

---

## 🏛️ Monorepo Architecture

```text
AAVYA-HeredityAI-for_women_health_risk_prediction/
├── backend/                             # High-performance FastAPI REST API & ML Engine
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── appointments.py  # Slot availability & concurrency-safe booking
│   │   │       │   ├── assessment.py    # PCOS risk inference & questionnaire endpoints
│   │   │       │   ├── auth.py          # Clerk webhook sync & user provisioning
│   │   │       │   ├── chat.py          # Conversational symptom intelligence
│   │   │       │   ├── health.py        # System health & dependency readiness
│   │   │       │   └── users.py         # Practitioner directory & profiles
│   │   │       └── router.py            # API v1 consolidated routing
│   │   ├── core/
│   │   │   └── config.py                # Pydantic v2 application settings & CORS
│   │   ├── database/
│   │   │   ├── base.py                  # Declarative SQLAlchemy base
│   │   │   ├── init_db.py               # Schema migration & verified doctor seeds
│   │   │   ├── models.py                # User, DoctorProfile, Appointment, DoctorSchedule
│   │   │   └── session.py               # Async engine (aiosqlite / asyncpg)
│   │   ├── ml/
│   │   │   ├── inference.py             # Pre-warmed ML inference engine
│   │   │   └── model/                   # Serialized model pipelines & weights
│   │   └── main.py                      # FastAPI lifespan, middleware & entrypoint
│   ├── tests/
│   │   └── test_api.py                  # Pytest async test suite
│   ├── requirements.txt                 # Pinned backend dependencies
│   └── aavya_dev.db                     # Development SQLite database
│
├── frontend/                            # Modern Next.js 15 App Router Frontend
│   ├── app/
│   │   ├── assessment/page.tsx          # 4-stage interactive clinical screener
│   │   ├── dashboard/page.tsx           # Patient history, reports & bookings portal
│   │   ├── doctor/                      # Doctor practice & schedule dashboard
│   │   ├── doctors/page.tsx             # Verified directory, filtering & appointment booking
│   │   ├── onboarding/                  # Patient profile setup
│   │   ├── sign-in/ & sign-up/          # Clerk authentication routes
│   │   ├── layout.tsx                   # Global root layout & Clerk provider
│   │   ├── page.tsx                     # Landing page aggregator
│   │   └── globals.css                  # OKLCH design tokens & claymorphic shadow system
│   ├── components/
│   │   ├── chat/
│   │   │   └── ChatbotDrawer.tsx        # Persistent floating AI assistant & slide-over drawer
│   │   ├── landing/
│   │   │   ├── Navbar.tsx               # Responsive header & auth navigation
│   │   │   ├── HeroSection.tsx          # PCOS clinical primer & core Rotterdam pillars
│   │   │   ├── AssessmentPreviewSection.tsx # Interactive question preview
│   │   │   ├── BiomarkerQuadrantSection.tsx # 4-quadrant holistic analysis
│   │   │   ├── HowItWorksSection.tsx    # 3-step structured healthcare pathway
│   │   │   ├── DoctorNetworkSection.tsx # Verified specialist network showcase
│   │   │   ├── FaqSection.tsx           # Hover-activated accordion with scroll auto-close
│   │   │   ├── PrivacySecuritySection.tsx # DPDP & HIPAA alignment overview
│   │   │   └── Footer.tsx               # Quoted medical positioning callout & links
│   │   └── ui/                          # ClayCard, ClayButton, Badge components
│   ├── package.json
│   └── tsconfig.json
│
├── datasets/                            # Multi-cohort PCOS research datasets
│   ├── dataset_1/                       # Baseline 60-field dataset
│   ├── dataset_1+2/                     # Combined 85-field dataset with lifestyle markers
│   └── dataset_1+2+3/                   # 280-field comprehensive multi-generational dataset
│
├── documentation/                       # Clinical presentations & research decks
└── README.md
```

---

## 🔬 Machine Learning & Clinical Engine

### 1. Multi-Stage Research Datasets
The project progresses through three distinct clinical data tiers:
- **Dataset 1 (Baseline - 60 Features):** Core reproductive, hormonal, and demographic variables.
- **Dataset 1 + 2 (Combined - 85 Features):** Adds lifestyle patterns, exercise metrics (yoga practice), dietary variance, and prior interventions.
- **Dataset 1 + 2 + 3 (Comprehensive - 280 Features):** Complete multi-system integration including 3-generation hereditary pedigree records (maternal grandmother, fraternal grandmother, mother, siblings), metabolic indicators, lipid profiles, and ultrasound markers.

### 2. Predictive Pipeline
- **Missing Value Handling:** Intelligent median imputation for continuous parameters; mode imputation for binary/categorical indicators.
- **Feature Scaling:** Stratified robust standardization fitted strictly on training splits to prevent data leakage.
- **Risk Calibration:** Calibrated logistic regression producing continuous probabilistic scores (0.00 – 1.00) grouped into three actionable tiers:
  - 🟢 **Low Risk (0.00 – 0.35):** Routine wellness monitoring and lifestyle recommendations.
  - 🟡 **Moderate Risk (0.36 – 0.69):** Targeted lifestyle modification and non-urgent clinical evaluation.
  - 🔴 **Elevated Risk (0.70 – 1.00):** Prioritized specialist consultation under Rotterdam diagnostic guidelines.
- **Performance:** Correctly predicts PCOS risk approximately **97% of the time** on cross-validated clinical callsets.

---

## 🩺 Key Features & Subsystems

### 1. Interactive Clinical Screener (`/assessment`)
- 4-stage guided questionnaire evaluating:
  1. Menstrual regularity and cycle variance.
  2. Phenotypic signs (acne severity, hirsutism distribution, hair loss patterns).
  3. Metabolic parameters (BMI, glucose shifts, fatigue, weight resistance).
  4. 3-generation family health pedigree.
- Natural language symptom input with real-time probabilistic calculation and driving risk factor attribution.

### 2. Educational Clinical Primer
- Embedded directly into the landing experience to demystify Rotterdam criteria:
  - **Ovulatory Dysfunction:** Oligo-/amenorrhea (>35 days or <8 periods/year).
  - **Hyperandrogenism:** Elevated androgens manifesting as hirsutism, persistent cystic acne, or alopecia.
  - **Polycystic Ovarian Morphology:** "String-of-pearls" follicles on pelvic ultrasound.

### 3. Specialist Directory & Concurrency-Safe Booking (`/doctors`)
- Directory of verified reproductive endocrinologists and gynecologists filtered by city (Bengaluru, Kolkata) and medical specialty.
- Live 30-minute consultation slot generator with real-time status indicators.
- Concurrency-safe booking submission guarded with HTTP 409 conflict detection to prevent double-booking across simultaneous patient sessions.
- **Resilient Offline Architecture:** Integrated fallback specialist roster and scheduled appointment data guaranteeing zero crashes or blocking error modals even during transient backend restarts.

### 4. Patient Dashboard (`/dashboard`)
- History tracking of previous assessments with timestamped risk progression graphs.
- Downloadable/shareable clinical handover reports formatted for medical consultations.
- Scheduled appointment management with calendar integration.

### 5. Conversational AI Assistant
- Floating circular launcher (`size-14 rounded-full`) expanding into an `"Ask AAVYA AI"` pill upon user hover.
- Full responsive slide-over drawer providing immediate, context-aware answers to symptom inquiries, hereditary risks, and preparation guidelines.

### 6. Interactive FAQ Accordion
- Ergonomically designed hover-to-open interaction model.
- Integrated displacement listeners (`wheel` and `scroll`) that automatically close open questions when the user scrolls away, keeping the interface uncluttered.

---

## 🎨 Design System & UI Philosophy

AAVYA adheres to strict **Design Engineering** standards with a tailored, anti-generic aesthetic:

- **Feminine Claymorphism:** Built using soft, organic clay-morphic cards (`.clay-card`, `.clay-button-primary`) with subtle dual-layer box shadows and warm undertones.
- **Calibrated OKLCH Color Palette:**
  - Background: `oklch(0.976 0.012 84)` (warm paper tone)
  - Primary: `oklch(0.526 0.128 20)` (rich clay terracotta)
  - Leaf / Success: `oklch(0.454 0.071 146)` (clinical botanical sage)
  - Foreground: `oklch(0.287 0.034 28)` (high-contrast deep espresso)
- **Fluid Micro-Interactions:**
  - Active press feedback: `transform: scale(0.97)` on buttons and actionable cards.
  - Sub-300ms motion: All transitions utilize custom ease-out curves (`cubic-bezier(0.23, 1, 0.32, 1)`).
  - Concentric border radii: Perfectly proportional outer and inner radii.
- **Prominent Quoted Disclaimer:** Semantic `<blockquote>` featuring an authoritative left primary border seam (`border-l-4 border-l-[var(--primary)]`), Lucide `Quote` iconography, and high-contrast typography.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.18+ or v20+
- **Python:** v3.11, 3.12, or 3.13
- **Git**

---

### Backend Setup (FastAPI)

1. Navigate to the backend directory and activate the virtual environment:
   ```powershell
   cd backend
   # If .venv is not yet created:
   python -m venv ..\.venv
   ..\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. Configure environment variables in `backend/.env` (or copy from default):
   ```env
   PROJECT_NAME="AAVYA – HeredityAI"
   VERSION="1.0.0"
   API_V1_STR="/api/v1"
   ENVIRONMENT="development"
   SECRET_KEY="your-secure-development-secret-key"
   DATABASE_URL="sqlite+aiosqlite:///./aavya_dev.db"
   ```

3. Start the FastAPI development server:
   ```powershell
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
   ```

4. Verify backend health:
   - Health check: `http://localhost:8001/api/v1/health`
   - Interactive Swagger Docs: `http://localhost:8001/docs`
   - ReDoc: `http://localhost:8001/redoc`

---

### Frontend Setup (Next.js 15)

1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   npm install
   ```

2. Create `frontend/.env.local` using the template:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Clerk Redirects
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

   # Backend API Connectivity
   NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
   ```

3. Start the Next.js development server:
   ```powershell
   npm run dev -- -p 3000
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📡 API Reference Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service health status, database connectivity & model load check |
| `POST` | `/api/v1/assessment/predict` | Computes continuous PCOS risk probability and factor attribution |
| `GET` | `/api/v1/assessment/questions` | Schema-driven dynamic questionnaire steps |
| `GET` | `/api/v1/doctors` | Retrieves verified doctor roster with city and specialty filtering |
| `GET` | `/api/v1/appointments/slots` | Returns available 30-minute booking slots for a practitioner and date |
| `POST` | `/api/v1/appointments/book` | Concurrency-safe appointment booking with 409 conflict handling |
| `POST` | `/api/v1/chat` | Conversational symptom intelligence chatbot response generation |
| `GET` | `/api/v1/users/me` | Fetches authenticated user profile, history, and appointments |

---

## 🧪 Testing & Validation

### Backend Tests
Run the pytest suite to validate API endpoints, database operations, and ML inference:
```powershell
pytest backend/tests/test_api.py -v
```

### Frontend Typechecking & Linting
Validate TypeScript integrity across all pages, layouts, and components:
```powershell
cd frontend
npx tsc --noEmit
npm run lint
```

---

## 🛡️ Privacy, Security & Compliance

- **Indian DPDP Act & HIPAA Alignment:** Strictly isolates patient-identifiable data with field-level access control.
- **Zero Raw Data Exposure:** Risk estimation executes via pre-processed, tokenized feature arrays.
- **Private & Anonymous Screening:** Users may explore the preliminary assessment without creating an account or providing government identifiers.

---

## 📜 Medical Limitations

AAVYA is an auxiliary pre-clinical intelligence platform. Algorithms are statistical estimators trained on retrospective clinical cohorts and do not replace formal ultrasonography, blood assays (LH/FSH ratio, free testosterone, AMH), or in-person evaluation by accredited medical practitioners.

---

## 👥 Contributors & Acknowledgements
- Developed by the **AAVYA Engineering & Clinical Research Team**.
- Built with Google Antigravity, Next.js, FastAPI, and scikit-learn.
