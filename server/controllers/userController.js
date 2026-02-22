import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_alif_luxe_2026', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received.' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server configuration error.' });
  }
};

export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User profile not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

export const toggleWishlistItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorited = user.wishlist.includes(productId);
        
        if (isFavorited) {
            user.wishlist.pull(productId);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        res.json({ wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error updating wishlist.' });
    }
};
