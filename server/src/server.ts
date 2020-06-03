import express from 'express'

const app = express()

app.get('/users', (req, res) => {
    res.json({
        message: "Ronaldo aqui meu bom, é nois"
    })
})

app.listen(3333)