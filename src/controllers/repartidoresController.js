const Repartidor = require('../models/Repartidor');

const registrarRepartidor = async (req, res) => {
  try {
    const { nombre, email, telefono, vehiculo } = req.body;

    const repartidor = await Repartidor.create({
      nombre,
      email,
      telefono,
      vehiculo,
      disponible: true,
      pedidoActual: null
    });

    res.status(201).json({
      mensaje: 'Repartidor registrado correctamente',
      repartidor
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const obtenerRepartidores = async (req, res) => {
  try {
    const repartidores = await Repartidor.findAll();
    res.json({ repartidores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const actualizarUbicacion = async (req, res) => {
  try {
    const { latitud, longitud } = req.body;
    const repartidor = await Repartidor.findByPk(req.params.id);

    if (!repartidor) {
      return res.status(404).json({ mensaje: 'Repartidor no encontrado' });
    }

    repartidor.latitud = latitud;
    repartidor.longitud = longitud;
    await repartidor.save();

    res.json({ mensaje: 'Ubicación actualizada', repartidor });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const actualizarDisponibilidad = async (req, res) => {
  try {
    const { disponible } = req.body;
    const repartidor = await Repartidor.findByPk(req.params.id);

    if (!repartidor) {
      return res.status(404).json({ mensaje: 'Repartidor no encontrado' });
    }

    repartidor.disponible = disponible;
    await repartidor.save();

    res.json({ mensaje: 'Disponibilidad actualizada', repartidor });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const asignarPedidoAutomatico = async (req, res) => {
  try {
    const repartidor = await Repartidor.findOne({ where: { disponible: true } });

    if (!repartidor) {
      return res.status(404).json({ mensaje: 'No hay repartidores disponibles' });
    }

    repartidor.disponible = false;
    repartidor.pedidoActual = req.params.pedidoId;
    await repartidor.save();

    res.json({ mensaje: 'Repartidor asignado', repartidor });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  registrarRepartidor,
  obtenerRepartidores,
  actualizarUbicacion,
  actualizarDisponibilidad,
  asignarPedidoAutomatico
};