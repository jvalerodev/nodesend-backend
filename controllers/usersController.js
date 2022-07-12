import User from '../models/User.js';
import { validationResult } from 'express-validator';

const register = async (req, res) => {
  // Comprobar mensajes de error de express validator
  const errors = await validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ ...errors });
  }

  // Comprobar si el email ya esta registrado
  const { email } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ msg: 'Email is not available.' });
  }

  // Registrar al usuario
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ msg: 'User successfully registered.' });
  } catch (error) {
    console.log(error.msg);
  }
};

export { register };