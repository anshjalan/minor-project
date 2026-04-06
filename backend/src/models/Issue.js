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
      enum: ["Garbage", "Road", "Lighting", "Water", "Drainage", "Other"],
      default: "Other"
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

