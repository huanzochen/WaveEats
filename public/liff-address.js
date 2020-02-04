window.onload = function () {
    const useNodeJS = true // if you are not using a node server, set this value to false
    const defaultLiffId = '' // change the default LIFF value if you are not using a node server

    // DO NOT CHANGE THIS
    let myLiffId = ''

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function (reqResponse) {
                return reqResponse.json()
            })
            .then(function (jsonResponse) {
                myLiffId = jsonResponse.id
                initializeLiffOrDie(myLiffId)
            })
            .catch(function (error) {
                document.getElementById('liffAppContent').classList.add('hidden')
                document.getElementById('nodeLiffIdErrorMessage').classList.remove('hidden')
            })
    } else {
        myLiffId = defaultLiffId
        initializeLiffOrDie(myLiffId)
    }
}

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById('liffAppContent').classList.add('hidden')
        document.getElementById('liffIdErrorMessage').classList.remove('hidden')
    } else {
        initializeLiff(myLiffId)
    }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp()
        })
        .catch((err) => {
            document.getElementById('liffAppContent').classList.add('hidden')
            document.getElementById('liffInitErrorMessage').classList.remove('hidden')
        })
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    registerButtonHandlers()

    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {
        document.getElementById('liffLoginButton').disabled = true
    } else {
        document.getElementById('liffLogoutButton').disabled = true
    }
}

/**
* Register event handlers for the buttons displayed in the app
*/
function registerButtonHandlers () {
  
    // closeWindow call
    document.getElementById('closeWindowButton').addEventListener('click', function () {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient()
      } else {
        liff.closeWindow()
      }
    })
  
    // sendMessages call
    document.getElementById('sendMessageButton').addEventListener('click', function () {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient()
      } else {
        console.log('ya')
        liff.sendMessages([{
          type: 'text',
          text: document.getElementById('addressSelect').options[document.getElementById('addressSelect').selectedIndex].text
        }]).then(function () {
          liff.closeWindow()
        }).catch(function (error) {
          window.alert('Error sending message: ' + error)
        })
      }
    })

}


/**
* Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
*/
function sendAlertIfNotInClient() {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.')
}

/**
* Toggle access token data field
*/
function toggleAccessToken() {
    toggleElement('accessTokenData')
}

/**
* Toggle profile info field
*/
function toggleProfileData() {
    toggleElement('profileInfo')
}

/**
* Toggle scanCode result field
*/
function toggleQrCodeReader() {
    toggleElement('scanQr')
}

/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId)
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = 'none'
    } else {
        elem.style.display = 'block'
    }
}
