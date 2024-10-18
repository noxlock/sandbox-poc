const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const BASE_URL = "https://www.virustotal.com/api/v3/"

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug');


app.get('/', (req, res) => {
    res.render('index.pug');
});

app.post('/submit', upload.single('sample'), (req, res) => {

    const form = new FormData();
    form.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
    });

    axios.post(`${BASE_URL}files`, form, {
        headers: {
            'x-apikey': process.env.API_KEY,
            'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
        res.send({ analysis_id: response.data.data.id, errors: null });
    }).catch((error) => {
        res.send({ analysis_id: null, errors: error });
    });
});

app.get('/analysis/:id', (req, res) => {
    const id = req.params.id;
    axios.get(`${BASE_URL}analyses/${id}`, {
        headers: {
            'x-apikey': process.env.API_KEY
        }
    }).then((response) => {
        res.send(response.data);
    }
    ).catch((error) => {
        res.send({errors: error});
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})