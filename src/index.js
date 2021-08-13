import css from "./index.css";
const ajax = require('./ajax')
const utils = require('./utils')
const modal  = require('./modal')

$(document).ready(() => {
  console.log('document loaded completely')
  // if page reloaded, read session state
  ajax.OperationByAjax('general', 'reload-get-session')

  // add todo list (interaction with keyboard at list-group-all tap)
  $('#input-todo-content').on('keyup', (e) => {
    // detect 'Enter' input
    if (e.key === 'Enter' || e.keyCode === 13) {
      // if input is not empty
      if ($('#input-todo-content').val() !== '') {
        // add input content to lists
        $('.list-group-all').prepend(
          `
        <div class="d-flex align-items-center list-group-item todo">
          <input class="flex-shrink-0 form-check-input pointer me-3 " type="checkbox" >
          <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p space p-2 me-2 mb-0">${utils.escapeHtml($('#input-todo-content').val())}</p>
          <img src="/img/info-lg.svg" class="flex-shrink-0 todo-info-icon pointer me-3" alt="Bootstrap-icon" width="18" height="18">
          <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
        </div>
        `
        )
        // clear input field content
        $('#input-todo-content').val('')
        // update unfinished todo counts
        utils.getUnfinishedTodos()
      } else {
        // show modal view
        modal.DisplayModal('input', 'submit', 'empty-content')
        // $('#emptyInput').modal('show')
      }
    }
  })

  // remove todo (by pressing close button at list-group-all tap)
  $('.list-group-all').on('click', '.btn-close', (e) => {
    $(e.target).parent().fadeOut('fast', () => {
      $(e.target).parent().remove()
      utils.getUnfinishedTodos()
    })
  })

  // clear all finished todos
  $('.btn-clear-todo').click(() => {
    $('.list-group-item.done').fadeOut('fast', () => {
      $('.list-group-item.done').remove()
      utils.getUnfinishedTodos()
    })
  })

  // complete todo (by pressing checkbox at list-group-all top)
  $(".list-group-all").on('click', '.form-check-input', (e) => {
    $(e.target).next().toggleClass('complete')
    $(e.target).parent().toggleClass('todo')
    $(e.target).parent().toggleClass('done')
    utils.getUnfinishedTodos()
  })

  // switch to unfinished-tab
  $('#unfinished-tab').click((e) => {
    // clear all previous records
    $('.list-group-unfinished').empty()
    // remove deletion buttons, checkboxes, img and p on every todo
    $('.list-group-all > .list-group-item.todo').clone().prependTo('.list-group-unfinished')
    $('.list-group-unfinished').find('button').remove()
    $('.list-group-unfinished').find('input').remove()
    $('.list-group-unfinished').find('p').removeAttr('contenteditable')
    $('.list-group-unfinished').find('img').remove()
  })

  // switch to finished-tab
  $('#finished-tab').click((e) => {
    // clear all previous records
    $('.list-group-finished').empty()
    // remove deletion buttons, checkboxes, img and p on every todo
    $('.list-group-all > .list-group-item.done').clone().prependTo('.list-group-finished')
    $('.list-group-finished').find('button').remove()
    $('.list-group-finished').find('input').remove()
    $('.list-group-finished').find('p').removeAttr('contenteditable')
    $('.list-group-finished').find('img').remove()
  })

  // upload todo list to server database
  // registered user only
  $('.btn-store-on-db').click((e) => {
    // if todo list is empty, show modal to inform user
    const todos = $('.list-group-all > .list-group-item').length
    if (todos === 0) {
      // show modal view
      modal.DisplayModal('button', 'upload-todos', 'empty-uploaded-content')
      // $('#emptyUploadTodoContent').modal('show')
      return
    }
    ajax.OperationByAjax('button', 'upload-todos')
  })

  // in order to clear validity state 
  $('#registerModal-form-retype-password').on('input', () => {
    $('#registerModal-form-retype-password').get(0).setCustomValidity('')
  })

  // registerModal-form submit event listener
  $('.registerModal-form').submit((e) => {
    e.preventDefault()
    // double password confirmation with constraint validation API
    if ($('#registerModal-form-password').val() !== $('#registerModal-form-retype-password').val()) {
      // get(0) -> turn jQuery object to native javascript object
      $('#registerModal-form-retype-password').get(0).setCustomValidity('請確認兩次輸入都是同一組密碼')
      return
    }
    ajax.OperationByAjax('form', 'register')
    // enable spinner animation
    $('.registerModal-form-spinner').toggleClass('hidden')
  })

  // loginModal-form submit event listener
  $('.loginModal-form').submit((e) => {
    e.preventDefault()
    ajax.OperationByAjax('form', 'login')
    // enable spinner animation
    $('.loginModal-form-spinner').toggleClass('hidden')
  })

  // confirm logout event listener
  $('.btn-logout-confirm').click(() => {
    ajax.OperationByAjax('button', 'logout')
  })

  // open filter modal event listener
  $('.filter-icon').click(() => {
    $('#filterModal').modal('show') 
  })

  // open todo info modal event listener
  $('.list-group-all').on('click', '.todo-info-icon', (e) => {
    $('#todoInfoModal').modal('show')
  })

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