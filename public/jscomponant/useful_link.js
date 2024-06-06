import { getData } from './utilities/get_data.js'
import { check_page_status, each_page_show, pagination, current_page } from './utilities/pagination.js'
import { search_ftn, search, sort_by_item, sort_by } from'./utilities/search.js';
import { order_by, order_by_ascending } from './utilities/order_by.js'

let useful_link_table = document.querySelector('#useful_link')

let data = {};
let data_in_table = [];

let path = window.location.pathname
let login = window.sessionStorage.getItem('username')
if(path === '/' && login) {
  document.querySelectorAll('.form-control').forEach(item => {
    item.addEventListener('change',() => {
        let title = document.querySelector('#title')
        let link = document.querySelector('#link')
        let used_for = document.querySelector('#used_for')
        if (title.value !== '' && link.value !== '' && used_for.value !== '') {
          document.querySelector('#submit_btn').removeAttribute('disabled')
          document.querySelector('#warn_notice').textContent = ''
        } else {
          document.querySelector('#submit_btn').setAttribute('disabled','')
          document.querySelector('#warn_notice').textContent = 'Fill in all the information!'
        }
      })
  })

  document.querySelector('#reset_btn').addEventListener('click', () => {
    document.querySelector('#title').value = ''
    document.querySelector('#link').value = ''
    document.querySelector('#used_for').value = ''
    document.querySelector('#warn_notice').textContent = ''
    document.querySelector('#submit_btn').setAttribute('disabled','')
  })
}

// add new data
document
  .querySelector('#useful_link_form')
  ?.addEventListener('submit', async (event) => {
    event.preventDefault() // To prevent the form from submitting synchronously
    const form = event.target
    let title = (form.title.value).replaceAll(' ','_')
    let link = form.link.value
    let used_for = (form.used_for.value).replaceAll(' ','_')
    
    const res = await fetch('/useful_link_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        link: link,
        used_for: used_for
      })
    })
    const result = await res.json()

    document.querySelector('#title').value = ''
    document.querySelector('#link').value = ''
    document.querySelector('#used_for').value = ''
    loadUsefulLinkTable()
});

const loadUsefulLinkTable = async () => {
  try {
    if (window.location.pathname === '/') {
      data = await getData(`useful_link_list?page=${current_page}&limit=${each_page_show}&order_by=${order_by}&order_by_ascending=${order_by_ascending}&sort_by_item=${sort_by_item}&sort_by=${sort_by}`)

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
        useful_link_table.innerHTML = ''
        useful_link_table.innerHTML = `<tr><th class="text-center" colspan=${no_of_col}>No DATA</th></tr>`
      } else if (window.location.pathname === '/') {
        useful_link_table.innerHTML = ''
        data_in_table.forEach( link => {
          useful_link_table.innerHTML += `<tr id=${link.id}><th scope="row">${link.id}</th>
          <td>
          <a data-web="${link.id}" href=${link.link}>${link.title}</a>
          <input class="hide" type='text' data-title="${link.id}" value=${link.title}>
          <input class="hide" type='text' data-link="${link.id}" value=${link.link}>
          </td>
          <td><input class="form-control" disabled type='text' data-used-for="${link.id}" value=${link.used_for}></td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
            <button data-edit="${link.id}">Edit</button>
            <button data-done="${link.id}" class="hide">Done</button>
            <button data-cancel="${link.id}" class="hide">Cancel</button>
          </td>
          <td class=${window.sessionStorage.getItem('admin')?'':'admin_hide'}>
          <button data-delete=${link.id}>Delete</button>
          </td>
          </tr>`
        })
      }

      // controller for the and delete btn
      document.querySelectorAll('[data-edit]')?.forEach(edit => {
        edit.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-edit')
          document.querySelector(`[data-web="${target}"]`).classList.add("hide")
          document.querySelector(`[data-title="${target}"]`).classList.remove("hide")
          document.querySelector(`[data-link="${target}"]`).classList.remove("hide")
          document.querySelector(`[data-used-for="${target}"]`).removeAttribute("disabled")
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
          document.querySelector(`[data-web="${target}"]`).classList.remove("hide")
          document.querySelector(`[data-title="${target}"]`).classList.add("hide")
          document.querySelector(`[data-link="${target}"]`).classList.add("hide")
          document.querySelector(`[data-used-for="${target}"]`).setAttribute("disabled","")
          document.querySelector(`[data-done="${target}"]`).classList.add('hide')
          document.querySelector(`[data-cancel="${target}"]`).classList.add('hide')
          document.querySelector(`[data-edit="${target}"]`).classList.remove('hide')
        })
      })
      document.querySelectorAll('[data-cancel]')?.forEach(cancel => {
        cancel.addEventListener('click', (e) => {
          const target = e.target.getAttribute('data-cancel')
          document.querySelector(`[data-web="${target}"]`).classList.remove("hide")
          document.querySelector(`[data-title="${target}"]`).classList.add("hide")
          document.querySelector(`[data-link="${target}"]`).classList.add("hide")
          document.querySelector(`[data-used-for="${target}"]`).setAttribute("disabled","")
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
  await fetch(`/useful_link_list${e.target.getAttribute('data-delete')}`, {
    method: 'DELETE'
  })
  loadUsefulLinkTable()
}

const editFtn = async (e) => {
  const currentTarget = e.target.getAttribute('data-done')
  
  const title = document.querySelector(`[data-title="${currentTarget}"]`).value
  const link = document.querySelector(`[data-link="${currentTarget}"]`).value
  const used_for = document.querySelector(`[data-used-for="${currentTarget}"]`).value
  
  await fetch(`/useful_link_list${e.target.getAttribute('data-done')}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id:currentTarget,
      title: title.replaceAll(' ','_'),
      link: link,
      used_for: used_for.replaceAll(' ','_')
    })
  })
  loadUsefulLinkTable()
}

export { loadUsefulLinkTable }