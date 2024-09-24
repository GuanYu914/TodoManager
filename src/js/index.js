// load js files for bootstrap
const bs_alert = require('../../node_modules/bootstrap/js/src/alert');
const bs_base_cp = require('../../node_modules/bootstrap/js/src/base-component');
const bs_btn = require('../../node_modules/bootstrap/js/src/button');
const bs_dropdown = require('../../node_modules/bootstrap/js/src/dropdown');
const bs_modal = require('../../node_modules/bootstrap/js/src/modal');
const bs_offcanvas = require('../../node_modules/bootstrap/js/src/offcanvas');
const bs_tab = require('../../node_modules/bootstrap/js/src/tab');
// load pre-defined js files
const { OperationByAjax } = require('./ajax');
const { initTodoAllEventListener } = require('./todo');
const { initMemberAllEventListener } = require('./member');
import '../css/index.css';
import '../css/theme.scss';

$(function () {
  console.log('document loaded completely');
  console.log('process.env.SERVER_URL', process.env.SERVER_URL);
  // if page reloaded, read session state
  OperationByAjax('general', 'reload-get-session');
  // open introduction modal
  $('#introductionModal').modal('show');

  initTodoAllEventListener();
  initMemberAllEventListener();

  // RWD at width@580px
  // switch navbar to offcanva style
  var mql_580px = window.matchMedia('(max-width: 580px)');
  if (mql_580px.matches) {
    $('.nav-button-block').toggleClass('d-none');
    $('.nav-offcanvas-block').toggleClass('d-none');
  }

  mql_580px.addEventListener('change', (e) => {
    if (e.matches) {
      $('.nav-button-block').toggleClass('d-none');
      $('.nav-offcanvas-block').toggleClass('d-none');
    } else {
      $('.nav-button-block').toggleClass('d-none');
      $('.nav-offcanvas-block').toggleClass('d-none');
    }
  });

  // RWD at width@450px
  // use filter icon to replace filter dropdown buttons
  var mql_450px = window.matchMedia('(max-width: 450px)');
  if (mql_450px.matches) {
    $('.dropdown-btn-block').toggleClass('d-none');
    $('.filter-icon').toggleClass('d-none');
    $('footer').toggleClass('position-static');
    $('footer').toggleClass('position-fixed');
    $('footer').toggleClass('start-0');
    $('footer').toggleClass('end-0');
    $('footer').toggleClass('bottom-0');
  }

  mql_450px.addEventListener('change', (e) => {
    if (e.matches) {
      $('.dropdown-btn-block').toggleClass('d-none');
      $('.filter-icon').toggleClass('d-none');
      $('footer').toggleClass('position-static');
      $('footer').toggleClass('position-fixed');
      $('footer').toggleClass('start-0');
      $('footer').toggleClass('end-0');
      $('footer').toggleClass('bottom-0');
    } else {
      $('.dropdown-btn-block').toggleClass('d-none');
      $('.filter-icon').toggleClass('d-none');
      $('footer').toggleClass('position-static');
      $('footer').toggleClass('position-fixed');
      $('footer').toggleClass('start-0');
      $('footer').toggleClass('end-0');
      $('footer').toggleClass('bottom-0');
    }
  });

  // RWD at width@380px
  // make .btn-clear-todo full width
  var mql_380px = window.matchMedia('(max-width: 380px)');
  if (mql_380px.matches) {
    $('.btn-clear-todo').toggleClass('w-100');
  }

  mql_380px.addEventListener('change', (e) => {
    if (e.matches) {
      $('.btn-clear-todo').toggleClass('w-100');
    } else {
      $('.btn-clear-todo').toggleClass('w-100');
    }
  });
});
