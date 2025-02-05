const express = require('express');
const app = express();
const connectDatabase = require('./database')

app.get('/ping', (req, res) => {
    try{
    res.send('pong'); }
    catch(error){
        res.status(500).send('An error occured')
    }
    });
    connectDatabase();

app.listen(8000, () => {
    console.log(`Server is running on port http://localhost:8000`);
    });
