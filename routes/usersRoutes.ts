import express from 'express';
import { client } from '../index';
import { pagination } from '../utilities/pagination'
import { hashPassword } from '../utilities/hash'

const usersRoutes = express.Router()

const getUsers = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'

		let usersList:any = []
		usersList = await client.query(
			`select * from users ORDER BY ${order_by} ${order_by_ascending}`
		)
		if (usersList.rows.length === 0) {
			data = []
		} else {
			data = usersList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const delUsers = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from users where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putUsers = async (req: express.Request, res: express.Response) => {
	try {
		if(req.body.updateUser){
			await client.query(
				'update users set username = $1, email = $2, updated_at = $3 where id = $4',
				[req.body.username, req.body.email, new Date, req.body.id]
			)
		} else if (req.body.changePw) {
			let hashPassWord = await hashPassword(req.body.password)
			
			await client.query(
				'update users set password = $1, updated_at = $2 where id = $3',
				[hashPassWord, new Date, req.body.id]
			)
		} else if (req.body.upgradeAdmin) {
			await client.query(
				'update users set is_admin = $1, updated_at = $2 where id = $3',
				[req.body.is_admin, new Date, req.body.id]
			)
		}
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}

usersRoutes.get('/users_list', getUsers)
usersRoutes.delete('/users_list:id', delUsers)
usersRoutes.put('/users_list:id', putUsers)

export { usersRoutes, getUsers, delUsers, putUsers }