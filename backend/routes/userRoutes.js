import express from 'express';
import { getUsers, getUserById, createUser, deleteUser, registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .delete(deleteUser);

export default router;
