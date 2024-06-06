import { getData } from './utilities/get_data.js'
import { check_page_status, each_page_show, pagination, current_page } from './utilities/pagination.js'
import { search_ftn, search, sort_by_item, sort_by } from'./utilities/search.js';
import { order_by, order_by_ascending } from './utilities/order_by.js'

let sample_info_table = document.querySelector('#sample_info_table')

let data = {};
let data_in_table = [];

let path = window.location.pathname
if(path === '/sample_info') {
  document.querySelectorAll('.form-control').forEach(item => {
    item.addEventListener('change',() => {
      let sample_receive_date = document.querySelector('#sample_receive_date')
      let analysis_date = document.querySelector('#analysis_date')
      let itemSelect = true
      document.querySelectorAll('.form-select').forEach(item => {
        if(itemSelect) {
          if(item.value === 'Choose Testing Item') {
            itemSelect = false
          } else {
            itemSelect = true
          }
        }
      })
      if (sample_receive_date.value !== '' && analysis_date.value !== '' && itemSelect) {
        document.querySelector('#submit_btn').removeAttribute('disabled')
        document.querySelector('#warn_notice').textContent = ''
      } else {
        document.querySelector('#submit_btn').setAttribute('disabled','')
        document.querySelector('#warn_notice').textContent = 'Fill in all the information!'
      }
    })
  })

  document.querySelector('#add_new_btn').addEventListener('click',() => {
    selectChange()
  })

  document.querySelector('#reset_btn').addEventListener('click', () => {
    let no_of_item = document.querySelectorAll('[data-testing-item]').length
    document.querySelector('#sample_receive_date').value = ''
    document.querySelector('#analysis_date').value = ''
    document.querySelector('#itemSelect').innerHTML = ''
    for(let i = 0;i < no_of_item; i++) {
      loadTestingItem()
    }
    document.querySelector('#warn_notice').textContent = ''
    document.querySelector('#submit_btn').setAttribute('disabled','')
  })
}

// add change ftn for select
const selectChange = () => {
  document.querySelectorAll('.form-select').forEach(item => {
    item.addEventListener('change',() => {
      let sample_receive_date = document.querySelector('#sample_receive_date')
      let analysis_date = document.querySelector('#analysis_date')
      let itemSelect = true
      document.querySelectorAll('[data-testing-item]').forEach(item => {
        if(itemSelect) {
          if(item.value === 'Choose Testing Item') {
            itemSelect = false
          } else {
            itemSelect = true
          }
        }
      })
      if (sample_receive_date.value !== '' && analysis_date.value !== '' && itemSelect) {
        document.querySelector('#submit_btn').removeAttribute('disabled')
        document.querySelector('#warn_notice').textContent = ''
      } else {
        document.querySelector('#submit_btn').setAttribute('disabled','')
        document.querySelector('#warn_notice').textContent = 'Fill in all the information!'
      }
    })
  })
}

// add new data
document
	.querySelector('#sampleInfoForm')
	?.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
    const form = event.target
		
    let items = []
    // let totalItem = document.querySelectorAll('[data-testing-item]').length
    document.querySelectorAll('[data-testing-item]')?.forEach(item => {
      items.push(item.value)
    })
    
		let sample_receive_date = form.sample_receive_date.value
		let analysis_date = form.analysis_date.value
    
		const res = await fetch('/sample_info_list', {
      method: 'POST',
			headers: {
        'Content-Type': 'application/json'
			},
			body: JSON.stringify({
        sample_receive_date: sample_receive_date,
				analysis_date: analysis_date,
        items: items
			})
		})
		const result = await res.json()

		document.querySelector('#sample_receive_date').value = ''
		document.querySelector('#analysis_date').value = ''
		document.querySelector('#itemSelect').innerHTML = ''
  
    loadTestingItem()
    loadSampleTable()
  });

const loadSampleTable = async () => {
  try {
    if (window.location.pathname === '/sample_info') {
      data = await getData(`sample_info_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)
  
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
        sample_info_table.innerHTML = ''
        sample_info_table.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
      } else {
        sample_info_table.innerHTML = ''
        data_in_table.forEach( sample => {
          let receive_hour = new Date(sample.sample_receive_date).getHours()
          receive_hour < 10? receive_hour = '0'+receive_hour:receive_hour
          let receive_minute = new Date(sample.sample_receive_date).getMinutes()
          receive_minute < 10? receive_minute = '0'+receive_minute:receive_minute
          let receive_date = new Date(sample.sample_receive_date).getDate()
          receive_date < 10? receive_date = '0'+receive_date:receive_date
          let receive_month = new Date(sample.sample_receive_date).getMonth()+1
          receive_month < 10? receive_month = '0'+receive_month:receive_month
          let receive_year = new Date(sample.sample_receive_date).getFullYear()
  
  
          let sample_receive_date = `${receive_year}-${receive_month}-${receive_date}T${receive_hour}:${receive_minute}`
  
          let analysis_hour = new Date(sample.analysis_date).getHours()
          analysis_hour < 10? analysis_hour = '0'+analysis_hour:analysis_hour
          let analysis_minute = new Date(sample.analysis_date).getMinutes()
          analysis_minute < 10? analysis_minute = '0'+analysis_minute:analysis_minute
          let analysis_date = new Date(sample.analysis_date).getDate()
          analysis_date < 10? analysis_date = '0'+analysis_date:analysis_date
          let analysis_month = new Date(sample.analysis_date).getMonth()+1
          analysis_month < 10? analysis_month = '0'+analysis_month:analysis_month
          let analysis_year = new Date(sample.analysis_date).getFullYear()
  
  
          let sample_analysis_date = `${analysis_year}-${analysis_month}-${analysis_date}T${analysis_hour}:${analysis_minute}`
  
          sample_info_table.innerHTML += `<tr id=${sample.id}><th scope="row">${sample.id}</th>
          <td>
            <input disabled type='datetime-local' data-sample-receive-date="${sample.id}" value=${sample_receive_date}>
          </td>
          <td>
            <input disabled type='datetime-local' data-analysis-date="${sample.id}" value=${sample_analysis_date}>
          </td>
          <td>
            <select disabled type='text' id=${sample.name} data-name="${sample.id}" value=${sample.name}></select>
          </td>
          <td>
            <input disabled type='text' data-batch-id="${sample.id}" value=${sample.batch_id}>
          </td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-edit="${sample.id}">Edit</button>
            <button data-done="${sample.id}" class="hide">Done</button>
            <button data-cancel="${sample.id}" class="hide">Cancel</button>
          </td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-delete=${sample.id}>Delete</button>
          </td>
          </tr>`
        })
      }
  
      let testing_item_data = await getData('testing_item_list')
      document.querySelectorAll('[data-name]').forEach(item => {
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
      // controller for the and delete btn
      document.querySelectorAll('[data-edit]')?.forEach(edit => {
        edit.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-edit')
          document.querySelector(`[data-sample-receive-date="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-analysis-date="${target}"]`).removeAttribute("disabled")
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
          document.querySelector(`[data-sample-receive-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-analysis-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-cancel]')?.forEach(cancel => {
        cancel.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-cancel')
          document.querySelector(`[data-sample-receive-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-analysis-date="${target}"]`).setAttribute("disabled","")
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
  await fetch(`/sample_info_list${e.target.getAttribute('data-delete')}`, {
    method: 'DELETE'
  })
  loadSampleTable()
}

const editFtn = async (e) => {
  const currentTarget = e.target.getAttribute('data-done')
  
  const sample_receive_date = document.querySelector(`[data-sample-receive-date="${currentTarget}"]`).value
  const analysis_date = document.querySelector(`[data-analysis-date="${currentTarget}"]`).value
  const name = document.querySelector(`[data-name="${currentTarget}"]`).value
  await fetch(`/sample_info_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      sample_receive_date: sample_receive_date,
      analysis_date: analysis_date,
      name: name
    })
  })
  loadSampleTable()
}

document.querySelector('#addBtn')?.addEventListener('click',async ()=>{
  let data = await getData('testing_item_list')
  let total = document.querySelectorAll('[data-testing-item]').length
  let selectContent = ''
  data.data.forEach(itemName => {
    selectContent += `<option value="${itemName.name}">${itemName.name}</option>`
  })
  document.querySelector('#itemSelect').innerHTML += `
    <select id=itemSelect${total+1} class="form-select" aria-label="Default Testing Item" data-testing-item>
      <option selected>Choose Testing Item</option>
      ${selectContent}
    </select>`
  checkNoOfSelect()
  selectChange()
})

document.querySelector('#reduceBtn')?.addEventListener('click',async ()=>{
  let total = document.querySelectorAll('[data-testing-item]').length
  if(total > 1) {
    document.querySelector(`#itemSelect${total}`)?.remove()
  }
  checkNoOfSelect()
  selectChange()
})

const loadTestingItem = async () => {
  try {
    let data = await getData('testing_item_list')
    let total = document.querySelectorAll('[data-testing-item]').length
    let selectContent = ''
    data.data.forEach(itemName => {
      selectContent += `<option value="${itemName.name}">${itemName.name}</option>`
    })
    document.querySelector('#itemSelect').innerHTML += `
      <select id=itemSelect${total+1} class="form-select" aria-label="Default Testing Item" data-testing-item>
        <option selected>Choose Testing Item</option>
        ${selectContent}
      </select>`
    checkNoOfSelect()
  } catch (e) {
    console.log(e)
  }
}

const checkNoOfSelect = () => {
  let total = document.querySelectorAll('[data-testing-item]').length
  if (total > 1 && document.querySelector('#reduceBtn').getAttribute('disabled') === '') {
    document.querySelector('#reduceBtn').removeAttribute('disabled')
  } else if ( total === 1 ) {
    document.querySelector('#reduceBtn').setAttribute('disabled','')
  }

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
}

export { loadTestingItem, loadSampleTable }