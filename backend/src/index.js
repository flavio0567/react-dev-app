const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes.js');
const cors = require('cors');
const port = 3333;

const app = express();

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-icf9v.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true

});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, function() {
    console.log("listening on port ", port);
  });

