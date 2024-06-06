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

document.querySelector('#pw_visibility')?.addEventListener('click',() => {
	let pw = document.querySelector('#passWord')
	if(pw.type === "password") {
		document.querySelector('#pw_visibility').textContent = 'visibility_off'
		pw.type = "text"
} else {
	document.querySelector('#pw_visibility').textContent = 'visibility'
	pw.type = "password"
}
})

document
	.querySelector('#loginForm')
	?.addEventListener('submit', async (event) => {
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
		if (window.sessionStorage.getItem('username') && window.sessionStorage.getItem('admin')) {
			// document.querySelector('[data-admin]').classList.add('disabled')
			document.querySelectorAll('.admin_hide').forEach(admin => {
				admin.classList.remove('admin_hide')
			})
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
					<div class="input-group mb-3">
						<span class="input-group-text">Username</span>
						<input type="text" name="main_userName" id="main_userName" class="form-control" aria-label="username"/>
					</div>
					<div class="input-group mb-3"">
						<span class="input-group-text">Password</span>
						<input type="password" name="main_passWord" id="main_passWord" class="form-control" aria-label="Password"/>
						<span class="input-group-text material-symbols-outlined" id="main_pw_visibility">
								visibility
						</span>
					</div>
					<br />
					<button type="submit" data-bs-dismiss="modal">Login</button>
				</form>
			</div>`
			
			document.querySelector('#home_content').innerHTML = content

			document.querySelector('#main_pw_visibility').addEventListener('click',() => {
				let pw = document.querySelector('#main_passWord')
				if(pw.type === "password") {
					document.querySelector('#main_pw_visibility').textContent = 'visibility_off'
					pw.type = "text"
				} else {
					document.querySelector('#main_pw_visibility').textContent = 'visibility'
					pw.type = "password"
				}
			})

		document
			.querySelector('#mainLoginForm')
			.addEventListener('submit', async (event) => {
				event.preventDefault() // To prevent the form from submitting synchronously
				const form = event.target
				let userName = form.main_userName.value
				let passWord = form.main_passWord.value

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