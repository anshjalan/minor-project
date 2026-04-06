import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ml-models" });
});

function heuristicAnalysis(text) {
  const lower = text.toLowerCase();

  if (lower.includes("garbage") || lower.includes("trash") || lower.includes("waste")) {
    return {
      summary: "Garbage waste has been reported in a public area.",
      category: "Garbage",
      priority: "Medium",
      explanation: "The description mentions garbage or waste, which matches a sanitation complaint."
    };
  }

  if (lower.includes("pothole") || lower.includes("broken road") || lower.includes("road")) {
    return {
      summary: "A road or pothole issue has been reported.",
      category: "Road",
      priority: "High",
      explanation: "The language points to road damage that could affect traffic flow and safety."
    };
  }

  if (lower.includes("street light") || lower.includes("streetlight") || lower.includes("dark")) {
    return {
      summary: "A street lighting issue has been reported.",
      category: "Lighting",
      priority: "Medium",
      explanation: "Mentions of darkness or failed lights indicate a public lighting problem."
    };
  }

  if (lower.includes("water") || lower.includes("leak") || lower.includes("pipe")) {
    return {
      summary: "A water supply or leakage issue has been reported.",
      category: "Water",
      priority: "High",
      explanation: "The wording suggests water loss, leakage, or supply interruption."
    };
  }

  if (lower.includes("drain") || lower.includes("sewer") || lower.includes("overflow")) {
    return {
      summary: "A drainage or sewer issue has been reported.",
      category: "Drainage",
      priority: "High",
      explanation: "Keywords related to drains and overflow indicate a drainage management problem."
    };
  }

  return {
    summary: "A general civic issue has been reported.",
    category: "Other",
    priority: "Medium",
    explanation: "The description does not strongly match a known category, so it is classified as Other."
  };
}

app.post("/api/ai/analyze", async (req, res) => {
  const { description = "", voiceTranscript = "", imageUrl = "" } = req.body;
  const combinedText = `${description} ${voiceTranscript}`.trim();

  if (!combinedText) {
    return res.status(400).json({ message: "description or voiceTranscript is required" });
  }

  if (!openai) {
    return res.json(heuristicAnalysis(combinedText));
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a civic issue classifier. Return compact JSON with keys summary, category, priority, explanation. Allowed categories: Garbage, Road, Lighting, Water, Drainage, Other. Allowed priority values: Low, Medium, High."
        },
        {
          role: "user",
          content: `Description: ${description}\nVoice transcript: ${voiceTranscript}\nImage reference: ${imageUrl}`
        }
      ]
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    const fallback = heuristicAnalysis(combinedText);

    res.json({
      summary: result.summary || fallback.summary,
      category: result.category || fallback.category,
      priority: result.priority || fallback.priority,
      explanation: result.explanation || fallback.explanation
    });
  } catch (error) {
    console.error("OpenAI analyze error:", error.message);
    res.json(heuristicAnalysis(combinedText));
  }
});

app.post("/api/ai/explain", (req, res) => {
  const { description = "", category = "Other" } = req.body;
  const base = heuristicAnalysis(description);

  res.json({
    category,
    explanation:
      base.explanation ||
      `This issue was placed in ${category} because the submitted text matches that civic service area.`
  });
});

app.listen(port, () => {
  console.log(`ML service running on port ${port}`);
});