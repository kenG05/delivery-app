const express = require('express');
const router = express.Router();
const {
  registrarRepartidor,
  obtenerRepartidores,
  actualizarUbicacion,
  actualizarDisponibilidad,
  asignarPedidoAutomatico
} = require('../controllers/repartidoresController');
const { verificarToken } = require('../middleware/auth');

router.post('/', verificarToken, registrarRepartidor);
router.get('/', verificarToken, obtenerRepartidores);
router.put('/:id/ubicacion', verificarToken, actualizarUbicacion);
router.put('/:id/disponibilidad', verificarToken, actualizarDisponibilidad);
router.post('/asignar/:pedidoId', verificarToken, asignarPedidoAutomatico);

module.exports = router;