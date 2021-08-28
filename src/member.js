const ajax = require('./ajax')
const utils = require('./utils')

const member = {
  initMemberAllEventListener: initMemberAllEventListener
}

function initMemberAllEventListener() {
  registerSubmitEventListener()
  loginSubmitEventListener()
  logoutEventListener()
  openEditProfileModalEventListener()
  EditUserProfileEventListener()
  showRegisterModal()
  showLoginModal()
  showLogoutModal()
}

function showRegisterModal() {
  $('.btn-register').click(() => {
    $('#registerModal').modal('show')
  })
}

function showLoginModal() {
  $('.btn-login').click(() => {
    $('#loginModal').modal('show')
  })
}

function showLogoutModal() {
  $('.btn-logout').click(() => {
    $('#logoutModal').modal('show')
  })
}

// registerModal-form submission
function registerSubmitEventListener() {
  $('.registerModal-form').submit(function (e) {
    e.preventDefault()
    e.stopPropagation()
    // reset form validation status
    $('.registerModal-form').removeClass('was-validated')
    // pass form check, then send ajax request
    if (this.checkValidity()) {
      ajax.OperationByAjax('form', 'register')
      // enable spinner animation
      $('.registerModal-form-spinner').toggleClass('hidden')
    }
    // don't pass form check, display relative warning
    if (!this.checkValidity()) {
      // get account & password info
      let account_val = $('#registerModal-form-account').val()
      let password_val = $('#registerModal-form-password').val()
      // if account is empty
      if (!account_val) {
        $('#registerModal-form-account').nextAll('.invalid-feedback').text('請輸入帳號名稱')
      }
      if (account_val) {
        // if account length greater then 8
        if (account_val.length >= 8) {
          // account isn't empty, but don't match the rule
          if (!account_val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            $('#registerModal-form-account').nextAll('.invalid-feedback').text('請輸入至少一位英文大小寫跟數字')
          } else {
            $('#registerModal-form-account').nextAll('.valid-feedback').text('此帳號符合規則')
          }
        }
        if (account_val.length < 8) {
          $('#registerModal-form-account').nextAll('.invalid-feedback').text('帳號長度至少為 8 個字元')
        }
      }
      // if password is empty
      if (!password_val) {
        $('#registerModal-form-password').nextAll('.invalid-feedback').text('請輸入密碼')
      }
      if (password_val) {
        // if password length greater than 8
        if (password_val.length >= 8) {
          // password isn't empty, but don't match the rule
          if (!password_val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            $('#registerModal-form-password').nextAll('.invalid-feedback').text('請輸入至少一位英文大小寫跟數字')
          } else {
            $('#registerModal-form-password').nextAll('.valid-feedback').text('此密碼符合規則')
          }
        }
        if (password_val.length < 8) {
          $('#registerModal-form-password').nextAll('.invalid-feedback').text('密碼長度至少為 8 個字元')
        }
      }
    }
    // add 'was-validated' class name on form
    this.classList.add('was-validated')
  })
}

// loginModal-form submission
function loginSubmitEventListener() {
  $('.loginModal-form').submit(function (e) {
    e.preventDefault()
    e.stopPropagation()
    // reset form validation status
    $('.loginModal-form').removeClass('was-validated')
    // pass form check, then send ajax request
    if (this.checkValidity()) {
      ajax.OperationByAjax('form', 'login')
      // enable spinner animation
      $('.loginModal-form-spinner').toggleClass('hidden')
    }
    // don't pass form check, display relative warning
    if (!this.checkValidity()) {
      // get account & password info
      let account_val = $('#loginModal-form-account').val()
      let password_val = $('#loginModal-form-password').val()
      // if account is empty
      if (!account_val) {
        $('#loginModal-form-account').nextAll('.invalid-feedback').text('請輸入帳號名稱')
      } 
      if (account_val) {
        // if account length grater than 8
        if (account_val.length >= 8) {
          // account isn't empty, but don't match the rule
          if (!account_val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            $('#loginModal-form-account').nextAll('.invalid-feedback').text('請輸入至少一位英文大小寫跟數字')
          } else {
            $('#loginModal-form-account').nextAll('.valid-feedback').text('此帳號符合規則')
          }
        }
        if (account_val.length < 8) {
          $('#loginModal-form-account').nextAll('.invalid-feedback').text('帳號長度至少為 8 個字元')
        }
      }
      // if password is empty
      if (!password_val) {
        $('#loginModal-form-password').nextAll('.invalid-feedback').text('請輸入密碼')
      } 
      if (password_val) {
        // if password length greater than 8
        if (password_val.length >= 8) {
          // password isn't empty, but don't match the rule
          if (!password_val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            $('#loginModal-form-password').nextAll('.invalid-feedback').text('請輸入至少一位英文大小寫跟數字')
          } else {
            $('#loginModal-form-password').nextAll('.valid-feedback').text('此密碼符合規則')
          }
        }
        if (password_val.length < 8) {
          $('#loginModal-form-password').nextAll('.invalid-feedback').text('密碼長度至少為 8 個字元')
        }
      }
    }
    // add 'was-validated' class name
    this.classList.add('was-validated')
  })
}

// show logout confirmation modal
function logoutEventListener() {
  $('.btn-logout-confirm').click(() => {
    ajax.OperationByAjax('button', 'logout')
  })
}

// show editProfile modal
function openEditProfileModalEventListener() {
  $('.btn-edit-profile').click(function (e) {
    $('#editProfileModal').modal('show')
    e.preventDefault()
    // reset form validation status
    $('.editProfileModal-form').removeClass('was-validated')
    let currentUser = utils.getLoginUser()
    // get current user nickname
    $('#editProfileModal-form-nickname').val(currentUser.nickname)
    // get current user account 
    $('#editProfileModal-form-account').val(currentUser.account)
    // clear password input
    $('#editProfileModal-form-password').val('')
    $('#editProfileModal').modal('show')
  })
}

// update user profile
function EditUserProfileEventListener() {
  $('.editProfileModal-form').submit(function (e) {
    e.preventDefault()
    e.stopPropagation()

    if (this.checkValidity()) {
      ajax.OperationByAjax('form', 'update-user')
      // enable spinner animation
      $('.editProfileModal-form-spinner').toggleClass('hidden')
    }
    if (!this.checkValidity()) {
      let password_val = $('#editProfileModal-form-password').val()

      // if password is empty
      if (!password_val) {
        $('#editProfileModal-form-password').nextAll('.invalid-feedback').text('請輸入密碼')
      } 
      if (password_val) {
        // if password length greater than 8
        if (password_val.length >= 8) {
          // password isn't empty, but don't match the rule
          if (!password_val.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            $('#editProfileModal-form-password').nextAll('.invalid-feedback').text('請輸入至少一位英文大小寫跟數字')
          } else {
            $('#editProfileModal-form-password').nextAll('.valid-feedback').text('此密碼符合規則')
          }
        }
        if (password_val.length < 8) {
          $('#editProfileModal-form-password').nextAll('.invalid-feedback').text('密碼長度至少為 8 個字元')
        }
      }
    }
    // add 'was-validated' class name
    this.classList.add('was-validated')
  })
}

module.exports = member