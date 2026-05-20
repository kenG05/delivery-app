const Pedido = require('../models/Pedido');

const crearPedido = async (req, res) => {
  try {
    const { productos, direccionEntrega, metodoPago } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'Debes agregar al menos un producto' });
    }

    const total = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    const pedido = await Pedido.create({
      clienteId: req.usuario.id,
      productos,
      direccionEntrega,
      metodoPago,
      total
    });

    res.status(201).json({
      mensaje: 'Pedido creado correctamente',
      pedido
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const obtenerPedidos = async (req, res) => {
  try {
    const { rol, id } = req.usuario;
    let pedidos;

    if (rol === 'admin') {
      pedidos = await Pedido.findAll({ order: [['createdAt', 'DESC']] });
    } else if (rol === 'repartidor') {
      pedidos = await Pedido.findAll({ where: { repartidorId: id }, order: [['createdAt', 'DESC']] });
    } else {
      pedidos = await Pedido.findAll({ where: { clienteId: id }, order: [['createdAt', 'DESC']] });
    }

    res.json({ pedidos });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    res.json({ pedido });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const actualizarEstado = async (req, res) => {
  try {
    const { estado, repartidorId } = req.body;
    const estadosValidos = ['pendiente', 'confirmado', 'preparando', 'en_camino', 'entregado', 'cancelado'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado no válido' });
    }

    const pedido = await Pedido.findByPk(req.params.id);

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    pedido.estado = estado;

    if (repartidorId) {
      pedido.repartidorId = repartidorId;
    }

    if (estado === 'confirmado' && !pedido.repartidorId) {
      const Repartidor = require('../models/Repartidor');
      const repartidorDisponible = await Repartidor.findOne({
        where: { disponible: true }
      });

      if (repartidorDisponible) {
        pedido.repartidorId = repartidorDisponible.id;
        repartidorDisponible.disponible = false;
        repartidorDisponible.pedidoActual = pedido.id;
        await repartidorDisponible.save();
        console.log(`Repartidor ${repartidorDisponible.nombre} asignado al pedido #${pedido.id}`);
      } else {
        console.log('No hay repartidores disponibles');
      }
    }

    if (estado === 'entregado') {
      pedido.fechaEntrega = new Date();
      if (pedido.repartidorId) {
        const Repartidor = require('../models/Repartidor');
        const repartidor = await Repartidor.findByPk(pedido.repartidorId);
        if (repartidor) {
          repartidor.disponible = true;
          repartidor.pedidoActual = null;
          await repartidor.save();
        }
      }
    }

    await pedido.save();

    res.json({
      mensaje: 'Estado actualizado correctamente',
      pedido
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
module.exports = { crearPedido, obtenerPedidos, obtenerPedidoPorId, actualizarEstado };