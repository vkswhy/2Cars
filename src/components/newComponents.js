import React from 'react'
function NewComponent(props){

        console.log(props)
        var constInt=props.prof;
        var Data=constInt.map((x,index)=>{
            return(
        <p key={index}>{x.name}</p>)});
        return(
            
        <div>{Data}</div>
        )

}

export default NewComponent;