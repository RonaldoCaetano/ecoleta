import express, { response } from 'express'
import path from 'path'
import knex from './database/connection'

const routes = express.Router()

interface Items {
    id: number
    titulo: string
    image: string
}

routes.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

routes.get('/items', async (req, res) => {
    const items: Items[] = await knex('items').select('*')

    const serializedItems = items.map((item: Items) => {
        return {
            id: item.id,
            title: item.titulo,
            image_url: `http://localhost:3333/uploads/${item.image}`
        }
    })

    return res.json(serializedItems)
})

routes.post('/points', async (req, res) => {
    const { 
        name, 
        email, 
        whatsapp, 
        latitude, 
        longitude, 
        city, 
        uf, 
        items
    } = req.body

    const trx = await knex.transaction()

    const insertedIds = await trx('points').insert({
        image: 'image-fake',
        name, 
        email, 
        whatsapp, 
        latitude, 
        longitude, 
        city, 
        uf 
    })

    const points_ids = insertedIds[0]

    const pointItems = items.map((item_id: number) => {
        return {
            item_id,
            point_id: points_ids
        }
    })

    await trx('point_items').insert(pointItems)

    return res.json({ success: true })
})

export default routes