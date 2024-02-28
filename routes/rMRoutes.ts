import express from 'express';
// import { parse } from '../utils';
// import formidable from 'formidable';
import { client } from '../index';
import { pagination } from '../pagination'


const rMRoutes = express.Router()

const getRM = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'
		let sort_by_item = req.query.sort_by_item?req.query.sort_by_item:''
		let sort_by = req.query.sort_by?req.query.sort_by:''

		let rMList:any = []
		if (sort_by) {
			rMList = await client.query('select * from rm_list')
			await rMList.rows?.forEach((item:any) => {
				console.log(typeof item[`${sort_by_item}`])
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
				rMList = await client.query(
					`select * from rm_list WHERE ${sort_by_item} like '%${sort_by}%' ORDER BY ${order_by} ${order_by_ascending}`
				)
			} else {
				rMList = await client.query(
					`select * from rm_list WHERE ${sort_by_item} = ${sort_by} ORDER BY ${order_by} ${order_by_ascending}`
				)
			}
		} else {
			rMList = await client.query(
				`select * from rm_list ORDER BY ${order_by} ${order_by_ascending}`
			)
		}
		if (rMList.rows.length === 0) {
			data = []
		} else {
			data = rMList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postRM = async (req: express.Request, res: express.Response) => {
	try {
    console.log(req.body, new Date)

	let rMList:any = []
	rMList
    rMList = await client.query(
      'INSERT INTO rm_list (chemical_name, is_crm, expiry_date, created_at) values ($1,$2,$3,$4)',
        [req.body.chemical_name,req.body.is_crm,req.body.expiry_date,new Date]
    )
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delRM = async (req: express.Request, res: express.Response) => {
	console.log(req.params.id)
	try {
		await client.query(
			`delete from rm_list where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putRM = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			'update rm_list set chemical_name = $1, is_crm = $2, expiry_date = $3, updated_at = $4 where id = $5',
			[req.body.chemical_name,req.body.is_crm,req.body.expiry_date,new Date, req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}



rMRoutes.get('/rm_list', getRM)
rMRoutes.post('/rm_list', postRM)
rMRoutes.delete('/rm_list:id', delRM)
rMRoutes.put('/rm_list:id', putRM)

export { rMRoutes, getRM, postRM, delRM, putRM }