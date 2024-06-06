import express from 'express';
import { client } from '../index';
import { pagination } from '../utilities/pagination'


const reagentRoutes = express.Router()


const getReagent = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'

		let reagentList:any = []
		reagentList = await client.query(
			`SELECT reagent_sample_info.id, reagent.name, testing_item.name AS item, reference_materials.chemical_name, testing_info.batch_id, reagent.prepare_date, reagent.expiry_date, reagent.prepared_by FROM reagent_sample_info JOIN reagent ON reagent_sample_info.reagent_id = reagent.id LEFT OUTER JOIN testing_info ON reagent_sample_info.testing_info_id = testing_info.id LEFT OUTER JOIN reference_materials ON reagent.reference_materials_id = reference_materials.id JOIN testing_item ON reagent.testing_item_id = testing_item.id ORDER BY ${order_by} ${order_by_ascending}`
		)
		if (reagentList.rows.length === 0) {
			data = []
		} else {
			data = reagentList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postReagent = async (req: express.Request, res: express.Response) => {
	try {
		let item_data = await client.query(
			'select * from testing_item where name = $1',
			[req.body.item]
			)
		let reference_materials_data = await client.query(
			'select * from reference_materials where chemical_name = $1',
			[req.body.reference_material]
		)

		let expiry = new Date(req.body.prepare_date)
		let month = (expiry.getMonth() + 3) > 11? expiry.getMonth() + 3 -11:expiry.getMonth() + 3
		let year = (expiry.getMonth() + 3) > 11? expiry.getFullYear() + 1:expiry.getFullYear()
		let expiry_date = new Date(year,month,expiry.getDate()-1)
		
		let reagentList
		reagentList = await client.query(
			'INSERT INTO reagent (name, testing_item_id, reference_materials_id, prepare_date, expiry_date, prepared_by, created_at) values ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
			[req.body.name,item_data.rows[0].id,reference_materials_data.rows[0].id,req.body.prepare_date,expiry_date,req.body.prepared_by,new Date]
		)
		// to find the batch_id for reagent_sample_info
		let testing_info_data:any = await client.query(
			'select * from testing_info where testing_item_id = $1',
			[item_data.rows[0].id]
		)
		await client.query(
			'INSERT INTO reagent_sample_info (reagent_id, testing_info_id) values ($1,$2)',
			[reagentList.rows[0].id, testing_info_data.rows.length !== 0?testing_info_data.rows[testing_info_data.rows.length - 1].id:null]
		)
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}


const delReagent = async (req: express.Request, res: express.Response) => {
	try {
		let deletedRegaentId = await client.query(
			'select * from reagent_sample_info where id = $1',
			[req.params.id]
		)

		await client.query(
			'delete from reagent_sample_info where id = $1',
			[req.params.id]
		)
		
		await client.query(
			'delete from reagent where id = $1',
			[deletedRegaentId.rows[0].reagent_id] 
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putReagent = async (req: express.Request, res: express.Response) => {
	try {
		let reagent_id = await client.query(
			'select * from reagent_sample_info where id = $1',
			[req.body.id]
		)
		let testing_item = await client.query(
			'select * from testing_item where name = $1',
			[req.body.item]
		)
		let reference_materials = await client.query(
			'select * from reference_materials where chemical_name = $1',
			[req.body.chemical_name]
		)
		let expiry = new Date(req.body.prepare_date)
		let month = (expiry.getMonth() + 3) > 11? expiry.getMonth() + 3 -11:expiry.getMonth() + 3
		let year = (expiry.getMonth() + 3) > 11? expiry.getFullYear() + 1:expiry.getFullYear()
		let expiry_date = new Date(year,month,expiry.getDate()-1)
		await client.query(
			'update reagent set name = $1, testing_item_id = $2, reference_materials_id = $3, prepare_date = $4, expiry_date = $5, prepared_by = $6, updated_at = $7 where id = $8',
			[req.body.name, testing_item.rows[0].id, reference_materials.rows[0].id, req.body.prepare_date, expiry_date, req.body.prepared_by, new Date, reagent_id.rows[0].reagent_id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}

reagentRoutes.get('/reagent_list', getReagent)
reagentRoutes.post('/reagent_list', postReagent)
reagentRoutes.delete('/reagent_list:id', delReagent)
reagentRoutes.put('/reagent_list:id', putReagent)

export { reagentRoutes, getReagent, postReagent, delReagent, putReagent }