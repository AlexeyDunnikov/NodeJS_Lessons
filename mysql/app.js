const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server is running on 3000');
})

app.get('/', (req, res) => {
    res.render('index.html');
})