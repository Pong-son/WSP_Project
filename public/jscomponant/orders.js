import { getData } from './get_data.js'
import { pagination } from './pagination.js'
import { sort_by_item, sort_by } from'./search.js';

let orders_table = document.querySelector('#orders_table')
// fixed variable
let each_page_show = Number(document.querySelector('#each_page_show')?.value);
let current_page = 1;
let order_by = 'id';
let order_by_ascending = true;
let data = {};
let data_in_table = [];

let path = window.location.pathname
if(path === '/orders') {
  document.querySelectorAll('.form-control').forEach(item => {
    item.addEventListener('change',() => {
        let companySelect = document.querySelector('#companySelect')
        let order_no = document.querySelector('#order_no')
        let product = document.querySelector('#product')
        let price = document.querySelector('#price')
        let confirm_date = document.querySelector('#confirm_date')
        if (companySelect.value !== 'Choose Company' && order_no.value !== '' && product.value !== '' && price.value !== '' && confirm_date.value !== '') {
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
      let companySelect = document.querySelector('#companySelect')
      let order_no = document.querySelector('#order_no')
      let product = document.querySelector('#product')
      let price = document.querySelector('#price')
      let confirm_date = document.querySelector('#confirm_date')
      if (companySelect.value !== 'Choose Company' && order_no.value !== '' && product.value !== '' && price.value !== '' && confirm_date.value !== '') {
        document.querySelector('#submit_btn').removeAttribute('disabled')
        document.querySelector('#warn_notice').textContent = ''
      } else {
        document.querySelector('#submit_btn').setAttribute('disabled','')
        document.querySelector('#warn_notice').textContent = 'Fill in all the information!'
      }
    })
  })

  document.querySelector('#reset_btn').addEventListener('click', () => {
    document.querySelector('#companySelect').innerHTML = ''
    loadOrder()
    document.querySelector('#order_no').value = ''
    document.querySelector('#product').value = ''
    document.querySelector('#price').value = ''
    document.querySelector('#confirm_date').value = ''
    document.querySelector('#warn_notice').textContent = ''
    document.querySelector('#submit_btn').setAttribute('disabled','')
  })
}

// add new data
document
	.querySelector('#orderForm')
	?.addEventListener('submit', async (event) => {
		event.preventDefault() // To prevent the form from submitting synchronously
    const form = event.target
    if (form.companySelect.value === 'Choose Company') {
      alert('Please choose Company')
    } else {
      let name = form.companySelect.value
      let order_no = form.order_no.value
      let product = form.product.value
      let price = form.price.value
      let confirm_date = form.confirm_date.value
      let username = window.sessionStorage.getItem('username')
      
      const res = await fetch('/orders_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          order_no: order_no,
          product: product,
          price: price,
          confirm_date: confirm_date,
          username: username
        })
      })
      const result = await res.json()

      document.querySelector('#companySelect').value = ''
      document.querySelector('#product').value = ''
      document.querySelector('#price').value = ''
      document.querySelector('#confirm_date').value = ''
      loadOrder()
      loadOrderTable()
    }
	});

const delFtn = async (e) => {
  await fetch(`/orders_list${e.target.getAttribute('data-delete')}`, {
    method: 'DELETE'
  })
  loadOrderTable()
}

const editFtn = async (e) => {
  const currentTarget = e.target.getAttribute('data-done')
  
  const name = document.querySelector(`[data-company-name="${currentTarget}"]`).value
  const order_no = document.querySelector(`[data-order-no="${currentTarget}"]`).value
  const product = document.querySelector(`[data-product="${currentTarget}"]`).value
  const price = document.querySelector(`[data-price="${currentTarget}"]`).value
  const confirm_date = document.querySelector(`[data-confirm-date="${currentTarget}"]`).value
  const username = document.querySelector(`[data-prepare-by="${currentTarget}"]`).value
  await fetch(`/orders_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      name: name,
      order_no: order_no,
      product: product,
      price: price,
      confirm_date: confirm_date,
      username: username
    })
  })
  loadOrderTable()
}

document.querySelector('#each_page_show')?.addEventListener('input', () => {
  each_page_show = Number(document.querySelector('#each_page_show').value)
  document.querySelector('#each_page_show').blur()
  console.log(each_page_show)
  loadOrderTable()
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
  if (path === '/orders') {
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
      loadOrderTable()
    })
  }
})

const loadOrderTable = async () => {
  try {
    if (window.location.pathname === '/orders') {

      data = await getData(`orders_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)
  
      let start = (current_page - 1) * each_page_show
      let end = start + each_page_show
      
      data_in_table = data.data?.slice(start, end)
  
      pagination(data.no_of_page)
      check_page_status(data)
      
      document.querySelector('[data-pre]')?.addEventListener('click',() => {
        current_page = current_page - 1
        loadOrderTable()
      })
      document.querySelector('[aria-label="Next"]')?.addEventListener('click',() => {
        current_page = current_page + 1
        loadOrderTable()
      })
      // generate table'
      if(data.data?.length === undefined || data.data?.length === 0) {
        let no_of_col = document.querySelectorAll('th').length
        orders_table.innerHTML = ''
        orders_table.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
      } else {
        orders_table.innerHTML = ''
        data_in_table.forEach( order => {
          let date = new Date(order.confirm_date).getDate()
          date < 10? date = '0'+date:date
          let month = new Date(order.confirm_date).getMonth()+1
          month < 10? month = '0'+month:month
          let year = new Date(order.confirm_date).getFullYear()
          let confirm_date = `${year}-${month}-${date}`
  
          orders_table.innerHTML += `<tr id=${order.id}><th scope="row">${order.id}</th>
          <td><select disabled id=${order.company_name} class="form-select" aria-label="Default Company Name" data-company-name=${order.id}></select></td>
          <td><input disabled type='text' data-order-no="${order.id}" value=${order.order_no}></td>
          <td><input disabled type='text' data-product="${order.id}" value=${order.product}></td>
          <td><input disabled type='number' data-price="${order.id}" value=${order.price}></td>
          <td><input disabled type='date' data-confirm-date="${order.id}" value=${confirm_date}></td>
          <td><input disabled type='text' data-prepare-by="${order.id}" value=${order.username}></td>
          <td>
          <button data-edit="${order.id}">Edit</button>
          <button data-done="${order.id}" class="hide">Done</button>
          <button data-cancel="${order.id}" class="hide">Cancel</button>
          </td>
          <td>
          <button data-delete=${order.id}>Delete</button>
          </td>
          </tr>`
        })
      }
  
      let supplier_data = await getData('suppliers_list')
      document.querySelectorAll('[data-company-name]').forEach(company => {
        company.innerHTML = ''
        let selectContent = ''
        supplier_data.data.forEach(supplier => {
          if (supplier.company_name === company.getAttribute('id')) {
            selectContent += `<option selected value="${supplier.company_name}">${supplier.company_name}</option>`
          } else {
            selectContent += `<option value="${supplier.company_name}">${supplier.company_name}</option>`
          }
        })
        company.innerHTML += `${selectContent}`
      })
      // controller for the and delete btn
      document.querySelectorAll('[data-edit]')?.forEach(edit => {
        if (window.sessionStorage.getItem('admin')) {
          edit.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-edit')
            document.querySelector(`[data-company-name="${target}"]`).removeAttribute("disabled")
            document.querySelector(`[data-order-no="${target}"]`).removeAttribute("disabled")
            document.querySelector(`[data-product="${target}"]`).removeAttribute("disabled")
            document.querySelector(`[data-confirm-date="${target}"]`).removeAttribute("disabled")
            document.querySelector(`[data-prepare-by="${target}"]`).removeAttribute("disabled")
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
          document.querySelector(`[data-order-no="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-product="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-confirm-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-prepare-by="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-cancel]')?.forEach(cancel => {
        cancel.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-cancel')
          document.querySelector(`[data-company-name="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-order-no="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-product="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-confirm-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-prepare-by="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-page]')?.forEach(page => {
        page.addEventListener('click',async e => {
          const page = e.target.getAttribute('data-page')
          current_page = page
          loadOrderTable()
        })
      })
  
      // generate select content to search
      if(data.data?.length !== undefined && data.data?.length !== 0) {
        let search_select = document.querySelector('#search_select')
        search_select.innerHTML = '<option selected>- Search By -</option>'
        let item = Object?.keys(data.data[0])
        for(let i = 0; i < item.length; i++) {
          search_select.innerHTML += `<option value='${item[i]}'>${item[i]}</option>`
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}


const loadOrder = async () => {
  try {
    data = await getData('suppliers_list')
    document.querySelector('#companySelect').innerHTML = ''
    let selectContent = ''
    data.data.forEach(supplier => {
      selectContent += `<option value="${supplier.company_name}">${supplier.company_name}</option>`
    })
    document.querySelector('#companySelect').innerHTML += `
        <option selected>Choose Company</option>
        ${selectContent}`
    checkNoOfSelect()
  } catch (e) {
    console.log(e)
  }
}

const checkNoOfSelect = () => {
  document.querySelector('[data-company]')?.addEventListener('input',e => {
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

export { loadOrder, loadOrderTable }