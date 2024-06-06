import express from 'express';
import { client } from '../index';
import { pagination } from '../utilities/pagination'

const testingItemRoutes = express.Router()

const getTestingItem = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'

		let testingItemList:any = []
		testingItemList = await client.query(
			`select * from testing_item ORDER BY ${order_by} ${order_by_ascending}`
		)
		if (testingItemList.rows.length === 0) {
			data = []
		} else {
			data = testingItemList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postTestingItem = async (req: express.Request, res: express.Response) => {
	try {
	let testingItemList:any = []
	testingItemList
    testingItemList = await client.query(
      'INSERT INTO testing_item (name,created_at) values ($1,$2)',
        [req.body.name,new Date]
    )
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delTestingItem = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from testing_item where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putTestingItem = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			'update testing_item set name = $1, updated_at = $2 where id = $3',
			[req.body.name,new Date, req.body.id]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}

testingItemRoutes.get('/testing_item_list', getTestingItem)
testingItemRoutes.post('/testing_item_list', postTestingItem)
testingItemRoutes.delete('/testing_item_list:id', delTestingItem)
testingItemRoutes.put('/testing_item_list:id', putTestingItem)

export { testingItemRoutes, getTestingItem, postTestingItem, delTestingItem, putTestingItem }