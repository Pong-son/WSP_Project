import { getData } from './utilities/get_data.js'
import { check_page_status, each_page_show, pagination, current_page } from './utilities/pagination.js'
import { search_ftn, search, sort_by_item, sort_by } from'./utilities/search.js';
import { order_by, order_by_ascending } from './utilities/order_by.js'

let orders_table = document.querySelector('#orders_table')

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
      let order_by = form.order_by.value?form.order_by.value:window.sessionStorage.getItem('username')
      
      const res = await fetch('/orders_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.replaceAll(' ','_'),
          order_no: order_no,
          product: product.replaceAll(' ','_'),
          price: price,
          confirm_date: confirm_date,
          order_by: order_by
        })
      })
      const result = await res.json()

      document.querySelector('#companySelect').value = ''
      document.querySelector('#product').value = ''
      document.querySelector('#price').value = ''
      document.querySelector('#confirm_date').value = ''
      document.querySelector('#order_by').value = ''
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
  const order_by = document.querySelector(`[data-order-by="${currentTarget}"]`).value
  await fetch(`/orders_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      name: name.replaceAll(' ','_'),
      order_no: order_no,
      product: product.replaceAll(' ','_'),
      price: price,
      confirm_date: confirm_date,
      order_by: order_by
    })
  })
  loadOrderTable()
}

const loadOrderTable = async () => {
  try {
    if (window.location.pathname === '/orders') {

      data = await getData(`orders_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}`)
      // &sort_by_item=${sort_by_item}&sort_by=${sort_by}
  
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
          <td><input disabled type='text' data-order-by="${order.id}" value=${order.order_by}></td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-edit="${order.id}">Edit</button>
            <button data-done="${order.id}" class="hide">Done</button>
            <button data-cancel="${order.id}" class="hide">Cancel</button>
          </td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
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
        edit.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-edit')
          document.querySelector(`[data-company-name="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-order-no="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-product="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-price="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-confirm-date="${target}"]`).removeAttribute("disabled")
          document.querySelector(`[data-order-by="${target}"]`).removeAttribute("disabled")
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
          document.querySelector(`[data-order-no="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-product="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-price="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-confirm-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-order-by="${target}"]`).setAttribute("disabled","")
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
          document.querySelector(`[data-price="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-confirm-date="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-order-by="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      
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