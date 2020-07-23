import * as Dropbox from "dropbox"

// http://localhost:8080/Dropboxsync/#uid=2813195024&access_token=sl.Aea_HOJLIQ5bJg9XdkyyEo7wOqJFxSlQJFzAIaTXCIyrFhKussVZBDBhp-zSfC6HoXixAWjjtht9z5MXvwLtq-aAH4lC4JA9sZtco9L0Z4zjHPoMSYWw3oOra_bQ5vK-TxKJqT4&expires_in=14400&token_type=bearer&scope=account_info.read+files.content.read+files.content.write+files.metadata.read+files.metadata.write&account_id=dbid%3AAADki0elB8xehVKg5bsYzP6lXDh-SMMMozo

const CLIENT_ID = "t2iwru3p0tsf7aa"

 function isAuthenticated(){
  return localStorage.getItem("dropbox")
}

 export function listFiles() {
  const ACCESS_TOKEN = localStorage.getItem("dropbox");
  if (ACCESS_TOKEN === null){return;}
  const dbx = new Dropbox.Dropbox({ fetch:fetch, accessToken: ACCESS_TOKEN });
  dbx.filesListFolder({path: ''})
    .then(function(response) {
      debugger;
      console.log(response.entries);
      console.log(response);
    })
    .catch(function(error: DropboxTypes.Error<DropboxTypes.files.ListFolderError>) {
      console.error(error);
    });
  return false;
}


function parseQueryString(str: string) {
  const ret: {[k: string]: string[] | string} = Object.create(null);

  if (typeof str !== 'string') {
    return ret;
  }

  str = str.trim().replace(/^(\?|#|&)/, '');

  if (!str) {
    return ret;
  }

  str.split('&').forEach(function (param) {
    const parts = param.replace(/\+/g, ' ').split('=');
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    // eslint-disable-next-line
    let key: any = parts.shift();
    // eslint-disable-next-line
    let val: any = parts.length > 0 ? parts.join('=') : undefined;

    key = decodeURIComponent(key);

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    const retVal = ret[key];
    if (ret[key] === undefined) {
      ret[key] = val;
    } else if (Array.isArray(retVal)) {
      retVal.push(val);
    } else {
      ret[key] = [ret[key], val];
    }
  });

  return ret;
}


export function setAccessTokenFromUrl() {
  const  str = parseQueryString(window.location.hash)['access_token'] as string;
  debugger;
  localStorage.setItem("dropbox",str)
}

export function authenticate(){
  if (isAuthenticated()) {return;}
  const dbx = new Dropbox.Dropbox({ fetch:fetch, clientId: CLIENT_ID });
  const authUrl = dbx.getAuthenticationUrl('http://localhost:8080/Dropboxsync');
  window.location.href = authUrl;
}