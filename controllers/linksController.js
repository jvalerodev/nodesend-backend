import Link from '../models/Link.js';
import { validationResult } from 'express-validator';
import shortid from 'shortid';

const newLink = async (req, res) => {
  // Comprobar si hay errores
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ ...errors });
  }

  // Crear un objeto del link
  const { originalName, filename } = req.body;
  const link = new Link();
  link.url = shortid.generate();
  link.filename = filename;
  link.original_name = originalName;

  // Si el usuario esta autenticado
  if (req.user) {
    const { password, downloads } = req.body;

    // Asignar al link el numero de descargas
    if (downloads) link.downloads = downloads;

    // Asignar password al link
    if (password) link.password = password;

    // Asignar el autor
    link.author = req.user._id;
  }

  // Guardar el enlace en la base de datos
  try {
    await link.save();
    res.json({ msg: `${link.url}` });
  } catch (error) {
    console.log(error);
  }
};

// Obtener todos los enlances
const getLinks = async (req, res) => {
  try {
    const links = await Link.find({}).select('url -_id');
    res.json({ links });
  } catch (error) {
    console.log(error);
  }
};

// Valida si un link tiene password
const hasPassword = async (req, res, next) => {
  const { url } = req.params;

  // Verificar si el enlace existe
  const link = await Link.findOne({ url });

  if (!link) {
    return res.status(404).json({ msg: 'The link does not exist' });
  }

  if (link.password) {
    return res.json({ hasPassword: true, url: link.url, file: link.filename });
  }

  next();
};

// Obtener enlace
const getLink = async (req, res) => {
  const { url } = req.params;

  // Verificar si el enlace existe
  const link = await Link.findOne({ url });

  if (!link) {
    return res.status(404).json({ msg: 'The link does not exist' });
  }

  res.json({ file: link.filename, hasPassword: false });
};

// Valida el passowrd del link
const validatePassword = async (req, res, next) => {
  const { url } = req.params;
  const { password } = req.body;

  // Buscar el enlace
  const link = await Link.findOne({ url });

  if (!await link.validatePassword(password)) {
    return res.status(401).json({ msg: 'Invalid password.' });
  }

  next();
};

export { newLink, hasPassword, getLinks, getLink, validatePassword };