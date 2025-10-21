const exp = require('express');
const userApp = exp.Router();
const User = require("../models/userModel");
const UserProgress = require("../models/userProgressModel");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to extract and verify token
const verifyToken = (authHeader) => {
    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('No token provided');
    }
    return jwt.verify(authHeader.substring(7), JWT_SECRET);
};

// Register new user
userApp.post("/register", expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, branch, year } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send({ message: "User already exists with this email" });
    }
    
    const savedUser = await new User({
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
        branch,
        year
    }).save();
    
    await new UserProgress({ userId: savedUser._id }).save();
    
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    
    res.status(201).send({ message: "User registered successfully", payload: userWithoutPassword });
}));

// User login
userApp.post("/login", expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    res.status(200).send({ 
        message: "Login successful", 
        payload: { user: userWithoutPassword, token } 
    });
}));

// Get user profile from token
userApp.get("/profile", expressAsyncHandler(async (req, res) => {
    try {
        const decoded = verifyToken(req.headers.authorization);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        
        res.status(200).send({ message: "User profile", payload: user });
    } catch (error) {
        res.status(401).send({ message: "Invalid token" });
    }
}));

// Get user profile by ID
userApp.get("/profile/:userId", expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }
    
    res.status(200).send({ message: "User profile", payload: user });
}));

// Update user profile
userApp.put("/profile", expressAsyncHandler(async (req, res) => {
    try {
        const decoded = verifyToken(req.headers.authorization);
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId, 
            req.body, 
            { new: true }
        ).select('-password');
        
        res.status(200).send({ message: "Profile updated", payload: updatedUser });
    } catch (error) {
        res.status(401).send({ message: "Invalid token" });
    }
}));

module.exports = userApp;