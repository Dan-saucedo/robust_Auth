import express from 'express';
import mongoose, { mongo } from 'mongoose';
import helmet from 'helmet';
import 'dotenv/config';
import { securityMiddleware } from './src/middleware/middleware.js';
import usersRoute from './src/routes/usersRoute.js';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5100;

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {message: 'This IP reached maximum attemps for access. Wait 15 minutes'},
    standardHeaders: true,
    legacyHeaders: false
});

app.use(express.json());
app.use(helmet());

app.use('/api', securityMiddleware);
//Aplicacion de rate limiting y cargar rutas
app.use('/api/users/login', loginLimiter);
app.use('/api/users', usersRoute);

app.get('/', async(req, res) => {
    res.json({ message: 'You connected successfully 👌', status: 'Online' });
});

//Conexion a MongoDB
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB 🙌');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al conectar a MongoDB', error.message);
        process.exit(1);
    }
})();