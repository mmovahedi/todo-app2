const ulTasksEl=document.getElementsByClassName("app--tasks")[0]
const ul=document.getElementsByClassName("app--groups")[0]
const createListBtnEl=document.getElementsByClassName("app--create-list")[0]
const createListCancelBtnEl=document.getElementsByClassName("create-pop-up--submit")[1]
const createPopUpEl=document.getElementsByClassName("create-pop-up")[0]
const popUpSubmitEl=document.getElementsByClassName("create-pop-up--submit")[0]
const popUpInputEl=document.getElementsByClassName("create-pop-up--input")[0]
const createPopUpUseCaseEl=document.getElementsByClassName("create-pop-up--use-case")[0]
const filterGroupListEl=document.getElementsByClassName("app--input")[0]
const filterTaskEl=document.getElementsByClassName("app--input")[2]
const addToDoBtnEl=document.getElementsByClassName("app--add-to-do-btn")[0]
const addToDoInputEl=document.getElementsByClassName("app--input")[1]
const loaderEl=document.getElementsByClassName("loader-container")[0]

const url=new URL(location.href)
const code=url.searchParams.get("code")

let listGroup=[]
let preLiEl=undefined
let accessToken
let createBtnClicked=false
let editBtnClicked=false
let listFilterKye=""
let taskFilterKye=""

//make loader visible
const showLoader=()=>{
    loaderEl.classList.add("set-visible")
}
//make lader invisible
const hideLoader=()=>{
    loaderEl.classList.remove("set-visible")
}
//add trash icon and edit icon to the li in group list
const addListIcons=(liEl,requestSeq)=>{
    const editIcon=document.createElement("span")
    const trashIcon=document.createElement("span")

    editIcon.classList.add("app--icon")
    editIcon.textContent="≣"
    trashIcon.classList.add("app--icon__1")
    trashIcon.textContent="✘"

      // add event listener on edit icons
      editIcon.addEventListener("click",()=>{
        visiblePopUp("Edit list name:")
        createPopUpEl.classList.add("set-visible")
        editBtnClicked=true

     })
    //add event listener on delete icons
    trashIcon.addEventListener("click",(e)=>{
        console.log(e)
        const confrirmDelete=confirm("Are you sure of deleting this list?")
        if(confrirmDelete){
            //remove a list
            showLoader()
            requestSeq.removeList(parseInt(e.path[1].id.substring(1)),(data,error)=>{
                hideLoader()
                if(error===undefined){
                    
                    removeElement(e.path[1].id,ul)
                }
               
            })

            
        }
    })

    liEl.appendChild(editIcon)
    liEl.appendChild(trashIcon)
}
//update group list rendering
const updateGroupListRendering=(title,liEL,requestSeq)=>{
    liEL.textContent=title 
    addListIcons(liEL,requestSeq)
}
//change checkbox state
const checkboxStatus=(checkboxEl,checkEl,checked=false)=>{
    if(checked){
        checkEl.classList.add("app--checkbox-checked")
        checkboxEl.classList.add("border-color-1")
    }else{
        checkEl.classList.remove("app--checkbox-checked")
        checkboxEl.classList.remove("border-color-1")
    }
}
//set two different functionality for submit button
const submitBtnCallback=(requestSeq,functionality)=>{
    if(popUpInputEl.value!==""){
        if(functionality==="create"){
            showLoader()
            requestSeq.createList(popUpInputEl.value,(data,error)=>{
                hideLoader()
                if(error===undefined){
                    
                    const arrData=[
                        data
                    ]
                    renderGroupList(arrData,requestSeq)
                    popUpInputEl.value=""
                    createPopUpEl.classList.remove("set-visible")
                }else{
                    console.log(error)
                }
            })
        }else if(functionality==="edit"){
            showLoader()
            requestSeq.updateList(parseInt(preLiEl.id.substring(1)),popUpInputEl.value,(data,error)=>{
                if(error===undefined){
                    hideLoader()
                    updateGroupListRendering(data.title,preLiEl,requestSeq)
                    popUpInputEl.value=""
                    createPopUpEl.classList.remove("set-visible")
                }
            })
        }
    }
}

//visible the popup 
const visiblePopUp=(popUpTitle)=>{
    createPopUpUseCaseEl.textContent=popUpTitle
    createPopUpEl.classList.add("set-visible")
}

//change the color of the star button when it clicked
const starBtnBackgroundChange=(starBtnEl)=>{
    if(starBtnEl.classList.contains("background-color-1")){
        starBtnEl.classList.remove("background-color-1")
    }else{
        starBtnEl.classList.add("background-color-1")
    }
    sortByPriority(ulTasksEl)
}
//send requst for changing the star value
const updateStarRequest=(requestSeq,taskId,starEl,starred=false)=>{
    showLoader()
     requestSeq.upadateTaskstStarred(taskId,starred,(data,error)=>{
         hideLoader()
         if(error===undefined){
             starBtnBackgroundChange(starEl)
             const taskArr={
                 data
             }
             renderTasks(taskArr,requestSeq,false)
         }
     })
}
const initiation=(requestSeq)=>{
  
    createListBtnEl.addEventListener("click",()=>{
        visiblePopUp("Create a new list:")
        createBtnClicked=true
    })
  
    popUpSubmitEl.addEventListener("click",()=>{
        if(createBtnClicked)
        {
            submitBtnCallback(requestSeq,"create")
            createBtnClicked=false
        }else if(editBtnClicked)
        {
            submitBtnCallback(requestSeq,"edit")
            editBtnClicked=false
        }
      
    })
    createListCancelBtnEl.addEventListener("click",()=>{
        createPopUpEl.classList.remove("set-visible")
        popUpInputEl.value=""
    })

    filterGroupListEl.addEventListener("input",(e)=>{
         listFilterKye=e.target.value
         renderFilter(listFilterKye,ul)
    })
    filterTaskEl.addEventListener("input",(e)=>{
         taskFilterKye=e.target.value
         renderFilter(taskFilterKye,ulTasksEl)
    })
    showLoader()
    requestSeq.getUser((data,error) =>{
        hideLoader()
        if(error===undefined)
        {
             const userNameEl=document.getElementsByClassName("app--username")[0]
             userNameEl.textContent=data.name
             //get user avatar after accessing user id
             showLoader()
             requestSeq.getAvatar(data.id,(data,error)=>{
                 hideLoader()
                 const avatarEl=document.getElementsByClassName("app--avatar")[0]
                 avatarEl.style.backgroundImage =`url(${data})`
             })
        }else{
            console.log(error)
        }
    })
    
    addToDoBtnEl.addEventListener("click",()=>{
        
        const taskTitle=addToDoInputEl.value
        
        if(preLiEl!==undefined && taskTitle!=="")
        {
           addToDoInputEl.value=""
           listId=preLiEl.id.substring(1)
           showLoader()
           requestSeq.createTask(parseInt(listId),taskTitle,(data,error)=>{
               hideLoader()
               if(error ===undefined){
                   const arrData=[
                       data
                   ]
                   renderTasks(arrData,requestSeq,false,false)
               }               
           })   
        }
    })
   
}
const getToken=(token) =>{
    accessToken=token
    const requestSeq=new WunderListApi("https://a.wunderlist.com/api/v1/","545764b4f177df6362aa","b25af534752046845d413992efe207c1caf084c7125d533133439c2a8405",token)
    showLoader()
    requestSeq.getAllList((data,error)=>{
        hideLoader()
        if(error===undefined){
           
           initiation(requestSeq)
           renderGroupList(data,requestSeq)
        
    }
    })
}


getAccessToken("545764b4f177df6362aa",code,"b25af534752046845d413992efe207c1caf084c7125d533133439c2a8405",(a,error)=>{
    if(error===undefined){
        getToken(a)
    }
    
    
})



const priorityStar=(requestSeq,li,starred=false,isCompleted=false)=>{
    const div1=document.createElement("div")
    const div2=document.createElement("div")
    
    div1.classList.add("app--priority")
    div1.classList.add("app--priority__1")
 
    div2.classList.add("app--priority")
    div2.classList.add("app--priority__2")
    
    if(starred){
        div2.classList.add("background-color-1")
    }
    if(isCompleted){
        div1.classList.add("disable-pointer-event")
        div2.classList.add("disable-pointer-event")
    }else{
        div1.classList.remove("disable-pointer-event");
        div2.classList.remove("disable-pointer-event")
    }
    div2.addEventListener("click",()=>{
        updateStarRequest(requestSeq,parseInt(li.id.substring(1)),div2,!starred)
    })
    div1.addEventListener("click",()=>{
        updateStarRequest(requestSeq,parseInt(li.id.substring(1)),div2,!starred)
    })
    li.appendChild(div1)
    li.appendChild(div2)
}

const removeElement=(childId,parentEl)=>{
    const li=document.getElementById(childId)
    parentEl.removeChild(li)
}

const renderTasks=(tasks,requestSeq,removeAll=true,isCompleted=false)=>{
      if(removeAll)
         ulTasksEl.innerHTML=""

        tasks.forEach((item,index) =>{
        const li=document.createElement("li")
        const trashIcon=document.createElement("span")
        const checkbox=document.createElement("span")
        const checkboxChecked=document.createElement("span")
    
       
        checkbox.classList.add("app--checkbox")
        checkboxChecked.classList.add("app--checkbox-checked")
        trashIcon.classList.add("app--icon__1")
        trashIcon.classList.add("set-left")
        trashIcon.textContent="✘"
        if(isCompleted){
            checkboxChecked.classList.add("app--checkbox-checked")
            checkbox.classList.add("border-color-1")
            li.classList.add("set-opacity-1")
            li.style.order="3"
        }else{
            checkboxChecked.classList.remove("app--checkbox-checked")
            checkbox.classList.remove("border-color-1")
        }
        checkbox.addEventListener("click",()=>{
            showLoader()
           requestSeq.upadateTaskCompleted(item.id,!isCompleted,(data,error)=>{
               hideLoader()
               if(error===undefined){
                  const arrData=[
                    data
                  ]
                  removeElement(`_${item.id}`,ulTasksEl)
                  renderTasks(arrData,requestSeq,false,!isCompleted)
               }
           })
        })

        trashIcon.addEventListener("click",()=>{
            const confrirmDelete=confirm("Delete it?")
            if(confrirmDelete){
                //remove a task
                const taskId=li.id.substring(1)
                showLoader()
                requestSeq.removeTask(parseInt(taskId),(data,error)=>{
                    hideLoader()
                    if(error===undefined){
                        removeElement(li.id,ulTasksEl)
                    }else{

                    }
                      
                })
                
            }
        })

        
        li.id=`_${item.id}`
        li.textContent =item.title
        ulTasksEl.appendChild(li)
        li.appendChild(trashIcon)
        li.appendChild(checkbox)
        checkbox.appendChild(checkboxChecked)
        priorityStar(requestSeq,li,item.starred,isCompleted)
       
      })
      if(!isCompleted)
         {sortByPriority(ulTasksEl)}
      renderFilter(taskFilterKye,ulTasksEl)
}


const renderGroupList=(lists,requestSeq)=>{
    
    
    lists.forEach((item,index) => {
        const li=document.createElement("li")
        

        li.textContent =item.title
        li.id=`_${item.id}`
        li.addEventListener("click",()=>{
           if(preLiEl!==undefined){
             preLiEl.style.borderColor="#2A2A2A"
             
           }
            preLiEl=li
            li.style.borderColor="red"
            showLoader()
            requestSeq.getCompletedTask(false,item.id,(data,error)=>{
                hideLoader()
                if(error===undefined){
                    renderTasks(data,requestSeq,true,false)
                    requestSeq.getCompletedTask(true,item.id,(d,err)=>{
                        if(err===undefined)
                        {
                            renderTasks(d,requestSeq,false,true)
                        }
                    })

                }
            })
            
        })
       
        ul.appendChild(li)
        addListIcons(li,requestSeq)
        
    })
    renderFilter(listFilterKye,ul)
}


