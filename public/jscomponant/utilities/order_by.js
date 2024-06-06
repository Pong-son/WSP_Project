import { load_table } from "./load_table.js";

let order_by = 'id';
let order_by_ascending = true;

document.querySelectorAll('[data-th]').forEach(title => {
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
    load_table()
  })
})

export { order_by, order_by_ascending }