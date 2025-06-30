const mongoose = require('mongoose');


const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, enum: ['login', 'logout'], required: true },
  timestamp: { type: Date, default: Date.now },
  role: { type: String },
  email: { type: String }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
