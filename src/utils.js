const utils = {
  SwitchToLoginState: SwitchToLoginState,
  SwitchToLogoutState: SwitchToLogoutState,
  getAllUploadData: getAllUploadData,
  getUnfinishedTodos: getUnfinishedTodos,
  escapeHtml: escapeHtml
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
    for (let i = 0; i < data.length; i++) {
      // add input content to lists
      if (data[i].checked === 1) {
        $('.list-group-all').prepend(
          `
          <div class="d-flex align-items-center list-group-item todo">
          <input class="flex-shrink-0 form-check-input pointer me-3 " type="checkbox" checked>
          <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p space p-2 me-2 mb-0">${escapeHtml(data[i].content)}</p>
          <img src="/img/info-lg.svg" class="flex-shrink-0 todo-info-icon pointer me-3" alt="Bootstrap-icon" width="18" height="18">
          <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
        </div>
        `
        )
      } else {
        $('.list-group-all').prepend(
          `
        <div class="d-flex align-items-center list-group-item todo">
          <input class="flex-shrink-0 form-check-input pointer me-3 " type="checkbox" >
          <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p space p-2 me-2 mb-0">${escapeHtml(data[i].content)}</p>
          <img src="/img/info-lg.svg" class="flex-shrink-0 todo-info-icon pointer me-3" alt="Bootstrap-icon" width="18" height="18">
          <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
        </div>
        `
        )
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
  $('.list-group-all > .list-group-item > .list-group-item-p').each(function () {
    // use innerText get formatted content (include new line)
    let content = $(this).get(0).innerText
    if ($(this).parent().hasClass('done')) {
      todos.push({
        checked: 1,
        content: content
      })
    } else {
      todos.push({
        checked: 0,
        content: content
      })
    }
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

module.exports = utils