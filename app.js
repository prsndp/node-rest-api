const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://deep:'+ process.env.MONGO_ATLAS_PW +'@cluster0.rseo6.mongodb.net/?retryWrites=true&w=majority');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// cors
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETTE, GET');
        return res.status(200).json({

        });
    };
    next();
});

// Routes which should handle requests

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


// middleware request
app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next )=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app;