const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productos: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  direccionEntrega: {
    type: DataTypes.STRING,
    allowNull: false
  },
  metodoPago: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'preparando', 'en_camino', 'entregado', 'cancelado'),
    defaultValue: 'pendiente'
  },
  repartidorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fechaEntrega: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'pedidos',
  timestamps: true
});

module.exports = Pedido;