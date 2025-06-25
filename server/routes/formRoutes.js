const express = require('express');
const router = express.Router();
const Form = require('../schemas/formSchema'); // adjust path if needed

// Create new form
router.post('/create', async (req, res) => {
  try {
    console.log(req.body)
    const form = new Form(req.body);
    await form.save();
    res.status(201).json({ message: 'Form saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save form' });
  }
});
router.get('/', async (req, res) => {
  const userId = req.user?.userId;
  const forms = await Form.find({ createdBy: userId });
  res.json(forms);
});

module.exports = router;
