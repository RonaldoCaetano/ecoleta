import express from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import { celebrate, Joi } from 'celebrate'

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router()
const upload = multer(multerConfig)
const pointsController = new PointsController()
const itemsController = new ItemsController()

routes.get('/items', itemsController.index)
routes.get('/points', pointsController.index)
routes.get('/point/:id', pointsController.show)
routes.post(
	'/points',
	upload.single('image'),
	celebrate({
		body: Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().required().email(),
			whatsapp: Joi.string().required(),
			latitude: Joi.number().required(),
			longitude: Joi.number().required(),
			city: Joi.number().required(),
			uf: Joi.number().required().max(2),
			items: Joi.string().required(),
		}),
	}),
	pointsController.create
)

export default routes
