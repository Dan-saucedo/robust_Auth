import express from 'express';
import { getUsers, updateUser, deleteUser, registerUser, loginUser } from '../controller/robustAuthentication.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//RUTAS PÚBLICAS
router.post('/register', registerUser);
router.post('/login', loginUser);
// 2. RUTAS PROTEGIDAS (Con verifyToken)
router.get('/users', verifyToken, getUsers);
router.put('/:id', verifyToken, updateUser);

//En el caso de DELETE no solamente es borrar el usuario y ya
//Lo debe buscar por su token. Si el token que se busca no coincide con el del usuario por borrar, NO LO BORRA
//Esto por seguridad y/o evitar *accidentes borrando otro usuario
router.delete('/:id', verifyToken, deleteUser);

export default router;