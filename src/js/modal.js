const modal = {
  DisplayModal: DisplayModal
}

// add modal flash message
function InsertFlashModal(modalName, cb) {
  if (modalName === 'emptyInput') {
    // select modal list container, then add relative modal
    $('.modal-block').append(`
    <div class="modal fade" id="emptyInput" tabindex="-1" aria-labelledby="輸入注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">請輸入代辦事項內容</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            請輸入內容才能幫您紀錄喔
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'clearAllTodosUnderFilterMode') {
    $('.modal-block').append(`
    <div class="modal fade" id="clearAllTodosUnderFilterMode" tabindex="-1" aria-labelledby="貼心提醒" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">貼心提醒</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            目前的代辦清單是被過濾的，執行此操作可能會清除掉目前清單以外的代辦事項<br>
            點擊 " 我知道了 "，將套用此操作
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">先不要好了</button>
            <button type="button" class="btn btn-primary btn-op-under-filter-mode-confirm" data-bs-dismiss="modal" data-op-name="clearAllTodos">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'deleteTodoModal') {
    $('.modal-block').append(`
    <div class="modal fade" id="deleteTodoModal" tabindex="-1" aria-labelledby="貼心提醒" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">貼心提醒</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            確定要刪除此代辦事項嗎？
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">先不要好了</button>
            <button type="button" class="btn btn-primary btn-remove-todo-confirm" data-bs-dismiss="modal" data-op-name="clearAllTodos">對</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'registerUnsuccessfullyDueToExistedAccount') {
    $('.modal-block').append(`
    <div class="modal fade" id="registerUnsuccessfullyDueToExistedAccount" tabindex="-1" aria-labelledby="註冊注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">註冊失敗</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            此帳號名稱已經被人使用，請換另外一組
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'registerUnsuccessfullyDueToServerError') {
    $('.modal-block').append(`
    <div class="modal fade" id="registerUnsuccessfullyDueToServerError" tabindex="-1" aria-labelledby="註冊注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">註冊失敗</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            伺服器發生錯誤，請稍後再試一次
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'registerSuccessfully') {
    $('.modal-block').append(`
    <div class="modal fade" id="registerSuccessfully" tabindex="-1" aria-labelledby="註冊注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">註冊成功</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            點擊 " 我知道了 "，將自動登入...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary btn-login" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'loginUnsuccessfullyDueToServerError') {
    $('.modal-block').append(`
    <div class="modal fade" id="loginUnsuccessfullyDueToServerError" tabindex="-1" aria-labelledby="登入注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">登入失敗</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            伺服器發生錯誤，請稍後再試一次
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return 
  }
  if (modalName === 'loginUnsuccessfullyDueToNotExistedAccount') {
    $('.modal-block').append(`
    <div class="modal fade" id="loginUnsuccessfullyDueToNotExistedAccount" tabindex="-1" aria-labelledby="登入注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">登入失敗</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            找不到此用戶帳密，請確認帳密是否有誤
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'loginSuccessfully') {
    $('.modal-block').append(`
    <div class="modal fade" id="loginSuccessfully" tabindex="-1" aria-labelledby="登入注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">登入成功</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            成功登入
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'emptyUploadTodoContent') {
    $('.modal-block').append(`
    <div class="modal fade" id="emptyUploadTodoContent" tabindex="-1" aria-labelledby="上傳注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">上傳代辦事項</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            代辦事項沒有內容無法上傳
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'ajaxSendErrorModal') {
    $('.modal-block').append(`
    <div class="modal fade" id="ajaxSendErrorModal" tabindex="-1" aria-labelledby="注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">網路異常</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            無法與伺服器通訊，請稍後再試試
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'uploadTodoUnsuccessfully') {
    $('.modal-block').append(`
    <div class="modal fade" id="uploadTodoUnsuccessfully" tabindex="-1" aria-labelledby="上傳注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">上傳代辦事項</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            無法上傳代辦事項到伺服器，已經將目前所有代辦事項離線儲存，若系統恢復正常，管家將自動上傳
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'updateUserSuccessfully') {
    $('.modal-block').append(`
    <div class="modal fade" id="updateUserSuccessfully" tabindex="-1" aria-labelledby="用戶更新注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">更新用戶資訊</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            更新用戶資訊成功，即將自動登出，請使用修改的密碼登入
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'updateUserUnsuccessfullyDueToServerError') {
    $('.modal-block').append(`
    <div class="modal fade" id="updateUserUnsuccessfullyDueToServerError" tabindex="-1" aria-labelledby="用戶更新注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">更新用戶資訊失敗</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            伺服器發生錯誤，請稍後再試一次
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'getTodoUnsuccessfully') {
    $('.modal-block').append(`
    <div class="modal fade" id="getTodoUnsuccessfully" tabindex="-1" aria-labelledby="貼心提醒" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">貼心提醒</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            伺服器發生錯誤，請稍後再試一次
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
  if (modalName === 'getTodoLocally') {
    $('.modal-block').append(`
    <div class="modal fade" id="getTodoLocally" tabindex="-1" aria-labelledby="貼心提醒" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">貼心提醒</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            目前代辦事項為離線儲存，等系統恢復正常，管家將自動上傳
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    `)
    cb()
    return
  }
}

// remove modal flash message
function RemoveFlashModal(modalName, cb) {
  if (modalName === 'emptyInput') {
    $('#emptyInput').on('hidden.bs.modal', () => {
      cb()
      $('#emptyInput').remove()
    })
    return
  }
  if (modalName === 'clearAllTodosUnderFilterMode') {
    $('#clearAllTodosUnderFilterMode').on('hidden.bs.modal', () => {
      cb()
      $('#clearAllTodosUnderFilterMode').remove()
    })
  }
  if (modalName === 'deleteTodoModal') {
    $('#deleteTodoModal').on('hidden.bs.modal', () => {
      cb()
      $('#deleteTodoModal').remove()
    })
  }
  if (modalName === 'registerUnsuccessfullyDueToExistedAccount') {
    $('#registerUnsuccessfullyDueToExistedAccount').on('hidden.bs.modal', () => {
      cb()
      $('#registerUnsuccessfullyDueToExistedAccount').remove()
    })
    return
  }
  if (modalName === 'registerUnsuccessfullyDueToServerError') {
    $('#registerUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
      cb()
      $('#registerUnsuccessfullyDueToServerError').remove()
    })
    return
  }
  if (modalName === 'loginUnsuccessfullyDueToServerError') {
    $('#loginUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
      cb()
      $('#loginUnsuccessfullyDueToServerError').remove()
    })
    return
  }
  if (modalName === 'registerSuccessfully') {
    $('#registerSuccessfully').on('hidden.bs.modal', () => {
      cb()
      $('#registerSuccessfully').remove()
    })
    return
  }
  if (modalName === 'loginUnsuccessfullyDueToNotExistedAccount') {
    $('#loginUnsuccessfullyDueToNotExistedAccount').on('hidden.bs.modal', () => {
      cb()
      $('#loginUnsuccessfullyDueToNotExistedAccount').remove()
    })
    return
  }
  if (modalName === 'loginSuccessfully') {
    $('#loginSuccessfully').on('hidden.bs.modal', () => {
      cb()
      $('#loginSuccessfully').remove()
    })
    return
  }
  if (modalName === 'emptyUploadTodoContent') {
    $('#emptyUploadTodoContent').on('hidden.bs.modal', () => {
      cb()
      $('#emptyUploadTodoContent').remove()
    })
    return
  }
  if (modalName === 'ajaxSendErrorModal') {
    $('#ajaxSendErrorModal').on('hidden.bs.modal', () => {
      cb()
      $('#ajaxSendErrorModal').remove()
    })
    return
  }
  if (modalName === 'uploadTodoUnsuccessfully') {
    $('#uploadTodoUnsuccessfully').on('hidden.bs.modal', () => {
      cb()
      $('#uploadTodoUnsuccessfully').remove()
    })
    return
  }
  if (modalName === 'updateUserSuccessfully') {
    $('#updateUserSuccessfully').on('hidden.bs.modal', () => {
      cb()
      $('#updateUserSuccessfully').remove()
    })
    return
  }
  if (modalName === 'updateUserUnsuccessfullyDueToServerError') {
    $('#updateUserUnsuccessfullyDueToServerError').on('hidden.bs.modal', () => {
      cb()
      $('#updateUserUnsuccessfullyDueToServerError').remove()
    })
  }
  if (modalName === 'getTodoUnsuccessfully') {
    $('#getTodoUnsuccessfully').on('hidden.bs.modal', () => {
      cb()
      $('#getTodoUnsuccessfully').remove()
    })
  }
  if (modalName === 'getTodoLocally') {
    $('#getTodoLocally').on('hidden.bs.modal', () => {
      cb()
      $('#getTodoLocally').remove()
    })
  }
}

// display multiple modals
function DisplayModal(type, op, state, cb) {
  if (type === 'input') {
    if (op === 'submit') {
      if (state === 'empty-content') {
        InsertFlashModal('emptyInput', () => {
          $('#emptyInput').modal('show')
        })
        RemoveFlashModal('emptyInput', () => {})
        return
      }
      return
    }
    return
  }
  if (type === 'form') {
    if (op === 'register') {
      if (state === 'done-existed-register-user') {
        $('#registerModal').modal('hide')
        InsertFlashModal('registerUnsuccessfullyDueToExistedAccount', () => {
          $('#registerUnsuccessfullyDueToExistedAccount').modal('show')
        })
        RemoveFlashModal('registerUnsuccessfullyDueToExistedAccount', () => {
          $('#registerModal').modal('show')
        })
        return
      }
      if (state === 'done-server-side-error') {
        $('#registerModal').modal('hide')
        InsertFlashModal('registerUnsuccessfullyDueToServerError', () => {
          $('#registerUnsuccessfullyDueToServerError').modal('show')
        })
        RemoveFlashModal('registerUnsuccessfullyDueToServerError', () => {
          $('#registerModal').modal('show')
        })
        return
      }
      if (state === 'done-enroll-successfully') {
        $('#registerModal').modal('hide')
        InsertFlashModal('registerSuccessfully', () => {
          $('#registerSuccessfully').modal('show')
        })
        RemoveFlashModal('registerSuccessfully', () => {})
        return
      }
      if (state === 'fail-ajax-error') {
        $('#registerModal').modal('hide')
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {
          $('#registerModal').modal('show')
        })
        return
      }
      return
    }
    if (op === 'login-after-register') {
      if (state === 'done-server-side-error') {
        $('#registerModal').modal('hide')
        InsertFlashModal('registerUnsuccessfullyDueToServerError', () => {
          $('#registerUnsuccessfullyDueToServerError').modal('show')
        })
        RemoveFlashModal('registerUnsuccessfullyDueToServerError', () => {
          $('#registerModal').modal('show')
        })
        return
      }
      if (state === 'fail-ajax-error') {
        $('#registerModal').modal('hide')
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {
          $('#registerModal').modal('show')
        })
        return
      }
      return
    }
    if (op === 'register-get-session') {
      if (state === 'done-server-side-error') {
        $('#loginModal').modal('hide')
        InsertFlashModal('loginUnsuccessfullyDueToServerError', () => {
        $('#loginUnsuccessfullyDueToServerError').modal('show')
        })
        RemoveFlashModal('loginUnsuccessfullyDueToServerError', () => {
          $('#loginModal').modal('show')
        })
        return
      }
      if (state === 'fail-ajax-error') {
        $('#registerModal').modal('hide')
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {
          $('#registerModal').modal('show')
        })
        return
      }
      return
    }
    if (op === 'login') {
      if (state === 'done-not-existed-account') {
        $('#loginModal').modal('hide')
        InsertFlashModal('loginUnsuccessfullyDueToNotExistedAccount', () => {
          $('#loginUnsuccessfullyDueToNotExistedAccount').modal('show')
        })
        RemoveFlashModal('loginUnsuccessfullyDueToNotExistedAccount', () => {
          $('#loginModal').modal('show')
        })
        return
      }
      if (state === 'done-server-side-error') {
        $('#loginModal').modal('hide')
        InsertFlashModal('loginUnsuccessfullyDueToServerError', () => {
          $('#loginUnsuccessfullyDueToServerError').modal('show')
        })
        RemoveFlashModal('loginUnsuccessfullyDueToServerError', () => {
          $('#loginModal').modal('show')
        })
        return
      }
      if (state === 'fail-ajax-error') {
        $('#loginModal').modal('hide')
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {
          $('#loginModal').modal('show')
        })
        return
      }
      return
    }
    if (op === 'login-get-session') {
      if (state === 'done-not-existed-account') {
        $('#loginModal').modal('hide')
        InsertFlashModal('loginUnsuccessfullyDueToNotExistedAccount', () => {
          $('#loginUnsuccessfullyDueToNotExistedAccount').modal('show')
        })
        RemoveFlashModal('loginUnsuccessfullyDueToNotExistedAccount', () => {
          $('#loginModal').modal('show')
        })
        return
      }
      if (state === 'done-server-side-error') {
        $('#loginModal').modal('hide')
        InsertFlashModal('loginUnsuccessfullyDueToServerError', () => {
          $('#loginUnsuccessfullyDueToServerError').modal('show')
        })
        RemoveFlashModal('loginUnsuccessfullyDueToServerError', () => {
          $('#loginModal').modal('show')
        })
        return
      }
      if (state === 'done-login-successfully') {
        $('#loginModal').modal('hide')
        InsertFlashModal('loginSuccessfully', () => {
          $('#loginSuccessfully').modal('show')
        })
        RemoveFlashModal('loginSuccessfully', () => {})
        return
      }
      if (state === 'fail-ajax-error') {
        $('#loginModal').modal('hide')
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {
          $('#loginModal').modal('show')
        })
        return
      }
      return
    }
    if (op === 'update-user') {
      if (state === 'done-server-side-error') {
        $('#editProfileModal').modal('hide')
        InsertFlashModal('updateUserUnsuccessfullyDueToServerError', () => {
          $('#updateUserUnsuccessfullyDueToServerError').modal('show')
        })
        RemoveFlashModal('updateUserUnsuccessfullyDueToServerError', () => {
          $('#editProfileModal').modal('show')
        })
        return
      }
      if (state === 'done-update-profile-successfully') {
        $('#editProfileModal').modal('hide')
        InsertFlashModal('updateUserSuccessfully', () => {
          $('#updateUserSuccessfully').modal('show')
        })
        RemoveFlashModal('updateUserSuccessfully', () => {
          cb()
        })
        return
      }
      if (state === 'fail-ajax-error') {
        $('#editProfileModal').modal('hide')
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {
          $('#editProfileModal').modal('show')
        })
        return
      }
      return
    }
    return
  }
  if (type === 'button') {
    if (op === 'clear-todos') {
      if (state === 'under-filter-mode') {
        InsertFlashModal('clearAllTodosUnderFilterMode', () => {
          $('#clearAllTodosUnderFilterMode').modal('show')
        })
        RemoveFlashModal('clearAllTodosUnderFilterMode', () => {})
        return
      }
    }
    if (op === 'logout') {
      if (state === 'fail-ajax-error') {
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {})
      }
      return
    }
    if (op === 'delete-todo') {
      if (state === 'confirmation') {
        InsertFlashModal('deleteTodoModal', () => {
          $('#deleteTodoModal').modal('show')
        })
        RemoveFlashModal('deleteTodoModal', () => {})
        return 
      }
    }
    return
  }
  if (type === 'general') {
    if (op === 'reload-get-session') {
      if (state === 'fail-ajax-error') {
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {})
        return
      }
      return
    }
    if (op === 'upload-todos') {
      if (state === 'empty-uploaded-content') {
        InsertFlashModal('emptyUploadTodoContent', () => {
          $('#emptyUploadTodoContent').modal('show')
        })
        RemoveFlashModal('emptyUploadTodoContent', () => {})
        return
      }
      if (state === 'fail-ajax-error') {
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {})
        return
      }
      if (state === 'done-upload-todos-unsuccessfully') {
        InsertFlashModal('uploadTodoUnsuccessfully', () => {
          $('#uploadTodoUnsuccessfully').modal('show')
        })
        RemoveFlashModal('uploadTodoUnsuccessfully', () => {})
        return
      }
      return
    }
    if (op === 'get-todos') {
      if (state === 'fail-ajax-error') {
        InsertFlashModal('ajaxSendErrorModal', () => {
          $('#ajaxSendErrorModal').modal('show')
        })
        RemoveFlashModal('ajaxSendErrorModal', () => {})
        return
      }
      if (state === 'done-get-todos-locally') {
        InsertFlashModal('getTodoLocally', () => {
          $('#getTodoLocally').modal('show')
        })
        RemoveFlashModal('getTodoLocally', () => {})
      }
      if (state === 'done-get-todos-unsuccessfully') {
        InsertFlashModal('getTodoUnsuccessfully', () => {
          $('#getTodoUnsuccessfully').modal('show')
        })
        RemoveFlashModal('getTodoUnsuccessfully', () => {})
        return
      }
      return
    }
    return
  }
}

module.exports = modal