const router  = require('express').Router();
const Service = require('../models/Service');

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type)     filter.type     = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.postedBy) filter.postedBy = req.query.postedBy;
    const services = await Service.find(filter)
      .populate('postedBy', 'name email linkedin memberType location')
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/services
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/services/:id
router.delete('/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Service removed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;