const TEMPLATE_HTML = `
<div>
  <header class="panel-section panel-section-header">
    <div class="icon-section-header"></div>
    <div class="text-section-header"></div>
  </header>

  <div class="panel-section panel-section-formElements">
    <div class="panel-formElements-item role">
      <label>Role</label>
      <select>
        <option value="">Not Selected</option>
      </select>
    </div>
  </div>
</div>
`

const PARSER = new DOMParser()

Promise.all([
  browser.contextualIdentities.query({}),
  browser.storage.sync.get(['roles', 'selectedRoles'])
]).then(([identities, data]) => {
  const { roles, selectedRoles } = data
  if (!roles) {
    return
  }

  const root = document.querySelector('#content')
  for (const identity of identities) {
    const entry = PARSER.parseFromString(TEMPLATE_HTML, 'text/html').body

    const icon = document.createElement('img')
    icon.src = identity.iconUrl

    entry.querySelector('.icon-section-header').appendChild(icon)
    entry.querySelector('.text-section-header').textContent = identity.name

    const current = (selectedRoles || {})[identity.cookieStoreId]
    const select = entry.querySelector('.role > select')
    let previousAccount = ''
    for (const role of roles) {
      if (role.account.id !== previousAccount) {
        const divider = document.createElement('option')
        divider.disabled = true
        divider.text = `Account: ${role.account.alias} (${role.account.id})`
        select.appendChild(divider)

        previousAccount = role.account.id
      }
      const option = document.createElement('option')
      option.value = role.role.arn
      option.text = role.role.arn
      option.selected = current === role.role.arn
      select.appendChild(option)
    }

    select.dataset['cookieStoreId'] = identity.cookieStoreId
    root.appendChild(entry)
  }

  document.querySelector('#placeholder').style.display = 'none'
  root.addEventListener('change', saveSettings)
})

function saveSettings () {
  const data = {}
  for (const item of document.querySelectorAll('select')) {
    const cookieStoreId = item.dataset['cookieStoreId']
    const selected = item.selectedOptions[0]

    data[cookieStoreId] = selected.value
  }

  console.log('Saving selected roles', data)
  browser.storage.sync.set({ selectedRoles: data })
}
