const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// API routes
app.use('/api/checkout', require('./api/checkout'));
app.use('/api/ecpay/notify', require('./api/ecpay-notify'));
app.use('/api/ecpay/return', require('./api/ecpay-return'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cuore Coffee server running on port ${PORT}`));
