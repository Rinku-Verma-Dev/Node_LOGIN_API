require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userId = require('../models/userSchema');
const data = require("../public/data")


// ----->   Fetching data by user ID
const profileById = async (req, res) => {
    try {
        const ID = req.params.id;
        // console.log(req.user);
        const userData = await userId.findOne({ _id: ID });
        res.json({ userData });
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

//----->   Check Authorisation 
const homeAuth = (req, res) => {
    const userName = req.body.email;
    res.json({ userName });
}

const dataFeatch = (req, res) => {
    try {
        res.send(data);
    } catch (err) {
        res.status(400).json({ error: err });
    }
}


//----->   Sign up user
const register = async (req, res) => {
    try {
        const { fName, lName, password } = req.body;
        const email = (req.body.email).toLowerCase();
        const isUserPresent = await userId.findOne({ email: email });
        // console.log(isUserPresent)
        if (isUserPresent) {
            res.status(400).send({ message: "user already registered" })
        }
        else {
            const newUser = new userId({
                fName: fName,
                lName: lName,
                email: email.toLowerCase(),
                password: password
            })

            const userPassword = await bcrypt.hash(password, 10);
            newUser.password = userPassword;
            await newUser.save();

            // const userName = await userId.findOne({ email: email });
            // let token = jwt.sign({ userName }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
            // console.log(token);
            res.json({ newUser });
        }
        // const email = req.body.email;
    } catch (err) {
        res.status(400).json({ error: err });
    }
};


//----->   login user
const login = async (req, ress) => {
    try {
        const { email, password } = req.body;
        const userName = await userId.findOne({ email: email.toLowerCase() });

        // console.log(require('crypto').randomBytes(64).toString('hex'));
        if (userName) {
            bcrypt.compare(password, userName.password, (err, res) => {
                if (res) {
                    const payload = {
                        id: userName._id,
                        email: userName.email,
                        fName: userName.fName
                    }
                    let token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1h" });
                    // console.log(token);
                    ress.json({ accessToken: token });
                }
                else {
                    ress.status(400).send({ message: "Invalid password" });
                }
            })
        }
        else {

            ress.status(400).send({ message: "Invalid user name " });
        }
        // ress.status(200).json({userName});
    } catch (err) {
        ress.status(400).json({ error: err });
    }
};


// ----->   Forget Password
const forget = async (req, res) => {
    try {
        const email = (req.body.email).toLowerCase();
        const { newPassword, confirmPassword } = req.body;
        const userData = await userId.findOne({ email: email });
        if (userData) {
            if (newPassword === confirmPassword) {
                // userData.updateOne({email: email}, {$set :{password: newPassword}});
                userData.password = await bcrypt.hash(newPassword, 10);
                await userData.save();
                res.send("Password changed.....");
            } else res.status(400).send({ message: "Please enter same Confirm password..." });
        }
        else {
            res.status(400).send({ message: "invalid user Id....." });
        }
    } catch (err) {
        register.status(400).json({ error: err });
    }
};


// ----->   Delete user Data
const deletedata = async (req, res) => {
    try {
        const { id } = req.user;
        console.log(id);
        await userId.findOneAndDelete({ _id: id })
        res.send("delete successfully..");

    } catch (err) {
        // res.send("ok");
        res.status(400).json({ error: err.message });
    }
}


// ----->   Change user Password
const changePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const currUser = await userId.findOne({ _id: id });
        const { currPassword, newPassword, confirmPassword } = req.body;

        await bcrypt.compare(currPassword, currUser.password, async (req, ress) => {
            if (ress) {

                if (newPassword === confirmPassword) {

                    currUser.password = await bcrypt.hash(newPassword, 10);
                    await currUser.save();
                    res.send("password Changed");

                } else res.status(400).send({ message: "Please enter same password" });

            } else res.status(400).send({ message: "incorrect Current password" });
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


module.exports = {
    login,
    deletedata,
    profileById,
    homeAuth,
    register,
    forget,
    changePassword,
    dataFeatch
};