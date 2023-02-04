const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const applySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    jobId: {
      type: ObjectId,
      ref: 'job',
      require: true
    },
    userId: {
      type: ObjectId,
      ref: 'user',
      require: true
    },
    resume: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("apply", applySchema);