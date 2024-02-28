import express from 'express';
// import { parse } from '../utils';
// import formidable from 'formidable';
import { client } from '../index';
import { pagination } from '../pagination'


const supplierListRoutes = express.Router()

const getSupplierList = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'
		let sort_by_item = req.query.sort_by_item?req.query.sort_by_item:''
		let sort_by = req.query.sort_by?req.query.sort_by:''

		let supplierList:any = []
		if (sort_by) {
			supplierList = await client.query('select * from supplier_list')
			await supplierList.rows?.forEach((item:any) => {
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
				supplierList = await client.query(
					`select * from supplier_list WHERE ${sort_by_item} like '%${sort_by}%' ORDER BY ${order_by} ${order_by_ascending}`
				)
			} else {
				supplierList = await client.query(
					`select * from supplier_list WHERE ${sort_by_item} = ${sort_by} ORDER BY ${order_by} ${order_by_ascending}`
				)
			}
		} else {
			supplierList = await client.query(
				`select * from supplier_list ORDER BY ${order_by} ${order_by_ascending}`
			)
		}
		if (supplierList.rows.length === 0) {
			data = []
		} else {
			data = supplierList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postSupplierList = async (req: express.Request, res: express.Response) => {
	try {
    console.log(req.body, new Date)

	let supplierList:any = []
	supplierList
    supplierList = await client.query(
      'INSERT INTO supplier_list (company_name,type_of_service,contact_person,contact_email,created_at) values ($1,$2,$3,$4,$5)',
        [req.body.company_name,req.body.type_of_service,req.body.contact_person,req.body.contact_email,new Date]
    )
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delSupplierList = async (req: express.Request, res: express.Response) => {
	console.log(req.params.id)
	try {
		await client.query(
			`delete from supplier_list where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putSupplierList = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			'update supplier_list set company_name = $1, type_of_service = $2, contact_person = $3, contact_email = $4, updated_at = $5 where id = $6',
			[req.body.company_name,req.body.type_of_service,req.body.contact_person,req.body.contact_emai,new Date, req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}



supplierListRoutes.get('/supplier_list', getSupplierList)
supplierListRoutes.post('/supplier_list', postSupplierList)
supplierListRoutes.delete('/supplier_list:id', delSupplierList)
supplierListRoutes.put('/supplier_list:id', putSupplierList)

export { supplierListRoutes, getSupplierList, postSupplierList, delSupplierList, putSupplierList }