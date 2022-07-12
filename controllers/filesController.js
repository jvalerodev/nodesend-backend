import multer from 'multer';
import shortid from 'shortid';
import fs from 'fs';
import path from 'path';
import Link from '../models/Link.js';

const uploadFile = (req, res, next) => {
  const multerConfig = {
    limits: { fileSize: req.user ? 20971520 : 1048576 },
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, path.resolve() + '/uploads');
      },
      filename: (req, file, callback) => {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        callback(null, `${shortid.generate() + extension}`);
      }
    })
  };

  const upload = multer(multerConfig).single('file');

  upload(req, res, error => {
    if (error) {
      console.log(error);
      return next();
    }
    res.json({ file: req.file.filename });
  });
};

const downloadFile = async (req, res, next) => {
  const { file } = req.params;
  const link = await Link.findOne({ filename: file });

  if (!link) {
    return res.redirect('back');
  }

  const fileDownload = path.resolve() + '/uploads/' + file;
  res.download(fileDownload);

  // Comprobar la cantidad de descargas restantes
  if (link.downloads === 1) {
    req.filename = link.filename; // Eliminar el archivo
    await link.deleteOne(); // Eliminar el enlace de la base de datos
    next();
  } else {
    link.downloads--;
    await link.save();
  }
};

const deleteFile = (req, res) => {
  try {
    fs.unlinkSync(path.resolve() + `/uploads/${req.filename}`);
  } catch (error) {
    console.log(error);
  }
};


export { uploadFile, deleteFile, downloadFile };