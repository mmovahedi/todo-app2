

  const getAccessToken=(clientId,code,clientSecret,callback) =>{
    const request=new XMLHttpRequest()
    
    request.addEventListener("readystatechange",(e) =>{
        
      if(e.target.status===200 && e.target.readyState===4){
        callback(JSON.parse(e.target.responseText).access_token,undefined)

      }else{
        callback(undefined,"can't get access token")
      }
      
    })
    request.open("POST","https://www.wunderlist.com/oauth/access_token",true)
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    request.send(`client_id=${clientId}&client_secret=${clientSecret}&code=${code}`)
    }


class WunderListApi{
    
    constructor(baseUrl,xClientId,clientSecret,accessToken){
        this.baseUrl=baseUrl
        this.accessToken=accessToken
        this.clientSecret=clientSecret
        this.xClientId=xClientId

    }

    
    setHeaders(request,xClientId,accessToken,headers=[],method,pathUrl,instance){
        request.open(method,instance.baseUrl+pathUrl)
        request.setRequestHeader("X-Client-ID",xClientId)
        request.setRequestHeader("X-Access-Token",accessToken)
        headers.forEach((item) =>{
            request.setRequestHeader(item.key,item.value)
        })
    }
 
    send(request,jsonData=""){
         
         request.send(jsonData)
    }
    
    setReadystatechange(request,callback){
        request.addEventListener("readystatechange",(e) =>{
            if(e.target.readyState===4 && (e.target.status===200 || e.target.status===201)){
                const data=JSON.parse(e.target.responseText)
                callback(data,undefined)
            }else if(e.target.readyState===4 && e.target.status===204){
                callback(undefined,undefined)
            }else if(e.target.readyState===4){
                callback(undefined,"error")
            }
        })
    }

    getUser(callback) {
       const request=new XMLHttpRequest()
       WunderListApi.prototype.setReadystatechange(request,callback)
       WunderListApi.prototype.setHeaders(request,this.xClientId,this.accessToken
        ,[],"GET","user",this)
       WunderListApi.prototype.send(request)
    
    }

    getAllList(callback){
        const request=new XMLHttpRequest()
        WunderListApi.prototype.setReadystatechange(request,callback)
        WunderListApi.prototype.setHeaders(request,this.xClientId,this.accessToken
            ,[],"GET","lists",this)
        WunderListApi.prototype.send(request)
    }
    
    getTask(listId,callback){
        const request=new XMLHttpRequest()
        WunderListApi.prototype.setReadystatechange(request,callback)
        WunderListApi.prototype.setHeaders(request,this.xClientId,this.accessToken
            ,[],"GET",`tasks?list_id=${listId}`,this)
        WunderListApi.prototype.send(request)
    }
  
    createList(title,callback){
       const request=new XMLHttpRequest()
       WunderListApi.prototype.setReadystatechange(request,callback)
       const headers=[
           {
               key:"Content-Type",
               value:"application/json"
           }
       ]
       WunderListApi.prototype.setHeaders(request,this.xClientId,this.accessToken
        ,headers,"POST",`lists`,this)
        WunderListApi.prototype.send(request,JSON.stringify({
            title:title
        }))


    }
    removeList(id,callback){
        WunderListApi.prototype.getListRevision(id,this,(data,error)=>{
            if(error===undefined){
                const request=new XMLHttpRequest()
                const revision=data.revision
                WunderListApi.prototype.setReadystatechange(request,callback)
                WunderListApi.prototype.setHeaders(request,this.xClientId,this.accessToken
                    ,[],"DELETE",`lists/${id}?revision=${revision}`,this)
                WunderListApi.prototype.send(request)
            }
        })
       
    
    }
    getListRevision(id,instance,callback){
        const request=new XMLHttpRequest()
        WunderListApi.prototype.setReadystatechange(request,callback)
        WunderListApi.prototype.setHeaders(request,instance.xClientId,instance.accessToken
            ,[],"GET",`lists/${id}`,instance)
        WunderListApi.prototype.send(request)
    }
    
    updateList(id,title,callback){
        
        WunderListApi.prototype.getListRevision(id,this,(data,error)=>{
            if(error===undefined){
                const req=new XMLHttpRequest()
                const revision=data.revision
                WunderListApi.prototype.setReadystatechange(req,callback)
                const headers=[
                    {
                        key:"Content-Type",
                        value:"application/json"
                    },
                    
                    {
                        key:'Access-Control-Allow-Methods',
                        value:'GET,PUT,POST,PATCH,DELETE'
                    }
                    
                ]
                WunderListApi.prototype.setHeaders(req,this.xClientId,this.accessToken
                 ,headers,"PATCH",`lists/${id}`,this)
                 WunderListApi.prototype.send(req,JSON.stringify({
                     revision:revision,
                     title:title
                 }))
            }
        })
      
        /**/
    }

    getCompletedTask(completed=false,listId,callback){
        const request=new XMLHttpRequest()
        WunderListApi.prototype.setReadystatechange(request,callback)
     
        WunderListApi.prototype.setHeaders(request,this.xClientId,this.accessToken
         ,[],"GET",`tasks?completed=${completed}&list_id=${listId}`,this)
         WunderListApi.prototype.send(request)
    }

    
    getSpecificTask(id,callback){
        const request=new XMLHttpRequest()
        WunderListApi.prototype.setReadystatechange(request,callback)
     
        WunderListApi.prototype.setHeaders(request,this.xClientId,this.accessToken
         ,[],"GET",`tasks/${id}`,this)
         WunderListApi.prototype.send(request)
    }

    getAvatar(userId,callback){
        const request=new XMLHttpRequest()
        request.addEventListener("readystatechange",(e) =>{
            if(e.target.readyState===4 && (e.target.status===200 || e.target.status===201)){
                
                callback(e.target.responseURL,undefined)
            }else if(e.target.readyState===4){
                callback(undefined,"error")
            }
        })
       WunderListApi.prototype.setHeaders(request,this.xClientId,this.accessToken
        ,[],"GET",`avatar?user_id=${userId}`,this)
       WunderListApi.prototype.send(request)
    }
    createTask(listId,title,callback){
        const request=new XMLHttpRequest()
        WunderListApi.prototype.setReadystatechange(request,callback)
        const headers=[
            {
                key:"Content-Type",
                value:"application/json"
            }
        ]
        WunderListApi.prototype.setHeaders(request,this.xClientId,this.accessToken
         ,headers,"POST",`tasks`,this)
         WunderListApi.prototype.send(request,JSON.stringify({
             title:title,
             list_id:listId
         }))
    }
    getTaskRevision(id,instance,callback){
        const request=new XMLHttpRequest()
        WunderListApi.prototype.setReadystatechange(request,callback)
        WunderListApi.prototype.setHeaders(request,instance.xClientId,instance.accessToken
            ,[],"GET",`tasks/${id}`,instance)
        WunderListApi.prototype.send(request)
    }

    removeTask(id,callback){
        
        WunderListApi.prototype.getTaskRevision(id,this,(data,error)=>{
            if(error===undefined)
            {
                
                const revision=data.revision
                const req=new XMLHttpRequest()
                WunderListApi.prototype.setReadystatechange(req,callback)
                const headers=[
                    {
                        key:"Content-Type",
                        value:"application/json"
                    }
                ]
                WunderListApi.prototype.setHeaders(req,this.xClientId,this.accessToken
                    ,headers,"DELETE",`tasks/${id}?revision=${revision}`,this)
                    WunderListApi.prototype.send(req)

            }else{
                console.log("error")
            }
        })

    }

    upadateTaskCompleted(id,completed,callback){
           WunderListApi.prototype.getTaskRevision(id,this,(data,error)=>{
               if(error===undefined){
                     const revision=data.revision
                     const req=new XMLHttpRequest()
                     WunderListApi.prototype.setReadystatechange(req,callback)
                     const headers=[
                         {
                             key:"Content-Type",
                             value:"application/json"
                         }
                     ]
                     WunderListApi.prototype.setHeaders(req,this.xClientId,this.accessToken
                        ,headers,"PATCH",`tasks/${id}`,this)
                        WunderListApi.prototype.send(req,JSON.stringify({
                            revision:revision,
                            completed:completed
                        }))
               }else{

               }
           })
    }
    upadateTaskstStarred(id,starred,callback){
        WunderListApi.prototype.getTaskRevision(id,this,(data,error)=>{
            if(error===undefined){
                  const revision=data.revision
                  const req=new XMLHttpRequest()
                  WunderListApi.prototype.setReadystatechange(req,callback)
                  const headers=[
                      {
                          key:"Content-Type",
                          value:"application/json"
                      }
                  ]
                  WunderListApi.prototype.setHeaders(req,this.xClientId,this.accessToken
                     ,headers,"PATCH",`tasks/${id}`,this)
                     WunderListApi.prototype.send(req,JSON.stringify({
                         revision:revision,
                         starred:starred
                     }))
            }else{

            }
        })
 }
}



/*const request =new XMLHttpRequest()

request.open("GET","https://a.wunderlist.com/api/v1/user")
request.setRequestHeader("X-Access-Token","f43df2cffe03e6f206a31342b27cfcc98a0de257af3c32d0adb1e01d9509")
request.setRequestHeader("X-Client-ID","545764b4f177df6362aa")

request.send()

*/
