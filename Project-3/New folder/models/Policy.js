const mongoose = require('mongoose');

// Schema for individual policy sections (chunks for retrieval)
const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  heading: { type: String, required: true },
  content: { type: String, required: true },
  // Pre-computed TF-IDF term frequencies stored here
  termFrequencies: { type: Map, of: Number, default: {} },
});

const PolicySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true },
    icon: { type: String, default: '📄' },
    sections: [SectionSchema],
  },
  { timestamps: true }
);

// Text index for basic full-text search fallback
PolicySchema.index({ 'sections.content': 'text', 'sections.heading': 'text' });

module.exports = mongoose.model('Policy', PolicySchema);
