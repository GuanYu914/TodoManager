const utils = {
  SwitchToLoginState: SwitchToLoginState,
  SwitchToLogoutState: SwitchToLogoutState,
  getAllUploadData: getAllUploadData,
  getUnfinishedTodos: getUnfinishedTodos,
  escapeHtml: escapeHtml,
  recordCurrentEditedTodoObj: recordCurrentEditedTodoObj,
  getCurrentEditedTodoObj: getCurrentEditedTodoObj
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
    // data = escapeHtml(data)
    $('.profile-nickname').text(`${data}, 您好`)
    $('.profile').toggleClass('d-none')
    // show upload todos button
    $('.btn-store-on-db').toggleClass('d-none')
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
      <h4 class="d-inline">
        <span class="align-middle badge rounded-pill bg-secondary">
          <span class="align-middle category-name">${escapeHtml(categories[0])}</span>
        </span>
      </h4>\n
      `
      for (let i = 1; i < categories.length; i++) {
        categories_htmlCode += `
        <h4 class="d-inline">
          <span class="align-middle badge rounded-pill bg-secondary">
            <span class="align-middle category-name">${escapeHtml(categories[i])}</span>
            <button type="button" class="align-middle btn-close btn-close-white px-0 py-0" aria-label="Close"></button>
          </span>
        </h4>\n 
        `
      }
      // add to all todos tab
      if (data[i].checked === 1) {
       $('.list-group-all').prepend(`
       <div class="list-group-item todo">
          <div class="categories-tags">
            ${categories_htmlCode}
          </div>
          <div class="d-flex list-group-item-user-operation align-items-center mt-2">
            <input class="flex-shrink-0 form-check-input pointer me-3 " type="checkbox" checked>
            <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p space complete p-2 me-2 mb-0">${escapeHtml(data[i].content)}</p>
            <img src="/img/info-lg.svg" class="flex-shrink-0 todo-info-icon pointer me-3" alt="Bootstrap-icon" width="18" height="18">
            <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
          </div>
          <div class="comment-block text-secondary space mt-2">${escapeHtml(data[i].comment)}</div>
        </div>
       `)
      } else {
        $('.list-group-all').prepend(`
        <div class="list-group-item todo">
           <div class="categories-tags">
             ${categories_htmlCode}
           </div>
           <div class="d-flex list-group-item-user-operation align-items-center mt-2">
             <input class="flex-shrink-0 form-check-input pointer me-3 " type="checkbox">
             <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p space p-2 me-2 mb-0">${escapeHtml(data[i].content)}</p>
             <img src="/img/info-lg.svg" class="flex-shrink-0 todo-info-icon pointer me-3" alt="Bootstrap-icon" width="18" height="18">
             <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
           </div>
           <div class="comment-block text-secondary space mt-2">${escapeHtml(data[i].comment)}</div>
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
  // show upload todos button
  $('.btn-store-on-db').toggleClass('d-none')
  // remove all previous stored todos
  $('.list-group-all').empty()
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
    // get checked button status
    let checked, content, categories, priority, comment
    if ($(this).hasClass('done')) {
      checked = 1
    } else {
      checked = 0
    }
    // get content
    content = $(this).find('.list-group-item-p').text()
    // get categories
    // use trim to remove space character in both ends of string 
    categories = $(this).find('.categories-tags').get(0).innerText.trim()
    console.log(categories)
    priorityText = categories.replace(/\s+/g, ' ').split(' ')[0]
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
      categories: categories,
      comment: comment,
      priority: priority
    })
  })
  return todos
}

// count number of todos needed to be finished
function getUnfinishedTodos() {
  const remainingTodos = $('.list-group-all > .todo').length
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

module.exports = utils