import dotenv from 'dotenv'
import mongoose from 'mongoose';

const env = dotenv.config().parsed;

const connection = () => {
    mongoose.connect(`mongodb://localhost:270127`, { 
        dbName: 'wegodevForm',
    })
    const connection = mongoose.connection;
    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.once('open', () => {
        console.log('Connected to MongoDB');
    });
}

export default connection;