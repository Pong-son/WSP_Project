import express from 'express';
import http from 'http';
import { Request, Response } from 'express';
import path from 'path';
import expressSession from 'express-session';
import jsonfile from 'jsonfile';
import { noticesRoutes } from './routes/noticesRoute';
import { loginRoutes } from './routes/loginRoute';
import { logoutRoutes } from './routes/logoutRoute';
import { registerRoutes } from './routes/registerRoute';
import { usefulLinkRoutes } from './routes/usefulLinkRoutes';
import { usersRoutes } from './routes/usersRoutes';
import { equipmentRoutes } from './routes/equipmentRoute';
import { calibrationPeriodRoutes } from './routes/calibrationPeriodRoutes';
import { suppliersRoutes } from './routes/suppliersRoutes';
import { sampleInfoRoutes } from './routes/sampleInfoRoutes';
import { testingItemRoutes } from './routes/testingItemRoutes';
import { referenceMaterialsRoutes } from './routes/referenceMaterialsRoutes';
import { ordersRoutes } from './routes/ordersRoute';
import { reagentRoutes } from './routes/reagentRoutes';
import { Client } from 'pg';
import dotenv from 'dotenv';
import {Server as SocketIO} from 'socket.io';
// import XLSX from 'xlsx';

dotenv.config();

export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

client.connect()

const app = express()
const server = new http.Server(app);
export const io = new SocketIO(server);

io.on('connection', function (socket) {
	socket;
});

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const PORT = 8080;

app.use(
	expressSession({
		secret: 'Tecky Academy teaches typescript',
		resave: true,
		saveUninitialized: true
	})
)

declare module 'express-session' {
	interface SessionData {
		userId?:number
		user?: string
		darkTheme?:boolean
	}
}

app.use((req, res, next) => {
	const date = new Date()
	console.log(`[${date.toDateString()}] Request ${req.path}`)
	next()
})

app.use(express.static('public'))

app.use('/', loginRoutes)

app.use('/', logoutRoutes)

app.use('/', registerRoutes)

app.use('/', noticesRoutes)

app.get('/', function (req: Request, res: Response) {
	res.sendFile(path.resolve('index.html'))
})

app.post('/', (req, res) => {
	res.sendFile(path.resolve('public', 'index.html'))
})

app.get('/theme',(req: Request, res: Response) => {
	if (req.session.darkTheme === undefined) {
		req.session.darkTheme = false
	}
	res.json(req.session.darkTheme)
})

app.put('/theme',(req: Request, res: Response) => {
	req.session.darkTheme = req.body.darkTheme
	res.json('Changed')
})

app.get('/isuser',(req: Request, res: Response) => {
	if (!req.session.user) {
		req.session.user = ''
	}
	res.json(req.session.user)
})

const isLoggedIn = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
	) => {
		if (req.session?.user) {
			next()
	} else {
		res.redirect('./')
	}
}

app.use(isLoggedIn, express.static('protected'))

app.use('/', equipmentRoutes)

app.use('/', calibrationPeriodRoutes)

app.use('/', suppliersRoutes)

app.use('/', referenceMaterialsRoutes)

app.use('/', sampleInfoRoutes)

app.use('/', testingItemRoutes)

app.use('/', ordersRoutes)

app.use('/', reagentRoutes)

app.use('/', usersRoutes)

app.use('/', usefulLinkRoutes)

app.get('/admin', (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'admin.html'))
})

app.get('/equipment', (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'equipment.html'))
})

app.get('/calibration_period', (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'calibration_period.html'))
})

app.get('/suppliers', (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'suppliers.html'))
})

app.get('/orders', (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'orders.html'))
})

app.get('/reference_materials', (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'reference_materials.html'))
})

app.get('/sample_info', (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'sample_info.html'))
})

app.get('/testing_item', (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'testing_item.html'))
})

app.get('/reagent', (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'reagent.html'))
})


app.get('/user', async (req: Request, res: Response) => {
	const likeMemos = await jsonfile.readFile('./user.json')
	res.json(likeMemos);
})

app.get('/like_memos', async (req: Request, res: Response) => {
	res.sendFile(path.resolve('public/protected', 'like_memos.html'))
})

app.put('/like_memo', async (req: express.Request, res: express.Response) => {
	console.log(req.session.userId)
	let userId = req.session.userId
	let memoId = req.body.id
	console.log(userId,memoId)
	try {
		await client.query(
			`INSERT INTO likes (user_id,memo_id) VALUES (${userId}, ${memoId});`
		)
		console.log("like")
	} catch (err) {
		err
	}
	res.json('Liked')
})

app.use((req, res) => {
	res.status(404)
	res.sendFile(path.resolve('public', '404.html'))
})

server.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`)
})