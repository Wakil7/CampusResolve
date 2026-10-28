const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Hostel',
        'Academic',
        'Maintenance & Infrastructure',
        'Mess & Canteen',
        'IT & Labs',
        'Safety & Security',
        'Other',
      ],
      default: 'Maintenance & Infrastructure',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    location: {
      type: String,
      trim: true,
      placeholder: 'e.g., Block B, Room 304 or CS Lab 2',
      default: 'Campus Premises',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    publicToCampus: {
      type: Boolean,
      default: false,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    attachments: [
      {
        filename: String,
        originalName: String,
        url: String,
        fileType: String,
      },
    ],
    complainant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedDepartment: {
      type: String,
      default: 'General',
    },
    resolutionDetails: {
      resolvedAt: { type: Date, default: null },
      resolutionNote: { type: String, default: '' },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: '' },
      submittedAt: { type: Date, default: null },
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        isStaffOnly: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    activityLog: [
      {
        action: { type: String, required: true },
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        performerName: { type: String, default: 'System' },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-generate human-readable ticket ID before validation
complaintSchema.pre('validate', function (next) {
  if (!this.ticketId) {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.ticketId = `CMP-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
