import express from 'express';
import { client } from '../index';
import { pagination } from '../utilities/pagination'

const suppliersRoutes = express.Router()

const getSuppliers = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'

		let suppliersList:any = []
		suppliersList = await client.query(
			`select * from suppliers ORDER BY ${order_by} ${order_by_ascending}`
		)
		if (suppliersList.rows.length === 0) {
			data = []
		} else {
			data = suppliersList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postSuppliers = async (req: express.Request, res: express.Response) => {
	try {
		let suppliersList:any = []
		suppliersList
    suppliersList = await client.query(
      'INSERT INTO suppliers (company_name,type_of_service,contact_person,contact_email,created_at) values ($1,$2,$3,$4,$5)',
        [req.body.company_name,req.body.type_of_service,req.body.contact_person,req.body.contact_email,new Date]
    )
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delSuppliers = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from suppliers where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putSuppliers = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			'update suppliers set company_name = $1, type_of_service = $2, contact_person = $3, contact_email = $4, updated_at = $5 where id = $6',
			[req.body.company_name,req.body.type_of_service,req.body.contact_person,req.body.contact_email,new Date, req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}

suppliersRoutes.get('/suppliers_list', getSuppliers)
suppliersRoutes.post('/suppliers_list', postSuppliers)
suppliersRoutes.delete('/suppliers_list:id', delSuppliers)
suppliersRoutes.put('/suppliers_list:id', putSuppliers)

export { suppliersRoutes, getSuppliers, postSuppliers, delSuppliers, putSuppliers }