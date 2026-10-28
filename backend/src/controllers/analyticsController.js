const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get dashboard analytics & statistical metrics
// @route   GET /api/analytics
// @access  Private (Staff & Admin)
exports.getAnalytics = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inReview = await Complaint.countDocuments({ status: 'In Review' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });

    const urgentCount = await Complaint.countDocuments({
      priority: 'Urgent',
      status: { $ne: 'Resolved' },
    });
    const highCount = await Complaint.countDocuments({
      priority: 'High',
      status: { $ne: 'Resolved' },
    });

    // Category breakdown
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Priority breakdown
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Status breakdown
    const statusStats = {
      Pending: pending,
      'In Review': inReview,
      'In Progress': inProgress,
      Resolved: resolved,
      Rejected: rejected,
    };

    // Calculate Average Resolution Time
    const resolvedComplaints = await Complaint.find({
      status: 'Resolved',
      'resolutionDetails.resolvedAt': { $ne: null },
    }).select('createdAt resolutionDetails.resolvedAt');

    let avgResolutionHours = 0;
    if (resolvedComplaints.length > 0) {
      const totalHours = resolvedComplaints.reduce((acc, curr) => {
        const diffMs =
          new Date(curr.resolutionDetails.resolvedAt) - new Date(curr.createdAt);
        return acc + diffMs / (1000 * 60 * 60);
      }, 0);
      avgResolutionHours = Math.round((totalHours / resolvedComplaints.length) * 10) / 10;
    }

    // Calculate Average Satisfaction Rating
    const ratedComplaints = await Complaint.find({
      'feedback.rating': { $ne: null },
    }).select('feedback.rating');

    let avgRating = 0;
    if (ratedComplaints.length > 0) {
      const totalScore = ratedComplaints.reduce(
        (acc, c) => acc + (c.feedback.rating || 0),
        0
      );
      avgRating = Math.round((totalScore / ratedComplaints.length) * 10) / 10;
    }

    // Total counts of students and resolvers
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalStaff = await User.countDocuments({ role: 'staff' });

    res.json({
      success: true,
      summary: {
        total,
        pending,
        inReview,
        inProgress,
        resolved,
        rejected,
        active: pending + inReview + inProgress,
        urgentCount,
        highCount,
        avgResolutionHours,
        avgRating,
        totalStudents,
        totalStaff,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      },
      categoryStats,
      priorityStats,
      statusStats,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
