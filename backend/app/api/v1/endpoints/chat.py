"""
AAVYA Conversational Clinical Assistant & Free-Text Inference Chatbot
Phase 5: Conversational PCOS Chatbot with trained ML Model Confidence Estimation.
"""
from typing import Any
from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.symptom_parser import symptom_parser
from app.ml.inference import inference_engine

router = APIRouter()

PREDICTION_KEYWORDS = [
    "predict", "risk", "score", "chance", "probability", "diagnose",
    "check", "evaluate", "estimate", "analyze", "percentage", "pcos"
]

FAQ_KNOWLEDGE_BASE = {
    "rotterdam": (
        "Under the internationally recognized **Rotterdam Consensus (2003)**, a PCOS diagnosis requires meeting at least 2 of the following 3 criteria:\n"
        "1. **Oligo- or Anovulation**: Irregular, infrequent, or absent menstrual cycles (typically cycles >35 days).\n"
        "2. **Clinical or Biochemical Hyperandrogenism**: Excessive facial/body hair (hirsutism), persistent cystic acne, or elevated serum free testosterone / DHEA-S.\n"
        "3. **Polycystic Ovarian Morphology on Ultrasound**: Presence of ≥12-20 follicles (2–9mm) per ovary or increased ovarian volume (>10mL)."
    ),
    "tests": (
        "Recommended diagnostic lab investigations to discuss with a gynecologist or reproductive endocrinologist include:\n"
        "• **Pelvic / Transvaginal Ultrasound**: High-resolution ovarian morphology evaluation.\n"
        "• **Day 2–3 Hormonal Panel**: Serum LH, FSH, Total Testosterone, Free Testosterone, and DHEA-S.\n"
        "• **Metabolic Markers**: Fasting Blood Glucose & Fasting Insulin (HOMA-IR for insulin resistance).\n"
        "• **Thyroid & Prolactin Panel**: TSH, Free T4, and Serum Prolactin (to rule out thyroid disorders or hyperprolactinemia mimicking PCOS)."
    ),
    "diet": (
        "Evidence-based lifestyle interventions for PCOS focus on **insulin sensitization and glycemic control**:\n"
        "• **Low-Glycemic Index (GI) Complex Carbohydrates**: Whole oats, quinoa, lentils, and non-starchy vegetables that prevent rapid insulin spikes.\n"
        "• **Adequate Dietary Protein**: 25-30g per meal to stabilize blood sugar and enhance satiety.\n"
        "• **Healthy Omega-3 Fats**: Chia seeds, walnuts, flaxseeds, and fatty fish to attenuate systemic inflammation.\n"
        "• **Moderate Exercise**: ≥150 minutes/week of combined resistance training and cardiovascular exercise to improve muscle glucose uptake independent of insulin."
    )
}


@router.post("/message", response_model=ChatResponse)
def process_chat_message(payload: ChatRequest) -> Any:
    """
    Conversational AI Symptom Intelligence Endpoint.
    Extracts clinical signals from free text, runs the trained scikit-learn Logistic Regression
    pipeline, and prints the model confidence score, risk probability, and clinical insights.
    """
    user_msg = payload.message.strip()
    if not user_msg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty."
        )

    lower_msg = user_msg.lower()

    # 1. Run Clinical NLP Symptom Parser
    parse_result = symptom_parser.parse(user_msg)
    extracted_features = parse_result.extracted_features
    detected_symptoms = parse_result.detected_symptoms

    has_symptoms = len(detected_symptoms) > 0
    has_prediction_intent = any(kw in lower_msg for kw in PREDICTION_KEYWORDS)

    # 2. Trigger ML inference if symptoms are detected or user asks for prediction
    if has_symptoms or (has_prediction_intent and len(extracted_features) > 0):
        # Run trained Logistic Regression model
        pred_dict = inference_engine.predict(extracted_features)

        confidence_score = pred_dict["confidence_score"]
        risk_pct = pred_dict["risk_percentage"]
        risk_cat = pred_dict["risk_category"]
        conf_statement = pred_dict["confidence_statement"]

        # Build feature attribution summary
        impact_lines = []
        for factor in pred_dict["top_contributing_factors"]:
            direction_str = "increases risk" if factor["direction"] == "increases_risk" else "mitigates risk"
            impact_lines.append(f"• **{factor['feature']}**: {direction_str} (impact coefficient: {factor['impact']:+.2f})")
        factors_text = "\n".join(impact_lines) if impact_lines else "• Baseline demographic features evaluated."

        symptom_tags = ", ".join([s.name for s in detected_symptoms]) if detected_symptoms else "Reported clinical parameters"

        reply = (
            f"### 🩺 AAVYA Machine Learning Risk Assessment\n\n"
            f"**Trained Model Confidence Score**: **`{confidence_score}%`**\n"
            f"**Estimated PCOS Risk Probability**: **`{risk_pct}%` ({risk_cat})**\n\n"
            f"{conf_statement}\n\n"
            f"#### 🔍 Key Risk Contributing Factors Identified:\n"
            f"{factors_text}\n\n"
            f"#### 🧬 Extracted Clinical Signals:\n"
            f"Mapped features: *{symptom_tags}*.\n\n"
            f"#### 📋 Recommended Next Steps:\n"
            f"1. Schedule an endocrine or gynecological consultation to evaluate Rotterdam criteria.\n"
            f"2. Consider requesting a Day 2-3 hormonal panel (LH, FSH, Total Testosterone) and Pelvic Ultrasound.\n"
            f"3. Maintain a low-glycemic dietary regimen and regular physical activity to support insulin sensitivity.\n\n"
            f"> *Note: This algorithmic assessment is for educational and screening guidance only. It is **NOT** a clinical diagnosis.*"
        )

        return ChatResponse(
            reply=reply,
            prediction=pred_dict,
            detected_symptoms=detected_symptoms,
            confidence_score=confidence_score,
            risk_percentage=risk_pct,
            risk_category=risk_cat,
            is_prediction_triggered=True
        )

    # 3. Handle specific knowledge questions
    if "rotterdam" in lower_msg or "criteria" in lower_msg:
        reply = FAQ_KNOWLEDGE_BASE["rotterdam"]
    elif "test" in lower_msg or "blood" in lower_msg or "ultrasound" in lower_msg or "lab" in lower_msg:
        reply = FAQ_KNOWLEDGE_BASE["tests"]
    elif "diet" in lower_msg or "food" in lower_msg or "exercise" in lower_msg or "nutrition" in lower_msg:
        reply = FAQ_KNOWLEDGE_BASE["diet"]
    else:
        reply = (
            "Hello! I am **AAVYA**, your clinical PCOS risk assistant. You can:\n\n"
            "1. **Describe your symptoms in natural language** (e.g. *'I have missed my periods for 2 months, notice hair on my chin, and have bad acne'*), and I will calculate your **statistical model confidence score** and risk probability using our trained model.\n"
            "2. Ask me about **Rotterdam diagnostic criteria**, **recommended hormonal blood tests**, or **insulin-sensitizing diets**.\n"
            "3. Connect with verified specialists like **Dr. Pratyush Dutta** for clinical follow-up."
        )

    return ChatResponse(
        reply=reply,
        prediction=None,
        detected_symptoms=detected_symptoms if detected_symptoms else [],
        confidence_score=None,
        risk_percentage=None,
        risk_category=None,
        is_prediction_triggered=False
    )
