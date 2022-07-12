import jwt from 'jsonwebtoken';

const generateJWT = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '8h' });
};

export default generateJWT;