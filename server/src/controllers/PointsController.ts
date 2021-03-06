import { Request, Response } from 'express'
import knex from '../database/connection'

export default class PointsController {
	async index(req: Request, res: Response) {
		const { city, uf, items } = req.query

		const parsedItems = String(items)
			.split(',')
			.map((item) => Number(item.trim()))

		const points = await knex('points')
			.join('point_items', 'points.id', '=', 'point_items.point_id')
			.whereIn('point_items.item_id', parsedItems)
			.where('city', String(city))
			.where('uf', String(uf))
			.distinct()
			.select('points.*')

		const serializedPoints = points.map((point) => {
			return {
				...point,
				image_url: `http://${req.connection.remoteAddress}/uploads/${point.image}`,
			}
		})

		return res.json(serializedPoints)
	}

	async create(req: Request, res: Response) {
		const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body

		const trx = await knex.transaction()

		const point = {
			image: req.file.filename,
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf,
		}

		const insertedIds = await trx('points').insert(point)

		const point_id = insertedIds[0]

		const itemsAsArray = String(items)
			.split(',')
			.map((item) => Number(item.trim()))

		const pointItems = itemsAsArray.map((item_id: number) => {
			return {
				item_id,
				point_id: point_id,
			}
		})

		await trx('point_items').insert(pointItems)

		await trx.commit()

		return res.json({
			...point,
			item_id: point_id,
		})
	}

	async show(req: Request, res: Response) {

		const {
			params: { id },
		} = req

		const point = await knex('points').where('id', id).first()

		const serializedPoint = {
			...point,
			image_url: `http://${req.connection.remoteAddress}/uploads/${point.image}`,
		}

		if (!point) return res.status(400).json({ message: 'Point not found' })

		const items = await knex('items')
			.join('point_items', 'items.id', '=', 'point_items.item_id')
			.where('point_items.point_id', id)
			.select('items.titulo')

		return res.json({ point: serializedPoint, items })
	}
}
