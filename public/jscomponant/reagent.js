import { getData } from './utilities/get_data.js'
import { check_page_status, each_page_show, pagination, current_page } from './utilities/pagination.js'
import { search_ftn, search, sort_by_item, sort_by } from'./utilities/search.js';
import { order_by, order_by_ascending } from './utilities/order_by.js'

let reagent_table = document.querySelector('#reagent_table')

let data = {};
let data_in_table = [];

let path = window.location.pathname
if(path === '/reagent') {
  document.querySelectorAll('.form-control').forEach(item => {
    item.addEventListener('change',() => {
      let name = document.querySelector('#name')
      let itemSelect = document.querySelector('#itemSelect')
      let referenceMaterialSelect = document.querySelector('#referenceMaterialSelect')
      let prepare_date = document.querySelector('#prepare_date')
      let prepared_by = document.querySelector('#prepared_by')
      if (name.value !== '' && itemSelect.value !== 'Choose Testing Item' &&referenceMaterialSelect.value !== 'Choose Reference Material' && prepare_date.value !== '' && prepared_by.value !== '') {
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
      let itemSelect = document.querySelector('#itemSelect')
      let referenceMaterialSelect = document.querySelector('#referenceMaterialSelect')
      let prepare_date = document.querySelector('#prepare_date')
      let prepared_by = document.querySelector('#prepared_by')
      if (name.value !== '' && itemSelect.value !== 'Choose Testing Item' && referenceMaterialSelect.value !== 'Choose Reference Material' && prepare_date.value !== '' && prepared_by.value !== '') {
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
    document.querySelector('#itemSelect').innerHTML = ''
    document.querySelector('#referenceMaterialSelect').innerHTML = ''
    loadItem()
    loadReferenceMaterial()
    document.querySelector('#prepare_date').value = ''
    document.querySelector('#prepared_by').value = ''
    document.querySelector('#warn_notice').textContent = ''
    document.querySelector('#submit_btn').setAttribute('disabled','')
  })
}

// add new data
document
	.querySelector('#reagentForm')
	?.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
    const form = event.target
		
		let name = form.name.value
    let item = form.itemSelect.value
    let reference_material = form.referenceMaterialSelect.value
		let prepare_date = form.prepare_date.value
		let prepared_by = form.prepared_by.value
    
		const res = await fetch('/reagent_list', {
      method: 'POST',
			headers: {
        'Content-Type': 'application/json'
			},
			body: JSON.stringify({
        name: name.replaceAll(' ','_'),
        item: item,
        reference_material: reference_material,
				prepare_date: prepare_date,
        prepared_by: prepared_by
			})
		})
		const result = await res.json()

		document.querySelector('#name').value = ''
		document.querySelector('#prepare_date').value = ''
		document.querySelector('#prepared_by').value = ''
		document.querySelector('#itemSelect').innerHTML = ''
		document.querySelector('#referenceMaterialSelect').innerHTML = ''

    loadReagentTable()
	});



const delFtn = async (e) => {
  await fetch(`/reagent_list${e.target.getAttribute('data-delete')}`, {
    method: 'DELETE'
  })
  loadReagentTable()
}

const editFtn = async (e) => {
  const currentTarget = e.target.getAttribute('data-done')
  
  const name = document.querySelector(`[data-name="${currentTarget}"]`).value
  const item = document.querySelector(`[data-item="${currentTarget}"]`).value
  const chemical_name = document.querySelector(`[data-chemical-name="${currentTarget}"]`).value
  const prepare_date = document.querySelector(`[data-prepare-date="${currentTarget}"]`).value
  const prepared_by = document.querySelector(`[data-prepare-by="${currentTarget}"]`).value
  await fetch(`/reagent_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      name: name.replaceAll(' ','_'),
      item: item,
      chemical_name: chemical_name,
      prepare_date: prepare_date,
      prepared_by: prepared_by
    })
  })
  loadReagentTable()
}

const loadReagentTable = async () => {
  try {
    if (window.location.pathname === '/reagent') {
      data = await getData(`reagent_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)
  
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
        reagent_table.innerHTML = ''
        reagent_table.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
      } else {
        reagent_table.innerHTML = ''
        data_in_table.forEach( reagent => {
          let prepare_date = new Date(reagent.prepare_date).getDate()
          prepare_date < 10? prepare_date = '0'+prepare_date:prepare_date
          let prepare_month = new Date(reagent.prepare_date).getMonth()+1
          prepare_month < 10? prepare_month = '0'+prepare_month:prepare_month
          let prepare_year = new Date(reagent.prepare_date).getFullYear()
  
  
          let reagent_prepare_date = `${prepare_year}-${prepare_month}-${prepare_date}`
  
          let expiry_date = new Date(reagent.expiry_date).getDate()
          expiry_date < 10? expiry_date = '0'+expiry_date:expiry_date
          let expiry_month = new Date(reagent.expiry_date).getMonth()+1
          expiry_month < 10? expiry_month = '0'+expiry_month:expiry_month
          let expiry_year = new Date(reagent.expiry_date).getFullYear()
  
          let reagent_expiry_date = `${expiry_year}-${expiry_month}-${expiry_date}`
  
          reagent_table.innerHTML += `<tr id=${reagent.id}><th scope="row">${reagent.id}</th>
          <td>
            <input disabled type='text' data-name="${reagent.id}" value=${reagent.name}>
          </td>
          <td>
            <select disabled id=${reagent.item} data-item="${reagent.id}" value=${reagent.item}></select>
          </td>
          <td>
            <select disabled id=${reagent.chemical_name} data-chemical-name="${reagent.id}" value=${reagent.chemical_name}></select>
          </td>
          <td>
            <input disabled type='text' data-batch-id="${reagent.id}" value=${reagent.batch_id}>
          </td>
          <td>
            <input disabled type='date' data-prepare-date="${reagent.id}" value=${reagent_prepare_date}>
          </td>
          <td>
            <input disabled type='date' data-expiry-date="${reagent.id}" value=${reagent_expiry_date}>
          </td>
          <td>
            <input disabled type='text' data-prepare-by="${reagent.id}" value=${reagent.prepared_by}>
          </td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-edit="${reagent.id}">Edit</button>
            <button data-done="${reagent.id}" class="hide">Done</button>
            <button data-cancel="${reagent.id}" class="hide">Cancel</button>
          </td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-delete=${reagent.id}>Delete</button>
          </td>
          </tr>`
        })
      }
  
      let testing_item_data = await getData('testing_item_list')
      document.querySelectorAll('[data-item]').forEach(item => {
        item.innerHTML = ''
        let selectContent = ''
        testing_item_data.data.forEach(testing_item => {
          if (testing_item.name === item.getAttribute('id')) {
            selectContent += `<option selected value="${testing_item.name}">${testing_item.name}</option>`
          } else {
            selectContent += `<option value="${testing_item.name}">${testing_item.name}</option>`
          }
        })
        item.innerHTML += `${selectContent}`
      })
      let reference_materials_data = await getData('reference_materials_list')
  
      document.querySelectorAll('[data-chemical-name]').forEach(reference_material => {
        reference_material.innerHTML = ''
        let selectContent = ''
        reference_materials_data.data.forEach(reference_materials => {
          if (reference_materials.chemical_name === reference_material.getAttribute('id')) {
            selectContent += `<option selected value="${reference_materials.chemical_name}">${reference_materials.chemical_name}</option>`
          } else {
            selectContent += `<option value="${reference_materials.chemical_name}">${reference_materials.chemical_name}</option>`
          }
        })
        reference_material.innerHTML += `${selectContent}`
      })
      // controller for the and delete btn
      document.querySelectorAll('[data-edit]')?.forEach(edit => {
        edit.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-edit')
          document.querySelector(`[data-name="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-item="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-chemical-name="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-prepare-date="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-prepare-by="${target}"]`).removeAttribute("disabled")
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
          document.querySelector(`[data-item="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-chemical-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-prepare-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-prepare-by="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-cancel]')?.forEach(cancel => {
        cancel.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-cancel')
          document.querySelector(`[data-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-item="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-chemical-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-prepare-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-prepare-by="${target}"]`).setAttribute("disabled","")
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

const loadItem = async () => {
  try {
    let data = await getData('testing_item_list')
    let total = document.querySelectorAll('[data-testing-item]').length
    let selectContent = ''
    data.data.forEach(itemName => {
      selectContent += `<option value="${itemName.name}">${itemName.name}</option>`
    })
    document.querySelector('#itemSelect').innerHTML = ''
    document.querySelector('#itemSelect').innerHTML += `
      <select id=itemSelect${total+1} class="form-select" aria-label="Default Testing Item" data-testing-item>
        <option selected>Choose Testing Item</option>
        ${selectContent}
      </select>`
    document.querySelectorAll('[data-testing-item]').forEach(select => {
      select?.addEventListener('input',e => {
        for(const child of e.target.children) {
          if(child.getAttribute('selected') === '') {
            child.removeAttribute('selected')
          }
          if(child.textContent === e.target.value) {
            child.setAttribute('selected','')
          }
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
}

const loadReferenceMaterial = async () => {
  try {
    let data = await getData('reference_materials_list')
    let total = document.querySelectorAll('[data-reference-materials]').length
    let selectContent = ''
    data.data.forEach(referenceMaterial => {
      selectContent += `<option value="${referenceMaterial.chemical_name}">${referenceMaterial.chemical_name}</option>`
    })
    document.querySelector('#referenceMaterialSelect').innerHTML = ''
    document.querySelector('#referenceMaterialSelect').innerHTML += `
      <select id=referenceMaterialSelect${total+1} class="form-select" aria-label="Reference Material" data-reference-materials>
        <option selected>Choose Reference Material</option>
        ${selectContent}
      </select>`
    document.querySelectorAll('[data-reference-materials]').forEach(select => {
      select?.addEventListener('input',e => {
        for(const child of e.target.children) {
          if(child.getAttribute('selected') === '') {
            child.removeAttribute('selected')
          }
          if(child.textContent === e.target.value) {
            child.setAttribute('selected','')
          }
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
}

export { loadItem, loadReferenceMaterial, loadReagentTable }