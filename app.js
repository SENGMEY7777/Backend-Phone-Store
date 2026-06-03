const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const authRoute = require('./routes/admin/authRoute');
const userRoutes = require('./routes/users/userRoutes');

app.use('/api/auth/admin', authRoute);
app.use('/api/auth/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});