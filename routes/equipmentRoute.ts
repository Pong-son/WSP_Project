import express from 'express';
import { client } from '../index';
import { pagination } from '../utilities/pagination'

const equipmentRoutes = express.Router()

const getEquipment = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'

		let equipmentList:any = []
		equipmentList = await client.query(
			`SELECT equipment.id, name, brand, model, calibration_period.parameter, calibration_period.calibration_period, calibration_date, expiry_date FROM equipment INNER JOIN calibration_period ON equipment.calibration_period_id = calibration_period.id ORDER BY ${order_by} ${order_by_ascending}`
		)
		if (equipmentList.rows.length === 0) {
			data = []
		} else {
			data = equipmentList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postEquipment = async (req: express.Request, res: express.Response) => {
	try {
		let calibration_period_data = await client.query(`select * from calibration_period where parameter = $1`,[req.body.parameter])
		let calibrationPriod = calibration_period_data.rows[0].calibration_period
		
		let cal_year = new Date(req.body.calibration_date)

		cal_year.setMonth(cal_year.getMonth()+calibrationPriod)
		
		let expiry_date = new Date(cal_year.setDate(cal_year.getDate()-1))

		await client.query(
			'INSERT INTO equipment (name, brand, model, calibration_period_id, calibration_date, expiry_date, created_at) values ($1,$2,$3,$4,$5,$6,$7)',
			[req.body.name,req.body.brand,req.body.model,calibration_period_data.rows[0].id,req.body.calibration_date, expiry_date,new Date]
			)
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delEquipment = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from equipment where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putEquipment = async (req: express.Request, res: express.Response) => {
	try {
		let calibration_period_data = await client.query(`select * from calibration_period where parameter = $1`,[req.body.parameter])
		let calibrationPriod = calibration_period_data.rows[0].calibration_period
		
		let cal_year = new Date(req.body.calibration_date)

		cal_year.setMonth(cal_year.getMonth()+calibrationPriod)
		
		let expiry_date = new Date(cal_year.setDate(cal_year.getDate()-1))

		await client.query(
			'update equipment set name = $1, brand = $2, model = $3, calibration_period_id = $4, calibration_date = $5, expiry_date = $6, updated_at = $7 where id = $8',
			[req.body.name,req.body.brand,req.body.model,calibration_period_data.rows[0].id,req.body.calibration_date,expiry_date,new Date, req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}

equipmentRoutes.get('/equipment_list', getEquipment)
equipmentRoutes.post('/equipment_list', postEquipment)
equipmentRoutes.delete('/equipment_list:id', delEquipment)
equipmentRoutes.put('/equipment_list:id', putEquipment)

export { equipmentRoutes, getEquipment, postEquipment, delEquipment, putEquipment }