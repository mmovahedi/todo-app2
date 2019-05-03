const addDisplayNone=(itemEl)=>{
    
    itemEl.classList.add("set-display-none") 
}

let x="fad"


const renderFilter=(filterWord,parentEl)=>{
    
    
    const filtered =[]
    const childNodes=parentEl.childNodes
    console.log(childNodes)
    
    for(let i=0;i<childNodes.length;i++){
        if(childNodes[i].childNodes.length!==0){
            childNodes[i].classList.remove("set-display-none")
        }
       
        if(!childNodes[i].textContent.toLowerCase().includes(filterWord.toLowerCase())){
            
             filtered.push(childNodes[i])
             
             
        }
    }
    
    
     
      filtered.forEach((item,index)=>{
          if(item.childNodes.length!==0)
          {
                addDisplayNone(item)
          }
      })

}

const sortByPriority=(parentEl)=>{
      const ulChildNodes=parentEl.childNodes
   
      for(let i=0;i<ulChildNodes.length;i++){
          
          const liChildNodes=ulChildNodes[i].childNodes
          if(!ulChildNodes[i].classList.contains("set-opacity-1")){
              if(liChildNodes[4].classList.contains("background-color-1"))
               {
                  ulChildNodes[i].style.order="1" 
               }else{
                  ulChildNodes[i].style.order="2" 
              }
          }
          
      }
}

