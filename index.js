import express from 'express';
import mongoose, { mongo } from 'mongoose';
import helmet from 'helmet';
import 'dotenv/config';
import MONGO_URI from 'dotenv';

const app = express();
const PORT = process.env.PORT || 5100;

app.get('/', async(req, res) => {
    res.json({
        message: 'Hello World',
        status: 'Online'
    });
});

app.use(express.json());
app.use(helmet());

/*
mongoose.connect(process.env.MONGO_URI)
try {
    await console.log('Conectado a MongoDB 🙌');
} catch(error) {
    console.error('Error connection MongoDB', error.message);
    process.exit(1); //Detiene la app
};
*/

app.listen(PORT, () => {
    console.log(`Hola mundo http://localhost:${PORT}`);
});