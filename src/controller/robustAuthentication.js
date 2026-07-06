import 'dotenv/config';
import jwt from 'jsonwebtoken';
import userModel from '../models/users.js';

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '1h' }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const user = await userModel.create({ email, password });

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.bloqueadoHasta && new Date() < user.bloqueadoHasta) {
      return res.status(403).json({ message: `Cuenta bloqueada hasta ${user.bloqueadoHasta}` });
    }

    if (user.password !== password) {
      user.intentosFallidos = (user.intentosFallidos || 0) + 1;

      if (user.intentosFallidos >= 3) {
        user.bloqueadoHasta = new Date(Date.now() + 15 * 60 * 1000);
      }

      await user.save();
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    user.intentosFallidos = 0;
    user.bloqueadoHasta = null;
    await user.save();

    const token = createToken(user);

    return res.status(200).json({
      message: 'Autenticación exitosa',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, '-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error al buscar usuario', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const updateData = {};

    if (email) updateData.email = email;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }

    const user = await userModel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

export default {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
