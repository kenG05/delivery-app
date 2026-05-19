const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Repartidor = sequelize.define('Repartidor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vehiculo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  latitud: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  longitud: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  pedidoActual: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'repartidores',
  timestamps: true
});

module.exports = Repartidor;