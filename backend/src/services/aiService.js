import { routeDepartment } from "../utils/departmentRouter.js";

function localFallback(description) {
  const text = description.toLowerCase();

  if (text.includes("garbage") || text.includes("trash") || text.includes("waste")) {
    return {
      summary: "Garbage accumulation reported by citizen.",
      category: "Garbage",
      detectedLabel: "Garbage",
      confidence: 0,
      xaiOverlayImageUrl: "",
      xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
      topDetections: [],
      priority: "Medium",
      explanation: "Keywords related to garbage and waste suggest this is a sanitation issue."
    };
  }

  if (text.includes("pothole") || text.includes("road") || text.includes("street")) {
    return {
      summary: "Road maintenance issue reported.",
      category: "Road",
      detectedLabel: "pothole",
      confidence: 0,
      xaiOverlayImageUrl: "",
      xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
      topDetections: [],
      priority: "High",
      explanation: "Road and pothole related terms indicate damage affecting commuting safety."
    };
  }

  if (text.includes("light") || text.includes("dark") || text.includes("streetlight")) {
    return {
      summary: "Public lighting issue reported.",
      category: "Lighting",
      detectedLabel: "Damaged_Electric_Poles",
      confidence: 0,
      xaiOverlayImageUrl: "",
      xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
      topDetections: [],
      priority: "Medium",
      explanation: "Lighting related language suggests a failed or missing public light."
    };
  }

  if (text.includes("water") || text.includes("leak") || text.includes("pipe")) {
    return {
      summary: "Water supply issue reported.",
      category: "Water",
      detectedLabel: "unknown",
      confidence: 0,
      xaiOverlayImageUrl: "",
      xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
      topDetections: [],
      priority: "High",
      explanation: "Water and leakage terms suggest disruption or wastage in the water network."
    };
  }

  if (text.includes("drain") || text.includes("sewer") || text.includes("flood")) {
    return {
      summary: "Drainage blockage or overflow reported.",
      category: "Drainage",
      detectedLabel: "unknown",
      confidence: 0,
      xaiOverlayImageUrl: "",
      xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
      topDetections: [],
      priority: "High",
      explanation: "Drainage and flooding terms indicate possible blockage or overflow risks."
    };
  }

  return {
    summary: "General civic issue reported by citizen.",
    category: "Other",
    detectedLabel: "unknown",
    confidence: 0,
    xaiOverlayImageUrl: "",
    xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
    topDetections: [],
    priority: "Medium",
    explanation: "The report does not strongly match a specific civic category, so it was grouped as Other."
  };
}

export async function analyzeIssue({ description, voiceTranscript = "", imageUrl = "", imagePath = "" }) {
  const payload = {
    description,
    voiceTranscript,
    imageUrl,
    image_path: imagePath
  };

  try {
    const response = await fetch(`${process.env.ML_SERVICE_URL}/api/ai/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const result = await response.json();
    const confidence = typeof result.confidence === "number" ? result.confidence : 0;
    return {
      ...result,
      detectedLabel: result.detectedLabel || "unknown",
      confidence,
      xaiOverlayImageUrl: result.xaiOverlayImageUrl || "",
      xaiEvidence: result.xaiEvidence || "",
      topDetections: result.topDetections || [],
      department: routeDepartment(result.category)
    };
  } catch (_error) {
    const fallback = localFallback(`${description} ${voiceTranscript}`);
    return {
      ...fallback,
      department: routeDepartment(fallback.category)
    };
  }
}

