import './jscomponant/navbar.js'
import './jscomponant/login.js'
import { checkLogin } from './jscomponant/login.js'
import './jscomponant/useful_link.js'
import './jscomponant/notice_board.js'
import './jscomponant/calibration_period.js'
import './jscomponant/suppliers.js'
import './jscomponant/reference_materials.js'
import './jscomponant/sample_info.js'
import './jscomponant/testing_item.js'
import './jscomponant/equipment.js'
import './jscomponant/orders.js'
import './jscomponant/reagent.js'
import './jscomponant/admin.js'
import { load_table } from './jscomponant/load_table.js'
import { search_ftn } from './jscomponant/search.js'

window.onload = async () => {
	checkLogin()
	search_ftn()
	load_table()
}