# Twitch Chat Plays League
Accept Twitch Donations in return for ability presses and many more twitch to league interactions.

### Installation
---

1. run `npm install` in both the root folder and in auth_server folder
2. register an app with streamlabs here: https://streamlabs.com/dashboard#/settings/api-settings (no need to submit unless production)
3. create a file called env.js within auth_server folder with the following format:
```javascript 
const secrets = {
  clientId: <client_id>,
   clientSecret: <client_secret>,
   redirectURI: 'http://localhost:8080/auth'
}

module.exports = secrets
```
* your client_id and client_secret can be found on your stream labs dashboard when editing your app config

4. navigate to auth_server folder and run `node server.js`
5. register an app with streamlabs and point your browser at localhost:8000 and click the link to authorize it.
---
6. for robotjs to work you will need to install the following:

* **Windows:**
windows-build-tools npm package `npm install --global --production windows-build-tools` from an elevated PowerShell or CMD.exe)

* **MacOSX:**
Xcode Command Line Tools.

* **Linux:**
Python (v2.7 recommended, v3.x.x is not supported).
make.
A C/C++ compiler like GCC.
libxtst-dev and libpng++-dev `sudo apt-get install libxtst-dev libpng++-dev`.

7. install node-gyp `npm install -g node-gyp`
8. build node-gyp with `node-gyp rebuild`
9. create a secrets.js file in root directory with the following format:
```javascript 
const secrets = {
  access_token: <token>
  riotAPIKey: <key>
  socket_token: <token>
}
module.exports = secrets
```
* you can get your access_token through the auth server and querying the db.sqlite file for your particular app
* riot api key is retrieved from here: https://developer.riotgames.com/
* socket token can be found on your streamlabs dev dashboard: https://streamlabs.com/dashboard#/settings/api-settings
* good resource for streamlabs api endpoints: https://dev.streamlabs.com/reference
10. **Finally** you can `node index.js` but put your username in place of Drunkenskarl (case sensitive) in the username field 
