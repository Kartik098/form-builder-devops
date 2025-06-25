const { Schema, model } = require('mongoose');

const fieldSchema = new Schema({
  id: String,
  type: String,
  label: String,
  required: Boolean,
  options: [String],
  min: String,
  max: String
}, { _id: false });

const formSchema = new Schema({
  title: String,
  fields: [fieldSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Form', formSchema);
