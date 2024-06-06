import { getData } from './utilities/get_data.js'
import { check_page_status, each_page_show, pagination, current_page } from './utilities/pagination.js'
import { search_ftn, search, sort_by_item, sort_by } from'./utilities/search.js';
import { order_by, order_by_ascending } from './utilities/order_by.js'

let suppliers_list_table = document.querySelector('#suppliers_list_table')

let data = {};
let data_in_table = [];

let path = window.location.pathname
if(path === '/suppliers') {
  document.querySelectorAll('.form-control').forEach(item => {
    item.addEventListener('change',() => {
        let company_name = document.querySelector('#company_name')
        let type_of_service = document.querySelector('#type_of_service')
        let contact_person = document.querySelector('#contact_person')
        let contact_email = document.querySelector('#contact_email')
        if (company_name.value !== '' && type_of_service.value !== '' && contact_person.value !== '' && contact_email.value !== '') {
          document.querySelector('#submit_btn').removeAttribute('disabled')
          document.querySelector('#warn_notice').textContent = ''
        } else {
          document.querySelector('#submit_btn').setAttribute('disabled','')
          document.querySelector('#warn_notice').textContent = 'Fill in all the information!'
        }
      })
  })

  document.querySelector('#reset_btn').addEventListener('click', () => {
    document.querySelector('#company_name').value = ''
    document.querySelector('#type_of_service').value = ''
    document.querySelector('#contact_person').value = ''
    document.querySelector('#contact_email').value = ''
    document.querySelector('#warn_notice').textContent = ''
    document.querySelector('#submit_btn').setAttribute('disabled','')
  })
}

// add new data
document
	.querySelector('#supplierListForm')
	?.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
		const form = event.target
		let company_name = form.company_name.value
		let type_of_service = form.type_of_service.value
		let contact_person = form.contact_person.value
		let contact_email = form.contact_email.value

		const res = await fetch('/suppliers_list', {
      method: 'POST',
			headers: {
        'Content-Type': 'application/json'
			},
			body: JSON.stringify({
        company_name: company_name.replaceAll(' ','_'),
				type_of_service: type_of_service.replaceAll(' ','_'),
        contact_person: contact_person.replaceAll(' ','_'),
        contact_email: contact_email
			})
		})
		const result = await res.json()

		document.querySelector('#company_name').value = ''
		document.querySelector('#type_of_service').value = ''
		document.querySelector('#contact_person').value = ''
		document.querySelector('#contact_email').value = ''

  loadSupplierTable()
	});

const loadSupplierTable = async () => {
  try {
    if (window.location.pathname === '/suppliers') {
      data = await getData(`suppliers_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)
  
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
        suppliers_list_table.innerHTML = ''
        suppliers_list_table.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
      } else {
        suppliers_list_table.innerHTML = ''
        data_in_table.forEach( item => {
          suppliers_list_table.innerHTML += `<tr id=${item.id}><th scope="row">${item.id}</th>
          <td><input disabled type='text' data-company-name="${item.id}" value=${item.company_name}></td>
          <td><input disabled type='text' data-type-of-service="${item.id}" value=${item.type_of_service}></td>
          <td><input disabled type='text' data-contact-person="${item.id}" value=${item.contact_person}></td>
          <td><input disabled type='text' data-contact-email="${item.id}" value=${item.contact_email}></td>
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
          document.querySelector(`[data-company-name="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-type-of-service="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-contact-person="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-contact-email="${target}"]`).removeAttribute("disabled")
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
          document.querySelector(`[data-company-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-type-of-service="${target}"]`).setAttribute("disabled","")
           document.querySelector(`[data-contact-person="${target}"]`).setAttribute("disabled","")
           document.querySelector(`[data-contact-email="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-cancel]')?.forEach(cancel => {
        cancel.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-cancel')
          document.querySelector(`[data-company-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-type-of-service="${target}"]`).setAttribute("disabled","")
           document.querySelector(`[data-contact-person="${target}"]`).setAttribute("disabled","")
           document.querySelector(`[data-contact-email="${target}"]`).setAttribute("disabled","")
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
  await fetch(`/suppliers_list${e.target.getAttribute('data-delete')}`, {
    method: 'DELETE'
  })
  loadSupplierTable()
}

const editFtn = async (e) => {
  const currentTarget = e.target.getAttribute('data-done')
  
  const company_name = document.querySelector(`[data-company-name="${currentTarget}"]`).value
  const type_of_service = document.querySelector(`[data-type-of-service="${currentTarget}"]`).value
  const contact_person = document.querySelector(`[data-contact-person="${currentTarget}"]`).value
  const contact_email = document.querySelector(`[data-contact-email="${currentTarget}"]`).value
  await fetch(`/suppliers_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      company_name: company_name.replaceAll(' ','_'),
      type_of_service: type_of_service.replaceAll(' ','_'),
      contact_person: contact_person.replaceAll(' ','_'),
      contact_email: contact_email
    })
  })
  loadSupplierTable()
}

export { loadSupplierTable }