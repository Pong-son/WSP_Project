import { getData } from './get_data.js'
import { navBar } from './navbar.js'

let login;
let loginName = window.sessionStorage.getItem('username');
loginName?login = true: login = false;


const loginBtn = async () => {
	document.querySelector('#loginBtn')?.addEventListener('click', async () => {
		if(login) {
			window.sessionStorage.clear()
			const res = await fetch('/logout')
			login = false
		}
		checkLogin()
	})
}

document
	.querySelector('#loginForm')
	.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
		const form = event.target
		let userName = form.userName.value
		let passWord = form.passWord.value

		const res = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: userName,
				password: passWord
			})
		})
		const result = await res.json()
		if (result === 'admin') {
			window.sessionStorage.setItem('username',userName)
			window.sessionStorage.setItem('admin','admin')
			login = true
		} else if (result === 'done') {
			window.sessionStorage.setItem('username',userName)
			login = true
		}
		document.querySelector('#userName').value = ''
		document.querySelector('#passWord').value = ''
		checkLogin()
		location.reload()
	})

const checkLogin = async () => {
	login = await getData(`isuser`)
	navBar(login)
  if(login){
		document.querySelector('#loginBtn').textContent = "Logout"
		document.querySelector('#loginBtn').removeAttribute('data-bs-toggle')
		if (window.sessionStorage.getItem('username') && !window.sessionStorage.getItem('admin')) {
			document.querySelector('[data-admin]').classList.add('disabled')
		}
	} else {
		document.querySelector('#loginBtn').textContent = "Login"
		document.querySelector('#loginBtn').setAttribute('data-bs-toggle',"modal")
	}
	let path = window.location.pathname
	if(path === '/'  && !login) {
		let content = `
			<div class='home_content_without_login'>
				<form action="/login" method="post" id="mainLoginForm">
					<input type="text" name="userName" id="userName" class="form-control" placeholder="Username" aria-label="username"/>
					<br />
					<input type="password" name="passWord" id="passWord" class="form-control" placeholder="Password" aria-label="Password"/>
					<br />
					<button type="submit" data-bs-dismiss="modal">Login</button>
				</form>
			</div>`
    document.querySelector('#home_content').innerHTML = content

		document
			.querySelector('#mainLoginForm')
			.addEventListener('submit', async (event) => {
				event.preventDefault() // To prevent the form from submitting synchronously
				const form = event.target
				let userName = form.userName.value
				let passWord = form.passWord.value

				const res = await fetch('/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						username: userName,
						password: passWord
					})
				})
				const result = await res.json()
				if (result === 'admin') {
					window.sessionStorage.setItem('username',userName)
					window.sessionStorage.setItem('admin','admin')
					login = true
				} else if (result === 'done') {
					window.sessionStorage.setItem('username',userName)
					login = true
				}
				document.querySelector('#userName').value = ''
				document.querySelector('#passWord').value = ''
				checkLogin()
				location.reload()
			})
	}
}


export { checkLogin, loginName, loginBtn }