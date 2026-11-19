"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/landing/Navbar";

interface FeatureImpact {
  feature: string;
  impact: number;
  direction: string;
}

interface AssessmentPrediction {
  prediction: number;
  confidence_score?: number;
  confidence_statement?: string;
  risk_probability: number;
  risk_percentage: number;
  risk_category: string;
  risk_description: string;
  top_contributing_factors: FeatureImpact[];
  model_version: string;
  disclaimer: string;
  timestamp: string;
}

interface Doctor {
  id: number;
  email: string;
  full_name: string;
  doctor_profile?: {
    specialization: string;
    qualification: string;
    city: string;
    consultation_fee: number;
  };
}

export default function AssessmentWizardPage() {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Menstrual & Gynecological Dynamics
    age: 24,
    menarcheAge: 13,
    cycleRegularity: "Irregular",
    cycleLengthDays: 38,
    cycleDurationDays: 5,

    // Step 2: Phenotypic & Endocrine Signals
    hairGrowth: "Yes",
    pimples: "Yes",
    hairLoss: "No",
    skinDarkening: "Yes",
    weightGain: "Yes",

    // Step 3: Anthropometrics, Metabolism & Lifestyle
    heightCm: 162,
    weightKg: 68,
    waistInch: 32,
    hipInch: 38,
    fastFood: "Yes",
    regExercise: "No",

    // Step 4: 3-Generation Pedigree Lineage
    motherPcos: "Yes",
    sisterPcos: "No",
    grandmotherDiabetes: "Yes",

    // Step 5: Free-text Symptom Description
    freeTextSymptom: "",
  });

  // NLP Parser state
  const [isParsingNlp, setIsParsingNlp] = useState(false);
  const [nlpInsight, setNlpInsight] = useState<string | null>(null);
  const [detectedChips, setDetectedChips] = useState<string[]>([]);
  const [showConfirmationSeam, setShowConfirmationSeam] = useState(false);
  const [detectedFeatureKeys, setDetectedFeatureKeys] = useState<string[]>([]);
  const [confirmedSymptoms, setConfirmedSymptoms] = useState({
    cycleRegularity: "Irregular",
    cycleLengthDays: 38,
    hairGrowth: "Yes",
    pimples: "Yes",
    hairLoss: "No",
    skinDarkening: "Yes",
    weightGain: "Yes",
    fastFood: "Yes",
    regExercise: "No",
  });
  const [freeTextPrediction, setFreeTextPrediction] = useState<AssessmentPrediction | null>(null);
  const [isEvaluatingFreeText, setIsEvaluatingFreeText] = useState(false);

  // Assessment results state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [predictionResult, setPredictionResult] = useState<AssessmentPrediction | null>(null);
  const [savedRecordId, setSavedRecordId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Doctor booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [verifiedDoctors, setVerifiedDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState("2026-12-05");
  const [bookingTime, setBookingTime] = useState("10:30 AM");
  const [bookingNotes, setBookingNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

  // Real-time BMI calculation
  const heightMeters = formData.heightCm > 0 ? formData.heightCm / 100 : 1.6;
  const bmi = formData.weightKg > 0 ? +(formData.weightKg / (heightMeters * heightMeters)).toFixed(1) : 25.0;

  // Real-time Waist-Hip Ratio
  const whr = formData.hipInch > 0 ? +(formData.waistInch / formData.hipInch).toFixed(2) : 0.84;

  // Fetch verified doctors for consultation
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch(`${apiUrl}/users/doctors`);
        if (res.ok) {
          const docs = await res.json();
          setVerifiedDoctors(docs);
          if (docs.length > 0) setSelectedDoctorId(docs[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
    }
    fetchDoctors();
  }, [apiUrl]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Step 5: Natural Language Free-Text Symptom Parsing & Confirmation Seam
  const handleParseFreeText = async () => {
    if (!formData.freeTextSymptom.trim()) return;
    setIsParsingNlp(true);
    setNlpInsight(null);
    setFreeTextPrediction(null);

    try {
      const res = await fetch(`${apiUrl}/assessment/parse-symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: formData.freeTextSymptom }),
      });

      if (res.ok) {
        const data = await res.json();
        setNlpInsight(data.summary_insight);
        const chips = (data.detected_symptoms as Array<{ name: string }>).map((s) => s.name);
        setDetectedChips(chips);
        setShowConfirmationSeam(true);

        const feats = data.extracted_features as Record<string, string | number>;
        setDetectedFeatureKeys(Object.keys(feats));

        // Update confirmedSymptoms with detected values
        setConfirmedSymptoms((prev) => {
          const updated = { ...prev };
          if (feats["Cycle(R/I)"]) updated.cycleRegularity = String(feats["Cycle(R/I)"]);
          if (feats["hair growth(Y/N)"]) updated.hairGrowth = String(feats["hair growth(Y/N)"]);
          if (feats["Pimples(Y/N)"]) updated.pimples = String(feats["Pimples(Y/N)"]);
          if (feats["Hair loss(Y/N)"]) updated.hairLoss = String(feats["Hair loss(Y/N)"]);
          if (feats["Skin darkening (Y/N)"]) updated.skinDarkening = String(feats["Skin darkening (Y/N)"]);
          if (feats["Weight gain(Y/N)"]) updated.weightGain = String(feats["Weight gain(Y/N)"]);
          if (feats["Fast food (Y/N)"]) updated.fastFood = String(feats["Fast food (Y/N)"]);
          if (feats["Reg.Exercise(Y/N)"]) updated.regExercise = String(feats["Reg.Exercise(Y/N)"]);
          if (feats["Cycle length(days)"]) updated.cycleLengthDays = Number(feats["Cycle length(days)"]);
          return updated;
        });

        // Auto-update form with extracted features
        setFormData((prev) => {
          const updated = { ...prev };
          if (feats["Cycle(R/I)"]) updated.cycleRegularity = String(feats["Cycle(R/I)"]);
          if (feats["hair growth(Y/N)"]) updated.hairGrowth = String(feats["hair growth(Y/N)"]);
          if (feats["Pimples(Y/N)"]) updated.pimples = String(feats["Pimples(Y/N)"]);
          if (feats["Hair loss(Y/N)"]) updated.hairLoss = String(feats["Hair loss(Y/N)"]);
          if (feats["Skin darkening (Y/N)"]) updated.skinDarkening = String(feats["Skin darkening (Y/N)"]);
          if (feats["Weight gain(Y/N)"]) updated.weightGain = String(feats["Weight gain(Y/N)"]);
          if (feats["Fast food (Y/N)"]) updated.fastFood = String(feats["Fast food (Y/N)"]);
          if (feats["Reg.Exercise(Y/N)"]) updated.regExercise = String(feats["Reg.Exercise(Y/N)"]);
          if (feats["Age (yrs)"]) updated.age = Number(feats["Age (yrs)"]);
          if (feats["Cycle length(days)"]) updated.cycleLengthDays = Number(feats["Cycle length(days)"]);
          return updated;
        });

        // Run preview inference to compute model confidence score
        if (Object.keys(feats).length > 0) {
          try {
            const predRes = await fetch(`${apiUrl}/assessment/predict`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ features: feats }),
            });
            if (predRes.ok) {
              const predData = await predRes.json();
              setFreeTextPrediction(predData);
            }
          } catch (e) {
            console.error("Confidence preview error:", e);
          }
        }
      }
    } catch (err) {
      console.error("NLP parser failed:", err);
    } finally {
      setIsParsingNlp(false);
    }
  };

  // Run direct prediction with confirmed features
  const handleRunFreeTextPrediction = async () => {
    setIsEvaluatingFreeText(true);
    const featurePayload = {
      "Cycle(R/I)": confirmedSymptoms.cycleRegularity,
      "Cycle length(days)": confirmedSymptoms.cycleLengthDays,
      "hair growth(Y/N)": confirmedSymptoms.hairGrowth,
      "Pimples(Y/N)": confirmedSymptoms.pimples,
      "Hair loss(Y/N)": confirmedSymptoms.hairLoss,
      "Skin darkening (Y/N)": confirmedSymptoms.skinDarkening,
      "Weight gain(Y/N)": confirmedSymptoms.weightGain,
      "Fast food (Y/N)": confirmedSymptoms.fastFood,
      "Reg.Exercise(Y/N)": confirmedSymptoms.regExercise,
      "Age (yrs)": formData.age,
      "BMI": bmi,
    };
    try {
      const predRes = await fetch(`${apiUrl}/assessment/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featurePayload }),
      });
      if (predRes.ok) {
        const predData = await predRes.json();
        setFreeTextPrediction(predData);
      }
    } catch (e) {
      console.error("Free text prediction error:", e);
    } finally {
      setIsEvaluatingFreeText(false);
    }
  };

  const handleApplyConfirmedToForm = () => {
    setFormData((prev) => ({
      ...prev,
      cycleRegularity: confirmedSymptoms.cycleRegularity,
      cycleLengthDays: confirmedSymptoms.cycleLengthDays,
      hairGrowth: confirmedSymptoms.hairGrowth,
      pimples: confirmedSymptoms.pimples,
      hairLoss: confirmedSymptoms.hairLoss,
      skinDarkening: confirmedSymptoms.skinDarkening,
      weightGain: confirmedSymptoms.weightGain,
      fastFood: confirmedSymptoms.fastFood,
      regExercise: confirmedSymptoms.regExercise,
    }));
  };

  // Submit assessment and execute ML inference
  const handleSubmitAssessment = async () => {
    setIsEvaluating(true);

    const featurePayload = {
      "Age (yrs)": formData.age,
      "Weight (Kg)": formData.weightKg,
      "Height(Cm) ": formData.heightCm,
      "BMI": bmi,
      "Cycle(R/I)": formData.cycleRegularity,
      "Cycle length(days)": formData.cycleLengthDays,
      "Weight gain(Y/N)": formData.weightGain,
      "hair growth(Y/N)": formData.hairGrowth,
      "Skin darkening (Y/N)": formData.skinDarkening,
      "Hair loss(Y/N)": formData.hairLoss,
      "Pimples(Y/N)": formData.pimples,
      "Fast food (Y/N)": formData.fastFood,
      "Reg.Exercise(Y/N)": formData.regExercise,
      "Waist(inch)": formData.waistInch,
      "Hip(inch)": formData.hipInch,
      "Waist:Hip Ratio": whr,
    };

    try {
      const res = await fetch(`${apiUrl}/assessment/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featurePayload }),
      });

      if (res.ok) {
        const result: AssessmentPrediction = await res.json();
        setPredictionResult(result);

        // If user is authenticated, automatically persist to NeonDB
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (userEmail) {
          saveToDatabase(userEmail, result, featurePayload);
        }
      }
    } catch (err) {
      console.error("Inference prediction error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Persist assessment result to NeonDB
  const saveToDatabase = async (email: string, result: AssessmentPrediction, features: Record<string, unknown>) => {
    try {
      const saveRes = await fetch(`${apiUrl}/assessment/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email,
          risk_probability: result.risk_probability,
          risk_percentage: result.risk_percentage,
          risk_category: result.risk_category,
          risk_description: result.risk_description,
          input_features: features,
          top_contributing_factors: result.top_contributing_factors,
        }),
      });

      if (saveRes.ok) {
        const saved = await saveRes.json();
        setSavedRecordId(saved.id);
        setSaveSuccess(true);
      }
    } catch (err) {
      console.error("Save assessment error:", err);
    }
  };

  // Book Consultation with Specialist
  const handleBookConsultation = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress || "guest_assessment@aavya.health";
    if (!selectedDoctorId) return;

    setIsBooking(true);
    try {
      const res = await fetch(`${apiUrl}/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_email: userEmail,
          doctor_id: selectedDoctorId,
          appointment_date: bookingDate,
          time_slot: bookingTime,
          notes: bookingNotes || `PCOS Risk Score: ${predictionResult?.risk_percentage}%. Consultation requested for endocrine follow-up.`,
          assessment_id: savedRecordId,
        }),
      });

      if (res.ok) {
        setBookingConfirmed(true);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <span className="clay-badge">
            Validated ML Inference • Rotterdam Consensus
          </span>
        </div>

        {/* Wizard Card Container */}
        {!predictionResult ? (
          <div className="clay-card p-6 sm:p-10">
            {/* Title & Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[var(--leaf)]">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: Menstrual & Gynecological Dynamics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display text-[var(--foreground)] font-medium">
                    Menstrual & Gynecological Dynamics
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    Cycle regularity and duration are primary phenotypic hallmarks under Rotterdam clinical guidelines.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Current Age (Years)
                    </label>
                    <input
                      type="number"
                      min={12}
                      max={60}
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 20)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] tabular-nums"
                    />
                  </div>

                  {/* Menarche Age */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Age at First Period (Menarche)
                    </label>
                    <input
                      type="number"
                      min={9}
                      max={20}
                      value={formData.menarcheAge}
                      onChange={(e) => handleInputChange("menarcheAge", parseInt(e.target.value) || 13)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] tabular-nums"
                    />
                  </div>

                  {/* Cycle Regularity */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Cycle Regularity (Cycle R/I)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Regular (Every 24-35 Days)", value: "Regular" },
                        { label: "Irregular / Skipped Cycles", value: "Irregular" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleInputChange("cycleRegularity", opt.value)}
                          className={`p-4 rounded-xl text-left border transition-all ${
                            formData.cycleRegularity === opt.value
                              ? "border-[var(--primary)] bg-rose-50/50 shadow-sm font-medium text-[var(--primary)]"
                              : "border-[var(--border)] hover:border-stone-400 text-[var(--foreground)]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cycle Length (Days) */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Typical Cycle Length (Days)
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={180}
                      value={formData.cycleLengthDays}
                      onChange={(e) => handleInputChange("cycleLengthDays", parseInt(e.target.value) || 30)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] tabular-nums"
                    />
                    <span className="text-xs text-[var(--muted-foreground)] mt-1 block">
                      Normal range is 24–35 days. Cycles &gt;35 days indicate oligomenorrhea.
                    </span>
                  </div>

                  {/* Period Duration */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Bleeding Duration (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={formData.cycleDurationDays}
                      onChange={(e) => handleInputChange("cycleDurationDays", parseInt(e.target.value) || 5)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] tabular-nums"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Phenotypic & Endocrine Signals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display text-[var(--foreground)] font-medium">
                    Phenotypic & Androgenic Indicators
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    Hyperandrogenism markers (elevated free testosterone / DHEA-S) reflected in dermatological features.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  {[
                    {
                      id: "hairGrowth",
                      title: "Excessive Facial or Body Hair (Hirsutism)",
                      desc: "Coarse or dark hair on chin, upper lip, chest, abdomen, or lower back.",
                      value: formData.hairGrowth,
                    },
                    {
                      id: "pimples",
                      title: "Persistent or Cystic Acne",
                      desc: "Hormonal breakouts along jawline, chin, or upper back unresponsive to standard wash.",
                      value: formData.pimples,
                    },
                    {
                      id: "hairLoss",
                      title: "Scalp Hair Thinning / Female Pattern Alopecia",
                      desc: "Noticeable widening of hair part or excessive crown shedding.",
                      value: formData.hairLoss,
                    },
                    {
                      id: "skinDarkening",
                      title: "Skin Darkening (Acanthosis Nigricans)",
                      desc: "Velvety hyperpigmentation in neck creases, armpits, or groin indicative of insulin resistance.",
                      value: formData.skinDarkening,
                    },
                    {
                      id: "weightGain",
                      title: "Rapid Unexplained Weight Gain",
                      desc: "Difficulty losing weight or rapid central abdominal fat distribution.",
                      value: formData.weightGain,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-medium text-sm text-[var(--foreground)]">{item.title}</h4>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{item.desc}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {["No", "Yes"].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleInputChange(item.id, val)}
                            className={`px-5 py-1.5 text-xs font-medium rounded-full border transition-all ${
                              item.value === val
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
                                : "border-[var(--border)] text-[var(--foreground)] hover:bg-stone-100"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Anthropometrics, Metabolism & Lifestyle */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display text-[var(--foreground)] font-medium">
                    Metabolism & Lifestyle Factors
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    Anthropometric ratios (BMI, WHR) and lifestyle inputs calibrated by our cross-validated model.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {/* Height & Weight */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      min={120}
                      max={220}
                      value={formData.heightCm}
                      onChange={(e) => handleInputChange("heightCm", parseFloat(e.target.value) || 160)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min={30}
                      max={200}
                      value={formData.weightKg}
                      onChange={(e) => handleInputChange("weightKg", parseFloat(e.target.value) || 60)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] tabular-nums"
                    />
                  </div>

                  {/* Real-time Computed BMI Badge */}
                  <div className="sm:col-span-2 p-4 rounded-xl clay-inset-well flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">
                        Computed Body Mass Index (BMI)
                      </span>
                      <div className="text-2xl font-display font-medium text-[var(--foreground)] tabular-nums mt-0.5">
                        {bmi} kg/m²
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        bmi >= 25 ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal Range" : bmi < 30 ? "Overweight" : "Obese"}
                    </span>
                  </div>

                  {/* Waist & Hip */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Waist Circumference (Inches)
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={60}
                      value={formData.waistInch}
                      onChange={(e) => handleInputChange("waistInch", parseFloat(e.target.value) || 30)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Hip Circumference (Inches)
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={70}
                      value={formData.hipInch}
                      onChange={(e) => handleInputChange("hipInch", parseFloat(e.target.value) || 36)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)] tabular-nums"
                    />
                  </div>

                  {/* Fast Food & Exercise */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Frequent Fast Food / High Glycemic Food?
                    </label>
                    <div className="flex gap-4">
                      {["No", "Yes"].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleInputChange("fastFood", val)}
                          className={`flex-1 py-2.5 text-xs font-medium rounded-xl border transition-all ${
                            formData.fastFood === val
                              ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
                              : "border-[var(--border)] text-[var(--foreground)] hover:bg-stone-100"
                          }`}
                        >
                          {val === "Yes" ? "Yes (≥ 2 times/wk)" : "No (Rarely/Never)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      Regular Exercise / Physical Activity?
                    </label>
                    <div className="flex gap-4">
                      {["No", "Yes"].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleInputChange("regExercise", val)}
                          className={`flex-1 py-2.5 text-xs font-medium rounded-xl border transition-all ${
                            formData.regExercise === val
                              ? "bg-[var(--leaf)] text-[var(--leaf-foreground)] border-[var(--leaf)] shadow-sm"
                              : "border-[var(--border)] text-[var(--foreground)] hover:bg-stone-100"
                          }`}
                        >
                          {val === "Yes" ? "Yes (≥ 30 mins/day)" : "No (Sedentary)"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: 3-Generation Hereditary Pedigree Lineage */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display text-[var(--foreground)] font-medium">
                    3-Generation Hereditary Pedigree
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    Genetic predisposition accounts for up to 70% of PCOS susceptibility across maternal and sibling lineages.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  {[
                    {
                      id: "motherPcos",
                      relation: "Mother (1st Degree Maternal)",
                      desc: "History of PCOS, irregular menstrual cycles, or difficulty conceiving.",
                      value: formData.motherPcos,
                    },
                    {
                      id: "sisterPcos",
                      relation: "Sister(s) (1st Degree Sibling)",
                      desc: "Diagnosed PCOS, cystic ovaries, or hormonal acne.",
                      value: formData.sisterPcos,
                    },
                    {
                      id: "grandmotherDiabetes",
                      relation: "Grandmother (2nd Degree Ancestral)",
                      desc: "Type 2 diabetes, insulin resistance, or gestational diabetes.",
                      value: formData.grandmotherDiabetes,
                    },
                  ].map((ped) => (
                    <div
                      key={ped.id}
                      className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--secondary-foreground)] font-semibold shrink-0 text-xs">
                          ♀
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-[var(--foreground)]">{ped.relation}</h4>
                          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{ped.desc}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {["No", "Yes"].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleInputChange(ped.id, val)}
                            className={`px-5 py-1.5 text-xs font-medium rounded-full border transition-all ${
                              ped.value === val
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
                                : "border-[var(--border)] text-[var(--foreground)] hover:bg-stone-100"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Natural Language Free-Text Symptom Parser & Interactive Confirmation Seam */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display text-[var(--foreground)] font-medium">
                    Describe In Your Own Words
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    Describe your daily symptoms, energy levels, or period patterns. Our clinical NLP engine will parse key signals into an interactive confirmation seam.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Quick Preset Prompts */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-[var(--muted-foreground)] font-semibold">Try sample narrative:</span>
                    {[
                      "Missed periods for 45 days, jawline cystic acne, dark patches on neck, rapid weight gain.",
                      "Severe hair thinning on crown, excess facial hair on chin, constant sugar cravings.",
                      "Periods are irregular, sedentary routine, gained 5kg, frequent junk food.",
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, freeTextSymptom: sample }));
                        }}
                        className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors text-left"
                      >
                        &ldquo;{sample.slice(0, 38)}...&rdquo;
                      </button>
                    ))}
                  </div>

                  {/* Free-text input */}
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={formData.freeTextSymptom}
                      onChange={(e) => handleInputChange("freeTextSymptom", e.target.value)}
                      placeholder="e.g., I've had irregular periods for over 6 months, usually 45 days apart. I've also noticed excessive hair on my chin and jawline acne that doesn't go away. I feel fatigued, gained 6kg rapidly, and crave sweets..."
                      className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)] placeholder:text-stone-400"
                    />
                    <div className="absolute bottom-3 right-3">
                      <button
                        type="button"
                        onClick={handleParseFreeText}
                        disabled={isParsingNlp || !formData.freeTextSymptom.trim()}
                        className="px-4 py-1.5 text-xs font-semibold rounded-full bg-[var(--leaf)] text-[var(--leaf-foreground)] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        {isParsingNlp ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Analyzing NLP...
                          </>
                        ) : (
                          <>✨ AI Extract Symptoms</>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* NLP Insight Banner */}
                  {nlpInsight && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2 animate-fadeIn">
                      <div className="font-semibold flex items-center gap-1.5 text-emerald-900">
                        <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Clinical NLP Extraction:
                      </div>
                      <p>{nlpInsight}</p>
                      {detectedChips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {detectedChips.map((chip, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-md font-medium">
                              ✓ {chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* INTERACTIVE CONFIRMATION SEAM CARD */}
                  {showConfirmationSeam && (
                    <div className="clay-card p-5 sm:p-6 space-y-5 border-2 border-[var(--primary)]/30 animate-fadeIn bg-[var(--card)]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                        <div>
                          <span className="clay-badge mb-1">Phase 6 Confirmation Seam</span>
                          <h3 className="font-display font-bold text-lg text-[var(--foreground)]">
                            Review & Confirm Extracted Symptoms
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            Please verify each candidate indicator detected by the NLP parser before executing the trained AI risk model.
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-stone-500 uppercase block font-semibold">Signals Identified</span>
                          <span className="font-display font-bold text-xl text-[var(--primary)]">
                            {detectedFeatureKeys.length} / 9 Markers
                          </span>
                        </div>
                      </div>

                      {/* Interactive Toggles Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                        {/* 1. Cycle Regularity */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)]">Cycle Regularity</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              detectedFeatureKeys.includes("Cycle(R/I)")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {detectedFeatureKeys.includes("Cycle(R/I)") ? "✓ Detected" : "○ Unmentioned"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {["Regular", "Irregular"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setConfirmedSymptoms((p) => ({ ...p, cycleRegularity: val }))}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                  confirmedSymptoms.cycleRegularity === val
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Cycle Length (days) */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)]">Cycle Length (Days)</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              detectedFeatureKeys.includes("Cycle length(days)")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {detectedFeatureKeys.includes("Cycle length(days)") ? "✓ Detected" : "○ Unmentioned"}
                            </span>
                          </div>
                          <input
                            type="number"
                            min={20}
                            max={120}
                            value={confirmedSymptoms.cycleLengthDays}
                            onChange={(e) =>
                              setConfirmedSymptoms((p) => ({
                                ...p,
                                cycleLengthDays: parseInt(e.target.value) || 30,
                              }))
                            }
                            className="w-full py-1.5 px-3 text-xs rounded-lg border border-stone-200 bg-white font-medium text-stone-900 tabular-nums focus:ring-1 focus:ring-[var(--primary)] outline-none"
                          />
                        </div>

                        {/* 3. Excessive Facial/Body Hair (Hirsutism) */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)]">Facial Hair / Hirsutism</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              detectedFeatureKeys.includes("hair growth(Y/N)")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {detectedFeatureKeys.includes("hair growth(Y/N)") ? "✓ Detected" : "○ Unmentioned"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {["No", "Yes"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setConfirmedSymptoms((p) => ({ ...p, hairGrowth: val }))}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                  confirmedSymptoms.hairGrowth === val
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 4. Persistent Acne */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)]">Persistent Acne / Pimples</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              detectedFeatureKeys.includes("Pimples(Y/N)")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {detectedFeatureKeys.includes("Pimples(Y/N)") ? "✓ Detected" : "○ Unmentioned"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {["No", "Yes"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setConfirmedSymptoms((p) => ({ ...p, pimples: val }))}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                  confirmedSymptoms.pimples === val
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 5. Scalp Hair Thinning */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)]">Scalp Hair Thinning</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              detectedFeatureKeys.includes("Hair loss(Y/N)")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {detectedFeatureKeys.includes("Hair loss(Y/N)") ? "✓ Detected" : "○ Unmentioned"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {["No", "Yes"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setConfirmedSymptoms((p) => ({ ...p, hairLoss: val }))}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                  confirmedSymptoms.hairLoss === val
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 6. Skin Darkening */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)]">Skin Darkening (Neck/Folds)</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              detectedFeatureKeys.includes("Skin darkening (Y/N)")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {detectedFeatureKeys.includes("Skin darkening (Y/N)") ? "✓ Detected" : "○ Unmentioned"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {["No", "Yes"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setConfirmedSymptoms((p) => ({ ...p, skinDarkening: val }))}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                  confirmedSymptoms.skinDarkening === val
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 7. Weight Gain */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)]">Metabolic Weight Gain</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              detectedFeatureKeys.includes("Weight gain(Y/N)")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {detectedFeatureKeys.includes("Weight gain(Y/N)") ? "✓ Detected" : "○ Unmentioned"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {["No", "Yes"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setConfirmedSymptoms((p) => ({ ...p, weightGain: val }))}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                  confirmedSymptoms.weightGain === val
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 8. Fast Food */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)]">Frequent Fast Food</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              detectedFeatureKeys.includes("Fast food (Y/N)")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {detectedFeatureKeys.includes("Fast food (Y/N)") ? "✓ Detected" : "○ Unmentioned"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {["No", "Yes"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setConfirmedSymptoms((p) => ({ ...p, fastFood: val }))}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                  confirmedSymptoms.fastFood === val
                                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 9. Regular Exercise */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--foreground)]">Regular Exercise (≥30m)</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                              detectedFeatureKeys.includes("Reg.Exercise(Y/N)")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {detectedFeatureKeys.includes("Reg.Exercise(Y/N)") ? "✓ Detected" : "○ Unmentioned"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {["No", "Yes"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setConfirmedSymptoms((p) => ({ ...p, regExercise: val }))}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                  confirmedSymptoms.regExercise === val
                                    ? "bg-[var(--leaf)] text-white border-[var(--leaf)] shadow-sm"
                                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Seam Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
                        <button
                          type="button"
                          onClick={handleApplyConfirmedToForm}
                          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="size-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Apply Confirmed Values to Form</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRunFreeTextPrediction}
                          disabled={isEvaluatingFreeText}
                          className="w-full sm:w-auto clay-button-primary px-6 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 active:scale-97 shadow-md"
                        >
                          {isEvaluatingFreeText ? (
                            <>
                              <div className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Executing Trained Model...</span>
                            </>
                          ) : (
                            <>
                              <span>⚡ Run Direct Free-Text Prediction</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Free-Text Trained Model Confidence Score Card */}
                      {freeTextPrediction && (
                        <div className="p-5 rounded-2xl bg-white border-2 border-[var(--primary)] shadow-lg space-y-4 animate-scaleIn text-[var(--foreground)] mt-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--primary)] flex items-center gap-1">
                                <span className="size-2 rounded-full bg-[var(--primary)] animate-ping" />
                                Model Prediction from Free-Text Extraction
                              </span>
                              <h4 className="font-display font-bold text-xl text-[var(--foreground)] mt-0.5">
                                {freeTextPrediction.risk_category}
                              </h4>
                              <p className="text-xs text-stone-600 mt-1 max-w-xl">
                                {freeTextPrediction.confidence_statement}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-center">
                                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block">
                                  Model Confidence
                                </span>
                                <span className="font-display font-bold text-2xl text-[var(--primary)] tabular-nums">
                                  {freeTextPrediction.confidence_score}%
                                </span>
                              </div>
                              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                                <span className="text-[9px] uppercase tracking-wider text-rose-700 font-bold block">
                                  PCOS Risk Index
                                </span>
                                <span className="font-display font-bold text-2xl text-rose-900 tabular-nums">
                                  {freeTextPrediction.risk_percentage}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Top Contributing Factors Breakdown */}
                          {freeTextPrediction.top_contributing_factors && freeTextPrediction.top_contributing_factors.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                                Key Extracted Risk Drivers (Model Weights):
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {freeTextPrediction.top_contributing_factors.slice(0, 4).map((f, idx) => (
                                  <div key={idx} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                                    <span className="font-medium text-stone-800">{f.feature}</span>
                                    <span className={`text-[11px] font-bold tabular-nums px-2 py-0.5 rounded ${
                                      f.direction === "increases_risk"
                                        ? "bg-rose-100 text-rose-800"
                                        : "bg-emerald-100 text-emerald-800"
                                    }`}>
                                      {f.impact > 0 ? `+${f.impact}` : f.impact}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-[10px] text-stone-500 italic p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                            Rotterdam Compliance: {freeTextPrediction.disclaimer}
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            <Link
                              href="/doctors"
                              className="clay-button-primary px-5 py-2 text-xs font-semibold"
                            >
                              Consult a PCOS Specialist →
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                handleApplyConfirmedToForm();
                                handleSubmitAssessment();
                              }}
                              className="clay-button-secondary px-5 py-2 text-xs font-semibold"
                            >
                              Generate Official Comprehensive Report
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl clay-inset-well space-y-2 text-xs text-[var(--muted-foreground)]">
                    <div className="font-semibold text-[var(--foreground)]">Summary of Profile to be Evaluated:</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Age: {formData.age} yrs • Menarche: {formData.menarcheAge} yrs</li>
                      <li>Cycles: {formData.cycleRegularity} ({formData.cycleLengthDays} days length)</li>
                      <li>Phenotypes: Hirsutism ({formData.hairGrowth}) • Acne ({formData.pimples}) • Skin Darkening ({formData.skinDarkening})</li>
                      <li>Anthropometrics: BMI {bmi} kg/m² • WHR {whr}</li>
                      <li>Hereditary: Mother ({formData.motherPcos}) • Sister ({formData.sisterPcos})</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-8 border-t border-[var(--border)] mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="clay-button-secondary px-6 py-2.5 text-sm font-medium"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="clay-button-primary px-7 py-2.5 text-sm font-medium"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitAssessment}
                  disabled={isEvaluating}
                  className="clay-button-primary px-8 py-3 text-sm font-semibold flex items-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Calculating Model Probability...
                    </>
                  ) : (
                    <>Run Statistical PCOS Risk Assessment →</>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* RESULT VIEW: Comprehensive Clinical Risk Report */
          <div className="space-y-8 animate-fadeIn">
            {/* Top Score Banner */}
            <div className="clay-card p-6 sm:p-10 border-l-4 border-l-[var(--primary)]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="clay-badge mb-2">Assessment Completed</span>
                  <h2 className="text-3xl sm:text-4xl font-display font-medium text-[var(--foreground)]">
                    {predictionResult.risk_category}
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-xl">
                    {predictionResult.risk_description}
                  </p>
                  {predictionResult.confidence_statement && (
                    <p className="text-xs text-[var(--primary)] font-medium mt-2 max-w-xl bg-rose-50/70 p-2.5 rounded-lg border border-rose-200">
                      🎯 {predictionResult.confidence_statement}
                    </p>
                  )}
                </div>

                {/* Circular Gauge & Confidence Score */}
                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                  {predictionResult.confidence_score !== undefined && (
                    <div className="p-3.5 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-center shadow-inner">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] block font-semibold">
                        Model Confidence
                      </span>
                      <span className="font-display font-bold text-2xl text-[var(--primary)] tabular-nums">
                        {predictionResult.confidence_score}%
                      </span>
                      <span className="text-[9px] text-[var(--leaf)] block font-semibold">
                        Algorithmic Certainty
                      </span>
                    </div>
                  )}

                  <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-[var(--background)] shadow-inner border border-[var(--border)] shrink-0">
                    <div className="text-center">
                      <span className="text-3xl font-display font-bold text-[var(--foreground)] tabular-nums">
                        {predictionResult.risk_percentage}%
                      </span>
                      <span className="block text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                        Risk Index
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {saveSuccess && (
                <div className="mt-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Assessment record saved to NeonDB profile (Record #{savedRecordId}).
                </div>
              )}
            </div>

            {/* Top Contributing Risk Drivers */}
            <div className="clay-card p-6 sm:p-8">
              <h3 className="text-xl font-display font-medium text-[var(--foreground)] mb-1">
                Top Contributing Risk Drivers
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-6">
                Model feature attributions ranked by absolute predictive impact on your score:
              </p>

              <div className="space-y-4">
                {predictionResult.top_contributing_factors.map((factor, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--foreground)]">
                        {factor.feature}
                      </span>
                      <span
                        className={`font-semibold ${
                          factor.direction === "increases_risk" ? "text-rose-700" : "text-emerald-700"
                        }`}
                      >
                        {factor.direction === "increases_risk" ? "+ Increases Risk" : "- Mitigates Risk"}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          factor.direction === "increases_risk" ? "bg-[var(--primary)]" : "bg-[var(--leaf)]"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(15, Math.abs(factor.impact) * 45))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps & Clinical Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="clay-card p-6">
                <h4 className="font-display font-medium text-base text-[var(--foreground)] mb-2">
                  Recommended Clinical Investigations
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] mb-4">
                  Take these suggested tests to your reproductive endocrinologist or gynecologist:
                </p>
                <ul className="text-xs space-y-2 text-[var(--foreground)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--leaf)] font-bold">✓</span>
                    <span>Pelvic Ultrasound (antral follicle count ≥12 per ovary)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--leaf)] font-bold">✓</span>
                    <span>Fasting Blood Glucose & Fasting Insulin (HOMA-IR)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--leaf)] font-bold">✓</span>
                    <span>Day 2–3 Hormonal Profile: LH, FSH, Total & Free Testosterone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--leaf)] font-bold">✓</span>
                    <span>Serum DHEA-S and Lipid Panel</span>
                  </li>
                </ul>
              </div>

              <div className="clay-card p-6">
                <h4 className="font-display font-medium text-base text-[var(--foreground)] mb-2">
                  Evidence-Based Lifestyle Guidance
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] mb-4">
                  Metabolic interventions to support ovulatory regularity:
                </p>
                <ul className="text-xs space-y-2 text-[var(--foreground)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] font-bold">•</span>
                    <span>Low-glycemic anti-inflammatory dietary pattern with complex carbs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] font-bold">•</span>
                    <span>150 mins/week moderate resistance and cardiovascular training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] font-bold">•</span>
                    <span>Stress management to attenuate adrenal cortisol release</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] font-bold">•</span>
                    <span>Adequate restorative sleep (7–9 hours) for circadian cycle rhythm</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Regulatory Disclaimer */}
            <div className="p-4 rounded-xl clay-inset-well text-xs text-[var(--muted-foreground)] leading-relaxed">
              <strong className="text-[var(--foreground)]">Non-Diagnostic Clinical Disclaimer: </strong>
              {predictionResult.disclaimer}
            </div>

            {/* Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowBookingModal(true)}
                className="w-full sm:w-auto clay-button-primary px-8 py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Consultation with Dr. Pratyush Dutta
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto clay-button-secondary px-6 py-3 text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Clinical Summary
              </button>

              <button
                type="button"
                onClick={() => {
                  setPredictionResult(null);
                  setCurrentStep(1);
                  setSaveSuccess(false);
                }}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline ml-auto py-2"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        )}
      </main>

      {/* DOCTOR BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card max-w-lg w-full p-6 sm:p-8 space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-medium text-[var(--foreground)]">
                Book Specialist Consultation
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-display font-medium text-emerald-950 text-lg">
                  Consultation Request Submitted!
                </h4>
                <p className="text-xs text-emerald-800">
                  Your appointment for {bookingDate} at {bookingTime} has been submitted to Dr. Pratyush Dutta.
                  You can track status on your patient dashboard.
                </p>
                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className="clay-button-primary px-6 py-2 text-xs font-semibold inline-block"
                  >
                    Go to Patient Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Doctor Selection */}
                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Select Specialist
                  </label>
                  <select
                    value={selectedDoctorId || ""}
                    onChange={(e) => setSelectedDoctorId(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)]"
                  >
                    {verifiedDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.full_name} • {doc.doctor_profile?.specialization || "PCOS Specialist"} ({doc.doctor_profile?.city || "India"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                      Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)]"
                    >
                      {["09:30 AM", "10:30 AM", "11:30 AM", "02:30 PM", "04:00 PM", "05:30 PM"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Consultation Notes */}
                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Clinical Notes for Doctor (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Include questions or key symptoms you'd like to discuss..."
                    className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] placeholder:text-stone-400"
                  />
                </div>

                <div className="p-3 rounded-lg clay-inset-well text-[11px] text-[var(--muted-foreground)]">
                  Your statistical PCOS assessment score ({predictionResult?.risk_percentage}%) will be automatically attached to this appointment.
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="clay-button-secondary px-5 py-2 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBookConsultation}
                    disabled={isBooking}
                    className="clay-button-primary px-6 py-2 text-xs font-semibold flex items-center gap-1.5"
                  >
                    {isBooking ? "Submitting..." : "Confirm Consultation"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
