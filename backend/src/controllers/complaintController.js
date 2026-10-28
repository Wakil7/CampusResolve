const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Helper to create notifications
const createNotification = async (recipientId, title, message, type, complaintId) => {
  try {
    if (!recipientId) return;
    await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      complaint: complaintId,
    });
  } catch (err) {
    console.error('Error creating notification:', err.message);
  }
};

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Students, Staff, Admin)
exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      isAnonymous,
      publicToCampus,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required',
      });
    }

    // Process attachments if any
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          url: `/uploads/${file.filename}`,
          fileType: file.mimetype,
        });
      });
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      priority: priority || 'Medium',
      location: location || 'Campus',
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      publicToCampus: publicToCampus === 'true' || publicToCampus === true,
      attachments,
      complainant: req.user.id,
      activityLog: [
        {
          action: 'Complaint Registered',
          performedBy: req.user.id,
          performerName: req.user.name,
          note: `Complaint lodged under ${category} with ${priority || 'Medium'} priority.`,
          timestamp: new Date(),
        },
      ],
    });

    await complaint.save();

    // Notify Admins & Staff in department
    const staffMembers = await User.find({
      role: { $in: ['staff', 'admin'] },
    }).limit(5);

    for (const staff of staffMembers) {
      await createNotification(
        staff._id,
        'New Complaint Registered',
        `[${complaint.ticketId}] "${complaint.title}" has been registered in ${complaint.category}.`,
        'SYSTEM',
        complaint._id
      );
    }

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('complainant', 'name email avatar studentId department')
      .populate('assignedTo', 'name email avatar department role');

    res.status(201).json({
      success: true,
      data: populatedComplaint,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating complaint',
    });
  }
};

// @desc    Get all complaints with filtering, search & pagination
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      department,
      myOnly,
      assignedToMe,
      search,
      sortBy = '-createdAt',
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    // Role-based restrictions & filter shortcuts
    if (req.user.role === 'student' || myOnly === 'true') {
      if (myOnly === 'true' || req.user.role === 'student') {
        query.complainant = req.user.id;
      }
    }

    if (assignedToMe === 'true') {
      query.assignedTo = req.user.id;
    }

    // Filters
    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (department && department !== 'all') {
      query.assignedDepartment = department;
    }

    // Search keyword in title, description, ticketId, location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('complainant', 'name email avatar studentId department')
      .populate('assignedTo', 'name email avatar department role')
      .populate('resolutionDetails.resolvedBy', 'name email role')
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Sanitize anonymous complaints if viewer is not the complainant or admin
    const sanitizedComplaints = complaints.map((c) => {
      const obj = c.toObject();
      if (
        obj.isAnonymous &&
        req.user.role !== 'admin' &&
        obj.complainant?._id?.toString() !== req.user.id
      ) {
        obj.complainant = {
          _id: obj.complainant?._id,
          name: 'Anonymous Student',
          email: '',
          avatar: '',
          department: obj.complainant?.department || '',
        };
      }
      return obj;
    });

    res.json({
      success: true,
      count: complaints.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: sanitizedComplaints,
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching complaints',
    });
  }
};

// @desc    Get public campus feed complaints (community visible issues)
// @route   GET /api/complaints/public
// @access  Public / Private
exports.getPublicFeed = async (req, res) => {
  try {
    const { category, search, sort = 'trending' } = req.query;

    const query = { publicToCampus: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'trending') {
      // sort by upvotes count
      sortOption = { upvotes: -1, createdAt: -1 };
    }

    const complaints = await Complaint.find(query)
      .populate('complainant', 'name avatar department')
      .populate('assignedTo', 'name department')
      .sort(sortOption)
      .limit(50);

    const userId = req.user ? req.user.id : null;

    const sanitized = complaints.map((c) => {
      const obj = c.toObject();
      if (obj.isAnonymous && (!userId || obj.complainant?._id?.toString() !== userId)) {
        obj.complainant = {
          name: 'Anonymous Student',
          department: obj.complainant?.department || '',
        };
      }
      obj.hasUpvoted = userId ? obj.upvotes?.some((id) => id.toString() === userId) : false;
      obj.upvoteCount = obj.upvotes ? obj.upvotes.length : 0;
      return obj;
    });

    res.json({
      success: true,
      count: sanitized.length,
      data: sanitized,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single complaint details
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('complainant', 'name email avatar studentId department roomNumber phone')
      .populate('assignedTo', 'name email avatar department role phone')
      .populate('comments.user', 'name avatar role')
      .populate('resolutionDetails.resolvedBy', 'name email role');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const obj = complaint.toObject();

    // Filter staff-only comments if user is student
    if (req.user.role === 'student') {
      obj.comments = obj.comments.filter((cmt) => !cmt.isStaffOnly);
    }

    // Mask complainant if anonymous and requester is not complainant or admin
    if (
      obj.isAnonymous &&
      req.user.role !== 'admin' &&
      obj.complainant?._id?.toString() !== req.user.id
    ) {
      obj.complainant = {
        _id: obj.complainant?._id,
        name: 'Anonymous Student',
        department: obj.complainant?.department,
      };
    }

    // Has current user upvoted
    obj.hasUpvoted = obj.upvotes?.some((id) => id.toString() === req.user.id);
    obj.upvoteCount = obj.upvotes ? obj.upvotes.length : 0;

    res.json({ success: true, data: obj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update complaint status (In Review, In Progress, Resolved, Rejected)
// @route   PUT /api/complaints/:id/status
// @access  Private (Staff & Admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const oldStatus = complaint.status;
    complaint.status = status;

    if (status === 'Resolved') {
      complaint.resolutionDetails = {
        resolvedAt: new Date(),
        resolutionNote: resolutionNote || 'Issue has been inspected and resolved.',
        resolvedBy: req.user.id,
      };
    } else if (status === 'Rejected') {
      complaint.resolutionDetails = {
        resolvedAt: new Date(),
        resolutionNote: resolutionNote || 'Complaint was rejected after review.',
        resolvedBy: req.user.id,
      };
    }

    complaint.activityLog.push({
      action: `Status changed to ${status}`,
      performedBy: req.user.id,
      performerName: req.user.name,
      note: resolutionNote || `Status updated from ${oldStatus} to ${status}.`,
      timestamp: new Date(),
    });

    await complaint.save();

    // Send notification to complainant
    await createNotification(
      complaint.complainant,
      `Complaint ${status}: ${complaint.ticketId}`,
      `Your complaint "${complaint.title}" has been updated to "${status}". ${
        resolutionNote ? `Note: ${resolutionNote}` : ''
      }`,
      'STATUS_CHANGE',
      complaint._id
    );

    res.json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign complaint to staff member or department
// @route   PUT /api/complaints/:id/assign
// @access  Private (Staff & Admin)
exports.assignComplaint = async (req, res) => {
  try {
    const { staffId, department } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    let assignedUserName = 'Department';
    if (staffId) {
      const staffUser = await User.findById(staffId);
      if (staffUser) {
        complaint.assignedTo = staffUser._id;
        complaint.assignedDepartment = department || staffUser.department;
        assignedUserName = staffUser.name;

        // Notify assigned staff
        await createNotification(
          staffUser._id,
          'Complaint Assigned to You',
          `Ticket ${complaint.ticketId} ("${complaint.title}") has been assigned to you.`,
          'ASSIGNMENT',
          complaint._id
        );
      }
    } else if (department) {
      complaint.assignedDepartment = department;
    }

    if (complaint.status === 'Pending') {
      complaint.status = 'In Review';
    }

    complaint.activityLog.push({
      action: 'Complaint Assigned',
      performedBy: req.user.id,
      performerName: req.user.name,
      note: `Assigned to ${assignedUserName} (${complaint.assignedDepartment})`,
      timestamp: new Date(),
    });

    await complaint.save();

    // Notify complainant
    await createNotification(
      complaint.complainant,
      'Complaint Assigned for Resolution',
      `Your complaint ${complaint.ticketId} has been assigned to ${assignedUserName} (${complaint.assignedDepartment}).`,
      'ASSIGNMENT',
      complaint._id
    );

    const updated = await Complaint.findById(complaint._id)
      .populate('complainant', 'name email avatar')
      .populate('assignedTo', 'name email avatar department role');

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment / discussion message to complaint
// @route   POST /api/complaints/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { message, isStaffOnly } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Only staff/admin can make staff-only internal comments
    const canMakeStaffOnly = ['staff', 'admin'].includes(req.user.role);
    const staffOnlyFlag = canMakeStaffOnly ? (isStaffOnly === true || isStaffOnly === 'true') : false;

    const newComment = {
      user: req.user.id,
      message: message.trim(),
      isStaffOnly: staffOnlyFlag,
      createdAt: new Date(),
    };

    complaint.comments.push(newComment);

    complaint.activityLog.push({
      action: staffOnlyFlag ? 'Internal Staff Note Added' : 'Discussion Comment Added',
      performedBy: req.user.id,
      performerName: req.user.name,
      note: `${req.user.name} added a message.`,
      timestamp: new Date(),
    });

    await complaint.save();

    // Notify other party
    if (!staffOnlyFlag) {
      const isComplainant = req.user.id.toString() === complaint.complainant.toString();
      const notifyTarget = isComplainant ? complaint.assignedTo : complaint.complainant;

      if (notifyTarget) {
        await createNotification(
          notifyTarget,
          `New Comment on ${complaint.ticketId}`,
          `${req.user.name}: "${message.slice(0, 60)}${message.length > 60 ? '...' : ''}"`,
          'COMMENT',
          complaint._id
        );
      }
    }

    const updated = await Complaint.findById(complaint._id)
      .populate('comments.user', 'name avatar role');

    res.json({
      success: true,
      data: updated.comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit student feedback and star rating on resolved complaint
// @route   POST /api/complaints/:id/feedback
// @access  Private (Complainant only)
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.complainant.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only complainant can submit feedback' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ success: false, message: 'Feedback can only be given on resolved complaints' });
    }

    complaint.feedback = {
      rating: Number(rating) || 5,
      comment: comment || '',
      submittedAt: new Date(),
    };

    complaint.activityLog.push({
      action: 'Feedback Submitted',
      performedBy: req.user.id,
      performerName: req.user.name,
      note: `Student rated resolution: ${rating} / 5 stars`,
      timestamp: new Date(),
    });

    await complaint.save();

    // Notify assigned staff
    if (complaint.assignedTo) {
      await createNotification(
        complaint.assignedTo,
        'Feedback Received on Resolution',
        `Student rated resolution for ${complaint.ticketId}: ${rating} stars.`,
        'FEEDBACK',
        complaint._id
      );
    }

    res.json({ success: true, data: complaint.feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle upvote on public complaint
// @route   POST /api/complaints/:id/upvote
// @access  Private
exports.toggleUpvote = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const index = complaint.upvotes.findIndex(
      (id) => id.toString() === req.user.id
    );

    let hasUpvoted = false;
    if (index > -1) {
      complaint.upvotes.splice(index, 1);
      hasUpvoted = false;
    } else {
      complaint.upvotes.push(req.user.id);
      hasUpvoted = true;
    }

    await complaint.save();

    res.json({
      success: true,
      hasUpvoted,
      upvoteCount: complaint.upvotes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Owner if pending, or Admin)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (
      req.user.role !== 'admin' &&
      (complaint.complainant.toString() !== req.user.id || complaint.status !== 'Pending')
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel or delete your pending complaints',
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Complaint removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
