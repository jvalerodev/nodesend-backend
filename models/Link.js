import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const linkSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  original_name: {
    type: String,
    required: true
  },
  downloads: {
    type: Number,
    default: 1
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    default: null
  },
  password: {
    type: String,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: false
  }
});

linkSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

linkSchema.methods.validatePassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

const Link = mongoose.model('Links', linkSchema);

export default Link;