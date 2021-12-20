const {
  SwitchToLoginState,
  SwitchToLogoutState,
  packAllTodos,
  updateLoginUser,
  storedTodosIntoLocal,
  checkCurrentLoginUserHaveLocalTodos,
  checkGuestHaveLocalTodos,
  getTodosFromLocal,
  removeUploadedTodosInLocal,
} = require('./utils')
const {DisplayModal} = require('./modal')
const {APIsURL} = require('./constant');

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
        url: `${APIsURL}/handle_register.php`,
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
            DisplayModal('form', 'register', 'done-existed-register-user')
            return
          }
          // receive server-side error from server
          if (json.isSuccessful === 'failed') {
            DisplayModal('form', 'register', 'done-server-side-error')
            return
          }
          // enroll successfully
          if (json.isSuccessful === 'successful') {
            DisplayModal('form', 'register', 'done-enroll-successfully')
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
          DisplayModal('form', 'register', 'fail-ajax-error')
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
        url: `${APIsURL}/handle_register_login.php`,
        data: {
          nickname: nickname,
          account: account,
          password: password
        },
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          if (json.isSuccessful === 'failed') {
            DisplayModal('form', 'login-after-register', 'done-server-side-error')
            return
          }
          if (json.isSuccessful === 'successful') {
            // send an ajax request to get a session variable
            OperationByAjax('form', 'register-get-session')
            return
          }
        })
        .fail(() => {
          DisplayModal('form', 'login-after-register', 'fail-ajax-error')
        })
    }
    // when get successful response, it will switch to login state
    if (op === 'register-get-session') {
      $.ajax({
        url: `${APIsURL}/get_session.php`,
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          // receive error when get wrong a session variable
          if (json.isSuccessful === 'failed') {
            DisplayModal('form', 'register-get-session', 'done-server-side-error')
            return
          }
          if (json.isSuccessful === 'successful') {
            updateLoginUser(true, json.data.nickname, json.data.account)
            SwitchToLoginState(json.data.nickname)
            OperationByAjax('general', 'get-todos')
          }
        })
        .fail(() => {
          DisplayModal('form', 'register-get-session', 'fail-ajax-error')
        })
    }
    // when get successful response, it will execute 'login-get-session'
    if (op === 'login') {
      let account = $('#loginModal-form-account').val()
      let password = $('#loginModal-form-password').val()
      $.ajax({
        method: 'POST',
        url: `${APIsURL}/handle_login.php`,
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
            DisplayModal('form', 'login', 'done-not-existed-account')
            return
          }
          // receive server-side error form server 
          if (json.isSuccessful === 'failed') {
            DisplayModal('form', 'login', 'done-server-side-error')
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
          DisplayModal('form', 'login', 'fail-ajax-error')
        })
    }
    // when get successful response, it will switch to login state and execute 'get-todos'
    if (op === 'login-get-session') {
      $.ajax({
        url: `${APIsURL}/get_session.php`,
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          // receive error when get wrong a session variable
          if (json.isSuccessful === 'failed') {
            DisplayModal('form', 'login-get-session', 'done-server-side-error')
            return
          }
          DisplayModal('form', 'login-get-session', 'done-login-successfully')
          // remove 'hidden.bs.modal' event handler to prevent execute multiple times 
          $('#loginSuccessfully').off('hidden.bs.modal').on('hidden.bs.modal', () => {
            updateLoginUser(true, json.data.nickname, json.data.account)
            SwitchToLoginState(json.data.nickname)
            OperationByAjax('general', 'get-todos')
          })
        })
        .fail(() => {
          DisplayModal('form', 'login-get-session', 'fail-ajax-error')
        })
    }
    // update nickname, password of user
    if (op === 'update-user') {
      let nickname = $('#editProfileModal-form-nickname').val()
      let password = $('#editProfileModal-form-password').val()
      $.ajax({
        method: 'POST',
        url: `${APIsURL}/handle_update_user.php`,
        xhrFields: { withCredentials: true },
        data: {
          nickname: nickname,
          password: password
        }
      })
        .done((json) => {
          // hide spinner animation
          $('.editProfileModal-form-spinner').toggleClass('hidden')
          if (json.isSuccessful === 'failed') {
            DisplayModal('form', 'update-user', 'done-server-side-error')
            return
          }
          // logout after hiding this modal
          DisplayModal('form', 'update-user', 'done-update-profile-successfully', () => {
            OperationByAjax('button', 'logout')
          })
        })
        .fail(() => {
          // hide spinner animation
          $('.editProfileModal-form-spinner').toggleClass('hidden')
          DisplayModal('form', 'update-user', 'fail-ajax-error')
        }) 
    }
    return
  }
  if (type === 'button') {
    // destroy session 
    if (op === 'logout') {
      $.ajax({
        url: `${APIsURL}/handle_logout.php`,
        xhrFields: { withCredentials: true }
      })
      .done(() => {
        // set user to guest, and fetch local todos
        updateLoginUser(false)
        if(checkGuestHaveLocalTodos()){
          SwitchToLogoutState(getTodosFromLocal())
          return
        }
        // no local todos to fetch
        SwitchToLogoutState();
      })
      .fail(() => {
        DisplayModal('button', 'logout', 'fail-ajax-error')
      })
    }
    return
  }
  // when get successful response, it will switch to login state and execute 'get-todos'
  if (type === 'general') {
    if (op === 'reload-get-session') {
      $.ajax({
        url: `${APIsURL}/get_session.php`,
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          // user is guest
          if (json.isSuccessful === 'failed') {
            updateLoginUser(false)
            if(checkGuestHaveLocalTodos()){
              SwitchToLogoutState(getTodosFromLocal())
              return
            }
            SwitchToLogoutState();
            return
          }
          // user is member, get todos from server
          updateLoginUser(true, json.data.nickname, json.data.account)
          SwitchToLoginState(json.data.nickname)
          OperationByAjax('general', 'get-todos')
        })
        .fail(() => {
          DisplayModal('general', 'reload-get-session', 'fail-ajax-error')
        })
        return
    }
    // upload todos of current user to server
    if (op === 'upload-todos') {
      $.post({
        url: `${APIsURL}/handle_store_todos.php`,
        xhrFields: { withCredentials: true }
      }, {
        content: JSON.stringify(packAllTodos())
      })
        .done(json => {
          if (json.isSuccessful === 'successful') {
            // remove any uploaded todos on local storage
            removeUploadedTodosInLocal()
            return
          }
          if (json.isSuccessful === 'failed') {
            // write uploaded todos into local storage
            storedTodosIntoLocal()
            // display modal about storing current todos into local storage
            DisplayModal('general', 'upload-todos', 'done-upload-todos-unsuccessfully')
            return
          }
        })
        .fail(() => {
          // write uploaded todos into local storage
          storedTodosIntoLocal()
          // display modal about storing current todos into local storage
          DisplayModal('general', 'upload-todos', 'done-upload-todos-unsuccessfully')
        })
      return
    }
    // get todos from server response
    if (op === 'get-todos') {
      $.ajax({
        method: 'GET',
        url: `${APIsURL}/handle_get_todos.php`,
        xhrFields: { withCredentials: true }
      })
        .done((json) => {
          if (json.isSuccessful === 'failed') {
            // check local storage first, if it existed, then show modal about current todos info is located in local storage
            if (checkCurrentLoginUserHaveLocalTodos()) {
              SwitchToLoginState(getTodosFromLocal())
              DisplayModal('general', 'get-todos', 'done-get-todos-locally')
              return
            }
            // if it is doesn't, show server-side error modal
            DisplayModal('general', 'get-todos', 'fail-ajax-error')
          }
          if (json.isSuccessful === 'successful') {
            if (checkCurrentLoginUserHaveLocalTodos()) {
              // get todos from local storage
              SwitchToLoginState(getTodosFromLocal())
              // display modal about current todos info is located in local storage
              DisplayModal('general', 'get-todos', 'done-get-todos-locally')
              return
            }
            // if no todos are located in local storage, get todos data from json response
            SwitchToLoginState(json.data)
            return
          }
        })
        .fail(() => {
          // check local storage first, if it existed, then show modal about current todos info is located in local storage
          if (checkCurrentLoginUserHaveLocalTodos()) {
            getTodosFromLocal()
            DisplayModal('general', 'get-todos', 'done-get-todos-locally')
            return
          }
          // if it is doesn't, show server-side error modal
          DisplayModal('general', 'get-todos', 'fail-ajax-error')
        })
    }
    return
  }
}

module.exports = {
  OperationByAjax: OperationByAjax,
}