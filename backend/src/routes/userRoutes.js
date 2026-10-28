const express = require('express');
const router = express.Router();
const {
  getStaffList,
  getAllUsers,
  updateUserRole,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/staff', protect, authorize('staff', 'admin'), getStaffList);
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;
