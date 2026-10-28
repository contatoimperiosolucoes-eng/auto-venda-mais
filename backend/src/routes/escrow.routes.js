const express = require('express');
const router = express.Router();
const escrowController = require('../controllers/escrow.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', escrowController.list);
router.get('/:id', escrowController.getById);
router.post('/', authMiddleware, escrowController.create);
router.patch('/:id/status', authMiddleware, escrowController.updateStatus);

module.exports = router;