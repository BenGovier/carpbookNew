const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const lakeController = require('../controllers/lakeController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', protect, upload.single('image'), lakeController.createLake);
router.get('/', protect, lakeController.getLakes);
router.get('/:id', protect, lakeController.getLake);
router.put('/:id', protect, upload.single('image'), lakeController.updateLake);
router.delete('/:id', protect, lakeController.deleteLake);

module.exports = router;