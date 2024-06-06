import { getData } from './get_data.js'

const lightDarkBtn = async () => {
	document.querySelector('#lightDarkBtn')?.addEventListener('click', async () => {
		let darkMode = await getData(`theme`)
		if (darkMode) {
			await fetch('/theme', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					darkTheme: false
				})
			})
			darkMode = false
		} else {
			await fetch('/theme', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					darkTheme: true
				})
			})
			darkMode = true
		}
		await checkTheme()
	})
}

const checkTheme = async () => {
	let darkMode = await getData(`theme`)
  if (darkMode) {
    // show dark
		document.querySelector('#navBarToggle').classList.remove('bg-primary')
		document.querySelector('#navBarToggle').classList.add('bg-info')
		document.querySelector('.bs-tooltip-auto')?.remove()
		document.querySelector('#lightDarkBtn').textContent = 'toggle_on'
		document.querySelector('#lightDarkBtn').setAttribute('data-bs-title','Change to Light Theme')
		document.querySelectorAll('.btn-success').forEach(item => {
			item.classList.remove('btn-success')
			item.classList.add('btn-primary')
		})
		document.querySelectorAll('[data-arrow]').forEach(arrow => {
			arrow.classList.add('text-light')
			arrow.classList.remove('text-dark')
		})
		document.querySelectorAll('.text-light').forEach(item => {
			item.classList.remove('text-light')
			item.classList.add('text-warning')
		})
		document.querySelectorAll('.text-bg-primary').forEach(item => {
			item.classList.remove('text-bg-primary')
			item.classList.add('text-bg-dark')
		})
		document.querySelectorAll('table').forEach(item => {
			item.classList.add('table-dark')
		})
		document.querySelectorAll('.bg-primary').forEach(item => {
			item.classList.remove('bg-primary')
			item.classList.add('bg-dark')
		})
		document.querySelectorAll('#equipmentModalLabel').forEach(item => {
			item.classList.remove('text-dark')
			item.classList.add('text-primary')
		})
		document.querySelector('.modal-body').classList.remove('bg-light')
		document.querySelector('.modal-body').classList.add('bg-dark')
		document.querySelector('#mainContent')?.setAttribute('id','mainContent_black')
	} else {
		// show light
		document.querySelector('#navBarToggle').classList.remove('bg-info')
		document.querySelector('#navBarToggle').classList.add('bg-primary')
		document.querySelector('.bs-tooltip-auto')?.remove()
		document.querySelector('#lightDarkBtn').textContent = 'toggle_off'
		document.querySelector('#lightDarkBtn').setAttribute('data-bs-title','Change to Dark Theme')
		document.querySelectorAll('.btn-primary').forEach(item => {
			item.classList.remove('btn-primary')
			item.classList.add('btn-success')
		})
		document.querySelectorAll('[data-arrow]').forEach(arrow => {
			arrow.classList.add('text-dark')
			arrow.classList.remove('text-light')
		})
		document.querySelectorAll('.text-warning').forEach(item => {
			item.classList.remove('text-warning')
			item.classList.add('text-light')
		})
		document.querySelectorAll('.text-bg-dark').forEach(item => {
			item.classList.remove('text-bg-dark')
			item.classList.add('text-bg-primary')
		})
		document.querySelectorAll('table').forEach(item => {
			item.classList.remove('table-dark')
		})
		document.querySelectorAll('.bg-dark').forEach(item => {
			item.classList.remove('bg-dark')
			item.classList.add('bg-primary')
		})
		document.querySelectorAll('#equipmentModalLabel').forEach(item => {
			item.classList.remove('text-dark')
			item.classList.add('text-primary')
		})
		document.querySelector('.modal-body').classList.remove('bg-dark')
		document.querySelector('.modal-body').classList.add('bg-light')
		document.querySelector('#mainContent_black')?.setAttribute('id','mainContent')
	}
  const tooltipTriggerList = document.querySelector('[data-bs-toggle="tooltip"]')
  new bootstrap.Tooltip(tooltipTriggerList)
}

export { checkTheme, lightDarkBtn }