import { getData } from './utilities/get_data.js'
import { check_page_status, each_page_show, pagination, current_page } from './utilities/pagination.js'
import { search_ftn, search, sort_by_item, sort_by } from'./utilities/search.js';
import { order_by, order_by_ascending } from './utilities/order_by.js'

let equipment_table = document.querySelector('#equipment_table')

let data = {};
let data_in_table = [];

let path = window.location.pathname
if(path === '/equipment') {
  document.querySelectorAll('.form-control').forEach(item => {
    item.addEventListener('change',() => {
        let name = document.querySelector('#name')
        let brand = document.querySelector('#brand')
        let model = document.querySelector('#model')
        let parameterSelect = document.querySelector('#parameterSelect')
        let calibration_date = document.querySelector('#calibration_date')
        if (name.value !== '' && brand.value !== '' && model.value !== '' && parameterSelect.value !== 'Choose Parameter' && calibration_date.value !== '') {
          document.querySelector('#submit_btn').removeAttribute('disabled')
          document.querySelector('#warn_notice').textContent = ''
        } else {
          document.querySelector('#submit_btn').setAttribute('disabled','')
          document.querySelector('#warn_notice').textContent = 'Fill in all the information!'
        }
      })
  })

  document.querySelectorAll('.form-select').forEach(item => {
    item.addEventListener('change',() => {
      let name = document.querySelector('#name')
      let brand = document.querySelector('#brand')
      let model = document.querySelector('#model')
      let parameterSelect = document.querySelector('#parameterSelect')
      let calibration_date = document.querySelector('#calibration_date')
      if (name.value !== '' && brand.value !== '' && model.value !== '' && parameterSelect.value !== 'Choose Parameter' && calibration_date.value !== '') {
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
    document.querySelector('#brand').value = ''
    document.querySelector('#model').value = ''
    document.querySelector('#parameterSelect').innerHTML = ''
    loadEquipment()
    document.querySelector('#calibration_date').value = ''
    document.querySelector('#warn_notice').textContent = ''
    document.querySelector('#submit_btn').setAttribute('disabled','')
  })
}

// add new data
document
	.querySelector('#equipmentForm')
	?.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
    const form = event.target
    if (form.parameterSelect.value === 'Choose Parameter') {
      alert('Please choose Parameter')
    } else {
      let name = form.name.value
      let brand = form.brand.value
      let model = form.model.value
      let parameter = form.parameterSelect.value
      let calibration_date = form.calibration_date.value
      
      const res = await fetch('/equipment_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.replaceAll(' ','_'),
          brand: brand.replaceAll(' ','_'),
          model: model.replaceAll(' ','_'),
          parameter: parameter,
          calibration_date: calibration_date
        })
      })
      const result = await res.json()

      document.querySelector('#name').value = ''
      document.querySelector('#brand').value = ''
      document.querySelector('#model').value = ''
      document.querySelector('#calibration_date').value = ''
      document.querySelector('#parameterSelect').innerHTML = ''
      loadEquipment()
      loadEquipmentTable()
    }
	});

const delFtn = async (e) => {
  await fetch(`/equipment_list${e.target.getAttribute('data-delete')}`, {
    method: 'DELETE'
  })
  loadEquipmentTable()
}

const editFtn = async (e) => {
  const currentTarget = e.target.getAttribute('data-done')
  
  const name = document.querySelector(`[data-name="${currentTarget}"]`).value
  const brand = document.querySelector(`[data-brand="${currentTarget}"]`).value
  const model = document.querySelector(`[data-model="${currentTarget}"]`).value
  const parameter = document.querySelector(`[data-parameter="${currentTarget}"]`).value
  const calibration_date = document.querySelector(`[data-calibration-date="${currentTarget}"]`).value
  await fetch(`/equipment_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      name: name.replaceAll(' ','_'),
      brand: brand.replaceAll(' ','_'),
      model: model.replaceAll(' ','_'),
      parameter: parameter,
      calibration_date: calibration_date
    })
  })
  loadEquipmentTable()
}

const loadEquipmentTable = async () => {
  try {
    if (window.location.pathname === '/equipment') {
      data = await getData(`equipment_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)

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
        equipment_table.innerHTML = ''
        equipment_table.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
      } else {
        equipment_table.innerHTML = ''
        data_in_table.forEach( equipment => {
          let cal_date = new Date(equipment.calibration_date).getDate()
          cal_date < 10? cal_date = '0'+cal_date:cal_date
          let cal_month = new Date(equipment.calibration_date).getMonth()+1
          cal_month < 10? cal_month = '0'+cal_month:cal_month
          let cal_year = new Date(equipment.calibration_date).getFullYear()
          let calibration_date = `${cal_year}-${cal_month}-${cal_date}`
  
          let exp_date = new Date(equipment.expiry_date).getDate()
          exp_date < 10? exp_date = '0'+exp_date:exp_date
          let exp_month = new Date(equipment.expiry_date).getMonth()+1
          exp_month < 10? exp_month = '0'+exp_month:exp_month
          let exp_year = new Date(equipment.expiry_date).getFullYear()
          let expiry_date = `${exp_year}-${exp_month}-${exp_date}`
  
          equipment_table.innerHTML += `<tr id=${equipment.id}><th scope="row">${equipment.id}</th>
          <td><input disabled type='text' data-name="${equipment.id}" value=${equipment.name}></td>
          <td><input disabled type='text' data-brand="${equipment.id}" value=${equipment.brand}></td>
          <td><input disabled type='text' data-model="${equipment.id}" value=${equipment.model}></td>
          <td><select disabled id=${equipment.parameter} class="form-select" aria-label="Default Parameter" data-parameter=${equipment.id}></select></td>
          <td><input disabled type='text' data-cal-period="${equipment.id}" value=${equipment.calibration_period}></td>
          <td><input disabled type='date' data-calibration-date="${equipment.id}" value=${calibration_date}></td>
          <td><input disabled type='date' data-expiry-date="${equipment.id}" value=${expiry_date}></td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-edit="${equipment.id}">Edit</button>
            <button data-done="${equipment.id}" class="hide">Done</button>
            <button data-cancel="${equipment.id}" class="hide">Cancel</button>
          </td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-delete=${equipment.id}>Delete</button>
          </td>
          </tr>`
        })
      }
  
      let calibration_period_data = await getData('calibration_period_list')
      document.querySelectorAll('[data-parameter]').forEach(item => {
        item.innerHTML = ''
        let selectContent = ''
        calibration_period_data.data.forEach(calibrationPeriod => {
          if (calibrationPeriod.parameter === item.getAttribute('id')) {
            selectContent += `<option selected value="${calibrationPeriod.parameter}">${calibrationPeriod.parameter}</option>`
          } else {
            selectContent += `<option value="${calibrationPeriod.parameter}">${calibrationPeriod.parameter}</option>`
          }
        })
        item.innerHTML += `${selectContent}`
      })
      // controller for the and delete btn
      document.querySelectorAll('[data-edit]')?.forEach(edit => {
        edit.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-edit')
          document.querySelector(`[data-name="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-brand="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-model="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-parameter="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-calibration-date="${target}"]`).removeAttribute("disabled")
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
          document.querySelector(`[data-brand="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-model="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-parameter="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-calibration-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-cancel]')?.forEach(cancel => {
        cancel.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-cancel')
          document.querySelector(`[data-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-brand="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-model="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-parameter="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-calibration-date="${target}"]`).setAttribute("disabled","")
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

const loadEquipment = async () => {
  try {
    data = await getData('calibration_period_list')
    document.querySelector('#parameterSelect').innerHTML = ''
    let selectContent = ''
    data.data.forEach(calibrationPeriod => {
      selectContent += `<option value="${calibrationPeriod.parameter}">${calibrationPeriod.parameter}</option>`
    })
    document.querySelector('#parameterSelect').innerHTML += `
        <option selected>Choose Parameter</option>
        ${selectContent}`
    checkNoOfSelect()
  } catch (e) {
    console.log(e)
  }
}

const checkNoOfSelect = () => {
  document.querySelector('[data-param]')?.addEventListener('input',e => {
    for(const child of e.target.children) {
      if(child.getAttribute('selected') === '') {
        child.removeAttribute('selected')
      }
      if(child.textContent === e.target.value) {
        child.setAttribute('selected','')
      }
    }
  })
}

export { loadEquipment, loadEquipmentTable }