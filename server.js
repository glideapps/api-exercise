const express = require('express')
var fs = require('fs');
const app = express()
const port = 3000

var _obj = JSON.parse(fs.readFileSync('users.json', 'utf8'));

app.use(express.json());

app.get('/users', (req, res) => {
    res.status(200).json({
        message: "Hello world!"
    });
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    
    res.status(200).json({
        message: `User ${userId} to return`
    });
});

app.post('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);

    res.status(200).json({
        message: `User ${userId} to be updated`
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
