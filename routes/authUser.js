import express from 'express'
import { loginUser, logoutUser, registerUser } from '../Controller/auth.Controller.js';

const router = express.Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post("/logout", logoutUser)

export default router;
