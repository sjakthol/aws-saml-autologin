const port = browser.runtime.connect({ name: "signin" })

// Parse and save current list of roles for the options page.
const accounts = [...document.querySelectorAll('fieldset > .saml-account')]
const roles = []
for (const account of accounts) {
  const accountTitle = account.querySelector('.saml-account-name').textContent
  const [_, accountAlias, accountId] = accountTitle.match(/ (.+) \((.+)\)/)
  const accountRoles = [...account.querySelectorAll('input[type=radio]')]

  for (const role of accountRoles) {
    const arn = role.value
    const arnParts = arn.split(':')
    const name = arnParts[arnParts.length - 1].split('/', 2)[1]
    roles.push({ account: { id: accountId, alias: accountAlias }, role: { arn, name }})
  }
}

browser.storage.sync.set({ roles })

// Ask our background script if autologin should be performed
port.postMessage({ action: "get-role" })

// Wait for reply
port.onMessage.addListener(function (data) {
  console.log('Selected role data', data)
  const inputs = [...document.querySelectorAll('input[type=radio]')]
  const input = inputs.find(e => e.value === data.arn)
  if (input) {
    // Found a match. Check and submit (if desired)
    input.checked = true
    if (data.submit) {
      document.getElementById("signin_button").click()
    }
  }
})

// Another convenience: ENTER submits form.
document.addEventListener('keypress', ev => {
  if (ev.key === 'Enter') {
    document.getElementById("signin_button").click()
  }
})