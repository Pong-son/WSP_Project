import { getData } from './get_data.js'
import { pagination } from './pagination.js'
import { sort_by_item, sort_by } from'./search.js';

let reference_materials_table = document.querySelector('#reference_materials_table')
// fixed variable
let each_page_show = Number(document.querySelector('#each_page_show')?.value);
let current_page = 1;
let order_by = 'id';
let order_by_ascending = true;
let data = {};
let data_in_table = [];

let path = window.location.pathname
if(path === '/reference_materials') {
  document.querySelectorAll('.form-control').forEach(item => {
    item.addEventListener('change',() => {
        let chemical_name = document.querySelector('#chemical_name')
        let expiry_date = document.querySelector('#expiry_date')
        if (chemical_name.value !== '' && expiry_date.value !== '') {
          document.querySelector('#submit_btn').removeAttribute('disabled')
          document.querySelector('#warn_notice').textContent = ''
        } else {
          document.querySelector('#submit_btn').setAttribute('disabled','')
          document.querySelector('#warn_notice').textContent = 'Fill in all the information!'
        }
      })
  })

  document.querySelector('#reset_btn').addEventListener('click', () => {
    document.querySelector('#chemical_name').value = ''
    document.querySelector('#expiry_date').value = ''
    document.querySelector('#is_certified').innerHTML = `
      <option value="true" selected>true</option>
      <option value="false">false</option>
    `
    document.querySelector('#warn_notice').textContent = ''
    document.querySelector('#submit_btn').setAttribute('disabled','')
  })
}
// add new data
document
	.querySelector('#reference_materials_form')
	?.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
		const form = event.target
		let chemical_name = form.chemical_name.value
		let is_certified = form.is_certified.value
		let expiry_date = form.expiry_date.value

		const res = await fetch('/reference_materials_list', {
      method: 'POST',
			headers: {
        'Content-Type': 'application/json'
			},
			body: JSON.stringify({
        chemical_name: chemical_name.replaceAll(' ','_'),
				is_certified: is_certified,
        expiry_date: expiry_date
			})
		})
		const result = await res.json()

		document.querySelector('#chemical_name').value = ''
		document.querySelector('#is_certified').value = ''
		document.querySelector('#expiry_date').value = ''

  loadReferenceMaterialsTable()
	});

const loadReferenceMaterialsTable = async () => {
  try {
    if (window.location.pathname === '/reference_materials') {

      data = await getData(`reference_materials_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)
  
      let start = (current_page - 1) * each_page_show
      let end = start + each_page_show
      
      data_in_table = data.data?.slice(start, end)
  
      pagination(data.no_of_page)
      check_page_status(data)
      
      document.querySelector('[data-pre]')?.addEventListener('click',() => {
        current_page = current_page - 1
        loadReferenceMaterialsTable()
      })
      document.querySelector('[aria-label="Next"]')?.addEventListener('click',() => {
        current_page = current_page + 1
        loadReferenceMaterialsTable()
      })
      // generate table
      if(data.data?.length === undefined || data.data?.length === 0) {
        let no_of_col = document.querySelectorAll('th').length
        reference_materials_table.innerHTML = ''
        reference_materials_table.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
      } else {
        reference_materials_table.innerHTML = ''
        data_in_table.forEach( item => {
          // return correct format of date valte into date input
          let date = new Date(item.expiry_date).getDate()
          date < 10? date = '0'+date:date
          let month = new Date(item.expiry_date).getMonth()+1
          month < 10? month = '0'+month:month
          let year = new Date(item.expiry_date).getFullYear()
  
          reference_materials_table.innerHTML += `<tr id=${item.id}><th scope="row">${item.id}</th>
          <td><input disabled type='text' data-chemical-name="${item.id}" value=${item.chemical_name}></td>
          <td>
          <select disabled id="is_certified" class="form-select" aria-label="Default true" data-is-crm="${item.id}" value=${item.is_certified}>
          <option value="true" ${item.is_certified?'selected':''}>true</option>
          <option value="false" ${item.is_certified?'':'selected'}>false</option>
        </select>
          <td><input disabled type='date' data-expiry-date="${item.id}" value="${year+'-'+month+'-'+date}"></td>
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
            document.querySelector(`[data-chemical-name="${target}"]`).removeAttribute("disabled")
            document.querySelector(`[data-is-crm="${target}"]`).removeAttribute("disabled")
            document.querySelector(`[data-expiry-date="${target}"]`).removeAttribute("disabled")
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
          document.querySelector(`[data-chemical-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-is-crm="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-expiry-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-cancel]')?.forEach(cancel => {
        cancel.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-cancel')
          document.querySelector(`[data-chemical-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-is-crm="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-expiry-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-page]')?.forEach(page => {
        page.addEventListener('click',async e => {
          const page = e.target.getAttribute('data-page')
          current_page = page
          loadReferenceMaterialsTable()
        })
      })
  
      // generate select content to search
      if(data.data?.length !== undefined && data.data?.length !== 0) {
        let search_select = document.querySelector('#search_select')
        search_select.innerHTML = '<option selected>- Search By -</option>'
        let item = Object?.keys(data.data[0])
        for(let i = 0; i < item.length -2; i++) {
          search_select.innerHTML += `<option value='${item[i]}'>${item[i]}</option>`
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

const delFtn = async (e) => {
  await fetch(`/reference_materials_list${e.target.getAttribute('data-delete')}`, {
    method: 'DELETE'
  })
  loadReferenceMaterialsTable()
}

const editFtn = async (e) => {
  const currentTarget = e.target.getAttribute('data-done')

  const chemical_name = document.querySelector(`[data-chemical-name="${currentTarget}"]`).value
  const is_certified = document.querySelector(`[data-is-crm="${currentTarget}"]`).value
  const expiry_date = document.querySelector(`[data-expiry-date="${currentTarget}"]`).value
  await fetch(`/reference_materials_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      chemical_name: chemical_name.replaceAll(' ','_'),
      is_certified: is_certified,
      expiry_date: expiry_date
    })
  })
  loadReferenceMaterialsTable()
}

document.querySelector('#each_page_show')?.addEventListener('input', () => {
  each_page_show = Number(document.querySelector('#each_page_show').value)
  document.querySelector('#each_page_show').blur()
  loadReferenceMaterialsTable()
})

const check_page_status = (data) => {
  let pre_btn = document.querySelector('[aria-label="Previous"]')
  let next_btn = document.querySelector('[aria-label="Next"]')
  document.querySelector(`[data-page="${current_page}"]`)?.classList.add('disabled')
  data.current_page === 1?pre_btn.classList.add('disabled'):pre_btn.classList.remove('disabled')
  data.current_page === data.no_of_page?next_btn.classList.add('disabled'):next_btn.classList.remove('disabled')
}

document.querySelectorAll('[data-th]').forEach(title => {
  let path = window.location.pathname
  if (path === '/reference_materials') {
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
      loadReferenceMaterialsTable()
    })
  }
})
export { loadReferenceMaterialsTable }