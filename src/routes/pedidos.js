const express = require('express');
const router = express.Router();
const { crearPedido, obtenerPedidos, obtenerPedidoPorId, actualizarEstado } = require('../controllers/pedidosController');
const { verificarToken } = require('../middleware/auth');

router.post('/', verificarToken, crearPedido);
router.get('/', verificarToken, obtenerPedidos);
router.get('/:id', verificarToken, obtenerPedidoPorId);
router.put('/:id/estado', verificarToken, actualizarEstado);

module.exports = router;