import express from 'express';
import { parse } from '../utils';
import formidable from 'formidable';
import { client } from '../index';
import { io } from '../index';


const memoRoutes = express.Router()

let counter = 0

const form = formidable({
	uploadDir: './public/uploads',
	keepExtensions: true,
	maxFiles: 1,
	maxFileSize: 200 * 1024, // the default limit is 200KB
	filter: (part) => part.mimetype?.startsWith('image/') || false,
	filename: (originalName, originalExt, part, form) => {
		let fieldName = part.name
		let timestamp = Date.now()
		let ext = part.mimetype?.split('/').pop()
		counter++
		return `${fieldName}-${timestamp}-${counter}.${ext}`
	}
})

const getMemos = async (req: express.Request, res: express.Response) => {
	try {
		let memoList:any = []
		memoList = await client.query(
			'select * from memos'
		)
		if (memoList.rows.length === 0) {
			res.json([])
		} else {
			res.json(memoList.rows)
		}
	} catch (err) {
		console.log(err)
		res.json([])
	}
}

const postMemos = async (req: express.Request, res: express.Response) => {
	const { fields, files } = await parse(form, req)
	fields
	try {
		let memoList:any = []
		memoList
		if (files.chooseFile === undefined) {
			memoList = await client.query(
				'INSERT INTO memos (content) values ($1)',
					[fields.memoEntry]
			)
		} else {
			memoList = await client.query(
				'INSERT INTO memos (content,image) values ($1,$2)',
					[fields.memoEntry,(files.chooseFile as formidable.File).newFilename]
			)
		}
		io.emit("new-memo","Congratulations! New Memo Created!");
	} catch (err) {
		console.log(err)
	}
	res.json({updated:1})
}

const delMemos = async (req: express.Request, res: express.Response) => {
	try {
		await client.query(
			`delete from memos where id = ${req.params.id}`
		)
	} catch (err) {
		console.log(err)
	}
	// res.redirect('/')
	res.json('Deleted')
}

const putMemos = async (req: express.Request, res: express.Response) => {
	console.log(req.body.content,Number(req.body.id))
	try {
		await client.query(
			'update memos set content = $1 where id = $2',
			[req.body.content,Number(req.body.id)]
		)
	} catch (err) {
		console.log(err)
	}
	res.json('Edited')
}



memoRoutes.get('/memo', getMemos)
memoRoutes.post('/memo', postMemos)
memoRoutes.delete('/memo:id', delMemos)
memoRoutes.put('/memo:id', putMemos)

export { memoRoutes, getMemos, postMemos, delMemos, putMemos }
