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
          <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p space p-2 me-4 mb-0">${utils.escapeHtml($('#input-todo-content').val())}</p>
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
    // remove deletion buttons, checkboxes and p on every todo
    $('.list-group-all > .list-group-item.todo').clone().prependTo('.list-group-unfinished')
    $('.list-group-unfinished').find('button').remove()
    $('.list-group-unfinished').find('input').remove()
    $('.list-group-unfinished').find('p').removeAttr('contenteditable')
  })

  // switch to finished-tab
  $('#finished-tab').click((e) => {
    // clear all previous records
    $('.list-group-finished').empty()
    // remove deletion buttons, checkboxes and p on every todo
    $('.list-group-all > .list-group-item.done').clone().prependTo('.list-group-finished')
    $('.list-group-finished').find('button').remove()
    $('.list-group-finished').find('input').remove()
    $('.list-group-finished').find('p').removeAttr('contenteditable')
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
})