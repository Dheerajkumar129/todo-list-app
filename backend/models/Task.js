const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is mandatory'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    dateTime: {
      type: Date,
      required: [true, 'Date and Time is mandatory']
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed'],
      default: 'In Progress'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for search optimization
TaskSchema.index({ title: 'text', description: 'text' });
TaskSchema.index({ dateTime: 1 });

module.exports = mongoose.model('Task', TaskSchema);
