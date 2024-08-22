const express = require('express');
const app = express();
const userRouter = require('./routes/Ruser.js');
const dotenv = require('dotenv');
const PORT = process.env.PORT;
const { sequelize } = require('./models');
const cors = require('cors');


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());


app.use('/user', userRouter);
// app.use('/', router);


app.get('*', (req, res) => {
    res.render('404');
})
app.listen(PORT, () => {
            console.log('Database connected!');
            console.log(`Server running in PORT: ${PORT}`);
});

