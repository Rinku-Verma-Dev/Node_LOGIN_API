// const {routFun, authenticataToken} = require('../models/require');
const authenticataToken = require('../models/authentication');
const express = require('express');
const router = express.Router();

const {
    login,
    profileById,
    homeAuth,
    deletedata,
    register,
    changePassword,
    forget,
    dataFeatch
} = require('../models/routeFunctions');

router.get('/profile/:id', authenticataToken,profileById);
router.post('/home', authenticataToken, homeAuth)
router.post("/data", dataFeatch)
router.post('/login', login);
router.post('/signup', register)
router.post('/forgetPassword', forget);
router.delete('/deleteData', authenticataToken, deletedata);
router.post('/changePassword',  authenticataToken, changePassword);


module.exports = router;