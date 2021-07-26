$(document).ready(() => {
  console.log('document loaded completely')
  // if page reloaded, read session state
  OperationByAjax('general', 'reload-get-session')

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
          <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p me-4 mb-0">${escapeHtml($('#input-todo-content').val())}</p>
          <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
        </div>
        `
        )
        // clear input field content
        $('#input-todo-content').val('')
        // update unfinished todo counts
        getUnfinishedTodos()
      } else {
        // show modal view
        $('#emptyInput').modal('show')
      }
    }
  })

  // remove todo (by pressing close button at list-group-all tap)
  $('.list-group-all').on('click', '.btn-close', (e) => {
    $(e.target).parent().fadeOut('fast', () => {
      $(e.target).parent().remove()
      getUnfinishedTodos()
    })
  })

  // clear all finished todos
  $('.btn-clear-todo').click(() => {
    $('.list-group-item.done').fadeOut('fast', () => {
      $('.list-group-item.done').remove()
      getUnfinishedTodos()
    })
  })

  // complete todo (by pressing checkbox at list-group-all top)
  $(".list-group-all").on('click', '.form-check-input', (e) => {
    $(e.target).next().toggleClass('complete')
    $(e.target).parent().toggleClass('todo')
    $(e.target).parent().toggleClass('done')
    getUnfinishedTodos()
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
      $('#emptyUploadTodoContent').modal('show')
      return
    }
    OperationByAjax('button', 'upload-todos')
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
    OperationByAjax('form', 'register')
    // enable spinner animation
    $('.registerModal-form-spinner').toggleClass('hidden')
  })

  // loginModal-form submit event listener
  $('.loginModal-form').submit((e) => {
    e.preventDefault()
    OperationByAjax('form', 'login')
    // enable spinner animation
    $('.loginModal-form-spinner').toggleClass('hidden')
  })

  // confirm logout event listener
  $('.btn-logout-confirm').click(() => {
    $.ajax({
      url: 'handle_logout.php'
    }).done(() => {
      SwitchToLogoutState()
    })
  })

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
          url: 'handle_register.php',
          data: {
            nickname: nickname,
            account: account,
            password: password
          }
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
          url: 'handle_register_login.php',
          data: {
            nickname: nickname,
            account: account,
            password: password
          }
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
          url: 'get_session.php'
        })
          .done((json) => {
            // receive error when get wrong a session variable
            if (json.isSuccessful === 'failed') {
              DisplayModal('form', 'register-get-session', 'done-server-side-error')
              return
            }
            if (json.isSuccessful === 'successful') {
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
        let account = $('#login-form-account').val()
        let password = $('#login-form-password').val()
        $.ajax({
          method: 'POST',
          url: 'handle_login.php',
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
          url: 'get_session.php'
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
              SwitchToLoginState(json.data.nickname)
              OperationByAjax('general', 'get-todos')
            })
          })
          .fail(() => {
            DisplayModal('form', 'login-get-session', 'fail-ajax-error')
          })
      }
      return
    }
    // upload todos 
    if (type === 'button') {
      if (op === 'upload-todos') {
        $.post("handle_store_todos.php", {
          content: JSON.stringify(getAllUploadData())
        })
          .done(json => {
            if (json.isSuccessful === 'successful') {
              DisplayModal('button', 'upload-todos', 'done-upload-todos-successfully')
              return
            }
            if (json.isSuccessful === 'failed') {
              DisplayModal('button', 'upload-todos', 'done-upload-todos-unsuccessfully')
              return
            }
          })
          .fail(() => {
            DisplayModal('button', 'upload-todos', 'fail-ajax-error')
          })
      }
      return
    }
    // when get successful response, it will switch to login state and execute 'get-todos'
    if (type === 'general') {
      if (op === 'reload-get-session') {
        $.ajax({
          url: 'get_session.php'
        })
          .done((json) => {
            if (json.isSuccessful === 'failed') {
              return
            }
            SwitchToLoginState(json.data.nickname)
            OperationByAjax('general', 'get-todos')
          })
          .fail(() => {
            DisplayModal('general', 'reload-get-session', 'fail-ajax-error')
          })
      }
      // get todos from server response
      if (op === 'get-todos') {
        $.ajax({
          method: 'GET',
          url: 'handle_get_todos.php'
        })
          .done((json) => {
            if (json.isSuccessful === 'failed') {
              DisplayModal('general', 'get-todos', 'done-upload-todos-unsuccessfully')
              return
            }

            if (json.isSuccessful === 'successful') {
              SwitchToLoginState(json.data)
              return
            }
          })
          .fail(() => {
            DisplayModal('general', 'get-todos', 'fail-ajax-error')
          })
      }
      return
    } 
  }

  // display multiple modals
  function DisplayModal(type, op, state) {
    if (type === 'form') {
      if (op === 'register') {
        if (state === 'done-existed-register-user') {
          $('#registerModal').modal('hide')
          $('#registerUnsuccessfullyDueToExistedAccount').modal('show')
          // This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete).
          $('#registerUnsuccessfullyDueToExistedAccount').on('hidden.bs.modal', () => {
            $('#registerModal').modal('show')
          })
          return
        }
        if (state === 'done-server-side-error') {
          $('#registerModal').modal('hide')
          $('#registerUnsuccessfullyDueToServerError').modal('show')
          $('#registerUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#registerModal').modal('show')
          })
          return
        }
        if (state === 'done-enroll-successfully') {
          $('#registerModal').modal('hide')
          $('#registerSuccessfully').modal('show')
          return
        }
        if (state === 'fail-ajax-error') {
          $('#registerModal').modal('hide')
          $('#registerUnsuccessfullyDueToServerError').modal('show')
          $('#registerUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#registerModal').modal('show')
          })
          return
        }
        return
      }
      if (op === 'login-after-register') {
        if (state === 'done-server-side-error') {
          $('#registerModal').modal('hide')
          $('#registerUnsuccessfullyDueToServerError').modal('show')
          $('#registerUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#registerModal').modal('show')
          })
          return
        }
        if (state === 'fail-ajax-error') {
          $('#registerModal').modal('hide')
          $('#registerUnsuccessfullyDueToServerError').modal('show')
          $('#registerUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#registerModal').modal('show')
          })
          return
        }
        return
      }
      if (op === 'register-get-session') {
        if (state === 'done-server-side-error') {
          $('#loginModal').modal('hide')
          $('#loginUnsuccessfullyDueToServerError').modal('show')
          $('#loginUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#loginModal').modal('show')
          })
          return
        }
        if (state === 'fail-ajax-error') {
          $('#registerModal').modal('hide')
          $('#registerUnsuccessfullyDueToServerError').modal('show')
          $('#registerUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#registerModal').modal('show')
          })
          return
        }
        return
      }
      if (op === 'login') {
        if (state === 'done-not-existed-account') {
          $('#loginModal').modal('hide')
          $('#loginUnsuccessfullyDueToNotExistedAccount').modal('show')
          $('#loginUnsuccessfullyDueToNotExistedAccount').on('hidden.bs.modal', () => {
            $('#loginModal').modal('show')
          })
          return
        }

        if (state === 'done-server-side-error') {
          $('#loginModal').modal('hide')
          $('#loginUnsuccessfullyDueToServerError').modal('show')
          $('#loginUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#loginModal').modal('show')
          })
          return
        }

        if (state === 'fail-ajax-error') {
          $('#loginModal').modal('hide')
          $('#loginUnsuccessfullyDueToServerError').modal('show')
          $('#loginUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#loginModal').modal('show')
          })
          return
        }
        return
      }
      if (op === 'login-get-session') {
        if (state === 'done-not-existed-account') {
          $('#loginModal').modal('hide')
          $('#loginUnsuccessfullyDueToNotExistedAccount').modal('show')
          $('#loginUnsuccessfullyDueToNotExistedAccount').on('hidden.bs.modal', () => {
            $('#loginModal').modal('show')
          })
          return
        }

        if (state === 'done-server-side-error') {
          $('#loginModal').modal('hide')
          $('#loginUnsuccessfullyDueToServerError').modal('show')
          $('#loginUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#loginModal').modal('show')
          })
          return
        }

        if (state === 'done-login-successfully') {
          $('#loginModal').modal('hide')
          $('#loginSuccessfully').modal('show')
          return
        }

        if (state === 'fail-ajax-error') {
          $('#loginModal').modal('hide')
          $('#loginUnsuccessfullyDueToServerError').modal('show')
          $('#loginUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
            $('#loginModal').modal('show')
          })
          return
        }
        return
      }
      return
    }
    if (type === 'button') {
      if (op === 'upload-todos') {
        if (state === 'fail-ajax-error') {
          $('#ajaxSendErrorModal').modal('show')
          return
        }

        if (state === 'done-upload-todos-successfully') {
          $('#uploadTodoSuccessfully').modal('show')
          return
        }

        if (state === 'done-upload-todos-unsuccessfully') {
          $('#uploadTodoUnsuccessfully').modal('show')
          return
        }
        return
      }
      return
    }
    if (type === 'general') {
      if (op === 'reload-get-session') {
        if (state === 'fail-ajax-error') {
          $('#ajaxSendErrorModal').modal('show')
          return
        }
      }
      if (op === 'get-todos') {
        if (state === 'fail-ajax-error') {
          $('#ajaxSendErrorModal').modal('show')
          return
        }

        if (state === 'done-upload-todos-unsuccessfully') {
          $('#uploadTodoUnsuccessfully').modal('show')
          return
        }
      }
      return
    }
  }
  
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
            <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p me-4 mb-0 complete">${data[i].content}</p>
            <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
          </div>
          `
          )
        } else {
          $('.list-group-all').prepend(
            `
          <div class="d-flex align-items-center list-group-item todo">
            <input class="flex-shrink-0 form-check-input pointer me-3" type="checkbox" >
            <p contenteditable='true' class="flex-grow-1 text-break list-group-item-p me-4 mb-0">${data[i].content}</p>
            <button type="button" class="flex-shrink-0 btn-close px-0 py-0" aria-label="Close"></button>
          </div>
          `
          )
        }
      }
      getUnfinishedTodos()
    }
  }

  // get all todos content information and pack into object array
  function getAllUploadData() {
    // create object array to store todo list
    const todos = []
    // $(this) doesn't work on arrow function, use function instead
    $('.list-group-all > .list-group-item').each(function () {
      const content = $(this).find('.list-group-item-p').text()
      if ($(this).hasClass('done')) {
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
})