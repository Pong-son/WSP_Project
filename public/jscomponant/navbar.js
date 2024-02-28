document.querySelector('#navBar').innerHTML = `
  <nav class="navbar navbar-expand-lg text-bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">E & M</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Home</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Chemical
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Reagent</a></li>
              <li><a class="dropdown-item" href="/rm">Reference Material</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Equipment
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/equipment">Equipment List</a></li>
              <li><a class="dropdown-item" href="/cal_period">Calibration Period</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Service
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Sample Record</a></li>
              <li><a class="dropdown-item" href="#">Testing Item</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Supplier
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/supplier">Supplier List</a></li>
              <li><a class="dropdown-item" href="/purchase_order">Purchase Order</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
          </li>
        </ul>
        <div class="d-flex">
          <!-- <div id="logoutBtn" class="" ></div> -->
          <button type="button" id="loginBtn" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#loginModal"></button>
        </div>
      </div>
    </div>
  </nav>`