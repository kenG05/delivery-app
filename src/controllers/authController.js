const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarios = [];

const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const usuarioExiste = usuarios.find(u => u.email === email);
    if (usuarioExiste) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = {
      id: usuarios.length + 1,
      nombre,
      email,
      password: passwordHash,
      rol: rol || 'cliente'
    };

    usuarios.push(usuario);

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: { id: usuario.id, nombre, email, rol: usuario.rol }
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Email o password incorrecto' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'Email o password incorrecto' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email, rol: usuario.rol }
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { registro, login };