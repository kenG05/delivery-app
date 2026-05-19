const repartidores = [];

const registrarRepartidor = (req, res) => {
  try {
    const { nombre, email, telefono, vehiculo } = req.body;

    const repartidor = {
      id: repartidores.length + 1,
      nombre,
      email,
      telefono,
      vehiculo,
      disponible: true,
      ubicacion: null,
      pedidoActual: null,
      fechaRegistro: new Date()
    };

    repartidores.push(repartidor);

    res.status(201).json({
      mensaje: 'Repartidor registrado correctamente',
      repartidor
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const obtenerRepartidores = (req, res) => {
  try {
    res.json({ repartidores });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const actualizarUbicacion = (req, res) => {
  try {
    const { latitud, longitud } = req.body;

    const repartidor = repartidores.find(r => r.id === parseInt(req.params.id));

    if (!repartidor) {
      return res.status(404).json({ mensaje: 'Repartidor no encontrado' });
    }

    repartidor.ubicacion = {
      latitud,
      longitud,
      ultimaActualizacion: new Date()
    };

    res.json({
      mensaje: 'Ubicación actualizada',
      repartidor
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const actualizarDisponibilidad = (req, res) => {
  try {
    const { disponible } = req.body;

    const repartidor = repartidores.find(r => r.id === parseInt(req.params.id));

    if (!repartidor) {
      return res.status(404).json({ mensaje: 'Repartidor no encontrado' });
    }

    repartidor.disponible = disponible;

    res.json({
      mensaje: 'Disponibilidad actualizada',
      repartidor
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const asignarPedidoAutomatico = (req, res) => {
  try {
    const repartidorDisponible = repartidores.find(r => r.disponible === true);

    if (!repartidorDisponible) {
      return res.status(404).json({ mensaje: 'No hay repartidores disponibles en este momento' });
    }

    repartidorDisponible.disponible = false;
    repartidorDisponible.pedidoActual = req.params.pedidoId;

    res.json({
      mensaje: 'Repartidor asignado correctamente',
      repartidor: repartidorDisponible
    });

  } catch (error) {
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