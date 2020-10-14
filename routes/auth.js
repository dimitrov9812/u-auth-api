const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { registerValidationSchema, loginValidationSchema } = require("../validation");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

// Register user
router.post("/register", async (req, res) => {
    // validate data before we make user
    const validatedUser = registerValidationSchema.validate(req.body);
    // if we have an error validating user we return it and dont save the user to the database
    if (validatedUser.error) return res.status(400).send(validatedUser.error.details[0].message)

    // check if a user is already in database
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(400).send("Email already exists!") 

    // Hash the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    // create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    // save the user to the database
    try {
        const savedUser = await user.save();
        res.send(savedUser);
        console.log("user saved to db!");
    } catch (err) {
        res.status(400).send(err);
    }
});


// Login user
router.post("/login", async (req, res) => {
    // Validate the user input
    const validatedUser = loginValidationSchema.validate(req.body);
    if (validatedUser.error) return res.status(400).send(validatedUser);

    // Check if the email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Email does not exists");

    // Check if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Password is incorrect");

    // Create and assign a token
    const token = JWT.sign({_id:user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token',token);
    res.send(token);

    // Log the user in
    res.send("Logged in successfully");
});

module.exports = router;