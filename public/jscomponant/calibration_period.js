import { getData } from './utilities/get_data.js'
import { check_page_status, each_page_show, pagination, current_page } from './utilities/pagination.js'
import { search_ftn, search, sort_by_item, sort_by } from'./utilities/search.js';
import { order_by, order_by_ascending } from './utilities/order_by.js'

let calibration_period_table = document.querySelector('#calibration_period_table')

let data = {};
let data_in_table = [];

let path = window.location.pathname
if(path === '/calibration_period') {
  document.querySelectorAll('.form-control').forEach(item => {
    item.addEventListener('change',() => {
        let parameter = document.querySelector('#parameter')
        let calibration_period = document.querySelector('#calibration_period')
        if (parameter.value !== '' && calibration_period.value !== '') {
          document.querySelector('#submit_btn').removeAttribute('disabled')
          document.querySelector('#warn_notice').textContent = ''
        } else {
          document.querySelector('#submit_btn').setAttribute('disabled','')
          document.querySelector('#warn_notice').textContent = 'Fill in all the information!'
        }
      })
  })

  document.querySelector('#reset_btn').addEventListener('click', () => {
    document.querySelector('#parameter').value = ''
    document.querySelector('#calibration_period').value = ''
    document.querySelector('#warn_notice').textContent = ''
    document.querySelector('#submit_btn').setAttribute('disabled','')
  })
}

// add new data
document
	.querySelector('#calibration_period_form')
	?.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
		const form = event.target
		let parameter = form.parameter.value
		let calibration_period = form.calibration_period.value

		const res = await fetch('/calibration_period_list', {
      method: 'POST',
			headers: {
        'Content-Type': 'application/json'
			},
			body: JSON.stringify({
        parameter: parameter.replaceAll(' ','_'),
				calibration_period: calibration_period
			})
		})
		const result = await res.json()

		document.querySelector('#parameter').value = ''
		document.querySelector('#calibration_period').value = ''

  loadCalTable()
	});

const loadCalTable = async () => {
  try {
    if (window.location.pathname === '/calibration_period') {
      data = await getData(`calibration_period_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)
  
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
        calibration_period_table.innerHTML = ''
        calibration_period_table.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
      } else {
        calibration_period_table.innerHTML = ''
        data_in_table.forEach( item => {
          calibration_period_table.innerHTML += `<tr id=${item.id}><th scope="row">${item.id}</th>
          <td><input disabled type='text' data-param="${item.id}" value=${item.parameter}></td>
          <td><input disabled type='text' data-cal-period="${item.id}" value=${item.calibration_period}></td>
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
          document.querySelector(`[data-param="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-cal-period="${target}"]`).removeAttribute("disabled")
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
          document.querySelector(`[data-param="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-cal-period="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-cancel]')?.forEach(cancel => {
        cancel.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-cancel')
          document.querySelector(`[data-param="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-cal-period="${target}"]`).setAttribute("disabled","")
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
  await fetch(`/calibration_period_list${e.target.getAttribute('data-delete')}`, {
    method: 'DELETE'
  })
  loadCalTable()
}

const editFtn = async (e) => {
  const currentTarget = e.target.getAttribute('data-done')
  
  const parameter = document.querySelector(`[data-param="${currentTarget}"]`).value
  const calibration_period = document.querySelector(`[data-cal-period="${currentTarget}"]`).value
  await fetch(`/calibration_period_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      parameter: parameter.replaceAll(' ','_'),
      calibration_period: calibration_period
    })
  })
  loadCalTable()
}

export { loadCalTable }