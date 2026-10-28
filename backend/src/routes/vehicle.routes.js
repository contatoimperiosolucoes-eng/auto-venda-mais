const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth.middleware');

// Rotas públicas (qualquer visitante consulta anúncios)
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Rotas protegidas (apenas 'vendedor' ou 'admin')
router.post('/', authMiddleware, authorizeRoles('vendedor', 'admin'), vehicleController.createVehicle);
router.put('/:id', authMiddleware, authorizeRoles('vendedor', 'admin'), vehicleController.updateVehicle);
router.patch('/:id', authMiddleware, authorizeRoles('vendedor', 'admin'), vehicleController.updateVehicle);
router.delete('/:id', authMiddleware, authorizeRoles('vendedor', 'admin'), vehicleController.deleteVehicle);

module.exports = router;