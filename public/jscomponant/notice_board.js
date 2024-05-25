let path = window.location.pathname
if(path === '/') {
	document.querySelectorAll('.form-control').forEach(item => {
		item.addEventListener('change',() => {
				let topic = document.querySelector('#topic')
				let content = document.querySelector('#content')
				if (topic.value !== '' && content.value !== '') {
					document.querySelector('#submit_btn_notices_part').removeAttribute('disabled')
					document.querySelector('#warn_notice_notices_part').textContent = ''
				} else {
					document.querySelector('#submit_btn_notices_part').setAttribute('disabled','')
					document.querySelector('#warn_notice_notices_part').textContent = 'Fill in all the information!'
				}
			})
	})

	document.querySelector('#reset_btn').addEventListener('click', () => {
		document.querySelector('#topic').value = ''
		document.querySelector('#content').value = ''
		document.querySelector('#warn_notice_notices_part').textContent = ''
		document.querySelector('#submit_btn_notices_part').setAttribute('disabled','')
	})
}

// add new data
document
  .querySelector('#noticesForm')
  ?.addEventListener('submit', async (event) => {
    event.preventDefault() // To prevent the form from submitting synchronously
    const form = event.target
    let topic = form.topic.value
    let content = form.content.value
    
    const res = await fetch('/notices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: topic,
        content: content
      })
    })
    const result = await res.json()

    document.querySelector('#topic').value = ''
    document.querySelector('#content').value = ''
    loadNotice()

});

const loadNotice = async () => {
	try {
		if (window.location.pathname === '/') {

			const res = await fetch('/notices')
		
			const notices = await res.json()
		
			const noticesContainer = document.querySelector('#notices_content')
			if(notices.length === 0) {
				noticesContainer.innerHTML = ''
				noticesContainer.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
			} else if (window.location.pathname === '/') {
				noticesContainer.innerHTML = ''
				for (let notice of notices) {
					noticesContainer.innerHTML += `<div class="notice" id=${notice.id}>
							<input type="text" id=data${notice.id} data-id=${notice.id} value=${notice.content}>
							<span class="material-symbols-outlined" notice-del=${notice.id} data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Delete">
								delete
							</span>
							<span class="material-symbols-outlined bi-pencil-square" notice-edit=${notice.id} data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Edit">
								edit_square
							</span>
						</div>
					`
				}
			}
		
			document.querySelectorAll('[notice-del]').forEach(del_btn => {
				del_btn.addEventListener('click',async e => {
					await fetch(`/notices${e.target.parentElement.id}`, {
						method: 'DELETE'
					})
					noticesContainer.innerHTML = ''
					loadNotice()
				})
			})
		
			document.querySelectorAll('[notice-edit]').forEach(edit_btn => {
				edit_btn.addEventListener('click', async e => {
					const newContent = document.querySelector(
						`#data${e.target.parentElement.id}`
					)
				
					await fetch(`/notices${e.target.parentElement.id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							id: e.target.parentElement.id,
							content: newContent.value
						})
					})
					noticesContainer.innerHTML = ''
					loadNotice()
				})
			})
		
			const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
			tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
		}
	} catch (e) {
		console.log(e)
	}
}

export { loadNotice }