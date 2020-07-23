import * as Dropbox from "dropbox"

const CLIENT_ID = "t2iwru3p0tsf7aa"
const LOCAL_STORAGE = "dropbox"

export function isAuthenticated(){
  return localStorage.getItem(LOCAL_STORAGE)
}

export function downloadFile(filename: string){
  const ACCESS_TOKEN = localStorage.getItem(LOCAL_STORAGE);
  if (ACCESS_TOKEN === null){return;}
  const dbx = new Dropbox.Dropbox({ fetch:fetch, accessToken: ACCESS_TOKEN });


  return dbx.filesDownload({path: '/' + filename})
  // eslint-disable-next-line
  .then( (response: any)=>{
    return new Promise(resolve=>{
      const blob = response.fileBlob;
      const reader = new FileReader();
      reader.addEventListener("loadend", function() {
          resolve(reader.result); // will print out file content
      });
      reader.readAsText(blob);
    })

  })
}

export function uploadFile(filename: string, content: string){
  const ACCESS_TOKEN = localStorage.getItem(LOCAL_STORAGE);
  if (ACCESS_TOKEN === null){return;}
  const dbx = new Dropbox.Dropbox({ fetch:fetch, accessToken: ACCESS_TOKEN });

  // eslint-disable-next-line 
  const mode: any = "overwrite"



  return dbx.filesUpload({path: '/' + filename, contents: content, mode: mode})



}

 export function listFiles() {
  const ACCESS_TOKEN = localStorage.getItem(LOCAL_STORAGE);
  if (ACCESS_TOKEN === null){return;}
  const dbx = new Dropbox.Dropbox({ fetch:fetch, accessToken: ACCESS_TOKEN });
  return dbx.filesListFolder({path: ''})


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
  localStorage.setItem(LOCAL_STORAGE,str)
}

export function authenticate(){
  const dbx = new Dropbox.Dropbox({ fetch:fetch, clientId: CLIENT_ID });
  
  const authUrl = dbx.getAuthenticationUrl(window.location.href);
  window.location.href = authUrl;
}