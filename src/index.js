const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
require('./models/Usuario');
require('./models/Pedido');
require('./models/Repartidor');

const { conectarDB } = require('./database/connection');
const authRoutes = require('./routes/auth');
const pedidosRoutes = require('./routes/pedidos');
const repartidoresRoutes = require('./routes/repartidores');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor de delivery funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/repartidores', repartidoresRoutes);

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('unirse_pedido', (pedidoId) => {
    socket.join(`pedido_${pedidoId}`);
    console.log(`Cliente unido al pedido ${pedidoId}`);
  });

  socket.on('actualizar_ubicacion', (data) => {
    const { pedidoId, latitud, longitud } = data;
    io.to(`pedido_${pedidoId}`).emit('ubicacion_actualizada', {
      pedidoId,
      latitud,
      longitud,
      timestamp: new Date()
    });
  });

  socket.on('cambiar_estado_pedido', (data) => {
    const { pedidoId, estado } = data;
    io.to(`pedido_${pedidoId}`).emit('estado_actualizado', {
      pedidoId,
      estado,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});