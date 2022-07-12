import User from '../models/User.js';
import { validationResult } from 'express-validator';
import cookie from 'cookie';
import generateJWT from '../helpers/generateJWT.js';

const authenticateUser = (req, res) => {
  const { user } = req;
  res.json({ user });
};

const logIn = async (req, res) => {
  // Comrpobar si hay errores
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ ...errors });
  }

  // Buscar si el usuario esta registrado
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ msg: 'User does not exist.' });
  }

  // Verificar el password
  if (!await user.validatePassword(password)) {
    return res.status(401).json({ msg: 'Incorrect password.' });
  }

  // Autenticar al usuario
  res.setHeader('Set-Cookie', cookie.serialize('token', generateJWT(user._id), {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 60 * 60 * 8,
    sameSite: 'strict',
    path: '/'
  }));

  res.statusCode = 200;

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email
  });
};

const logOut = async (req, res) => {
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/'
  }));

  res.statusCode = 200;

  res.json({ success: true });
};

export { logIn, authenticateUser, logOut };