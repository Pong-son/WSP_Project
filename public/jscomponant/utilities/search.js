import { load_table } from './load_table.js'

let sort_by_item = '';
let sort_by = '';

const search_ftn = async (data) => {
  document.querySelector('#search_controller').innerHTML = `
  <div class="input-group">
    <select id="search_select" class="form-select">
    </select>
    <input id="search_item" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" disabled>
    <button id="search_btn" class="btn btn-success" type="button" disabled>Search</button>
    <button id="refresh_btn" class="btn btn-success" style="display: flex; align-items: center;">
      <span class="material-symbols-outlined" style="color:"white";">refresh</span>
    </button>
  </div>
  `

  // generate select content to search
  let search_by = []
  document.querySelectorAll('[data-arrow]').forEach(title => {
    search_by.push(title.getAttribute('data-arrow'))
  })
  let search_select = document.querySelector('#search_select')
  search_select.innerHTML = '<option selected>- Search By -</option>'
  for(let i = 0; i < search_by.length; i++) {
    if(search_by[i] === 'created_at' || search_by[i] === 'updated_at' || search_by[i] === 'password' || search_by[i] === 'admin') {
      search_select
    } else {
      search_select.innerHTML += `<option value='${search_by[i]}'>${search_by[i]}</option>`
    }
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
    }
  })
  
  document.querySelector('#search_btn')?.addEventListener('click', () => {
    let search_select = document.querySelector('#search_select').value
    let search_item = document.querySelector('#search_item').value
    sort_by_item = search_select
    sort_by = typeof search_item === 'number'?search_item:search_item.toLowerCase()
    load_table()
  })
  
  document.querySelector('#refresh_btn')?.addEventListener('click', () => {
    sort_by_item = ''
    sort_by = ''
    load_table()
  })
}

const search = (data, sort_by_item, sort_by) => {
  let new_array = []
  if(sort_by_item && sort_by) {
    new_array = data.filter(item =>
      (typeof item[sort_by_item] === 'string')?
        item[sort_by_item].toLowerCase().includes(sort_by):
        item[sort_by_item].toString().includes(sort_by)
    )
  }
  return new_array
}

export { search_ftn, search, sort_by_item, sort_by }
