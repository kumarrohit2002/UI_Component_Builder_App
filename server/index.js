const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');
const cookiesparser = require('cookie-parser');
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(cookiesparser());

app.use(cors(
    {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const { connectDB } = require('./src/configs');
//connecting to database
connectDB();


//mounting routes

const AllRoutes = require('./src/routes');
app.use('/api', AllRoutes);


app.get('/', (req, res) => {
    res.send('Hello Duniya!');
});


app.listen(port, () => {
    console.log(`\nServer is running on http://localhost:${port} 🟢\n`);
});