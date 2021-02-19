const multer = require('multer')
const express = require('express')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const Post = require('./models/Post')
require('dotenv/config')

//CONFIG
//--Multer--
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            cb(new Error('Invalid file type'))
        } else {
            cb(null, true)
        }
    }
})
//-----------------------------------------------------------------------------

const router = express.Router()
router
    .get('/', async (req, res) => {

        ip = await (req.headers.host)

        Post.find({}).sort({ createdAt: 'DESC' })
            .then(data => res.json({ error: false, data: data, ip: req.headers.host }))
            .catch(err => res.status(400).json({ error: true, data: err }))
    })

    .get('/:id', (req, res) => {
        Post.findOne({ _id: req.params.id })
            .then(data => res.json({ error: false, data: data }))
            .catch(err => res.status(400).json({ error: true, data: err }))
    })


    //POST
    .post('/', upload.single('file'), (req, res) => {

        Post.create({
            name: req.body.name,
            description: req.body.description,
            photo_name: req.file.originalname,
            photo_key: req.file.filename,
            photo_url: process.env.SERVER_URL + `/uploads/${req.file.filename}`
            //photo_url: `http://${req.headers.host}/uploads/${req.file.filename}`
        })
            .then((data) => res.json({ error: false, data: data, resposta: respo }))
            .catch(err => res.status(400).json({ error: true, data: err }))
    })
    //--------------------------------------------------------------------------

    //PUT
    .put('/:id', upload.single('file'), (req, res) => {
        if (req.file) {
            //Achando a foto e apagando do disco
            Post.findOne({ _id: req.params.id })
                .then(data => promisify(fs.unlink)(path.resolve(__dirname, '.', 'uploads', data.photo_key)))
            //Fazendo a devida alteração no banco de dados
            Post.updateOne({ _id: req.params.id }, {
                name: req.body.name,
                description: req.body.description,
                photo_name: req.file.originalname,
                photo_name: req.file.filename,
                photo_url: process.env.SERVER_URL + `/uploads/${req.file.filename}`
                //photo_url: `http://${req.headers.host}/uploads/${req.file.filename}`
            })
                .then(() => res.json({ error: false, message: "Alteração feita" }))
                .catch(err => res.status(400).json({ error: true, message: err }))
        } else {
            Post.updateOne({ _id: req.params.id }, {
                name: req.body.name,
                description: req.body.description
            })
                .then(() => res.json({ error: false, message: "Alteração feita" }))
                .catch(err => res.status(400).json({ error: true, message: err }))
        }
    })
    //----------------------------------------------------------------------------
    //DELETE
    .delete('/:id', (req, res) => {
        //Deletando o arquivo no disco
        Post.findOne({ _id: req.params.id })
            .then(data => promisify(fs.unlink)(path.resolve(__dirname, '.', 'uploads', data.photo_key)))
        //Deletando os dados no banco
        Post.deleteOne({ _id: req.params.id })
            .then(() => res.json({ erro: false, message: "Deletado com sucesso" }))
            .catch((err) => res.status(400).json({ error: true, message: err }))
    })
//----------------------------------------------------------------------------
module.exports = router