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
        <div class="d-flex align-items-center list-group-item done">
          <input class="flex-shrink-0 form-check-input pointer me-3" type="checkbox" checked >
          <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p p-2 me-4 mb-0 space complete">${escapeHtml(data[i].content)}</p>
          <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
        </div>
        `
        )
      } else {
        $('.list-group-all').prepend(
          `
        <div class="d-flex align-items-center list-group-item todo">
          <input class="flex-shrink-0 form-check-input pointer me-3" type="checkbox" >
          <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p p-2 me-4 mb-0 space">${escapeHtml(data[i].content)}</p>
          <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
        </div>
        `
        )
      }
    }
    getUnfinishedTodos()
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
  $('.todos-remaining').text(`剩餘 ${remainingTodos} 個代辦事項`)
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