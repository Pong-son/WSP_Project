import './theme.js'
import { checkTheme, lightDarkBtn } from './theme.js'
import { loginBtn } from './login.js'

const navBar = (login) => {
  let content = (login)?
    `<nav class="navbar navbar-expand-lg text-bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand text-light" href="/">E & M</a>
        <button id="navBarToggle" class="navbar-toggler bg-primary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active text-light" aria-current="page" href="/">Home</a>
            </li>
            <li class="nav-item dropdown" data-user>
              <a class="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Chemical
              </a>
              <ul class="dropdown-menu text-bg-primary">
                <li><a class="dropdown-item text-light" href="/reagent">Reagent</a></li>
                <li><a class="dropdown-item text-light" href="/reference_materials">Reference Material</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown" data-user>
              <a class="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Equipment
              </a>
              <ul class="dropdown-menu text-bg-primary">
                <li><a class="dropdown-item text-light" href="/equipment">Equipment List</a></li>
                <li><a class="dropdown-item text-light" href="/calibration_period">Calibration Period</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown" data-user>
              <a class="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Service
              </a>
              <ul class="dropdown-menu text-bg-primary">
                <li><a class="dropdown-item text-light" href="/sample_info">Sample Record</a></li>
                <li><a class="dropdown-item text-light" href="/testing_item">Testing Item</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown" data-user>
              <a class="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Supplier
              </a>
              <ul class="dropdown-menu text-bg-primary">
                <li><a class="dropdown-item text-light" href="/suppliers">Supplier List</a></li>
                <li><a class="dropdown-item text-light" href="/orders">Purchase Order</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link text-light" href="/admin" data-admin>User Management</a>
            </li>
          </ul>
          <div class="d-flex">
            <span type="button" class="btn material-symbols-outlined fs-2 text-light" id="lightDarkBtn" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Change the Theme">
              toggle_off
            </span>
            <a href="/"><button type="button" id="loginBtn" class="btn btn-success text-light" data-bs-toggle="modal" data-bs-target="#loginModal"></button></a>
          </div>
        </div>
      </div>
    </nav>` : `
    <nav class="navbar navbar-expand-lg text-bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand text-light" href="/">E & M</a>
        <button id="navBarToggle" class="navbar-toggler bg-primary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active text-light" aria-current="page" href="/">Home</a>
            </li>
          </ul>
          <div class="d-flex">
            <span type="button" class="btn material-symbols-outlined fs-2 text-light" id="lightDarkBtn" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Change the Theme">
              toggle_off
            </span>
            <button type="button" id="loginBtn" class="btn btn-success text-light" data-bs-toggle="modal" data-bs-target="#loginModal"></button>
          </div>
        </div>
      </div>
    </nav>`
  document.querySelector('#navBar').innerHTML = content

  loginBtn()
  lightDarkBtn()
  checkTheme()
}

export { navBar }