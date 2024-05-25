import express from 'express';
import { client } from '../index';
import { User } from '../module';
import { hashPassword } from '../hash'

const registerRoutes = express.Router()

const postRegister = async (req: express.Request, res: express.Response) => {
	let userNameValid:boolean = false
	try {
		let user:any = await client.query(
			'select * from users where username = $1 ',
			[req.body.username]
		)
		if (user.rows.username) {
			res.json("Name Has Been Used")
		}
		if(req.body.username.length < 4) {
			res.json("Name should not shorter than 4")
		}
		let hashPassWord = await hashPassword(req.body.password)
		if(!userNameValid) {
			const newUser: User = {
				username: req.body.username as string,
				password: hashPassWord as string,
			}
			
			await client.query(
				'INSERT INTO users (username, password, email, is_admin, created_at) values ($1,$2,$3,$4,$5)',
				[newUser.username,newUser.password, req.body.email, false,  new Date()]
			)
			res.json("Success")
		}
	} catch (e) {
		console.log(e)
	}
}

registerRoutes.post('/register',postRegister)

export { registerRoutes, postRegister }