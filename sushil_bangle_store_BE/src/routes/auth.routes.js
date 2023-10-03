const router = require('express').Router();
const UserAuth = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/functions');

// SIGNUP api
router.post('/signup', async (req, res) => {
    try {
        // Check for unique email
        const userExists = await UserAuth.findOne({ email: req.body.email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Another User already exists with this Email.' });
        }

        // Signup user
        const user = UserAuth({
            fullName: req.body.fullName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10) // Secure password
        });

        const response = await user.save();

        // Generating and Setting token in header
        // res.header("Authorization", `Bearer ${generateToken({ user: { email: req.body.email } })}`)

        res.status(200).json({ success: true, message: "New User Created Successfully.", response, token: generateToken({ user: { email: req.body.email } }) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        console.log("Error =>", error);
    }
});

// LOGIN api

router.post('/login', async (req, res) => {
    // check if user really exists
    const userExists = await UserAuth.findOne({ email: req.body.email });

    if (!userExists) return res.status(400).json({ success: false, message: "Invalid Email or Password" })

    try {
        // Verify Password
        if (!bcrypt.compareSync(req.body.password, userExists.password)) return res.status(400).json({ success: false, message: "Invalid Email or Password" });

        // Generating and Setting token in header
        // res.header("Authorization", `Bearer ${generateToken({ user: { email: req.body.email } })}`)

        res.status(200).json({ success: true, message: "User Login Success.", response: userExists, token: generateToken({ user: { email: req.body.email } }) });

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        console.log("Error =>", error);
    }
});

module.exports = router;