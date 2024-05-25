import express from 'express';
import { client } from '../index';
import { pagination } from '../pagination'


const ordersRoutes = express.Router()

const getOrders = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'
		let sort_by_item = req.query.sort_by_item?req.query.sort_by_item:''
		let sort_by = req.query.sort_by?req.query.sort_by:''

		let orderList:any = []
		if (sort_by) {
			orderList = await client.query(`SELECT orders.id, suppliers.company_name, order_no, product, price, confirm_date, users.username FROM orders INNER JOIN suppliers ON orders.suppliers_id = suppliers.id INNER JOIN users ON orders.user_id = users.id `)
			await orderList.rows?.forEach((item:any) => {
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
				orderList = await client.query(
					`SELECT orders.id, suppliers.company_name, order_no, product, price, confirm_date, users.username FROM orders INNER JOIN suppliers ON orders.suppliers_id = suppliers.id INNER JOIN users ON orders.user_id = users.id WHERE ${sort_by_item} like '%${sort_by}%' ORDER BY ${order_by} ${order_by_ascending}`
				)
			} else {
				orderList = await client.query(
					`SELECT orders.id, suppliers.company_name, order_no, product, price, confirm_date, users.username FROM orders INNER JOIN suppliers ON orders.suppliers_id = suppliers.id INNER JOIN users ON orders.user_id = users.id WHERE ${sort_by_item} = ${sort_by} ORDER BY ${order_by} ${order_by_ascending}`
				)
			}
		} else {
			orderList = await client.query(
				`SELECT orders.id, suppliers.company_name, order_no, product, price, confirm_date, users.username FROM orders INNER JOIN suppliers ON orders.suppliers_id = suppliers.id INNER JOIN users ON orders.user_id = users.id ORDER BY ${order_by} ${order_by_ascending}`
			)
		}
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
		let users_data = await client.query(`select * from users where username = $1`,[req.body.username])
		let username = users_data.rows[0].id

		let supplier_data = await client.query(`select * from suppliers where company_name = $1`,[req.body.name])
		let supplier = supplier_data.rows[0].id

		await client.query(
			'INSERT INTO orders (suppliers_id, order_no, product, price, confirm_date, user_id, created_at) values ($1,$2,$3,$4,$5,$6,$7)',
			[supplier,req.body.order_no,req.body.product,req.body.price,req.body.confirm_date, username,new Date]
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

		let user_data = await client.query(`select * from users where username = $1`,[req.body.username])
		let user = user_data.rows[0].id
		await client.query(
			'update orders set suppliers_id = $1, order_no = $2, product = $3, price = $4, confirm_date = $5, user_id = $6, updated_at = $7 where id = $8',
			[supplier,req.body.order_no,req.body.product,req.body.price,req.body.confirm_date,user,new Date, req.body.id]
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