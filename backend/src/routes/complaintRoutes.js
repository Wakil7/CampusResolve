const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getPublicFeed,
  getComplaintById,
  updateStatus,
  assignComplaint,
  addComment,
  submitFeedback,
  toggleUpvote,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public campus feed can be accessed without strict auth (or with optional auth)
router.get('/public', protect, getPublicFeed);

router
  .route('/')
  .get(protect, getComplaints)
  .post(protect, upload.array('attachments', 5), createComplaint);

router.route('/:id').get(protect, getComplaintById).delete(protect, deleteComplaint);

// Status updates & assignments (Staff & Admin)
router.put('/:id/status', protect, authorize('staff', 'admin'), updateStatus);
router.put('/:id/assign', protect, authorize('staff', 'admin'), assignComplaint);

// Comments, feedback, upvoting
router.post('/:id/comments', protect, addComment);
router.post('/:id/feedback', protect, submitFeedback);
router.post('/:id/upvote', protect, toggleUpvote);

module.exports = router;
