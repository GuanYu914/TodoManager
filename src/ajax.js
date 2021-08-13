const utils = require('./utils')
const modal = require('./modal')

const ajax = {
  OperationByAjax: OperationByAjax,
}

// list ajax requests and operations
function OperationByAjax(type, op) {
  if (type === 'form') {
    // when get successful response, it will execute 'login-after-register'
    if (op === 'register') {
      // get necessary post data
      let nickname = $('#registerModal-form-nickName').val()
      let account = $('#registerModal-form-account').val()
      let password = $('#registerModal-form-password').val()
      $.ajax({
        method: 'POST',
        url: 'http://192.168.0.15/todo_manager/handle_register.php',
        data: {
          nickname: nickname,
          account: account,
          password: password
        },
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          // hide spinner animation
          $('.registerModal-form-spinner').toggleClass('hidden')
          // existed register user founded in database
          if (json.isSuccessful === 'failed' && json.displayError === 'true') {
            modal.DisplayModal('form', 'register', 'done-existed-register-user')
            return
          }
          // receive server-side error from server
          if (json.isSuccessful === 'failed') {
            modal.DisplayModal('form', 'register', 'done-server-side-error')
            return
          }
          // enroll successfully
          if (json.isSuccessful === 'successful') {
            modal.DisplayModal('form', 'register', 'done-enroll-successfully')
            // remove 'hidden.bs.modal' event handler to prevent execute multiple times 
            $('#registerSuccessfully').off('hidden.bs.modal').on('hidden.bs.modal', () => {
              // send an ajax request to login directly
              OperationByAjax('form', 'login-after-register')
            })
            return
          }
        })
        .fail(() => {
          // hide spinner animation
          $('.registerModal-form-spinner').toggleClass('hidden')
          modal.DisplayModal('form', 'register', 'fail-ajax-error')
        })
    }
    // when get successful response, it will execute 'register-get-session'
    if (op === 'login-after-register') {
      // get necessary post data
      let nickname = $('#registerModal-form-nickName').val()
      let account = $('#registerModal-form-account').val()
      let password = $('#registerModal-form-password').val()
      $.ajax({
        method: 'POST',
        url: 'http://192.168.0.15/todo_manager/handle_register_login.php',
        data: {
          nickname: nickname,
          account: account,
          password: password
        },
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          if (json.isSuccessful === 'failed') {
            modal.DisplayModal('form', 'login-after-register', 'done-server-side-error')
            return
          }
          if (json.isSuccessful === 'successful') {
            // send an ajax request to get a session variable
            OperationByAjax('form', 'register-get-session')
            return
          }
        })
        .fail(() => {
          modal.DisplayModal('form', 'login-after-register', 'fail-ajax-error')
        })
    }
    // when get successful response, it will switch to login state
    if (op === 'register-get-session') {
      $.ajax({
        url: 'http://192.168.0.15/todo_manager/get_session.php',
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          // receive error when get wrong a session variable
          if (json.isSuccessful === 'failed') {
            modal.DisplayModal('form', 'register-get-session', 'done-server-side-error')
            return
          }
          if (json.isSuccessful === 'successful') {
            utils.SwitchToLoginState(json.data.nickname)
            OperationByAjax('general', 'get-todos')
          }
        })
        .fail(() => {
          modal.DisplayModal('form', 'register-get-session', 'fail-ajax-error')
        })
    }
    // when get successful response, it will execute 'login-get-session'
    if (op === 'login') {
      let account = $('#login-form-account').val()
      let password = $('#login-form-password').val()
      $.ajax({
        method: 'POST',
        url: 'http://192.168.0.15/todo_manager/handle_login.php',
        xhrFields: { withCredentials: true },
        data: {
          account: account,
          password: password
        }
      })
        .done((json) => {
          // hide spinner animation
          $('.loginModal-form-spinner').toggleClass('hidden')
          if (json.isSuccessful === 'failed' && json.displayError === 'true') {
            modal.DisplayModal('form', 'login', 'done-not-existed-account')
            return
          }
          // receive server-side error form server 
          if (json.isSuccessful === 'failed') {
            modal.DisplayModal('form', 'login', 'done-server-side-error')
            return
          }
          // login successfully
          if (json.isSuccessful === 'successful') {
            // send an ajax request to get a session variable
            OperationByAjax('form', 'login-get-session')
            return
          }
        })
        .fail(() => {
          // hide spinner animation
          $('.loginModal-form-spinner').toggleClass('hidden')
          modal.DisplayModal('form', 'login', 'fail-ajax-error')
        })
    }
    // when get successful response, it will switch to login state and execute 'get-todos'
    if (op === 'login-get-session') {
      $.ajax({
        url: 'http://192.168.0.15/todo_manager/get_session.php',
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          // receive error when get wrong a session variable
          if (json.isSuccessful === 'failed') {
            modal.DisplayModal('form', 'login-get-session', 'done-server-side-error')
            return
          }
          modal.DisplayModal('form', 'login-get-session', 'done-login-successfully')
          // remove 'hidden.bs.modal' event handler to prevent execute multiple times 
          $('#loginSuccessfully').off('hidden.bs.modal').on('hidden.bs.modal', () => {
            utils.SwitchToLoginState(json.data.nickname)
            OperationByAjax('general', 'get-todos')
          })
        })
        .fail(() => {
          modal.DisplayModal('form', 'login-get-session', 'fail-ajax-error')
        })
    }
    return
  }
  // upload todos 
  if (type === 'button') {
    if (op === 'upload-todos') {
      $.post({
        url: "http://192.168.0.15/todo_manager/handle_store_todos.php",
        xhrFields: { withCredentials: true }
      }, {
        content: JSON.stringify(utils.getAllUploadData())
      })
        .done(json => {
          if (json.isSuccessful === 'successful') {
            modal.DisplayModal('button', 'upload-todos', 'done-upload-todos-successfully')
            return
          }
          if (json.isSuccessful === 'failed') {
            modal.DisplayModal('button', 'upload-todos', 'done-upload-todos-unsuccessfully')
            return
          }
        })
        .fail(() => {
          modal.DisplayModal('button', 'upload-todos', 'fail-ajax-error')
        })
      return
    }
    if (op === 'logout') {
      $.ajax({
        url: 'http://192.168.0.15/todo_manager/handle_logout.php',
        xhrFields: { withCredentials: true }
      })
      .done(() => {
        utils.SwitchToLogoutState()
      })
      .fail(() => {
        modal.DisplayModal('button', 'logout', 'fail-ajax-error')
      })
      return
    }
    return
  }
  // when get successful response, it will switch to login state and execute 'get-todos'
  if (type === 'general') {
    if (op === 'reload-get-session') {
      $.ajax({
        url: 'http://192.168.0.15/todo_manager/get_session.php',
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          if (json.isSuccessful === 'failed') {
            return
          }
          utils.SwitchToLoginState(json.data.nickname)
          OperationByAjax('general', 'get-todos')
        })
        .fail(() => {
          modal.DisplayModal('general', 'reload-get-session', 'fail-ajax-error')
        })
    }
    // get todos from server response
    if (op === 'get-todos') {
      $.ajax({
        method: 'GET',
        url: 'http://192.168.0.15/todo_manager/handle_get_todos.php',
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          if (json.isSuccessful === 'failed') {
            modal.DisplayModal('general', 'get-todos', 'done-upload-todos-unsuccessfully')
            return
          }

          if (json.isSuccessful === 'successful') {
            utils.SwitchToLoginState(json.data)
            return
          }
        })
        .fail(() => {
          modal.DisplayModal('general', 'get-todos', 'fail-ajax-error')
        })
    }
    return
  }
}

module.exports = ajax