"use client";

import React, { useState } from "react";
import { Activity, RefreshCw, Info } from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";
import { ClayButton } from "@/components/ui/ClayButton";
import { Badge } from "@/components/ui/Badge";
import { predictPCOSRisk, AssessmentPredictionResponse } from "@/lib/api";

export function AssessmentPreviewSection() {
  const [formData, setFormData] = useState<Record<string, string>>({
    age: "24",
    weight_kg: "68",
    height_cm: "162",
    cycle_regularity: "Irregular",
    cycle_length_days: "42",
    weight_gain_flag: "Yes",
    hirsutism_flag: "Yes",
    skin_darkening_flag: "Yes",
    hair_loss_flag: "Yes",
    acne_flag: "Yes",
    fast_food_flag: "Yes",
    regular_exercise_flag: "No",
    family_history_pcos: "Yes",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, string | number | boolean> = {
        age: parseFloat(formData.age) || 24,
        weight_kg: parseFloat(formData.weight_kg) || 60,
        height_cm: parseFloat(formData.height_cm) || 160,
        cycle_regularity: formData.cycle_regularity,
        cycle_length_days: parseFloat(formData.cycle_length_days) || 30,
        weight_gain_flag: formData.weight_gain_flag,
        hirsutism_flag: formData.hirsutism_flag,
        skin_darkening_flag: formData.skin_darkening_flag,
        hair_loss_flag: formData.hair_loss_flag,
        acne_flag: formData.acne_flag,
        fast_food_flag: formData.fast_food_flag,
        regular_exercise_flag: formData.regular_exercise_flag,
        family_history_pcos: formData.family_history_pcos,
      };

      // Compute BMI automatically
      const weight = typeof payload.weight_kg === "number" ? payload.weight_kg : 60;
      const height = typeof payload.height_cm === "number" ? payload.height_cm : 160;
      if (weight && height) {
        const heightM = height / 100;
        payload.bmi = Number((weight / (heightM * heightM)).toFixed(2));
      }

      const res = await predictPCOSRisk(payload);
      setResult(res);
      setError(null);
    } catch (err: unknown) {
      console.warn("Assessment calculation notice:", err);
      const msg = err instanceof Error ? err.message : "Failed to calculate assessment indicators.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="assessment-preview" className="py-20 border-t border-[var(--border)] bg-[oklch(0.976_0.012_84/0.7)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)]">
            Experience the Inference Engine
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2.5">
            Test our serialized model bundle with sample clinical and lifestyle indicators. See how the engine imputes, scales, and computes probability in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Interactive Form Card */}
          <div className="lg:col-span-7">
            <ClayCard className="p-6 sm:p-8">
              <div className="pb-4 mb-6 border-b border-[var(--border)]">
                <h3 className="text-base font-bold font-display text-[var(--foreground)]">
                  Preliminary Parameter Input
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Select sample clinical and lifestyle attributes
                </p>
              </div>

              <form onSubmit={handleRunAssessment} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Age (yrs)
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.weight_kg}
                      onChange={(e) => handleInputChange("weight_kg", e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.height_cm}
                      onChange={(e) => handleInputChange("height_cm", e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Menstrual Cycle
                    </label>
                    <select
                      value={formData.cycle_regularity}
                      onChange={(e) => handleInputChange("cycle_regularity", e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Irregular">Irregular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Avg. Cycle Days
                    </label>
                    <input
                      type="number"
                      value={formData.cycle_length_days}
                      onChange={(e) => handleInputChange("cycle_length_days", e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                {/* Binary Symptom Checkboxes */}
                <div className="pt-2">
                  <span className="block text-xs font-semibold text-[var(--foreground)] mb-2">
                    Observed Physical & Hereditary Factors
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { key: "weight_gain_flag", label: "Unexplained Weight Gain" },
                      { key: "hirsutism_flag", label: "Excess Facial/Body Hair" },
                      { key: "skin_darkening_flag", label: "Skin Darkening (Neck/Creases)" },
                      { key: "hair_loss_flag", label: "Scalp Hair Thinning" },
                      { key: "acne_flag", label: "Severe / Adult Acne" },
                      { key: "family_history_pcos", label: "Family History of PCOS" },
                      { key: "fast_food_flag", label: "Frequent Fast Food Intake" },
                      { key: "regular_exercise_flag", label: "Regular Weekly Exercise" },
                    ].map((item) => {
                      const isYes = formData[item.key] === "Yes";
                      return (
                        <button
                          type="button"
                          key={item.key}
                          onClick={() => handleInputChange(item.key, isYes ? "No" : "Yes")}
                          className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors duration-150 flex items-center justify-between ${
                            isYes
                              ? "bg-[color-mix(in_oklab,var(--primary)_12%,var(--card))] border-[var(--primary)] text-[var(--foreground)] font-medium"
                              : "bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-neutral-400"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span
                            className={`size-2 rounded-full ${
                              isYes ? "bg-[var(--primary)]" : "bg-neutral-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3">
                  <ClayButton
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        <span>Running Calibrated Model...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="size-4" />
                        <span>Compute Statistical Risk</span>
                      </>
                    )}
                  </ClayButton>
                </div>
              </form>
            </ClayCard>
          </div>

          {/* Real-Time Prediction Result Card */}
          <div className="lg:col-span-5">
            <ClayCard className="p-6 sm:p-8 flex flex-col justify-between min-h-[440px]">
              {result ? (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                      Risk Stratification
                    </span>
                    <Badge
                      variant={
                        result.risk_category === "Elevated Risk"
                          ? "coral"
                          : result.risk_category === "Moderate Risk"
                          ? "gold"
                          : "sage"
                      }
                    >
                      {result.risk_category}
                    </Badge>
                  </div>

                  {/* Big Percentage Display */}
                  <div className="text-center py-2">
                    <div className="text-5xl font-extrabold font-display tabular-nums text-[var(--foreground)]">
                      {result.risk_percentage}%
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-1 font-medium">
                      Calibrated Model Probability
                    </div>
                  </div>

                  {/* Context Description */}
                  <div className="p-3.5 rounded-xl bg-[color-mix(in_oklab,var(--background)_70%,var(--muted))] border border-[var(--border)] text-xs text-[var(--foreground)] leading-relaxed">
                    {result.risk_description}
                  </div>

                  {/* Contributing Factors */}
                  {result.top_contributing_factors.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-[var(--foreground)] block mb-2">
                        Top Contributing Biomarkers:
                      </span>
                      <div className="space-y-1.5">
                        {result.top_contributing_factors.slice(0, 3).map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                          >
                            <span className="truncate max-w-[200px] text-[var(--foreground)]">
                              {f.feature}
                            </span>
                            <span
                              className={`font-semibold tabular-nums ${
                                f.direction === "increases_risk"
                                  ? "text-[var(--primary)]"
                                  : "text-[var(--leaf)]"
                              }`}
                            >
                              {f.direction === "increases_risk" ? "+" : ""}
                              {f.impact}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medical Disclaimer Guarantee */}
                  <div className="pt-3 border-t border-[var(--border)] flex items-start gap-2 text-[11px] text-[var(--muted-foreground)]">
                    <Info className="size-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
                    <span>
                      {result.disclaimer}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center my-auto py-8">
                  <div className="size-14 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--leaf)] mb-4">
                    <Activity className="size-7" />
                  </div>
                  <h4 className="text-base font-bold font-display text-[var(--foreground)]">
                    Awaiting Input Parameters
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] max-w-xs mt-1 leading-relaxed">
                    Adjust the parameters on the left and click &ldquo;Compute Statistical Risk&rdquo; to execute the live scikit-learn model inference.
                  </p>
                  {error && (
                    <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left">
                      <strong>Connection Notice:</strong> {error}
                    </div>
                  )}
                </div>
              )}
            </ClayCard>
          </div>
        </div>
      </div>
    </section>
  );
}
