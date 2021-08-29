// load js files for bootstrap
const bs_alert = require('../node_modules/bootstrap/js/src/alert')
const bs_base_cp = require('../node_modules/bootstrap/js/src/base-component')
const bs_btn = require('../node_modules/bootstrap/js/src/button')
const bs_dropdown = require('../node_modules/bootstrap/js/src/dropdown')
const bs_modal = require('../node_modules/bootstrap/js/src/modal')
const bs_offcanvas = require('../node_modules/bootstrap/js/src/offcanvas')
const bs_tab = require('../node_modules/bootstrap/js/src/tab')
// load pre-defined js files 
const ajax = require('./ajax')
const todo = require('./todo')
const member = require('./member')

$(function () {
  console.log('document loaded completely')
  // if page reloaded, read session state
  ajax.OperationByAjax('general', 'reload-get-session')

  todo.initTodoAllEventListener()
  member.initMemberAllEventListener()

  // RWD at width@450px 
  // switch navbar to offcanva style
  // use filter icon to replace filter dropdown buttons
  var mql_450px = window.matchMedia("(max-width: 450px)")
  if (mql_450px.matches) {
    $('.nav-button-block').toggleClass('d-none')
    $('.nav-offcanvas-block').toggleClass('d-none')
    $('.dropdown-btn-block').toggleClass('d-none')
    $('.filter-icon').toggleClass('d-none')
  }
  
  mql_450px.addEventListener('change', (e) => {
    if (e.matches) {
      $('.nav-button-block').toggleClass('d-none')
      $('.nav-offcanvas-block').toggleClass('d-none')
      $('.dropdown-btn-block').toggleClass('d-none')
      $('.filter-icon').toggleClass('d-none')
    } else {
      $('.nav-button-block').toggleClass('d-none')
      $('.nav-offcanvas-block').toggleClass('d-none')
      $('.dropdown-btn-block').toggleClass('d-none')
      $('.filter-icon').toggleClass('d-none')
    }
  })

  // RWD at width@380px
  // make .btn-store-on-db & .btn-clear-todo full width
  var mql_380px = window.matchMedia("(max-width: 380px)")
  if (mql_380px.matches) {
    $('.btn-store-on-db').toggleClass('me-3')
    $('.btn-store-on-db').toggleClass('mb-3')
    $('.btn-store-on-db').toggleClass('w-100')
    $('.btn-clear-todo').toggleClass('w-100')
  }

  mql_380px.addEventListener('change', (e) => {
    if (e.matches) {
      $('.btn-store-on-db').toggleClass('me-3')
      $('.btn-store-on-db').toggleClass('mb-3')
      $('.btn-store-on-db').toggleClass('w-100')
      $('.btn-clear-todo').toggleClass('w-100')
    } else {
      $('.btn-store-on-db').toggleClass('me-3')
      $('.btn-store-on-db').toggleClass('mb-3')
      $('.btn-store-on-db').toggleClass('w-100')
      $('.btn-clear-todo').toggleClass('w-100')
    }
  })
})