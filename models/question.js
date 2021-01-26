const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, minlength: 5 },
    category: {
      type: String,
      required: true,
      enum: ['diverse', 'ciudate', 'perverse'],
      lowercase: true,
      trim: true,
    },
    author: { type: String, trim: true, default: 'Vlad Moisuc' },
    tags: Array,
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'normal', 'hard'],
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['open', 'closed'],
      lowercase: true,
      trim: true,
    },
    suggestions: [String],
    options: {
      type: Array,
      required: function () {
        return this.type === 'closed';
      },
      default: function () {
        if (this.type === 'closed') return ['Da.', 'Nu.'];
        else return;
      },
    },
    isPublished: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
