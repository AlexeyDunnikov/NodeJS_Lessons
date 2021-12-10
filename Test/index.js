const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url);

    res.write('hello from Node');
    res.end();
})

server.listen(3000, () => {
    console.log('Server is running...')
})