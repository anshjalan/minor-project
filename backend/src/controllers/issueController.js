import Issue from "../models/Issue.js";
import { analyzeIssue } from "../services/aiService.js";

export async function createIssue(req, res) {
  const { title, description, voiceTranscript, latitude, longitude, addressLabel } = req.body;

  if (!description || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: "Description and location are required" });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
  const ai = await analyzeIssue({
    description,
    voiceTranscript,
    imageUrl,
    imagePath: req.file?.path || ""
  });

  const issue = await Issue.create({
    title,
    description,
    voiceTranscript,
    imageUrl,
    location: {
      latitude: Number(latitude),
      longitude: Number(longitude),
      addressLabel
    },
    category: ai.category,
    detectedLabel: ai.detectedLabel,
    detectionConfidence: ai.confidence,
    topDetections: ai.topDetections,
    xaiOverlayImageUrl: ai.xaiOverlayImageUrl,
    xaiEvidence: ai.xaiEvidence,
    aiSummary: ai.summary,
    aiExplanation: ai.explanation,
    priority: ai.priority,
    department: ai.department,
    reportedBy: req.user._id
  });

  const populatedIssue = await issue.populate("reportedBy", "name email role");
  res.status(201).json(populatedIssue);
}

export async function getIssues(req, res) {
  const { status, category } = req.query;
  const filter = {};

  if (req.user.role !== "admin") {
    filter.reportedBy = req.user._id;
  }

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  const issues = await Issue.find(filter)
    .populate("reportedBy", "name email role")
    .sort({ createdAt: -1 });

  res.json(issues);
}

export async function getIssueById(req, res) {
  const issue = await Issue.findById(req.params.id).populate("reportedBy", "name email role");

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" });
  }

  if (req.user.role !== "admin" && issue.reportedBy._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(issue);
}

export async function updateIssueStatus(req, res) {
  const { status, category } = req.body;
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" });
  }

  if (status) {
    issue.status = status;
  }

  if (category) {
    issue.category = category;
  }

  await issue.save();

  const updatedIssue = await issue.populate("reportedBy", "name email role");
  res.json(updatedIssue);
}

export async function getDashboardStats(req, res) {
  const [total, pending, inProgress, resolved] = await Promise.all([
    Issue.countDocuments(),
    Issue.countDocuments({ status: "Pending" }),
    Issue.countDocuments({ status: "In Progress" }),
    Issue.countDocuments({ status: "Resolved" })
  ]);

  res.json({
    total,
    pending,
    inProgress,
    resolved
  });
}

