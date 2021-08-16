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
          <div class="list-group-item todo">
            <div class="categories-tags">
              <h4 class="d-inline category-badge">
                <span class="align-middle badge rounded-pill bg-secondary">
                  <span class="align-middle category-name">優先性：低</span>
                </span>
              </h4>
            </div>
            <div class="d-flex list-group-item-user-operation align-items-center mt-2">
              <input class="flex-shrink-0 form-check-input pointer me-3 " type="checkbox" >
              <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p space p-2 me-2 mb-0">${utils.escapeHtml($('#input-todo-content').val())}</p>
              <img src="/img/info-lg.svg" class="flex-shrink-0 todo-info-icon pointer me-3" alt="Bootstrap-icon" width="18" height="18">
              <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
            </div>
            <div class="comment-block text-secondary space mt-2"></div>
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
    $(e.target).parent().parent().fadeOut('fast', () => {
      $(e.target).parent().parent().remove()
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
    $(e.target).parent().parent().toggleClass('todo')
    $(e.target).parent().parent().toggleClass('done')
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

  // add categories of todo event listener (by pressing button)
  $('.btn-add-category-name').click(() => {
    // get current categories number, maximum number is 6
    // if number reached maximum, don't do anything then clear input
    let totalCategories = $('.modal-body > .categories-block > .categories-tags > .category-badge').length
    if (totalCategories === 6) {
      $('#category-input-content').val('')
      return 
    }
    // search all categories, check if it existed
    // if it existed, skip operation 
    let content = $('#category-input-content').val()
    // use trim to remove space character in both ends of string 
    let currentCategories = $('.modal-body > .categories-block > .categories-tags').get(0).innerText.trim()
    currentCategories = currentCategories.replace(/\s+/g, ' ').split(' ')
    for (let i = 0; i < currentCategories.length; i++) {
      if (currentCategories[i] === content) {
        $('#category-input-content').val('')
        return
      }
    }
    // if get non-empty content, add input content as category name
    if (content) {
      $('.modal-body > .categories-block > .categories-tags').prepend(`
        <h4 class="d-inline category-badge">
          <span class="align-middle badge rounded-pill bg-secondary mb-2">
            <span class="align-middle category-name">${utils.escapeHtml(content)}</span>
            <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
          </span>
        </h4>
      `)
    }
    // clear categories input field
    $('#category-input-content').val('')
  })

  // add categories of todo event listener2 (by pressing enter key)
  $('#category-input-content').on('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {  // press enter key
      // get current categories number, maximum number is 6
      // if number reached maximum, don't do anything then clear input
      let totalCategories = $('.modal-body > .categories-block > .categories-tags > .category-badge').length
      if (totalCategories === 6) { 
        $('#category-input-content').val('')
        return 
      }
      // search all categories, check if it existed
      // if it existed, skip operation 
      let content = $('#category-input-content').val()
      // use trim to remove space character in both ends of string 
      let currentCategories = $('.modal-body > .categories-block > .categories-tags').get(0).innerText.trim()
      currentCategories = currentCategories.replace(/\s+/g, ' ').split(' ')
      for (let i = 0; i < currentCategories.length; i++) {
        if (currentCategories[i] === content) {
          $('#category-input-content').val('')
          return
        }
      }
      // if get non-empty content, add input content as category name
      if (content) {
        $('.modal-body > .categories-block > .categories-tags').prepend(`
          <h4 class="d-inline category-badge">
            <span class="align-middle badge rounded-pill bg-secondary mb-2">
              <span class="align-middle category-name">${utils.escapeHtml(content)}</span>
              <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
            </span>
          </h4>
        `)
      }
      // clear categories input field
      $('#category-input-content').val('')
    }
  })
  
  // remove category name from existed categories
  $('.modal-body > .categories-block > .categories-tags').on('click', '.btn-close', (e) => {
    $(e.target).parent().parent().fadeOut('fast', () => {
      $(e.target).parent().parent().remove()
    })
  })

  // open todo info modal event listener
  $('.list-group-all').on('click', '.todo-info-icon', (e) => {
    // add categories shortcut area, speed up adding category
    let existedCategoriesName = []
    let currentCategoriesName = ''
    // if there are existed categories was found, add to existed categories block
    let categories = $('.list-group-all > .list-group-item > .categories-tags')
    if (categories.find('.d-inline:nth-child(n+2)').length) {
      $('.modal-body > .categories-block > .existed-categories-tags').append(`
      <div class="form-text mb-2">點擊目前既有名稱，快速套用</div>
      `)
    }
    categories.find('.d-inline:nth-child(n+2)').each(function () {
      currentCategoriesName = $(this).find('.category-name').text()
      // if currentCategories was added to existedCategoriesName array, then skip the operation
      for (let i = 0; i < existedCategoriesName.length; i++) {
        if (currentCategoriesName === existedCategoriesName[i]) return
      }
      existedCategoriesName.push(currentCategoriesName)
      $('.modal-body > .categories-block > .existed-categories-tags').append(`
      <h4 class="d-inline category-badge">
        <span class="align-middle badge rounded-pill bg-primary pointer">
          <span class="align-middle category-name">${utils.escapeHtml(currentCategoriesName)}</span>
        </span>
      </h4>
      `)
    })
    let existedCategoriesTags = $('.modal-body > .categories-block > .existed-categories-tags')
    // display existed-categories-tags block
    existedCategoriesTags.removeClass('d-none')
    // hide existed-categories-tags block
    $('#todoInfoModal').on('hidden.bs.modal', () => {
      existedCategoriesTags.addClass('d-none')
      existedCategoriesTags.empty()
    })
    // clear recorded previous value on todo info modal
    $('#category-input-content').val('')
    $('.modal-body > .categories-block > .categories-tags').empty()
    $('#comment-textarea').val('')
    // set low priority (default setting)
    $('#priority-dropdown-selection').val('1')
    // read categories (include categories and priority)
    if ($('.list-group-all > .list-group-item > .categories-tags').length) {
      // use trim to remove space character in both ends of string 
      let categoriesOfTodo = $(e.target).parent().parent().children('.categories-tags').get(0).innerText.trim()
      categoriesOfTodo = categoriesOfTodo.replace(/\s+/g, ' ').split(' ')
      // read categories from index 1, index 0 is priority tag
      for (let i = 1; i < categoriesOfTodo.length; i++) {
        $('.modal-body > .categories-block > .categories-tags').append(`
          <h4 class="d-inline category-badge">
            <span class="align-middle badge rounded-pill bg-secondary mb-2">
              <span class="align-middle category-name">${utils.escapeHtml(categoriesOfTodo[i])}</span>
              <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
            </span>
          </h4>
        `)
      }
      // read priority from todo categories block
      let priorityOfTodo = categoriesOfTodo[0]
      if (priorityOfTodo === '優先性：低') {
        $('#priority-dropdown-selection').val('1')
      }
      if (priorityOfTodo === '優先性：中') {
        $('#priority-dropdown-selection').val('2')
      }
      if (priorityOfTodo === '優先性：高') {
        $('#priority-dropdown-selection').val('3')
      } 
    }
    // read comment
    if ($(e.target).parent().parent().children('.comment-block').text()) {
      let commentOfTodo = $(e.target).parent().parent().children('.comment-block').text()
      $('#comment-textarea').val(commentOfTodo)
    }
    // show todo info modal
    $('#todoInfoModal').modal('show')
    // record current todo jquery object to set todo
    utils.recordCurrentEditedTodoObj($(e.target).parent().parent())
  })

  // read todo info modal values to set the todo
  $('.btn-todo-info-icon-confirm').click(() => {
    // get current todo jquery object
    let e = utils.getCurrentEditedTodoObj()
    // get all categories name
    // use trim to remove space character in both ends of string 
    let currentCategories = $('.modal-body > .categories-block > .categories-tags').get(0).innerText.trim()
    // if there are categories was founded, then convert into array
    if (currentCategories !== '') {
      currentCategories = currentCategories.replace(/\s+/g, ' ').split(' ')
    }
    // take off last space char, it is unnecessary
    let comment = $('#comment-textarea').val()
    // get priority from select
    let priority = $('#priority-dropdown-selection').find(":selected").text();
    // clear categories, comment of the todo
    e.children('.categories-tags').empty()
    e.children('.comment-block').empty()
    // put categories, comment, priority on specific todo
    if (priority) {
      e.children('.categories-tags').append(`
        <h4 class="d-inline category-badge">
          <span class="align-middle badge rounded-pill bg-secondary">
            <span class="align-middle category-name">優先性：${utils.escapeHtml(priority)}</span>
          </span>
        </h4>
      `)
    }
    if (Array.isArray(currentCategories) && currentCategories.length) {
      for (let i = 0; i < currentCategories.length; i++) {
        e.children('.categories-tags').append(`
          <h4 class="d-inline category-badge">
            <span class="align-middle badge rounded-pill bg-secondary">
              <span class="align-middle category-name">${utils.escapeHtml(currentCategories[i])}</span>
              <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
            </span>
          </h4>
        `)
      }
    }
    if (comment) {
      e.children('.comment-block').append(`${utils.escapeHtml(comment)}`)
    }
  })

  // click existed categories, then add to categories tags block
  $('.modal-body > .categories-block > .existed-categories-tags').on('click', '.category-name', (e) => {
    let clickedCategoryName = $(e.target).text()
    // search all categories, check if it existed
    // if it existed, skip operation 
    // use trim to remove space character in both ends of string 
    let currentCategories = $('.modal-body > .categories-block > .categories-tags').get(0).innerText.trim()
    currentCategories = currentCategories.replace(/\s+/g, ' ').split(' ')
    // check if clickedCategoryName is added to categories tags block
    // if it is true, skip the operation
    for (let i = 0; i < currentCategories.length; i++) {
      if (currentCategories[i] === clickedCategoryName) return
    }
    // add to categories tags block
    $('.modal-body > .categories-block > .categories-tags').prepend(`
      <h4 class="d-inline category-badge">
        <span class="align-middle badge rounded-pill bg-secondary mb-2">
          <span class="align-middle category-name">${utils.escapeHtml(clickedCategoryName)}</span>
          <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
        </span>
      </h4>
    `)
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