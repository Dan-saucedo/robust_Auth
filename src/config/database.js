import mongoose from 'mongoose';

const connectDB = async() => {
    try {
        //Connection MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successful connection MongoDB 👌')
    } catch(error) {
        console.error('Error connection Mongo DB', error.message);
        process.exit(1); //Detiene la app
    }
}

export default connectDB;