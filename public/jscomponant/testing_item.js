import { getData } from './utilities/get_data.js'
import { check_page_status, each_page_show, pagination, current_page } from './utilities/pagination.js'
import { search_ftn, search, sort_by_item, sort_by } from'./utilities/search.js';
import { order_by, order_by_ascending } from './utilities/order_by.js'

let testing_item_table = document.querySelector('#testing_item_table')

let data = {};
let data_in_table = [];

let path = window.location.pathname
if(path === '/testing_item') {
  document.querySelectorAll('.form-control').forEach(item => {
    item.addEventListener('change',() => {
        let name = document.querySelector('#name')
        if (name.value !== '') {
          document.querySelector('#submit_btn').removeAttribute('disabled')
          document.querySelector('#warn_notice').textContent = ''
        } else {
          document.querySelector('#submit_btn').setAttribute('disabled','')
          document.querySelector('#warn_notice').textContent = 'Fill in all the information!'
        }
      })
  })

  document.querySelector('#reset_btn').addEventListener('click', () => {
    document.querySelector('#name').value = ''
    document.querySelector('#warn_notice').textContent = ''
    document.querySelector('#submit_btn').setAttribute('disabled','')
  })
}

// add new data
document
	.querySelector('#testingItemForm')
	?.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
		const form = event.target
		let name = form.name.value

		const res = await fetch('/testing_item_list', {
      method: 'POST',
			headers: {
        'Content-Type': 'application/json'
			},
			body: JSON.stringify({
        name: name.replaceAll(' ','_'),
			})
		})
		const result = await res.json()
    document.querySelector('#submit_btn').setAttribute('disabled','')
		document.querySelector('#name').value = ''

  loadTestingItemTable()
	});

const loadTestingItemTable = async () => {
  try {
    if (window.location.pathname === '/testing_item') {
      data = await getData(`testing_item_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)
  
      let start = (current_page - 1) * each_page_show
      let end = start + each_page_show
      
      data_in_table = data.data?.slice(start, end)
  
      pagination(data.no_of_page)
      check_page_status(data)
      search_ftn(data)

      if(search(data.data, sort_by_item, sort_by).length !== 0) {
        data_in_table = search(data.data, sort_by_item, sort_by)
      } else if (sort_by_item) {
        data.data = []
      } else {
        ''
      }
      // generate table      
      if(data.data?.length === undefined || data.data?.length === 0) {
        let no_of_col = document.querySelectorAll('th').length      
        testing_item_table.innerHTML = ''
        testing_item_table.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
      } else {
        testing_item_table.innerHTML = ''
        data_in_table.forEach( item => {
          testing_item_table.innerHTML += `<tr id=${item.id}><th scope="row">${item.id}</th>
          <td><input disabled type='text' data-name="${item.id}" value=${item.name}></td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-edit="${item.id}">Edit</button>
            <button data-done="${item.id}" class="hide">Done</button>
            <button data-cancel="${item.id}" class="hide">Cancel</button>
          </td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-delete=${item.id}>Delete</button>
          </td>
          </tr>`
        })
      }
      // controller for the and delete btn
      document.querySelectorAll('[data-edit]')?.forEach(edit => {
        edit.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-edit')
          document.querySelector(`[data-name="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-done="${target}"]`).classList.remove('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.remove('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.add('hide')
        })
      })
      document.querySelectorAll('[data-delete]')?.forEach(del => {
        del.addEventListener('click', (e) => {
          delFtn(e)
        })
      })
      document.querySelectorAll('[data-done]')?.forEach(done => {
        done.addEventListener('click', (e) => {
          editFtn(e)
          const target = e.target.getAttribute('data-done')
          document.querySelector(`[data-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-cancel]')?.forEach(cancel => {
        cancel.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-cancel')
          document.querySelector(`[data-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })

      search_ftn(data)
    }
  } catch (e) {
    console.log(e)
  }
}

const delFtn = async (e) => {
  await fetch(`/testing_item_list${e.target.getAttribute('data-delete')}`, {
    method: 'DELETE'
  })
  loadTestingItemTable()
}

const editFtn = async (e) => {
  const currentTarget = e.target.getAttribute('data-done')
  
  const name = document.querySelector(`[data-name="${currentTarget}"]`).value
  await fetch(`/testing_item_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      name: name.replaceAll(' ','_')
    })
  })
  loadTestingItemTable()
}

export { loadTestingItemTable }