import { getData } from './get_data.js'
import { loadUsefulLinkTable } from '../useful_link.js'
import { loadNotice } from '../notice_board.js'
import { loadCalTable } from '../calibration_period.js'
import { loadSupplierTable } from '../suppliers.js'
import { loadReferenceMaterialsTable } from '../reference_materials.js'
import { loadTestingItem, loadSampleTable } from '../sample_info.js'
import { loadTestingItemTable } from '../testing_item.js'
import { loadEquipment, loadEquipmentTable } from '../equipment.js'
import { loadOrder, loadOrderTable } from '../orders.js'
import { loadItem, loadReferenceMaterial, loadReagentTable } from '../reagent.js'
import { loadUsersTable } from '../admin.js'

const load_table = async () => {
  let path = window.location.pathname
  if(path === '/') {
    let login = await getData(`isuser`)
    if(login) {
      loadUsefulLinkTable()
      loadNotice()
    }
  }
  if(path === '/calibration_period') {
    loadCalTable()
  }
  if (path === '/suppliers') {
    loadSupplierTable()
  }
  if (path === '/reference_materials') {
    loadReferenceMaterialsTable()
  }
  if (path === '/testing_item') {
    loadTestingItemTable()
  }
  if (path === '/sample_info') {
    loadTestingItem()
    loadSampleTable()
  }
  if (path === '/equipment') {
    loadEquipmentTable()
    loadEquipment()
  }
  if (path === '/orders') {
    loadOrder()
    loadOrderTable()
  }
  if (path === '/reagent') {
    loadItem()
    loadReferenceMaterial()
    loadReagentTable()
  }
  if (path === '/admin') {
    loadUsersTable()
  }
}

export { load_table }