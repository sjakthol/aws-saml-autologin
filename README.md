AWS SAML Auto Login extension for Firefox Multi-Account Containers.

## Features

* Configure a default AWS SAML Login Role for each Firefox Multi-Account Container.
* Automatically select and submit AWS SAML Login Form based on current container.

## Pre-requisites

* AWS environment with
  * SAML federated login (not AWS SSO)
  * multiple federated login roles
* Firefox with
  * Multi-Account Container extension
  * multiple containers for different AWS environments

## Usage

1. Install Extension as
   * temporary extension from local folder
   * signed xpi you have built with web-ext tool
2. Login to AWS using your IDP in any container to let the extension discover available AWS accounts and IAM roles
3. Open extension settings and configure default IAM role for containers
4. Login to AWS using your IDP in any container for which a default role was specified
   * Default role is selected and you are logged in to said role automatically.
5. Login to AWS using your IDP in the same container again
   * You can choose and login with non-default role.

## Repository Contents

* `autologin.js` - Content script that is loaded to https://signin.aws.amazon.com/saml page. Persists list of available roles to local storage and submits role selection form.
* `background.js` - Background script that waits for a message from `autologin.js` asking which role it should log the user in as.
* `options.js`, `options.html` - Options page that allows you to select default roles for different containers.

## License

MIT.
