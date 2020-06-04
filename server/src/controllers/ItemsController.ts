import { Request, Response } from 'express'
import knex from '../database/connection'

interface Items {
    id: number
    titulo: string
    image: string
}

export default class ItemsController {
    async index(req: Request, res: Response) {
        const items: Items[] = await knex('items').select('*')
  
        const serializedItems = items.map((item: Items) => {
            return {
                id: item.id,
                title: item.titulo,
                image_url: `http://localhost:3333/uploads/${item.image}`
            }
        })
    
        return res.json(serializedItems)
    }
}