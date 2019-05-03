
const logIn=(clientId,redirectUri,state) =>{
    const url=`https://www.wunderlist.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
    location.assign(url)
}

logIn("545764b4f177df6362aa","http://127.0.0.1:8080/login.html","active")