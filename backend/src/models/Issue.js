import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    voiceTranscript: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      addressLabel: { type: String, trim: true }
    },
    category: {
      type: String,
      enum: ["Damaged Concrete Structures", "Damaged Electric Poles", "Damaged Road Signs", "Dead Animal Pollution", "Fallen Trees", "Garbage", "Graffiti", "Pothole", "Road Crack", "Other"],
      default: "Other"
    },
    detectedLabel: {
      type: String,
      trim: true,
      default: "unknown"
    },
    detectionConfidence: {
      type: Number,
      default: 0
    },
    topDetections: [
      {
        label: { type: String, trim: true },
        score: { type: Number, default: 0 },
        bbox: [{ type: Number }]
      }
    ],
    xaiOverlayImageUrl: {
      type: String,
      default: ""
    },
    xaiEvidence: {
      type: String,
      trim: true
    },
    aiSummary: {
      type: String,
      trim: true
    },
    aiExplanation: {
      type: String,
      trim: true
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    department: {
      type: String,
      trim: true,
      default: "General Civic Department"
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;

