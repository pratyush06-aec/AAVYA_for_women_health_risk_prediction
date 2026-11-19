"""
Clinical NLP Symptom Parser Service
Extracts PCOS phenotypic, gynecological, and lifestyle indicators from free-text user narratives.
Handles negation, colloquial terminology, and maps to canonical model input features.
"""
import re
from typing import Dict, Any, List, Tuple
from app.schemas.assessment import ExtractedSymptom, SymptomParseResponse


# Semantic rules: (Feature_Key, Canonical_Value, Positive_Patterns, Negative_Patterns, Clinical_Label)
SYMPTOM_RULES = [
    (
        "Cycle(R/I)",
        "Irregular",
        [
            r"\b(?:irregular|unpredictable|abnormal|erratic|skipped|missing|missed|delayed|late)\s*(?:periods?|cycles?|menstruation|bleeding)\b",
            r"\b(?:periods?|cycles?)\s*(?:are\s+)?(?:irregular|unpredictable|delayed|late|erratic|stopped)\b",
            r"\b(?:oligomenorrhea|amenorrhea)\b",
            r"\bhaven't\s+had\s+(?:my\s+)?period\b",
            r"\bperiod\s+(?:comes\s+)?every\s+(?:[4-9]\d|\d{3})\s+days\b",
        ],
        [
            r"\b(?:regular|normal|on\s+time|predictable)\s*(?:periods?|cycles?)\b",
            r"\bperiods?\s*(?:are\s+)?(?:regular|normal|punctual)\b",
        ],
        "Irregular Menstrual Cycles"
    ),
    (
        "hair growth(Y/N)",
        "Yes",
        [
            r"\b(?:facial|chin|jawline|upper\s*lip|sideburns?|chest|belly|body)\s*hair\b",
            r"\b(?:excess(?:ive)?|thick|coarse|abnormal|male-pattern)\s*hair\s*(?:growth)?\b",
            r"\bhirsutism\b",
            r"\bshaving\s*(?:my\s*)?(?:chin|face)\b",
            r"\bplucking\s*(?:chin|facial)\s*hair\b",
        ],
        [
            r"\b(?:no|without|never\s+had)\s*(?:facial|excess|body)\s*hair\b",
            r"\bno\s+hirsutism\b",
        ],
        "Excessive Facial/Body Hair (Hirsutism)"
    ),
    (
        "Pimples(Y/N)",
        "Yes",
        [
            r"\b(?:cystic\s*)?acne\b",
            r"\bpimples?\b",
            r"\bbreakouts?\b",
            r"\b(?:jawline|chin|cheek|back)\s*(?:breakouts?|acne|pimples?)\b",
            r"\bhormonal\s*acne\b",
            r"\bzits\b",
        ],
        [
            r"\b(?:no|clear|without)\s*(?:acne|pimples?|breakouts?)\b",
            r"\bskin\s*is\s*clear\b",
        ],
        "Persistent Acne & Breakouts"
    ),
    (
        "Hair loss(Y/N)",
        "Yes",
        [
            r"\bhair\s*(?:fall|loss|thinning|shedding)\b",
            r"\bthinning\s*(?:at\s*(?:the\s*)?crown|hair)\b",
            r"\balopecia\b",
            r"\blosing\s*(?:chunks\s+of\s+)?hair\b",
            r"\bscalp\s*(?:is\s*)?showing\b",
        ],
        [
            r"\b(?:no|without)\s*hair\s*(?:fall|loss|thinning)\b",
            r"\bthick\s*hair\b",
        ],
        "Scalp Hair Thinning / Alopecia"
    ),
    (
        "Skin darkening (Y/N)",
        "Yes",
        [
            r"\b(?:dark|darkened|darkening|pigmented|blackish)\s*(?:neck|skin|patches|armpits?|groin|folds)\b",
            r"\bacanthosis\s*nigricans\b",
            r"\bhyperpigmentation\s*(?:around\s*neck)?\b",
            r"\bvelvety\s*(?:dark\s*)?skin\b",
        ],
        [
            r"\bno\s*skin\s*darkening\b",
            r"\bno\s*dark\s*(?:patches|neck)\b",
        ],
        "Skin Darkening (Acanthosis Nigricans)"
    ),
    (
        "Weight gain(Y/N)",
        "Yes",
        [
            r"\b(?:gained|gaining|put\s*on|sudden|rapid|unexplained)\s*weight\b",
            r"\bweight\s*gain\b",
            r"\btrouble\s*(?:losing|shedding)\s*weight\b",
            r"\bcannot\s*lose\s*weight\b",
            r"\bbelly\s*fat\s*(?:accumulat\w+|increas\w+)\b",
        ],
        [
            r"\b(?:no|stable|constant)\s*weight\b",
            r"\bweight\s*is\s*normal\b",
            r"\blost\s*weight\b",
        ],
        "Unexplained Weight Gain / Metabolic Shift"
    ),
    (
        "Fast food (Y/N)",
        "Yes",
        [
            r"\b(?:eat|craving|crave|consume|love)\s*(?:junk|fast|fried|oily|processed)\s*food\b",
            r"\b(?:junk|fast|street|takeout)\s*food\b",
            r"\bsugar\s*cravings?\b",
            r"\bsweets?\s*(?:almost\s*)?(?:every\s*day|daily|frequently)\b",
        ],
        [
            r"\b(?:no|rarely|seldom|avoid)\s*(?:junk|fast|fried)\s*food\b",
            r"\bhealthy\s*diet\b",
            r"\bhome\s*cooked\s*food\b",
        ],
        "Frequent Fast Food / High-Glycemic Intake"
    ),
    (
        "Reg.Exercise(Y/N)",
        "No",
        [
            r"\b(?:no|rarely|don't|do\s*not|hardly|never|not)\s*(?:regularly\s*)?(?:exercise|work\s*out|gym|physical\s*activity)\b",
            r"\bsedentary\s*(?:lifestyle|job|routine)\b",
            r"\blazy|inactive\b",
        ],
        [
            r"\b(?:regular|daily|active)\s*(?:exercise|workout|gym|running|yoga)\b",
            r"\bwork\s*out\s*(?:[3-7]\s*times|daily|regularly)\b",
        ],
        "Sedentary / Low Physical Activity"
    ),
]


class SymptomParserEngine:
    """Robust Natural Language Extractor for PCOS Symptom Profiles"""

    def parse(self, text: str) -> SymptomParseResponse:
        cleaned_text = text.strip()
        lower_text = cleaned_text.lower()

        extracted_features: Dict[str, Any] = {}
        detected_symptoms: List[ExtractedSymptom] = []

        # 1. Rule-based entity & pattern evaluation
        for feature_key, positive_val, pos_patterns, neg_patterns, label in SYMPTOM_RULES:
            # Check negative patterns first
            is_negated = False
            for neg_pat in neg_patterns:
                match = re.search(neg_pat, lower_text)
                if match:
                    is_negated = True
                    # If negated, we record opposite if applicable
                    if positive_val == "Irregular":
                        extracted_features[feature_key] = "Regular"
                    elif positive_val == "Yes":
                        extracted_features[feature_key] = "No"
                    elif positive_val == "No":
                        extracted_features[feature_key] = "Yes"
                    break

            if is_negated:
                continue

            # Check positive patterns
            for pos_pat in pos_patterns:
                match = re.search(pos_pat, lower_text)
                if match:
                    snippet = text[max(0, match.start() - 10):min(len(text), match.end() + 10)]
                    extracted_features[feature_key] = positive_val
                    detected_symptoms.append(
                        ExtractedSymptom(
                            name=label,
                            feature_mapped=feature_key,
                            value_inferred=positive_val,
                            confidence=0.88,
                            snippet=f"...{snippet.strip()}..."
                        )
                    )
                    break

        # 2. Extract numeric cycle length if mentioned
        cycle_length_match = re.search(r"\b(?:cycle\s*length|cycle|period\s*every)\s*(?:is\s+)?(\d{2,3})\s*(?:days)?\b", lower_text)
        if not cycle_length_match:
            cycle_length_match = re.search(r"\b(?:period(?:s)?\s*(?:in|for|after)\s*)(\d{2,3})\s*(?:days)?\b", lower_text)
        if not cycle_length_match:
            cycle_length_match = re.search(r"\b(\d{2,3})\s*(?:day|days)\s*(?:cycle|period)\b", lower_text)
        
        if cycle_length_match:
            days = int(cycle_length_match.group(1))
            if 15 <= days <= 180:
                extracted_features["Cycle length(days)"] = days
                detected_symptoms.append(
                    ExtractedSymptom(
                        name=f"Cycle Length ({days} days)",
                        feature_mapped="Cycle length(days)",
                        value_inferred=days,
                        confidence=0.92,
                        snippet=f"...cycle of {days} days..."
                    )
                )

        # 3. Extract age if stated
        age_match = re.search(r"\b(?:i(?:'m| am)\s*|age\s*(?:is\s*)?|aged\s*)(\d{2})\s*(?:years?\s*old|yrs?)?\b", lower_text)
        if age_match:
            age = int(age_match.group(1))
            if 12 <= age <= 60:
                extracted_features["Age (yrs)"] = age
                detected_symptoms.append(
                    ExtractedSymptom(
                        name=f"Patient Age ({age} yrs)",
                        feature_mapped="Age (yrs)",
                        value_inferred=age,
                        confidence=0.95,
                        snippet=f"...age {age}..."
                    )
                )

        # 4. Generate dynamic clinical summary insight
        symptom_count = len(detected_symptoms)
        if symptom_count == 0:
            summary = "No clear PCOS phenotypic or cycle markers were identified from the text. You can still fill out the structured questionnaire."
        elif symptom_count <= 2:
            names = ", ".join(s.name for s in detected_symptoms)
            summary = f"Detected {symptom_count} symptom indicator(s): {names}. These have been mapped to your clinical questionnaire."
        else:
            names = ", ".join(s.name for s in detected_symptoms[:3])
            summary = f"Identified {symptom_count} clinical indicators including {names}. These signals have been pre-filled for risk scoring."

        return SymptomParseResponse(
            original_text=text,
            extracted_features=extracted_features,
            detected_symptoms=detected_symptoms,
            summary_insight=summary
        )


symptom_parser = SymptomParserEngine()
