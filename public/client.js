const toastr = window.toastr;
toastr.options = {
  'closeButton': true,
  'debug': false,
  'newestOnTop': false,
  'progressBar': true,
  // 'positionClass': 'toast-top-right',
  'positionClass': 'toast-bottom-full-width',
  'preventDuplicates': false,
  // 'preventDuplicates': true,
  'showDuration': '3000',
  'hideDuration': '20000',
  'timeOut': '20000',
  'extendedTimeOut': '20000',
  'showEasing': 'swing',
  'hideEasing': 'linear',
  'showMethod': 'fadeIn',
  'hideMethod': 'fadeOut'
}
// Define a callback for when the toast is shown/hidden/clicked
toastr.options.onShown = function () {
  // console.log('hello')
}
toastr.options.onHidden = function () {
  // console.log('goodbye')
  // document.getElementById('mainTopics').value = ''
  // document.getElementById('hardTopics').value = ''
  // document.getElementById('moreTopics').value = ''
  // document.forms[0].classList.remove('submitted')
}
toastr.options.onclick = function (ev) {
  // console.log('clicked')
  // confirmCopy()
  // ev.preventDefault()
}
toastr.options.onCloseClick = function () {
  // console.log('close button clicked')
}

document.getElementById('toDatabase').disabled = false

document.getElementById('toDatabase').addEventListener('click', validateData)
document.getElementById('toDatabase').addEventListener('touchend', validateData)

function validateData () {
  if ([].some.call(document.getElementById('quizForm').elements, x => x.checked)) {
    sendData()
  } else {
    toastr['error'](
      'Please pick one answer from the available options given above',
      'Must choose something'
    )
  }
}

function sendData (ev) {
  var formInfo = {}
  // if (FormData) {
  //   formData = new FormData(document.querySelector('form'))
  //   formData.append('_id', Date.now().toString())
  //   formData.append('createdAt', new Date())
  //   const l = [...formData.keys()]
  //   l.map(x => formInfo[x] = formData.get(x))
  // } else {
  formInfo['_id'] = Date.now().toString()
  formInfo['createdAt'] = new Date()
  formInfo['quizChoice'] = document.querySelector('input[name="quiz"]:checked').value
  // }

  $.ajax('https://sqz.glitch.me/answer', {
    data : JSON.stringify(formInfo),
    contentType : 'application/json',
    type : 'POST',
    success: function(data) {
      console.log(data);
      toastr.success(
        'Your answer has been submitted successfully. <br> Thank you!',
        'Successfully Submitted'
      )
      document.getElementById('toDatabase').disabled = true
      document.getElementById('toDatabase').className = ''
    },
    error: function(err) {
      console.error(err);
      toastr['error'](
        'Something went wrong and your data could not be submitted. Please try again or contact a human',
        'Some error occured'
      )
    }
  });
}