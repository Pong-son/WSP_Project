import express from 'express';
import { client } from '../index';
import { pagination } from '../pagination'


const sampleInfoRoutes = express.Router()

const getSampleInfo = async (req: express.Request, res: express.Response) => {
	try {
		let data: any[]
		let page: number = req.query.page?Number(req.query.page):1
		let limit: number = req.query.limit?Number(req.query.limit):10
		let order_by:string = req.query.order_by?req.query.order_by.toString():'id'
		let order_by_ascending:string = req.query.order_by_ascending === 'true'?'':'DESC'
		let sort_by_item = req.query.sort_by_item?req.query.sort_by_item:''
		let sort_by = req.query.sort_by?req.query.sort_by:''

		let sampleInfoList:any = []
		if (sort_by) {
			sampleInfoList = await client.query(`SELECT testing_info.id, sample_info.sample_receive_date, sample_info.analysis_date, testing_item.name, testing_info.batch_id FROM testing_info INNER JOIN sample_info ON testing_info.sample_info_id = sample_info.id INNER JOIN testing_item ON testing_info.testing_item_id = testing_item.id`)

			await sampleInfoList.rows?.forEach((item:any) => {
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
				sampleInfoList = await client.query(
					`SELECT testing_info.id, sample_info.sample_receive_date, sample_info.analysis_date, testing_item.name, testing_info.batch_id FROM testing_info INNER JOIN sample_info ON testing_info.sample_info_id = sample_info.id INNER JOIN testing_item ON testing_info.testing_item_id = testing_item.id WHERE ${sort_by_item} like '%${sort_by}%' ORDER BY ${order_by} ${order_by_ascending}`
				)
			} else {
				sampleInfoList = await client.query(
					`SELECT testing_info.id, sample_info.sample_receive_date, sample_info.analysis_date, testing_item.name, testing_info.batch_id FROM testing_info INNER JOIN sample_info ON testing_info.sample_info_id = sample_info.id INNER JOIN testing_item ON testing_info.testing_item_id = testing_item.id WHERE ${sort_by_item} = ${sort_by} ORDER BY ${order_by} ${order_by_ascending}`
				)
			}
		} else {
			sampleInfoList = await client.query(
				`SELECT testing_info.id, sample_info.sample_receive_date, sample_info.analysis_date, testing_item.name, testing_info.batch_id FROM testing_info INNER JOIN sample_info ON testing_info.sample_info_id = sample_info.id INNER JOIN testing_item ON testing_info.testing_item_id = testing_item.id ORDER BY ${order_by} ${order_by_ascending}`
			)
		}
		if (sampleInfoList.rows.length === 0) {
			data = []
		} else {
			data = sampleInfoList.rows
		}
		res.json(pagination(data,page,limit))
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postSampleInfo = async (req: express.Request, res: express.Response) => {
	try {
		let sampleInfoList
		sampleInfoList = await client.query(
			'INSERT INTO sample_info (sample_receive_date,analysis_date,created_at) values ($1,$2,$3) RETURNING id',
			[req.body.sample_receive_date,req.body.analysis_date,new Date]
			)
			
		let testingItemList

		
		let sample_info_id: number =  sampleInfoList.rows[0].id
		
		let noOfItem:number = req.body.items.length
		for (let i = 0; i < noOfItem; i++) {
			
			testingItemList = await client.query(`select * from testing_item where name = $1`,[req.body.items[i]])
			
			let testing_item_id = testingItemList.rows[0].id
			let batch_id = await client.query(
				`SELECT * from testing_info where testing_item_id = $1 ORDER BY batch_id DESC`,
				[testing_item_id]
			)
			console.log()
			await client.query(
				'INSERT INTO testing_info (sample_info_id,testing_item_id, batch_id, created_at) values ($1,$2,$3,$4)',
				[sample_info_id,testing_item_id,batch_id.rows.length > 0?batch_id.rows[0].batch_id+1:1, new Date]
			)
		}
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}




const delSampleInfo = async (req: express.Request, res: express.Response) => {
	try {

		let testing_info = await client.query(
			`delete from testing_info where id = ${req.params.id} RETURNING sample_info_id`
		)

		let new_testing_item = await client.query(
			`select * from testing_info where sample_info_id = $1`, [testing_info.rows[0].sample_info_id] 
		)
		if (new_testing_item.rows.length === 0) {
			await client.query(
				`delete from sample_info where id = $1`,
				[testing_info.rows[0].sample_info_id]
			)
		}
	} catch (err) {
		console.log(err)
	}
	res.json('Deleted')
}

const putSampleInfo = async (req: express.Request, res: express.Response) => {
	try {
		let testing_info = await client.query(
			'select * from testing_info where id = $1',
			[req.body.id]
		)
		await client.query(
			'update sample_info set sample_receive_date = $1, analysis_date = $2, updated_at = $3 where id = $4',
			[req.body.sample_receive_date,req.body.analysis_date,new Date, testing_info.rows[0].sample_info_id]
		)
		let testing_item = await client.query(
			'select * from testing_item where name = $1',
			[req.body.name]
		)
		if(testing_item.rows[0].id !== testing_info.rows[0].testing_item_id) {
			let new_batch_id = await client.query(
				'select * from testing_info where testing_item_id = $1 ORDER BY batch_id DESC',
				[testing_item.rows[0].id]
			)
			await client.query(
				'update testing_info set testing_item_id = $1, batch_id = $2, updated_at = $3 where id = $4',
				[testing_item.rows[0].id, new_batch_id.rows.length === 0?1:new_batch_id.rows[0].batch_id +1,new Date, req.body.id]
			)
			// if (req.body.name) {
			// 	let new_batch_id = sample_info_testing_item_id.rows.length +1
			// }
		}
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}



sampleInfoRoutes.get('/sample_info_list', getSampleInfo)
sampleInfoRoutes.post('/sample_info_list', postSampleInfo)
sampleInfoRoutes.delete('/sample_info_list:id', delSampleInfo)
sampleInfoRoutes.put('/sample_info_list:id', putSampleInfo)

export { sampleInfoRoutes, getSampleInfo, postSampleInfo, delSampleInfo, putSampleInfo }