import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

// Register User
export const registerUser = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }
        
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const usernameExists = await User.findOne({ username: username.toLowerCase().trim() });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const user = await User.create({
            name,
            username: username.toLowerCase().trim(),
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(550).json({ message: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const queryValue = usernameOrEmail.toLowerCase().trim();
        const user = await User.findOne({
            $or: [
                { email: queryValue },
                { username: queryValue }
            ]
        });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const { name, username, email, password, profilePic, role } = req.body;
    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const usernameExists = await User.findOne({ username: username.toLowerCase().trim() });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const user = new User({ name, username, email, password, profilePic, role });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(450).json({ message: error.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
