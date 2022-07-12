import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -__v');
    } catch (error) {
      console.log(error);
      return res.status(403).json({ msg: 'Invalid token' });
    }
  }

  return next();
};

export default checkAuth;