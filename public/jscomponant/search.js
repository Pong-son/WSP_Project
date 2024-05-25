import { load_table } from './load_table.js'

let sort_by_item = '';
let sort_by = '';

const search_ftn = async () => {
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
    document.querySelector('#search_item').value = ''
    document.querySelector('#search_item').setAttribute('disabled','')
    load_table()
  })
}

export { search_ftn, sort_by_item, sort_by }
