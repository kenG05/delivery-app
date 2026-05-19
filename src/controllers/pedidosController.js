const pedidos = [];

const crearPedido = (req, res) => {
  try {
    const { productos, direccionEntrega, metodoPago } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Debes agregar al menos un producto' });
    }

    const total = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    const pedido = {
      id: pedidos.length + 1,
      clienteId: req.usuario.id,
      productos,
      direccionEntrega,
      metodoPago,
      total,
      estado: 'pendiente',
      repartidorId: null,
      fechaCreacion: new Date(),
      fechaEntrega: null
    };

    pedidos.push(pedido);

    res.status(201).json({
      mensaje: 'Pedido creado correctamente',
      pedido
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const obtenerPedidos = (req, res) => {
  try {
    const { rol, id } = req.usuario;

    if (rol === 'admin') {
      return res.json({ pedidos });
    }

    if (rol === 'repartidor') {
      const misPedidos = pedidos.filter(p => p.repartidorId === id);
      return res.json({ pedidos: misPedidos });
    }

    const misPedidos = pedidos.filter(p => p.clienteId === id);
    res.json({ pedidos: misPedidos });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const obtenerPedidoPorId = (req, res) => {
  try {
    const pedido = pedidos.find(p => p.id === parseInt(req.params.id));

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    res.json({ pedido });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const actualizarEstado = (req, res) => {
  try {
    const { estado, repartidorId } = req.body;
    const estadosValidos = ['pendiente', 'confirmado', 'preparando', 'en_camino', 'entregado', 'cancelado'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado no válido' });
    }

    const pedido = pedidos.find(p => p.id === parseInt(req.params.id));

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    pedido.estado = estado;

    if (repartidorId) {
      pedido.repartidorId = repartidorId;
    }

    if (estado === 'entregado') {
      pedido.fechaEntrega = new Date();
    }

    res.json({
      mensaje: 'Estado actualizado correctamente',
      pedido
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { crearPedido, obtenerPedidos, obtenerPedidoPorId, actualizarEstado };