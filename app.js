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
const brandRoute = require('./routes/users/brandRoute');
const productRoute = require('./routes/users/productRoute');
const orderRoute = require('./routes/users/orderRoute');

app.use('/api/auth/admin', authRoute);
app.use('/api/auth/users', userRoutes);
app.use('/api/user/brands', brandRoute);
app.use('/api/user/products', productRoute);
app.use('/api/user/orders', orderRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
