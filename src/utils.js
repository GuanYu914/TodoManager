const utils = {
  SwitchToLoginState: SwitchToLoginState,
  SwitchToLogoutState: SwitchToLogoutState,
  getAllUploadData: getAllUploadData,
  getUnfinishedTodos: getUnfinishedTodos,
  escapeHtml: escapeHtml,
  recordCurrentEditedTodoObj: recordCurrentEditedTodoObj,
  getCurrentEditedTodoObj: getCurrentEditedTodoObj,
  updateCategoriesDropdownList: updateCategoriesDropdownList,
  applyFilterSettingFromDropdown: applyFilterSettingFromDropdown,
  applyCheckedEffect: applyCheckedEffect,
  getOriginalTodo: getOriginalTodo,
  getCurrentPillTabName: getCurrentPillTabName,
  updatePillTabs: updatePillTabs,
  checkFilterEnableStatus: checkFilterEnableStatus,
  updateFilterIcon: updateFilterIcon,
  updateLoginUser: updateLoginUser,
  getLoginUser: getLoginUser,
  storedUploadedTodosIntoLocal: storedUploadedTodosIntoLocal,
  checkCurrentLoginUserHaveLocalUploadedTodos: checkCurrentLoginUserHaveLocalUploadedTodos,
  getUploadedTodosFromLocal: getUploadedTodosFromLocal,
  removeUploadedTodosInLocal: removeUploadedTodosInLocal,
  getColorOfPriority: getColorOfPriority
}

function getColorOfPriority(priority) {
  if (priority === '優先性：高') {
    return 'bg-priority-high'
  }
  if (priority === '優先性：中') {
    return 'bg-priority-mid'
  }
  if (priority === '優先性：低') {
    return 'bg-priority-low'
  }
}

// switch UI to login state
function SwitchToLoginState(data) {
  // data is user nickname
  if (typeof (data) === 'string') {
    // hide register、login buttons
    $('.btn-register, .btn-login').toggleClass('d-none')
    // show logout button & profile block in DOM tree
    $('.btn-logout').toggleClass('d-none')
    // prevent xss attack
    $('.profile-nickname').text(`${data}, 您好`)
    $('.profile').toggleClass('d-none')
    // show profile editing button
    $('.btn-edit-profile').toggleClass('d-none')
    // show upload todos button
    $('.btn-store-on-db').toggleClass('d-none')
    // clean previous todos 
    $('.list-group-all').empty()
    // show totals tab
    $('#pills-tab li:first-child button').tab('show')
    return
  }
  // data is todos
  if (typeof (data) === 'object') {
    // console.log(data)
    // generate categories html block
    for (let i = 0; i < data.length; i++) {
      let categories = data[i].categories
      categories = categories.replace(/\s+/g, ' ').split(' ')
      let categories_htmlCode = `
      <h4 class="d-inline-flex mb-1">
        <span class="align-middle badge rounded-pill ${getColorOfPriority(categories[0])}">
          <span class="align-middle category-name">${escapeHtml(categories[0])}</span>
        </span>
      </h4>\n
      `
      for (let i = 1; i < categories.length; i++) {
        categories_htmlCode += `
        <h4 class="d-inline-flex mb-1">
          <span class="align-middle badge rounded-pill bg-category">
            <span class="align-middle category-name">${escapeHtml(categories[i])}</span>
            <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
          </span>
        </h4>\n 
        `
      }
      // add to all todos tab
      if (data[i].checked === 1) {
        $('.list-group-all').prepend(`
       <div class="list-group-item done" data-todo-id=${i+1}>
          <div class="categories-tags">
            ${categories_htmlCode}
          </div>
          <div class="d-flex list-group-item-user-operation align-items-center mt-2">
            <input class="flex-shrink-0 form-check-input pointer mt-0 me-2 " type="checkbox" checked>
            <p class="flex-grow-1 text-break list-group-item-p space complete fs-5 p-2 me-2 mb-0">${escapeHtml(data[i].content)}</p>
            <img src="./img/info-lg.svg" class="flex-shrink-0 todo-info-icon pointer me-3" alt="Bootstrap-icon" width="18" height="18">
            <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
          </div>
          <div class="comment-block text-secondary space fs-5 mt-2">${escapeHtml(data[i].comment)}</div>
        </div>
       `)
      } else {
        $('.list-group-all').prepend(`
        <div class="list-group-item todo" data-todo-id="${i+1}">
           <div class="categories-tags">
             ${categories_htmlCode}
           </div>
           <div class="d-flex list-group-item-user-operation align-items-center mt-2">
             <input class="flex-shrink-0 form-check-input pointer mt-0 me-2" type="checkbox">
             <p class="flex-grow-1 text-break list-group-item-p space fs-5 p-2 me-2 mb-0">${escapeHtml(data[i].content)}</p>
             <img src="./img/info-lg.svg" class="flex-shrink-0 todo-info-icon pointer me-3" alt="Bootstrap-icon" width="18" height="18">
             <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
           </div>
           <div class="comment-block text-secondary space fs-5 mt-2">${escapeHtml(data[i].comment)}</div>
         </div>
        `)
      }
    }
    getUnfinishedTodos()
    // remove alert message
    $('.alert-block').empty()
  }
}

// switch UI to logout state
function SwitchToLogoutState() {
  // show register、login buttons
  $('.btn-register, .btn-login').toggleClass('d-none')
  // hide logout button & profile block in DOM tree
  $('.btn-logout').toggleClass('d-none')
  $('.profile').toggleClass('d-none')
  $('.profile-nickname').text('')
  // hide profile editing button
  $('.btn-edit-profile').toggleClass('d-none')
  // show upload todos button
  $('.btn-store-on-db').toggleClass('d-none')
  // remove all previous stored todos on every pill tabs
  $('.list-group-all').empty()
  $('.list-group-unfinished').empty()
  $('.list-group-finished').empty()
  // reset filter 
  $('.priority-filter-title').text('優先性')
  $('.categories-filter-title').text('分類')
  updateFilterIcon()
  getUnfinishedTodos()
  // add alert message
  $('.alert-block').empty()
  $('.alert-block').append(`
  <div class="alert alert-primary" role="alert">
      註冊登入即可線上保存代辦事項，<strong class="pointer" data-bs-toggle="modal" data-bs-target="#registerModal">現在就立即註冊吧！</strong>
  </div>
  `)
}

// get all todos content information and pack into object array
function getAllUploadData() {
  // create object array to store todo list
  const todos = []
  $('.list-group-all > .list-group-item').each(function () {
    if (!$(this).attr('class').match(/filtered-/)) {
      // get checked button status
      let checked, content, categories = [], priority, comment
      if ($(this).hasClass('done')) {
        checked = 1
      } else {
        checked = 0
      }
      // get content
      content = $(this).find('.list-group-item-p').text()
      // get categories
      $(this).find('.categories-tags > .d-inline-flex').each(function () {
        // use trim to remove space character in both ends of string 
        categories.push($(this).find('.category-name').get(0).innerText.trim())
      })
      priorityText = categories[0]
      // get priority
      if (priorityText === '優先性：低') {
        priority = 0
      }
      if (priorityText === '優先性：中') {
        priority = 1
      }
      if (priorityText === '優先性：高') {
        priority = 2
      }
      // get comment
      comment = $(this).children('.comment-block').text()
      // push to todos
      todos.push({
        checked: checked,
        content: content,
        categories: categories.join(' '),
        comment: comment,
        priority: priority
      })
    }
  })
  return todos
}

// count number of todos needed to be finished
function getUnfinishedTodos() {
  // 只找沒有 filtered- 標籤且有 todo class 的元素
  let remainingTodos = 0
  $('.list-group-all').children('.list-group-item').each(function () {
    let className = $(this).attr('class')
    if(!className.match(/filtered-/)) {
      if (className.match(/todo/)) {
        remainingTodos++
      }
    }
  })
  if (remainingTodos) { // if there have todos to finish
    $('.todos-remaining').empty()
    $('.todos-remaining').append(`
    <span class="position-absolute top-0 start-86 translate-middle badge rounded-pill bg-danger">
      ${remainingTodos}
    </span>
    `)
  } else { // have nothing to finish
    $('.todos-remaining').empty()
  }
}

// html escape 
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// get current pill tab name
function getCurrentPillTabName() {
  if ($('#totals-tab-content').hasClass('active')) {
    return 'totals'
  }
  if ($('#unfinished-tab-content').hasClass('active')) {
    return 'unfinished'
  }
  if ($('#finished-tab-content').hasClass('active')) {
    return 'finished'
  }
}

// refresh checkbox status on totals tab
function applyCheckedEffect() {
  $('.list-group-all').children('.list-group-item').each(function () {
    if ($(this).find('.list-group-item-p').hasClass('complete')) {
      $(this).find('input').prop('checked', true)
    } 
    else {
      $(this).find('input').prop('checked', false)
    }
  })
}

// update current pill tab content
function updatePillTabs(tab_name) {
  if (tab_name === 'totals') return
  if (tab_name === 'unfinished') {
    $('.list-group-unfinished').empty()
    $('.list-group-all > .list-group-item.todo').clone().prependTo('.list-group-unfinished')
    return
  }
  if (tab_name === 'finished') {
    $('.list-group-finished').empty()
    $('.list-group-all > .list-group-item.done').clone().prependTo('.list-group-finished')
    return
  }
}

// update dropdown list content of 分類 filter 
function updateCategoriesDropdownList() {
  // if there are no category tags about 分類 filter existed, then reset to default | 如果沒有任何有關當前分類標籤 todo 存在時，則設為預設狀態
  let tmp_counter = 0
  $('.list-group-all').children('.list-group-item').each(function () {
    if ($(this).attr('class').match(/filtered-category/)) {
      tmp_counter++
    }
  })
  if (!tmp_counter) {
    $('.categories-filter-title').text('分類')
    applyFilterSettingFromDropdown()
    updatePillTabs(getCurrentPillTabName())
  }
  // if there are category tags existed, then research all existed category tags | 如果存在相關標籤則重新搜尋所有分類標籤
  let existedCategoriesName = []
  let currentCategoriesName = ''
  let categories = $('.list-group-all > .list-group-item > .categories-tags')
  // get current categories list from all todos 
  categories.find('.d-inline-flex:nth-child(n+2)').each(function () {
    currentCategoriesName = $(this).find('.category-name').text()
    // if currentCategories was added to existedCategoriesName array, then skip the operation
    for (let i = 0; i < existedCategoriesName.length; i++) {
      if (currentCategoriesName === existedCategoriesName[i]) return
    }
    existedCategoriesName.push(currentCategoriesName)
  })
  // clear dropdown list content, write with new list
  $('.categories-filter-menu').empty()
  if (existedCategoriesName.length) {
    // apply category tag, then display reset message | 假如有套用分類名稱，印出取消套用區塊
    if ($('.categories-filter-title').get(0).innerText.trim() !== '分類') {
      $('.categories-filter-menu').prepend(`
      <li><span class="dropdown-item filter-reset pointer">移除套用此分類</span></li>`
      )
    }
    for (let i = 0; i < existedCategoriesName.length; i++) {
      $('.categories-filter-menu').append(`
      <li><span class="dropdown-item category-filter-option pointer">${escapeHtml(existedCategoriesName[i])}</span></li>
      `)
    }
  } 
  // apply none category tag, then display warning message | 假如有套用分類名稱，印出取消套用區塊
  if (!existedCategoriesName.length) {
    $('.categories-filter-menu').append(`
      <li><span class="dropdown-item">您並未有任何分類名稱</span></li>
    `)
  }
}

// update filter icon status
// used for device-width less than 450px
function updateFilterIcon() {
  if (!$('.filter-icon').hasClass('d-none')) {
    let priority_filter = $('.priority-filter-title').get(0).innerText.trim()
    let categories_filter = $('.categories-filter-title').get(0).innerText.trim()

    if (priority_filter !== '優先性' || categories_filter !== '分類') {
      $('.filter-icon').attr('src', './img/filter-right-selected.svg')
      return
    }
    $('.filter-icon').attr('src', '/img/filter-right.svg')
  }
}

// if filter mode is off, then return false
// if filter mode is on, then return true
function checkFilterEnableStatus () {
  let tab_name = getCurrentPillTabName()
  let priority_filter_name = $('.priority-filter-title').get(0).innerText.trim()
  let categories_filter_name = $('.categories-filter-title').get(0).innerText.trim()

  if (tab_name === 'totals' && 
      priority_filter_name === '優先性' &&
      categories_filter_name === '分類') {
      return false
  }
  return true
}

function applyFilterSettingFromDropdown() {
  // get current priority, category filter setting
  let priority_filter_title = $('.priority-filter-title').get(0).innerText.trim()
  let categories_filter_title = $('.categories-filter-title').get(0).innerText.trim()
  let searchedTags = []       // tags where user wants to search | 放置搜尋的標籤
  let tmpSortedTodoList = []  // location where save priority filtered result | 放置優先性排序結果
  // if category filter is set, then push category setting into searched array | 如果有設置分類，則添加到搜尋標籤陣列
  if (categories_filter_title !== '分類') {
    searchedTags.push(categories_filter_title)
  }
  // you can add more filter, then push them into search array | 這邊可以放之後新增的 filter 標籤，加入標籤陣列搜尋

  // reset all | 開始重設，判斷是否將原有 todo 隱藏，刪除所有之前 filter 產生的結果
  $('.list-group-all').children('.list-group-item').filter(function () {
    // ensure todo is filtered ? | 確定 todo 是否為 filter 產生的結果
    let flag_is_filtered = $(this).attr('class').match(/filtered-/)
    // todo is filtered | todo 為 filter 產生的結果
    if (!flag_is_filtered) {
      // if priority filter is set, then hide this | 若優先性被設置，則隱藏
      // if other filters is set, then hide this | 若有其他 filter 屬性，則隱藏
      if (priority_filter_title !== '優先性' || searchedTags.length) {
        $(this).addClass('d-none')
      }
      // if no filter is set, then display this | 若優先性沒有被設置且也沒有其他 filter，則顯示
      if (priority_filter_title === '優先性' && !searchedTags.length) {
        $(this).removeClass('d-none')
      }
    }
    // todo is not filtered | todo 不為 filter 產生的結果
    if (flag_is_filtered) {
      // remove this | 移除
      $(this).remove()
    }
  })
  // if priority is unset, then use original todos order as priority filter result | 如果沒有設置優先性且設置標籤的話，則把原本的 todo 順序當作優先性排序
  if (priority_filter_title === '優先性' && searchedTags.length) {
    $('.list-group-all > .list-group-item').each(function () {
      tmpSortedTodoList.push($(this).clone().addClass('filtered-priority').removeClass('d-none'))
    })
  }
  // if priority is set, then generate result according to filter setting | 如果有設置優先性，則根據設置的清單內容調整
  if (priority_filter_title !== '優先性') {
    if (priority_filter_title === '由高至低') {
      $('.list-group-all > .list-group-item > .categories-tags').find('.d-inline-flex:first-child').each(function () {
        if ($(this).find('.category-name').text() === '優先性：高') {
          tmpSortedTodoList.push($(this).parents('.list-group-item').clone().addClass('filtered-priority').removeClass('d-none'))
        }
      })
      $('.list-group-all > .list-group-item > .categories-tags').find('.d-inline-flex:first-child').each(function () {
        if ($(this).find('.category-name').text() === '優先性：中') {
          tmpSortedTodoList.push($(this).parents('.list-group-item').clone().addClass('filtered-priority').removeClass('d-none'))
        }
      })
      $('.list-group-all > .list-group-item > .categories-tags').find('.d-inline-flex:first-child').each(function () {
        if ($(this).find('.category-name').text() === '優先性：低') {
          tmpSortedTodoList.push($(this).parents('.list-group-item').clone().addClass('filtered-priority').removeClass('d-none'))
        }
      })
    }
    if (priority_filter_title === '由低至高') {
      $('.list-group-all > .list-group-item > .categories-tags').find('.d-inline-flex:first-child').each(function () {
        if ($(this).find('.category-name').text() === '優先性：低') {
          tmpSortedTodoList.push($(this).parents('.list-group-item').clone().addClass('filtered-priority').removeClass('d-none'))
        }
      })
      $('.list-group-all > .list-group-item > .categories-tags').find('.d-inline-flex:first-child').each(function () {
        if ($(this).find('.category-name').text() === '優先性：中') {
          tmpSortedTodoList.push($(this).parents('.list-group-item').clone().addClass('filtered-priority').removeClass('d-none'))
        }
      })
      $('.list-group-all > .list-group-item > .categories-tags').find('.d-inline-flex:first-child').each(function () {
        if ($(this).find('.category-name').text() === '優先性：高') {
          tmpSortedTodoList.push($(this).parents('.list-group-item').clone().addClass('filtered-priority').removeClass('d-none'))
        }
      })
    }
  }
  // save final result | 存放最後輸出結果
  let filterResultTodoList = []  
  // if searched array is empty, then store priority filter result 
  if (!searchedTags.length) {
    filterResultTodoList = tmpSortedTodoList
  }
  // if searched array is not empty, then start to search all todos matched category filter setting
  if (searchedTags.length) {
    for (let i = 0; i < tmpSortedTodoList.length; i++) {
      tmpSortedTodoList[i].find('.categories-tags').each(function () {
        let flag_push = false
        $(this).find('.category-name').each(function () {
          for (let i = 0; i < searchedTags.length; i++) {
            if ($(this).text() === searchedTags[i]) {
              flag_push = true
            }
          }
          if (flag_push) {
            filterResultTodoList.push($(this).parents('.list-group-item').clone().addClass('filtered-category'))
            flag_push = false
          }
        })
      })
    }
  }  
  // add to dom 
  for (let i = 0; i < filterResultTodoList.length; i++) {
    $('.list-group-all').append(filterResultTodoList[i])
  }
}

// get non-filtered todo according to data-to-id attribute
function getOriginalTodo(obj) {
  let todoID
  if ($(obj).hasClass('list-group-item')) {
    todoID = $(obj).attr('data-todo-id')
  } else {
    todoID = $(obj).parents('.list-group-item').attr('data-todo-id')
  }
  let res
  $('.list-group-all').children('.list-group-item').each(function () {
    if (!$(this).attr('class').match(/filtered-/)) {
      if ($(this).attr('data-todo-id') === todoID) {
        res = $(this)
      }
    }
  })
  return res
}

// store uploaded todos into local storage
function storedUploadedTodosIntoLocal() {
  const current_user = getLoginUser()
  const uploadedTodos = {
    current_user,
    current_uploaded_data: getAllUploadData()
  }
  const stored_key = `uploadedTodos-${current_user.account}`
  localStorage.setItem(stored_key, JSON.stringify(uploadedTodos))
}

// get all uploaded todos from local storage, then render all
function getUploadedTodosFromLocal() {
  const current_user = getLoginUser()
  const data = JSON.parse(localStorage.getItem(`uploadedTodos-${current_user.account}`))
  SwitchToLoginState(data.current_uploaded_data)
}

// check if current user has uploaded todos in local storage
function checkCurrentLoginUserHaveLocalUploadedTodos() {
  const current_user = getLoginUser()
  const data = JSON.parse(localStorage.getItem(`uploadedTodos-${current_user.account}`))
  if (data !== null) {
    if (data.current_user.account === current_user.account) {
      return true
    }
    return false
  }
  return false
}

// remove uploaded todos in local storage
function removeUploadedTodosInLocal() {
  const current_user = getLoginUser()
  localStorage.removeItem(`uploadedTodos-${current_user.account}`)
}

const todo = {
  jq: {}
}
// return jQuery object 
function recordCurrentEditedTodoObj (obj) {
  todo.jq = obj
}

function getCurrentEditedTodoObj () {
  return todo.jq
}

const user = {
  nickname: '',
  account: ''
}

function updateLoginUser (nickname, account) {
  user.nickname = nickname,
  user.account = account
}

function getLoginUser () {
  return user
}

module.exports = utils