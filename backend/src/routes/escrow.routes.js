const express = require('express');
const router = express.Router();
const escrowController = require('../controllers/escrow.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Rotas de Escrow
router.get('/', escrowController.list || ((req, res) => res.json([])));
router.get('/:id', escrowController.getById || ((req, res) => res.json({})));
router.post('/', authMiddleware, escrowController.create || escrowController.createEscrow || ((req, res) => res.status(501).json({ error: 'Não implementado' })));
router.patch('/:id/status', authMiddleware, escrowController.updateStatus || ((req, res) => res.status(501).json({ error: 'Não implementado' })));

module.exports = router;