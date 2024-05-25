import express from 'express';
import { client } from '../index';
import { pagination } from '../pagination'


const referenceMaterialsRoutes = express.Router()

const getReferenceMaterials = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'
		let sort_by_item = req.query.sort_by_item?req.query.sort_by_item:''
		let sort_by = req.query.sort_by?req.query.sort_by:''

		let referenceMaterialsList:any = []
		if (sort_by) {
			referenceMaterialsList = await client.query('select * from reference_materials')
			await referenceMaterialsList.rows?.forEach((item:any) => {
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
				referenceMaterialsList = await client.query(
					`select * from reference_materials WHERE ${sort_by_item} like '%${sort_by}%' ORDER BY ${order_by} ${order_by_ascending}`
				)
			} else {
				referenceMaterialsList = await client.query(
					`select * from reference_materials WHERE ${sort_by_item} = ${sort_by} ORDER BY ${order_by} ${order_by_ascending}`
				)
			}
		} else {
			referenceMaterialsList = await client.query(
				`select * from reference_materials ORDER BY ${order_by} ${order_by_ascending}`
			)
		}
		if (referenceMaterialsList.rows.length === 0) {
			data = []
		} else {
			data = referenceMaterialsList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postReferenceMaterials = async (req: express.Request, res: express.Response) => {
	try {
		let referenceMaterialsList:any = []
		referenceMaterialsList
    referenceMaterialsList = await client.query(
      'INSERT INTO reference_materials (chemical_name, is_certified, expiry_date, created_at) values ($1,$2,$3,$4)',
        [req.body.chemical_name,req.body.is_certified,req.body.expiry_date,new Date]
    )
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delReferenceMaterials = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from reference_materials where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putReferenceMaterials = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			'update reference_materials set chemical_name = $1, is_certified = $2, expiry_date = $3, updated_at = $4 where id = $5',
			[req.body.chemical_name,req.body.is_certified,req.body.expiry_date,new Date, req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}



referenceMaterialsRoutes.get('/reference_materials_list', getReferenceMaterials)
referenceMaterialsRoutes.post('/reference_materials_list', postReferenceMaterials)
referenceMaterialsRoutes.delete('/reference_materials_list:id', delReferenceMaterials)
referenceMaterialsRoutes.put('/reference_materials_list:id', putReferenceMaterials)

export { referenceMaterialsRoutes, getReferenceMaterials, postReferenceMaterials, delReferenceMaterials, putReferenceMaterials }