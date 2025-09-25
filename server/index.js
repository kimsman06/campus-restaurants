require('dotenv').config();
const express = require('express');
const cors = require('cors');
const restaurantsRouter = require('./src/routes/restaurants.routes');
const notFound = require('./src/middleware/notFound.middleware');
const errorHandler = require('./src/middleware/error.middleware');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/restaurants', restaurantsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

module.exports = app;