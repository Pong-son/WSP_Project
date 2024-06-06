import express from 'express';
import { client } from '../index';
import { pagination } from '../utilities/pagination'

const usefulLinkRoutes = express.Router()

const getUsefulLink = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'

		let usefulLinkList:any = []
		usefulLinkList = await client.query(
			`select * from useful_link ORDER BY ${order_by} ${order_by_ascending}`
		)
		if (usefulLinkList.rows.length === 0) {
			data = []
		} else {
			data = usefulLinkList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postUsefulLink = async (req: express.Request, res: express.Response) => {
	try {
    let usefulLinkList:any = []
    usefulLinkList
    usefulLinkList = await client.query(
      'INSERT INTO useful_link (title, used_for, link, created_at) values ($1,$2,$3,$4)',
        [req.body.title,req.body.used_for, req.body.link,new Date]
    )
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delUsefulLink = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from useful_link where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putUsefulLink = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			'update useful_link set title = $1,used_for = $2, link = $3, updated_at = $4 where id = $5',
			[req.body.title,req.body.used_for, req.body.link,new Date, req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}

usefulLinkRoutes.get('/useful_link_list', getUsefulLink)
usefulLinkRoutes.post('/useful_link_list', postUsefulLink)
usefulLinkRoutes.delete('/useful_link_list:id', delUsefulLink)
usefulLinkRoutes.put('/useful_link_list:id', putUsefulLink)

export { usefulLinkRoutes, getUsefulLink, postUsefulLink, delUsefulLink, putUsefulLink }