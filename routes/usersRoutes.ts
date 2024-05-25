import express from 'express';
import { client } from '../index';
import { pagination } from '../pagination'
import { hashPassword } from '../hash'

const usersRoutes = express.Router()

const getUsers = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'
		let sort_by_item = req.query.sort_by_item?req.query.sort_by_item:''
		let sort_by = req.query.sort_by?req.query.sort_by:''

		let usersList:any = []
		if (sort_by) {
			usersList = await client.query('select * from users')
			await usersList.rows?.forEach((item:any) => {
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
				usersList = await client.query(
					`select * from users WHERE ${sort_by_item} like '%${sort_by}%' ORDER BY ${order_by} ${order_by_ascending}`
				)
			} else {
				usersList = await client.query(
					`select * from users WHERE ${sort_by_item} = ${sort_by} ORDER BY ${order_by} ${order_by_ascending}`
				)
			}
		} else {
			usersList = await client.query(
				`select * from users ORDER BY ${order_by} ${order_by_ascending}`
			)
		}
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