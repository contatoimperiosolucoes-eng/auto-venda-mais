const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');

// Listagem e busca por ID
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Criação
router.post('/', vehicleController.createVehicle);

// Atualização (PUT e PATCH)
router.put('/:id', vehicleController.updateVehicle);
router.patch('/:id', vehicleController.updateVehicle);

// Remoção
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;