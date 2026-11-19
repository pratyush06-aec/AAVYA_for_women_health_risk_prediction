/**
 * AAVYA – HeredityAI API Client
 * Typed communication with the FastAPI backend inference and clinical endpoints.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface HealthCheckResponse {
  status: string;
  database: string;
  model_loaded: boolean;
  model_version: string;
  environment: string;
  timestamp: string;
}

export interface FeatureImpact {
  feature: string;
  impact: number;
  direction: "increases_risk" | "reduces_risk";
}

export interface AssessmentPredictionResponse {
  prediction: number;
  risk_probability: number;
  risk_percentage: number;
  risk_category: "Low Risk" | "Moderate Risk" | "Elevated Risk";
  risk_description: string;
  top_contributing_factors: FeatureImpact[];
  model_version: string;
  disclaimer: string;
  timestamp: string;
}

export interface FeatureSchemaResponse {
  total_features: number;
  binary_columns: string[];
  continuous_columns: string[];
  categorical_columns: string[];
  numerical_features: string[];
  binary_mappings: Record<string, Record<string, number>>;
  top_coefficients: Array<{
    feature: string;
    coefficient: number;
    impact_direction: string;
  }>;
}

export async function fetchHealth(): Promise<HealthCheckResponse> {
  const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function fetchFeatureSchema(): Promise<FeatureSchemaResponse> {
  const res = await fetch(`${API_BASE_URL}/assessment/schema`, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Schema fetch failed: ${res.statusText}`);
  return res.json();
}

export async function predictPCOSRisk(
  features: Record<string, string | number | boolean>
): Promise<AssessmentPredictionResponse> {
  const res = await fetch(`${API_BASE_URL}/assessment/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Prediction failed: ${res.statusText}`);
  }
  return res.json();
}
