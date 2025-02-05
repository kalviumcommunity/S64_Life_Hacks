const mongoose = require("mongoose");
require ('dotenv').config();
const connectDatabase = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then((data) => {
            console.log(`MongoDB connected with server: ${data.connection.host}`)
        })
        .catch((err) => {
            console.error(`Database connection failed: ${err.messsage}`)
        })
} 

module.exports = connectDatabase;


