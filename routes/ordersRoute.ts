import express from 'express';
import { client } from '../index';
import { pagination } from '../utilities/pagination'

const ordersRoutes = express.Router()

const getOrders = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'

		let orderList:any = []
		orderList = await client.query(
			`SELECT orders.id, suppliers.company_name, order_no, product, price, confirm_date, order_by FROM orders INNER JOIN suppliers ON orders.suppliers_id = suppliers.id ORDER BY ${order_by} ${order_by_ascending}`
		)
		if (orderList.rows.length === 0) {
			data = []
		} else {
			data = orderList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postOrders = async (req: express.Request, res: express.Response) => {
	try {
		let supplier_data = await client.query(`select * from suppliers where company_name = $1`,[req.body.name])
		let supplier = supplier_data.rows[0].id

		await client.query(
			'INSERT INTO orders (suppliers_id, order_no, product, price, confirm_date, order_by, created_at) values ($1,$2,$3,$4,$5,$6,$7)',
			[supplier,req.body.order_no,req.body.product,req.body.price,req.body.confirm_date, req.body.order_by,new Date]
			)
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delOrders = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from orders where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putOrders = async (req: express.Request, res: express.Response) => {
	try {
		let supplier_data = await client.query(`select * from suppliers where company_name = $1`,[req.body.name])
		let supplier = supplier_data.rows[0].id

		await client.query(
			'update orders set suppliers_id = $1, order_no = $2, product = $3, price = $4, confirm_date = $5, order_by = $6, updated_at = $7 where id = $8',
			[supplier,req.body.order_no,req.body.product,req.body.price,req.body.confirm_date,req.body.order_by,new Date, req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}

ordersRoutes.get('/orders_list', getOrders)
ordersRoutes.post('/orders_list', postOrders)
ordersRoutes.delete('/orders_list:id', delOrders)
ordersRoutes.put('/orders_list:id', putOrders)

export { ordersRoutes, getOrders, postOrders, delOrders, putOrders }