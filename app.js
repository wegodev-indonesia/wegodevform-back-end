import express from 'express';
import dotenv from 'dotenv'
import connection from './connection.js';
import cors from 'cors';
import indexRouter from './routes/index.js';

const env = dotenv.config().parsed;

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: env.CORS_URL,
}));

app.use('/', indexRouter);

// catch 404
app.use((req, res, next) => {
    res.status(404).json({ message: "404_NOT_FOUND" });
});

// error handler
app.use((req, res, next ) => {
    if(env.NODE_ENV == 'production'){
        // render the error page
        res.status(500)
            .json({message : 'REQUEST_FAILED' });
    } else {
        //development error handler
        next();
    }
});

//db connection
connection();

app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`);
})
