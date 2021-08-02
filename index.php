<!-- 基於 bootstrap & jQuery 實作 -->

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo List</title>
  <style>
    .complete {
      text-decoration: line-through;
    }

    .pointer {
      cursor: pointer;
    }

    .hidden {
      visibility: hidden;
    }

    .circle {
      height: 30px;
      width: 30px;
      border-radius: 50%;
    }

    .space {
      white-space: pre-line;
    }
  </style>
  <!-- import jQuery -->
  <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
  <!-- import bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
  <script src="index.js"></script>
</head>

<body>
  <!-- navigation bar -->
  <div class="container">
    <div class="row">
      <div class="col-12">
        <nav class="navbar navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Todo List</a>
            <div class="d-flex align-items-center">
              <button class="btn btn-primary btn-register me-2" type="button" data-bs-toggle="modal" data-bs-target="#registerModal">註冊</button>
              <button class="btn btn-outline-primary btn-login me-2" type="button" data-bs-toggle="modal" data-bs-target="#loginModal">登入</button>
              <div class="d-flex d-inline-block align-items-center profile d-none me-2">
                <div class="profile-avatar circle bg-primary me-2"></div>
                <span class="profile-nickname"></span>
              </div>
              <button class="btn btn-outline-primary btn-logout d-none" type="button" data-bs-toggle="modal" data-bs-target="#logoutModal">登出</button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
 <!-- modal list -->
  <div class="container">
    <!-- empty input data -->
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
    <!-- can't upload empty todo list  -->
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
    <!-- upload todo list successfully  -->
    <div class="modal fade" id="uploadTodoSuccessfully" tabindex="-1" aria-labelledby="上傳注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">上傳代辦事項</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            上傳代辦事項成功
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    <!-- upload todo list unsuccessfully-->
    <div class="modal fade" id="uploadTodoUnsuccessfully" tabindex="-1" aria-labelledby="上傳注意事項" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">上傳代辦事項</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            無法上傳代辦事項，請稍後在試
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
          </div>
        </div>
      </div>
    </div>
    <!-- ajax request error -->
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
    <!-- register form modal -->
    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="註冊表單" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">用戶註冊</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            <form class="registerModal-form">
              <div class="mb-3">
                <label for="nickName" class="col-form-label text-danger">* 您的暱稱</label>
                <input type="text" class="form-control" id="registerModal-form-nickName" required maxlength="10">
                <div id="nicknameHelp1" class="form-text">長度不得超過 10 個字元</div>
              </div>
              <div class="mb-3">
                <label for="account" class="col-form-label text-danger">* 帳號</label>
                <input class="form-control" id="registerModal-form-account" pattern="^[a-zA-Z0-9]{8,}$" required minlength="8" maxlength="20" />
                <div id="accountHelp1" class="form-text">長度不得超過 20 個字元，至少為 8 個字元</div>
                <div id="accountHelp2" class="form-text">由英文及數字組成，且必須包括 1 個英文大小寫以及 1 個數字</div>
              </div>
              <div class="mb-3">
                <label for="password" class="col-form-label text-danger">* 密碼</label>
                <input type="password" class="form-control" id="registerModal-form-password" pattern="^[a-zA-Z0-9]{8,}$" required minlength="8" maxlength="20" />
                <div id="passwordHelp1" class="form-text">長度不得超過 20 個字元，至少為 8 個字元</div>
                <div id="passwordHelp2" class="form-text">由英文及數字組成，且必須包括 1 個英文大小寫以及 1 個數字</div>
              </div>
              <div class="mb-3">
                <label for="retypePassword" class="col-form-label text-danger">* 密碼確認</label>
                <input type="password" class="form-control" id="registerModal-form-retype-password" required minlength="8" maxlength="20" />
              </div>
              <div class="clearfix">
                <button type="submit" class="btn btn-primary">送出</button>
                <div class="registerModal-form-spinner spinner-grow text-primary float-end hidden" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!--  register the account successfully  -->
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
    <!--  register the account unsuccessfully due to account exist  -->
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
    <!--  register the account unsuccessfully due to server error  -->
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
    <!-- login form modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="登入表單" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">用戶登入</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            <form class="loginModal-form">
              <div class="mb-3">
                <label for="account" class="col-form-label text-danger">* 帳號</label>
                <input class="form-control" id="login-form-account" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required minlength="8" maxlength="20" required />
                <div id="accountHelp1" class="form-text">長度不得超過 20 個字元，至少為 8 個字元</div>
                <div id="accountHelp2" class="form-text">由英文及數字組成，且必須包括 1 個英文大小寫以及 1 個數字</div>
              </div>
              <div class="mb-3">
                <label for="password" class="col-form-label text-danger">* 密碼</label>
                <input type="password" class="form-control registerModal-form-password" id="login-form-password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required minlength="8" maxlength="20" required />
                <div id="passwordHelp1" class="form-text">長度不得超過 20 個字元，至少為 8 個字元</div>
                <div id="passwordHelp2" class="form-text">由英文及數字組成，且必須包括 1 個英文大小寫以及 1 個數字</div>
              </div>
              <div class="clearfix">
                <button type="submit" class="btn btn-primary">送出</button>
                <div class="loginModal-form-spinner spinner-grow text-primary float-end hidden" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!--  login successfully  -->
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
    <!--  login unsuccessfully due to account not existed  -->
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
    <!--  login the account unsuccessfully due to server error  -->
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
    <!-- logout form modal -->
    <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="確認登出?" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">用戶登出</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉視窗"></button>
          </div>
          <div class="modal-body">
            <p>確定要登出嗎？</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-logout-confirm" data-bs-dismiss="modal">確定</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- todo list body -->
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-10 mt-3 mx-auto">
        <!-- alert message -->
        <div class="alert alert-success" role="alert">
          註冊登入即可線上保存代辦事項，<strong>現在就立即註冊吧！</strong>
        </div>
        <!-- user input block-->
        <div class="input-group mt-3 mb-3">
          <input type="text" class="form-control" placeholder="請輸入代辦事項，並按下 Enter 送出" aria-label="add todo content" aria-describedby="button-add-todo" id="input-todo-content">
        </div>
        <!-- content tab -->
        <div class="tab-content" id="pills-tabContent">
          <!-- display all todos -->
          <div class="tab-pane fade show active" id="totals" role="tabpanel" aria-labelledby="totals-tab">
            <div class="list-group-all"></div>
          </div>
          <!-- display unfinished todos -->
          <div class="tab-pane fade" id="unfinished" role="tabpanel" aria-labelledby="unfinished-tab">
            <div class="list-group-unfinished"></div>
          </div>
          <!-- display finished todos -->
          <div class="tab-pane fade" id="finished" role="tabpanel" aria-labelledby="finished-tab">
            <div class="list-group-finished"></div>
          </div>
        </div>
        <!-- content nav-pills -->
        <!-- used to switch specific content tab -->
        <div class="mt-3">
          <!-- remaining todos counter -->
          <div class="d-flex align-items-center flex-wrap">
            <p class="w-100 fs-6 badge btn btn-secondary todos-remaining py-2">剩餘 0 個代辦事項</p>
          </div>
          <ul class="nav nav-pills d-flex flex-grow-1 justify-content-center mt-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="fs-6 nav-link active" id="totals-tab" data-bs-toggle="pill" data-bs-target="#totals" type="button" role="tab" aria-controls="totals" aria-selected="true">全部</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="fs-6 nav-link" id="unfinished-tab" data-bs-toggle="pill" data-bs-target="#unfinished" type="button" role="tab" aria-controls="unfinished" aria-selected="false">未完成</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="fs-6 nav-link" id="finished-tab" data-bs-toggle="pill" data-bs-target="#finished" type="button" role="tab" aria-controls="finished" aria-selected="false">已完成</button>
            </li>
          </ul>
        </div>
        <!-- functional buttons -->
        <div class="d-flex justify-content-center mt-3">
          <button type="button" class="d-none btn btn-secondary btn-store-on-db me-3">儲存此代辦清單</button>
          <button type="button" class="btn btn-secondary btn-clear-todo">清除所有已完成的事項</button>
        </div>
      </div>
    </div>
  </div>

</body>

</html>