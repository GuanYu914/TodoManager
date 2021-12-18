const utils = require('./utils')
const modal = require('./modal')
const ajax = require('./ajax')

const todo = {
  initTodoAllEventListener: initTodoAllEventListener
}

function initTodoAllEventListener() {
  addTodoEventListener()
  deleteTodoRelativeInfoEventListener()
  displayTodoDeletionConfirmModalEventListener()
  clearAllTodosEventListener()
  completeTodoEventListener()
  switchTabEventListener()
  uploadTodosEventListener()
  todoOperationUnderFilterModeEventListener()
  openFilterModalOnMobileEventListener()
  addCategoryOnTodoInfoModalEventListener()
  removeExistedCategoryOnTodoInfoModalEventListener()
  openTodoInfoModalEventListener()
  setTodoInfoWithTodoInfoModalValueEventListener()
  addCategoryFromExistedCategoriesEventListener()
  priorityFilterAllEventListener()
  categoryFilterAllEventListener()
}

// add todo list 
function addTodoEventListener() {
  $('#input-todo-content').on('keyup', (e) => {
    // detect 'Enter' input
    if (e.key === 'Enter') {
      // if input is not empty
      if ($('#input-todo-content').val() !== '') {
        // use data-todo-id attribute to represent todo id 
        let TodoID = -1
        $('.list-group-all').children('.list-group-item').each(function () {
          if (parseInt($(this).attr('data-todo-id')) > TodoID) {
            TodoID = parseInt($(this).attr('data-todo-id'))
          }
        })
        TodoID++
        // add input content to lists
        $('.list-group-all').prepend(
          `
        <div class="list-group-item todo" data-todo-id=${TodoID}>
          <div class="categories-tags">
            <h4 class="d-inline-flex category-badge mb-1">
              <span class="align-middle badge rounded-pill bg-priority-low">
                <span class="align-middle category-name">優先性：低</span>
              </span>
            </h4>
          </div>
          <div class="d-flex list-group-item-user-operation align-items-center mt-2">
            <input class="flex-shrink-0 form-check-input pointer mt-0 me-2 " type="checkbox" >
            <p class="flex-grow-1 text-break list-group-item-p space fs-5 p-2 me-2 mb-0">${utils.escapeHtml($('#input-todo-content').val())}</p>
            <img src="./img/info-lg.svg" class="flex-shrink-0 todo-info-icon pointer me-3" alt="Bootstrap-icon" width="18" height="18">
            <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
          </div>
          <div class="comment-block text-secondary space fs-6 mt-2"></div>
        </div>
      `
        )
        // clear input field content
        $('#input-todo-content').val('')
        // apply dropdown filter condition & update current pill tab content
        utils.applyFilterSettingFromDropdown()
        utils.updatePillTabs('totals')
        utils.updatePillTabs('unfinished')
        utils.updatePillTabs('finished')
        // update unfinished todo counts
        utils.getUnfinishedTodos()
      } else {
        // show modal view
        modal.DisplayModal('input', 'submit', 'empty-content')
      }
    }
  })
}

// remove category tag, todo 
function deleteTodoRelativeInfoEventListener() {
  $('.list-group-all, .list-group-unfinished, .list-group-finished').on('click', '.btn-close', (e) => {
    // user wants to delete category tag 
    if ($(e.target).parent().hasClass('badge')) {
      let tag_name = $(e.target).parent().find('.category-name').text()
      // get original todo, then remove category tag
      let todo = utils.getOriginalTodo(e.target)
      todo.find('.categories-tags > .d-inline-flex').each(function () {
        if ($(this).find('.category-name').text() === tag_name) {
          $(this).remove()
        }
      })
      // apply dropdown filter condition & update current pill tab content
      utils.applyFilterSettingFromDropdown()
      utils.updatePillTabs(utils.getCurrentPillTabName())
      // update unfinished todo counts
      utils.getUnfinishedTodos()
    }
    // user wants to delete entire todo, then display confirmation modal
    if ($(e.target).parent().hasClass('list-group-item-user-operation')) {
      modal.DisplayModal('button', 'delete-todo', 'confirmation')
      utils.recordCurrentEditedTodoObj($(e.target).parents('.list-group-item'))
    }
  })
}

// removed todo confirmation 
function displayTodoDeletionConfirmModalEventListener() {
  $('.modal-block').on('click', '.btn-remove-todo-confirm', (() => {
    let todo = utils.getOriginalTodo(utils.getCurrentEditedTodoObj())
    todo.remove()
    // apply dropdown filter condition & update current pill tab content
    utils.applyFilterSettingFromDropdown()
    utils.updatePillTabs(utils.getCurrentPillTabName())
    // update unfinished todo counts
    utils.getUnfinishedTodos()
  }))
}

// clear all finished todos
function clearAllTodosEventListener() {
  $('.btn-clear-todo').on('click', () => {
    // check if filter mode is on ?
    if (utils.checkFilterEnableStatus()) {
      modal.DisplayModal('button', 'clear-todos', 'under-filter-mode')
      return
    }
    // clear all todos with 'done' status
    $('.list-group-all > .list-group-item.done').remove()
    // apply dropdown filter condition & update current pill tab content
    utils.applyFilterSettingFromDropdown()
    utils.updatePillTabs(utils.getCurrentPillTabName())
    // update unfinished todo counts
    utils.getUnfinishedTodos()
  })
}

// complete todo
function completeTodoEventListener() {
  $(".list-group-all, .list-group-unfinished, .list-group-finished").on('click', '.form-check-input', (e) => {
    // get original todo
    let todo = utils.getOriginalTodo(e.target)
    // toggle classes to apply complete effect
    todo.find('.list-group-item-p').toggleClass('complete')
    // toggle classes to switch todo into 'done' status
    todo.toggleClass('todo')
    todo.toggleClass('done')
    // refresh checked button status
    utils.applyCheckedEffect()
    // apply dropdown filter condition & update current pill tab content
    utils.applyFilterSettingFromDropdown()
    utils.updatePillTabs(utils.getCurrentPillTabName())
    // update unfinished todo counts
    utils.getUnfinishedTodos()
  })
}

// switch pill tabs
function switchTabEventListener() {
  // switch to unfinished-tab
  $('#unfinished-tab').on('click', (e) => {
    // apply dropdown filter condition & update current pill tab content | 套用篩選機制 & 更新目前 pill tab 
    utils.applyFilterSettingFromDropdown()
    utils.updatePillTabs('unfinished')
  })

  // switch to finished-tab
  $('#finished-tab').on('click', (e) => {
    // apply dropdown filter condition & update current pill tab content | 套用篩選機制 & 更新目前 pill tab 
    utils.applyFilterSettingFromDropdown()
    utils.updatePillTabs('finished')
  })
}

// upload todo list to server database
// registered user only
function uploadTodosEventListener() {
  $('.btn-store-on-db').on('click', (e) => {
    // if todo list is empty, show modal to inform user
    const todos = $('.list-group-all > .list-group-item').length
    if (todos === 0) {
      // show modal view
      modal.DisplayModal('button', 'upload-todos', 'empty-uploaded-content')
      return
    }
    // check filter mode is on ?
    if (utils.checkFilterEnableStatus()) {
      modal.DisplayModal('button', 'upload-todos', 'under-filter-mode')
      return
    }
    // send ajax request when filter mode is off
    ajax.OperationByAjax('button', 'upload-todos')
  })
}

// operation confirmation under filter mode
function todoOperationUnderFilterModeEventListener() {
  $('.modal-block').on('click', '.btn-op-under-filter-mode-confirm', (e) => {
    let op_name = $(e.target).attr('data-op-name')
    if (op_name === 'uploadAllTodos') {
      ajax.OperationByAjax('button', 'upload-todos')
    }
    if (op_name === 'clearAllTodos') {
      $('.list-group-all > .list-group-item.done').remove()
      // apply filter condition & update current pill tab content 
      utils.applyFilterSettingFromDropdown()
      utils.updatePillTabs(utils.getCurrentPillTabName())
      // update unfinished todo counts
      utils.getUnfinishedTodos()
    } 
  })
}

// open filter modal 
function openFilterModalOnMobileEventListener() {
  $('.filter-icon').on('click', () => {
    $('#filterModal').modal('show') 
  })
}

// add categories of todo event listener 
function addCategoryOnTodoInfoModalEventListener() {
  // by pressing button
  $('.btn-add-category-name').on('click', () => {
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
        <h4 class="d-inline-flex category-badge mb-2">
          <span class="align-middle badge rounded-pill bg-category">
            <span class="align-middle category-name">${utils.escapeHtml(content)}</span>
            <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
          </span>
        </h4>
      `)
    }
    // clear categories input field
    $('#category-input-content').val('')
  })

  // by pressing key
  $('#category-input-content').on('keyup', (e) => {
    if (e.key === 'Enter') {  // press enter key
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
          <h4 class="d-inline-flex category-badge mb-2">
            <span class="align-middle badge rounded-pill bg-category">
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
}

// remove category name from existed categories
function removeExistedCategoryOnTodoInfoModalEventListener() {
  $('.modal-body > .categories-block > .categories-tags').on('click', '.btn-close', (e) => {
    $(e.target).parents('.category-badge').fadeOut('fast', () => {
      $(e.target).parents('.category-badge').remove()
    })
  })
}

// show todoInfo modal 
function openTodoInfoModalEventListener() {
  $('.list-group-all, .list-group-unfinished, .list-group-finished').on('click', '.todo-info-icon', (e) => {
    // add categories shortcut area, speed up adding category
    let existedCategoriesName = []
    let currentCategoriesName = ''
    // if there are existed categories was found, add to existed categories block
    let categories = $('.list-group-all > .list-group-item > .categories-tags')
    if (categories.find('.d-inline-flex:nth-child(n+2)').length) {
      $('.modal-body > .categories-block > .existed-categories-tags').append(`
      <div class="form-text mb-2">點擊目前既有名稱，快速套用</div>
      `)
    }
    categories.find('.d-inline-flex:nth-child(n+2)').each(function () {
      currentCategoriesName = $(this).find('.category-name').text()
      // if currentCategories was added to existedCategoriesName array, then skip the operation
      for (let i = 0; i < existedCategoriesName.length; i++) {
        if (currentCategoriesName === existedCategoriesName[i]) return
      }
      existedCategoriesName.push(currentCategoriesName)
      $('.modal-body > .categories-block > .existed-categories-tags').append(`
      <h4 class="d-inline-flex category-badge mb-1">
        <span class="align-middle badge rounded-pill bg-category pointer">
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
      let categoriesOfTodo = $(e.target).parents('.list-group-item').children('.categories-tags').get(0).innerText.trim()
      categoriesOfTodo = categoriesOfTodo.replace(/\s+/g, ' ').split(' ')
      // read categories from index 1, index 0 is priority tag
      for (let i = 1; i < categoriesOfTodo.length; i++) {
        $('.modal-body > .categories-block > .categories-tags').append(`
          <h4 class="d-inline-flex category-badge mb-2">
            <span class="align-middle badge rounded-pill bg-category">
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
    // read content
    let todo_content = $(e.target).parents('.list-group-item').find('.list-group-item-p').text()
    $('#modal-input-todo-content').val(todo_content)
    // read comment
    if ($(e.target).parents('.list-group-item').children('.comment-block').text()) {
      let commentOfTodo = $(e.target).parents('.list-group-item').children('.comment-block').get(0).innerText.replace('備註：', '')
      $('#comment-textarea').val(commentOfTodo)
    }
    // show todo info modal
    $('#todoInfoModal').modal('show')
    // record current edited todo
    utils.recordCurrentEditedTodoObj(utils.getOriginalTodo(e.target))
  })
}

// set todo info from TodoInfo modal
function setTodoInfoWithTodoInfoModalValueEventListener() {
  $('.btn-todo-info-icon-confirm').on('click', () => {
    // get current edited todo
    let e = utils.getCurrentEditedTodoObj() 
    // get all categories name
    // use trim to remove space character in both ends of string 
    let currentCategories = $('.modal-body > .categories-block > .categories-tags').get(0).innerText.trim()
    // if there are categories was founded, then convert into array
    if (currentCategories !== '') {
      currentCategories = currentCategories.replace(/\s+/g, ' ').split(' ')
    }
    // get content of todo on todo info modal
    let todo_content = $('#modal-input-todo-content').val()
    // take off last space char, it is unnecessary
    let comment = $('#comment-textarea').val()
    // get priority from select
    let priority = $('#priority-dropdown-selection').find(":selected").text();
    // clear categories, content, comment of the todo
    e.children('.categories-tags').empty()
    e.children('.list-group-item-p').empty()
    e.children('.comment-block').empty()
    // put categories, content, comment, priority on specific todo
    if (priority) {
      e.children('.categories-tags').append(`
        <h4 class="d-inline-flex category-badge mb-1">
          <span class="align-middle badge rounded-pill ${utils.getColorOfPriority('優先性：' + priority)}">
            <span class="align-middle category-name">優先性：${utils.escapeHtml(priority)}</span>
          </span>
        </h4>
      `)
    }
    if (Array.isArray(currentCategories) && currentCategories.length) {
      for (let i = 0; i < currentCategories.length; i++) {
        e.children('.categories-tags').append(`
          <h4 class="d-inline-flex category-badge mb-1">
            <span class="align-middle badge rounded-pill bg-category">
              <span class="align-middle category-name">${utils.escapeHtml(currentCategories[i])}</span>
              <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
            </span>
          </h4>
        `)
      }
    }
    if (todo_content) {
      e.find('.list-group-item-p').text(todo_content)
    }
    if (comment) {
      // e.children('.comment-block').append(`${utils.escapeHtml(comment)}`)
      e.children('.comment-block').text('備註：' + comment)
    }
    // apply filter condition & update current pill tab content
    utils.applyFilterSettingFromDropdown()
    utils.updatePillTabs(utils.getCurrentPillTabName())
  })
}

// click existed categories, then add to categories tags block
function addCategoryFromExistedCategoriesEventListener() {
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
    // get current categories number, maximum number is 6
    // if number reached maximum, don't do anything then clear input 
    let totalCategories = $('.modal-body > .categories-block > .categories-tags > .category-badge').length
    if (totalCategories === 6) { 
      $('#category-input-content').val('')
      return 
    }
    // add to categories tags block
    $('.modal-body > .categories-block > .categories-tags').prepend(`
      <h4 class="d-inline-flex category-badge mb-2">
        <span class="align-middle badge rounded-pill bg-category">
          <span class="align-middle category-name">${utils.escapeHtml(clickedCategoryName)}</span>
          <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
        </span>
      </h4>
    `)
  })
}

// priority filter 
function priorityFilterAllEventListener() {
  // click priority filter event listener
  $('.priority-filter-title').on('click', () => {
    // if priority filter is set
    if ($('.priority-filter-title').get(0).innerText.trim() !== '優先性') {
      // if it doesn't generate remove message block, then add it
      if ($('.priority-filter-menu').find('.filter-reset').length === 0) {
        $('.priority-filter-menu').prepend(`
          <span class="dropdown-item filter-reset pointer">移除套用此順序</span>`
        )
      }
    }
  })
  // user select priority filter option
  $('.priority-filter-menu').on('click', '.priority-filter-option', function () {
    // set priority filer title as selected option
    $('.priority-filter-title').text($(this).text())
    // apply filter condition & update current pill tab content
    utils.applyFilterSettingFromDropdown()    
    utils.updatePillTabs(utils.getCurrentPillTabName())
    // update filter icon state
    utils.updateFilterIcon()
  })
  // clear priority filter option event listener
  $('.priority-filter-menu').on('click', '.filter-reset', function () {
    $('.priority-filter-title').text('優先性')
    // apply filter condition & update current pill tab content
    utils.applyFilterSettingFromDropdown()
    utils.updatePillTabs(utils.getCurrentPillTabName())
    // update filter icon state
    utils.updateFilterIcon()
    // remove reset message
    $('.priority-filter-menu').find('.filter-reset').remove()
  })
}

// category filter
function categoryFilterAllEventListener() {
  $('.categories-filter-title').click(() => {
    // get current categories list
    utils.updateCategoriesDropdownList()
    // update filter icon state
    utils.updateFilterIcon()
  })
  // user select categories filter option
  $('.categories-filter-menu').on('click', '.category-filter-option', function () {
    // set categories filer title as selected option
    $('.categories-filter-title').text($(this).text())
    // apply filter condition & update current pill tab content
    utils.applyFilterSettingFromDropdown()
    utils.updatePillTabs(utils.getCurrentPillTabName())
    // update filter icon state
    utils.updateFilterIcon()
  })
  // clear categories filter option event listener
  $('.categories-filter-menu').on('click', '.filter-reset', function () {
    $('.categories-filter-title').text('分類')
    // apply filter condition & update current pill tab content
    utils.applyFilterSettingFromDropdown()
    utils.updatePillTabs(utils.getCurrentPillTabName())
    // update filter icon state     
    utils.updateFilterIcon()
    // remove reset message
    $('.categories-filter-menu').find('.filter-reset').remove()
  })
}

module.exports = todo