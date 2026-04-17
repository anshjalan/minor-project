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
      category: "Pothole",
      detectedLabel: "Pothole",
      confidence: 0,
      xaiOverlayImageUrl: "",
      xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
      topDetections: [],
      priority: "High",
      explanation: "Road and pothole related terms indicate damage affecting commuting safety."
    };
  }

  if (text.includes("light") || text.includes("dark") || text.includes("pole")) {
    return {
      summary: "Public lighting issue reported.",
      category: "Damaged Electric Poles",
      detectedLabel: "Damaged_Electric_Poles",
      confidence: 0,
      xaiOverlayImageUrl: "",
      xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
      topDetections: [],
      priority: "High",
      explanation: "Lighting or pole related language suggests a damaged electrical pole."
    };
  }

  if (text.includes("tree") || text.includes("branch") || text.includes("fallen")) {
    return {
      summary: "Fallen tree blocking path reported.",
      category: "Fallen Trees",
      detectedLabel: "Fallen_Trees",
      confidence: 0,
      xaiOverlayImageUrl: "",
      xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
      topDetections: [],
      priority: "Medium",
      explanation: "Tree blockage terms indicate an obstruction requiring removal."
    };
  }
  
  if (text.includes("sign") || text.includes("stop sign") || text.includes("board")) {
    return {
      summary: "Damaged road sign reported.",
      category: "Damaged Road Signs",
      detectedLabel: "Damaged_Road_Signs",
      confidence: 0,
      xaiOverlayImageUrl: "",
      xaiEvidence: "The ML service was unavailable, so a text fallback was used.",
      topDetections: [],
      priority: "Medium",
      explanation: "Keywords matching sign structures mapped to traffic enforcement."
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

