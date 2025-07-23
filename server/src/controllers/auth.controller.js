const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const {User}= require('../models');
const { handleGenericAPIError } = require('../utils');


const registerUser=async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        
        newUser.password = undefined; 

        res.status(201).json({ message: 'User registered successfully',isSuccess: true,data:{user: newUser} });
    } catch (error) {
        handleGenericAPIError('registerUser', req, res, error);
    }
}




const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id ,email:email}, process.env.JWT_SECRET, { expiresIn: '3h' });
        if (!token) {
            return res.status(500).json({ message: 'Error generating token' });
        }
        
        res.cookie('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3 * 60 * 60 * 1000, 
        });
        
        user.password = undefined; 

        res.status(200).json({message: 'Login successful', isSuccess: true, data: { user:user } });
    } catch (error) {
        handleGenericAPIError('loginUser', req, res, error);
    }
}


const logoutUser = (req, res) => {
    try {
        res.clearCookie('auth');
        res.status(200).json({ message: 'Logout successful', isSuccess: true });
    } catch (error) {
        handleGenericAPIError('logoutUser', req, res, error);   
    }
}

const isAuthenticated = async(req, res) => {
    try {
        const user = req.user;
        const userId=user?._id;
        const isUser=await User.findById(userId).select('-password');

        res.status(200).json({
            isSuccess: true,
            message: 'User is authenticated',
            data: { user: isUser }
        });
        
    } catch (error) {
        handleGenericAPIError('isAuthenticated', req, res, error);
    }
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    isAuthenticated
};