const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define your routes here

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // Sync database models with the database
  await sequelize.authenticate()
  console.log('Database synced');
});

app.use('/auth', authRoutes);
