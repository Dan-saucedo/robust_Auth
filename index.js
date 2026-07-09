import express from 'express';
import mongoose, { mongo } from 'mongoose';
import helmet from 'helmet';
import 'dotenv/config';
import { securityMiddleware } from './src/middleware/middleware.js';
//import usersRoute from '../main_project/src/routes/usersRoute.js';
//import productsRoute from '../main_project/src/routes/productsRoute.js';

const app = express();
const PORT = process.env.PORT || 5100;

app.get('/', async(req, res) => {
    res.json({
        message: 'You connected successfully 👌',
        status: 'Online'
    });
});

app.use('/api/products', securityMiddleware, productsRoute );
app.use('/api/users', securityMiddleware, usersRoute);
app.use(express.json());
app.use(helmet());

//Conexion a MongoDB
mongoose.connect(process.env.MONGO_URI)
try {
    await console.log('Conectado a MongoDB 🙌');
} catch(error) {
    console.error('Error connection MongoDB', error.message);
    process.exit(1); //Detiene la app
};


app.listen(PORT, () => {
    console.log(`Hola mundo http://localhost:${PORT}`);
});