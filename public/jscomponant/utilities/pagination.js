import { load_table } from "./load_table.js";

let current_page = 1;
let each_page_show = Number(document.querySelector('#each_page_show')?.value);

const pagination = async (no_of_page) => {
  // for pagination
  let paginationController = document.querySelector('.pagination')
  let page_no = ''
  for(let i = 1;i <= no_of_page ;i++){
    page_no += `<li class="page-item"><a class="page-link" data-page=${i}>${i}</a></li>`
  }
  paginationController.innerHTML = `
  <li class="page-item">
  <a class="page-link" aria-label="Previous" data-pre>
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>
  ${page_no}
  <li class="page-item">
    <a class="page-link" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
    </li>
  `
  document.querySelector('[data-pre]')?.addEventListener('click',() => {
    current_page = Number(current_page) - 1
    load_table()
  })
  document.querySelector('[aria-label="Next"]')?.addEventListener('click',() => {
    current_page = Number(current_page) + 1
    load_table()
  })
  document.querySelectorAll('[data-page]')?.forEach(page => {
    page.addEventListener('click',async e => {
      const page = e.target.getAttribute('data-page')
      current_page = page
      load_table()
    })
  })
}

const check_page_status = (data) => {
  document.querySelector('#each_page_show')?.addEventListener('input', () => {
    each_page_show = Number(document.querySelector('#each_page_show').value)
    document.querySelector('#each_page_show').blur()
    current_page = 1
    load_table()
  })

  let pre_btn = document.querySelector('[aria-label="Previous"]')
  let next_btn = document.querySelector('[aria-label="Next"]')
  document.querySelector(`[data-page="${current_page}"]`)?.classList.add('disabled')
  data.current_page === 1?pre_btn.classList.add('disabled'):pre_btn.classList.remove('disabled')
  data.current_page === data.no_of_page?next_btn.classList.add('disabled'):next_btn.classList.remove('disabled')
}

export { check_page_status, each_page_show, pagination, current_page }