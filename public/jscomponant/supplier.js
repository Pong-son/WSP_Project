import { getData } from './get_data.js'
import { pagination } from './pagination.js'

let supplier_list_table = document.querySelector('#supplier_list_table')
// fixed variable
let each_page_show = Number(document.querySelector('#each_page_show')?.value);
let current_page = 1;
let order_by = 'id';
let order_by_ascending = true;
let sort_by_item = '';
let sort_by = '';
let data = {};
let data_in_table = [];

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

		const res = await fetch('/supplier_list', {
      method: 'POST',
			headers: {
        'Content-Type': 'application/json'
			},
			body: JSON.stringify({
        company_name: company_name,
				type_of_service: type_of_service,
        contact_person: contact_person,
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
    data = await getData(`supplier_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)

    let start = (current_page - 1) * each_page_show
    let end = start + each_page_show
    
    data_in_table = data.data?.slice(start, end)

    pagination(data.no_of_page)
    check_page_status(data)
    
    document.querySelector('[data-pre]')?.addEventListener('click',() => {
      current_page = current_page - 1
      loadSupplierTable()
    })
    document.querySelector('[aria-label="Next"]')?.addEventListener('click',() => {
      current_page = current_page + 1
      loadSupplierTable()
    })
    // generate table
    if(data.length === 0) {
      supplier_list_table.innerHTML = ''
      supplier_list_table.innerHTML = '<tr><th>No DATA</th></tr>'
    } else {
      supplier_list_table.innerHTML = ''
      data_in_table.forEach( item => {
        supplier_list_table.innerHTML += `<tr id=${item.id}><th scope="row">${item.id}</th>
        <td><input disabled type='text' data-company-name="${item.id}" value=${item.company_name}></td>
        <td><input disabled type='text' data-type-of-service="${item.id}" value=${item.type_of_service}></td>
        <td><input disabled type='text' data-contact-person="${item.id}" value=${item.contact_person}></td>
        <td><input disabled type='text' data-contact-email="${item.id}" value=${item.contact_email}></td>
        <td>
        <button data-edit="${item.id}">Edit</button>
        <button data-done="${item.id}" class="hide">Done</button>
        <button data-cancel="${item.id}" class="hide">Cancel</button>
        </td>
        <td>
        <button data-delete=${item.id}>Delete</button>
        </td>
        </tr>`
      })
    }
    // controller for the and delete btn
    document.querySelectorAll('[data-edit]')?.forEach(edit => {
      if (window.sessionStorage.getItem('admin')) {
        edit.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-edit')
          document.querySelector(`[company-name="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-company-type-of-service="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-contact-person="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-contact-email="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-done="${target}"]`).classList.remove('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.remove('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.add('hide')
        })
      } else {
        edit.addEventListener('click', () => {
          alert('Please Find Admin!')
        })
      }
    })
    document.querySelectorAll('[data-delete]')?.forEach(del => {
      if (window.sessionStorage.getItem('admin')) {
        del.addEventListener('click', (e) => {
          delFtn(e)
        })
      } else {
        del.addEventListener('click', () => {
          alert('Please Find Admin!')
        })
      }
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
    document.querySelectorAll('[data-page]')?.forEach(page => {
      page.addEventListener('click',async e => {
        const page = e.target.getAttribute('data-page')
        current_page = page
        loadSupplierTable()
      })
    })

    // generate select content to search
    if(data.length !== 0) {
      let search_select = document.querySelector('#search_select')
      search_select.innerHTML = '<option selected>- Search By -</option>'
      let item = Object?.keys(data.data[0])
      for(let i = 0; i < item.length -2; i++) {
        search_select.innerHTML += `<option value='${item[i]}'>${item[i]}</option>`
      }
    }
  } catch (e) {
    console.log(e)
  }
}

const delFtn = async (e) => {
  await fetch(`/supplier_list${e.target.getAttribute('data-delete')}`, {
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
  await fetch(`/supplier_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      company_name: company_name,
      type_of_service: type_of_service,
      contact_person: contact_person,
      contact_email: contact_email
    })
  })
}

document.querySelector('#each_page_show')?.addEventListener('input', () => {
  each_page_show = Number(document.querySelector('#each_page_show').value)
  document.querySelector('#each_page_show').blur()
  console.log(each_page_show)
  loadSupplierTable()
})

const check_page_status = (data) => {
  let pre_btn = document.querySelector('[aria-label="Previous"]')
  let next_btn = document.querySelector('[aria-label="Next"]')
  document.querySelector(`[data-page="${current_page}"]`)?.classList.add('disabled')
  data.current_page === 1?pre_btn.classList.add('disabled'):pre_btn.classList.remove('disabled')
  data.current_page === data.no_of_page?next_btn.classList.add('disabled'):next_btn.classList.remove('disabled')
}

document.querySelector('#search_select')?.addEventListener('change', () => {
  if(document.querySelector('#search_select').value === '- Search By -') {
    document.querySelector('#search_item').setAttribute('disabled','')
  } else {
    document.querySelector('#search_item').removeAttribute('disabled')
  }
})

document.querySelector('#search_item')?.addEventListener('input', () => {
  if(document.querySelector('#search_item').value !== '') {
    document.querySelector('#search_btn').removeAttribute('disabled')
  } else {
    document.querySelector('#search_btn').setAttribute('disabled','')
    sort_by = ''
    loadSupplierTable()
  }
})

document.querySelector('#search_btn')?.addEventListener('click', () => {
  let search_select = document.querySelector('#search_select').value
  let search_item = document.querySelector('#search_item').value
  sort_by_item = search_select
  sort_by = search_item.toLowerCase()
  loadSupplierTable()
  document.querySelector('#search_select').value = sort_by_item
})

document.querySelectorAll('[data-th]').forEach(title => {
  let path = window.location.pathname
  if (path === '/supplier') {
    title.addEventListener('click',(e) => {
      e.stopPropagation()
      document.querySelector(`[data-arrow=${order_by}]`).textContent = ''
      if (order_by !== e.target.getAttribute('data-th')) {
        order_by = e.target.getAttribute('data-th')
        order_by_ascending = true
        document.querySelector(`[data-arrow=${order_by}]`).textContent = 'arrow_downward'
      } else {
        order_by_ascending = !order_by_ascending
        order_by_ascending?document.querySelector(`[data-arrow=${order_by}]`).textContent = 'arrow_downward':document.querySelector(`[data-arrow=${order_by}]`).textContent = 'arrow_upward'
      }
      loadSupplierTable()
    })
  }
})
export { loadSupplierTable }