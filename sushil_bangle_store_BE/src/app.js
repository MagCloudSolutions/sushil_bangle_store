const express = require('express');
const app = express();
require('dotenv').config(); // .env
require('./db')(); // DB
const cors = require('cors');

app.use(cors()); // CORS

app.use(express.json()); // To deal data in JSON (parse requests of content-type : application/json)

app.use(express.urlencoded({
    extended: true
})); // parse requests of content-type : application/x-www-form-urlencoded

// Test
app.get("/", (req, res) => {
    res.status(200).send("<h1>Welcome to Sushil Bangle Store API</h1>")
});

// API ROUTES =>

// User routes
app.use('/', require("./routes/auth.routes")); // Auth

// Product routes
app.use('/products', require("./routes/products.routes")); // Products

// Invoices routes
app.use('/invoices', require("./routes/invoices.routes")); // Invoices

// Error route
app.all("*", (req, res) => {
    res.status(404).send("Not Found");
});

// Server Listening
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server has started successfully`);
});