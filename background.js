const lastLogins = {}

function connected(port) {
  console.log('Received connection for port', port)
  port.onMessage.addListener(function (msg) {
    console.log('Received message from port', port, msg)
    if (msg.action === 'get-role') {
      const cookieStoreId = port.sender.tab.cookieStoreId
      browser.storage.sync.get('selectedRoles').then(({ selectedRoles }) => {
        const arn = (selectedRoles || {})[cookieStoreId]

        // Autosubmit form if there has been at least 1 hour from previous autologin
        // (to enable manual selection of a role)
        const lastLogin = lastLogins[cookieStoreId] || 0
        const submit = (Date.now() - lastLogin) > 3600000

        lastLogins[cookieStoreId] = Date.now()
        port.postMessage({ arn, submit })
      })
    }
  })
}

// Wait for connections from tabs
browser.runtime.onConnect.addListener(connected)