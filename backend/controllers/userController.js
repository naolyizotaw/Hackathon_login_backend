const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const User = require( "../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const transporter = require('../config/mailer');

const SignupUser = asyncHandler(async (req, res) => {
    const {username , email , password } = req.body;
    if (!username || !email || !password ) {
        res.status(400);
        throw new Error("All Fields are mandatory")
    }
    const usernameAvailable = await User.findOne({username});
    if(usernameAvailable) {
        res.status(400);
        throw new Error("account with this username already exists")
    }

    const emailExists = await User.findOne({email})
    if(emailExists){
        res.status(400);
        throw new Error("account with this email already exists ")
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Create JWT containing the code and email
    const verificationToken = jwt.sign({ email, code: verificationCode }, process.env.JWT_SECRET, { expiresIn: '10m' });

    const user  = await User.create({
        username,
        email,
        password: hashedPassword,
        isVerified: false
        // Do NOT save verificationToken or code in DB
    });
    console.log("user created", user);
    if(user) {
        // Send verification email
        const verifyUrl = `${req.protocol}://${req.get('host')}/api/users/verify-email?token=${verificationToken}&code=${verificationCode}`;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'no-reply@example.com',
            to: user.email,
            subject: 'Verify your email',
            html: `<p>Hi ${user.username},</p><p>Your verification code is: <b>${verificationCode}</b></p><p>Or click <a href="${verifyUrl}">here</a> to verify.</p>`
        });
        res.status(201).json({
            _id: user.id,
            email: user.email,
            message: 'Verification email sent. Please check your inbox.',
            token: verificationToken,
            code: verificationCode
        })
    } else {
        res.status(400);
        throw new Error("User data is not valid")
    }
    
    return verificationToken;
});

const loginUser = asyncHandler (async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!")
    }

    const user = await User.findOne({email});
    
    if(user && (await bcrypt.compare(password, user.password))) {
         if (!user.isVerified) {
            res.status(403);
           throw new Error("Please verify your email before logging in.");
        }
        const accessToken = jwt.sign({
            user : {
                username : user.username,
                email : user.email,
                id: user.id
            }, 
        }, process.env.JWT_SECRET , {expiresIn :  "1h"});
        res.status(200).json({accessToken});
    } else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
})
const currentUser = asyncHandler ( async (req, res) => {
    
    res.json(req.user)
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { code } = req.query;
    // req.user is set by verifyToken middleware
    if (!code) {
        return res.status(400).json({ message: 'Verification code is required.' });
    }
    try {
        // Find user by email from decoded token (set in req.user)
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        // Compare code from query with code from token (req.user.code)
        if (req.user.code !== code) {
            return res.status(400).json({ message: 'Invalid verification code.' });
        }
        user.isVerified = true;
        await user.save();
        return res.json({ message: 'Email verified successfully. You can now log in.' });
    } catch (err) {
        return res.status(400).json({ message: 'Verification failed.' });
    }
});

// Utility function to send verification email and return JWT token
async function sendVerificationEmail(req, res) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = jwt.sign({ email: req.email, code: verificationCode }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/users/verify-email?code=${verificationCode}`;
    await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        to: req.email,
        subject: 'Verify your email',
        html: `<p>Hi ${req.username},</p><p>Your verification code is: <b>${verificationCode}</b></p><p>Or click <a href="${verifyUrl}">here</a> to verify.</p>`
    });
    
    return verificationToken;
    
}

// Route handler to send verification email and return JWT token
const requestVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }
    if (user.isVerified) {
        return res.status(400).json({ message: 'User is already verified.' });
    }
    const token = await sendVerificationEmail(user, req);
    res.json({ message: 'Verification email sent. Please check your inbox.', verifyToken: token });
});

module.exports = {SignupUser , loginUser , currentUser, verifyEmail, requestVerificationEmail}