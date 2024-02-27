// move to admin page
document
	.querySelector('#regisForm')
	.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
		const form = event.target
		console.log(form)
		let rUserName = form.rUserName.value
		let rPassWord = form.rPassWord.value
		let cfmRPassWord = form.cfmRPassWord.value

		if(rPassWord !== cfmRPassWord) {
			document.querySelector('#regWarn').innerHTML = "Two password are not match!"
			return
		}
		const res = await fetch('/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: rUserName,
				password: rPassWord
			})
		})
		const result = await res.json()
		console.log(result)

		document.querySelector('#rUserName').value = ''
		document.querySelector('#rPassWord').value = ''
		document.querySelector('#cfmRPassWord').value = ''

		// window.location = '/admin.html'
	})