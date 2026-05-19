const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Usuario = sequelize.define('Usuario', {
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
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('cliente', 'repartidor', 'admin'),
    defaultValue: 'cliente'
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;