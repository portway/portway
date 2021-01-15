(function() {
  function initialize() {
    const signupBtn = document.querySelector('#signup-button')
    const tosCheckbox = document.querySelector('#tos')

    if (!tosCheckbox.checked) {
      signupBtn.setAttribute('disabled', true)
    }

    tosCheckbox.addEventListener('click', (e) => {
      if (e.target.checked) {
        signupBtn.removeAttribute('disabled')
      } else {
        signupBtn.setAttribute('disabled', true)
      }
    }, { passive: false })
  }

  window.addEventListener('load', initialize, { passive: false })
})()
