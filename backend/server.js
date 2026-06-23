const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const path = require('path');
// require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dbConnect = require('./db')

const app = express();
const PORT = process.env.PORT || 5051;

app.use(cors());
app.use(bodyParser.json());

dbConnect();

//ROUTES
const userRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const loginRoutes = require('./routes/login');
const messageRoutes = require('./routes/messages');
const storiesRoutes = require("./routes/stories");

app.use('/', userRoutes);
app.use('/', postsRoutes);
app.use('/', loginRoutes);
app.use('/', messageRoutes);
app.use('/', storiesRoutes);


app.get('/', (req, res) => {
    res.send('Search for /users, /posts')
});

app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


