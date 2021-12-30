const express = require('express');
const app = express();

app.use(express.static('public'));

app.set('view engine', 'pug');

app.listen(3000, () => {
    console.log('Server is running on 3000');
})

app.get('/', (req, res) => {
    res.render('main', {
        title: 'main',
        content: 'Hello'
    });
})