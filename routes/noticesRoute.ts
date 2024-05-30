import express from 'express';
import { client } from '../index';

const noticesRoutes = express.Router()

const getNotices = async (req: express.Request, res: express.Response) => {
	try {
		let noticesList:any = []
		noticesList = await client.query(
			'select * from notices'
		)

		if (noticesList.rows.length === 0) {
			res.json([])
		} else {
			res.json(noticesList.rows)
		}
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postNotices = async (req: express.Request, res: express.Response) => {
	try {
		let noticesList:any = []
		await client.query(
			'INSERT INTO notices (topic, content) values ($1, $2)',
				[req.body.topic, req.body.content]
		)
		noticesList
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delNotices = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from notices where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	// res.redirect('/')
	res.json('Deleted')
}

const putNotices = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			'update notices set content = $1 where id = $2',
			[req.body.content,req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}

noticesRoutes.get('/notices', getNotices)
noticesRoutes.post('/notices', postNotices)
noticesRoutes.delete('/notices:id', delNotices)
noticesRoutes.put('/notices:id', putNotices)

export { noticesRoutes, getNotices, postNotices, delNotices, putNotices }
