import express from 'express';
import { client } from '../index';
import { pagination } from '../pagination'

const calibrationPeriodRoutes = express.Router()

const getCalibrationPeriod = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'
		let sort_by_item = req.query.sort_by_item?req.query.sort_by_item:''
		let sort_by = req.query.sort_by?req.query.sort_by:''

		let calibrationPeriodList:any = []
		if (sort_by) {
			calibrationPeriodList = await client.query('select * from calibration_period')
			await calibrationPeriodList.rows?.forEach((item:any) => {
				if (typeof item[`${sort_by_item}`] === 'number') {
					if(item[`${sort_by_item}`] === Number(req.query.sort_by)) {
						sort_by = item[`${sort_by_item}`]
					}
				} else if (typeof item[`${sort_by_item}`] === 'string') {
					if(item[`${sort_by_item}`].toLowerCase() === req.query.sort_by) {
						sort_by = item[`${sort_by_item}`]
					}
				}
			});
			if(typeof sort_by === 'string'){
				calibrationPeriodList = await client.query(
					`select * from calibration_period WHERE ${sort_by_item} like '%${sort_by}%' ORDER BY ${order_by} ${order_by_ascending}`
				)
			} else {
				calibrationPeriodList = await client.query(
					`select * from calibration_period WHERE ${sort_by_item} = ${sort_by} ORDER BY ${order_by} ${order_by_ascending}`
				)
			}
		} else {
			calibrationPeriodList = await client.query(
				`select * from calibration_period ORDER BY ${order_by} ${order_by_ascending}`
			)
		}
		if (calibrationPeriodList.rows.length === 0) {
			data = []
		} else {
			data = calibrationPeriodList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postCalibrationPeriod = async (req: express.Request, res: express.Response) => {
	try {
		let calibrationPeriodList:any = []
		calibrationPeriodList
    calibrationPeriodList = await client.query(
      'INSERT INTO calibration_period (parameter,calibration_period,created_at) values ($1,$2,$3)',
        [req.body.parameter,req.body.calibration_period,new Date]
    )
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delCalibrationPeriod = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from calibration_period where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putCalibrationPeriod = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			'update calibration_period set parameter = $1, calibration_period = $2, updated_at = $3 where id = $4',
			[req.body.parameter,req.body.calibration_period,new Date, req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}



calibrationPeriodRoutes.get('/calibration_period_list', getCalibrationPeriod)
calibrationPeriodRoutes.post('/calibration_period_list', postCalibrationPeriod)
calibrationPeriodRoutes.delete('/calibration_period_list:id', delCalibrationPeriod)
calibrationPeriodRoutes.put('/calibration_period_list:id', putCalibrationPeriod)

export { calibrationPeriodRoutes, getCalibrationPeriod, postCalibrationPeriod, delCalibrationPeriod, putCalibrationPeriod }