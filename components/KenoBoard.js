import React, {Component} from 'react';
import {Paper,Button, Typography} from '@material-ui/core';
import TrxIcon from './TrxIcon'
import swal from 'sweetalert';

let cardValues =[];
let arrayNumbers = []
class KenoBoard extends Component{

    constructor(props) {
        super(props);
        this.state= {
            betValue:'',
            divProperties: undefined,
            pointerEvents: 'auto'
        }
    }

    componentWillMount(){
        cardValues = this.defaultArray();
        this.setState({divProperties:cardValues})
        arrayNumbers = []
        // box-shadow: rgb(255, 202, 0) 0px 0px 38px 14px;
        // border: 2px solid rgb(255, 202, 0);
        // background-color: #ffd700a8
    }

    defaultArray(){
        let defaultValues = []
        for(let i = 1; i<81 ;i++){
            let tempProperties={
                id: i,
                style:{
                    border: '2px solid #3c3c3c',
                    borderRadius: '9px',
                    marginTop: '15px',
                    padding: '3px',
                    margin: '0 auto',
                    boxShadow: 'inset 7px -2px 44px 12px rgb(111, 91, 191)',
                    width:60, 
                    height:60,
                    userSelect: 'none',
                    transition: '0.3s',
                    backgroundColor: 'transparent'
                },
                TextColor: '#a5dc86',
                clicked:false
            }
            defaultValues.push(tempProperties)
        }

        return defaultValues
    }

    playKeno(incorrectValues, correctValues,userNums, winningValue){
        let divProperties = Object.assign({}, this.state.divProperties);
        if(incorrectValues.length>0){
        for(let i = 0; i<incorrectValues.length;i++){
            let style = Object.assign({},divProperties[incorrectValues[i]-1].style)
                    style.boxShadow = 'rgb(255, 90, 90) 7px -2px 44px 12px inset'
                    divProperties[incorrectValues[i]-1].style = style;
                    divProperties[incorrectValues[i]-1].TextColor = 'white';
        }
    }
        if(correctValues.length>0){
        for(let i = 0; i<correctValues.length;i++){
            let style = Object.assign({},divProperties[correctValues[i]-1].style)
                    style.boxShadow = 'rgb(255, 202, 0) 0px 0px 38px 14px'
                    style.backgroundColor = '#ffd700a8'
                    style.border = '2px solid rgb(255, 202, 0)'
                    divProperties[correctValues[i]-1].style = style;
                    divProperties[correctValues[i]-1].TextColor = 'white';
        }
    }
    let merge = [...new Set([...incorrectValues, ...userNums,...correctValues])]
    // console.log(merge)
    // let testMap = new Map();
    // for(const tag of merge) {
    //     testMap.set(tag.id, tag);
    // }
    // let clearNumbersArray = [...testMap.values()]
    console.log(merge)

    if(correctValues.length>0){
        if(winningValue>0){
            swal({
                title: "Winner",
                text: `Yaaay, got ${correctValues.length} number(s) correct! And Won ${winningValue}TRX`,
                icon: "success",
                button: "Congratulations!",
              }).then((value) =>{
                this.props.callbackGetArrayValues(merge)
                this.setState({pointerEvents:'none'})
              });
        }else{
            swal({
                title: "Loser !!!!!",
                text: `Not enough correct numbers, you only got ${correctValues.length} correct`,
                icon: "error",
                button: "Come At Me Bro!",
              }).then((value) =>{
                this.props.callbackGetArrayValues(merge)
                this.setState({pointerEvents:'none'})
              });
        }
        
    } else{
        swal({
            title: "Loser !!!!!",
            text: "You got 0 numbers correct, go back to where you came from!",
            icon: "error",
            button: "Come At Me Bro!",
          }).then((value) =>{
            this.props.callbackGetArrayValues(merge)
            this.setState({pointerEvents:'none'})
          });
    }
        this.setState({divProperties:divProperties});
    }

    quickPick(quickValues,clear){
        // for(let i =0;i<clear.length;i++){
        //     clear[i] = clear[i]
        // }
        this.clearBoard(clear);
        let divProperties = Object.assign({}, this.state.divProperties);
        
        for(let i = 0;i<quickValues.length;i++){
            let style = Object.assign({},divProperties[quickValues[i]-1].style)
            arrayNumbers.push(quickValues[i])
                style.boxShadow = 'rgb(193, 255, 0) 7px -2px 44px 12px inset'
        divProperties[quickValues[i]-1].style = style;
        divProperties[quickValues[i]-1].TextColor = 'white';
        divProperties[quickValues[i]-1].clicked = true
        }

        this.props.callbackGetArrayValues(arrayNumbers)

        
        this.setState({divProperties:divProperties});
    }

    clearBoard(clearNumbers){
        let divProperties = Object.assign({}, this.state.divProperties);
        
        for(let i = 0;i<clearNumbers.length;i++){
            let style = Object.assign({},divProperties[clearNumbers[i]-1].style)
            style.border = '2px solid rgb(60, 60, 60)'
            style.backgroundColor = 'transparent'
            style.boxShadow = 'inset 7px -2px 44px 12px rgb(111, 91, 191)'
            divProperties[clearNumbers[i]-1].TextColor =  '#a5dc86';
        divProperties[clearNumbers[i]-1].style = style;
        divProperties[clearNumbers[i]-1].clicked = false
        }
        arrayNumbers = []
        
        this.setState({divProperties:divProperties});
        this.setState({pointerEvents:'auto'})
    }

    mouseEnter = (id)=>{
        let divProperties = Object.assign({}, this.state.divProperties);
        let style = Object.assign({},divProperties[id].style)
        if(divProperties[id].clicked !== true){
            style.boxShadow = 'inset 7px -2px 44px 12px #a5dc86'
            divProperties[id].TextColor = 'rgb(255, 255, 255)';
        }
        
        divProperties[id].style = style;
        
        this.setState({divProperties:divProperties});
    }

    removeValue(num, array){
        for( let i = 0; i < array.length; i++){ 
            if ( array[i] === num) {
              array.splice(i, 1); 
            }
         }
         return array
    }


    mouseLeave = (id)=>{
        let divProperties = Object.assign({}, this.state.divProperties);
        let style = Object.assign({},divProperties[id].style)
        if(divProperties[id].clicked !== true){
            style.boxShadow = 'inset 7px -2px 44px 12px rgb(111, 91, 191)'
            divProperties[id].TextColor =  '#a5dc86';
        }
        
        divProperties[id].style = style;
        
        this.setState({divProperties:divProperties});
    }

    mouseClick = (id)=>{
        let divProperties = Object.assign({}, this.state.divProperties);
        let style = Object.assign({},divProperties[id].style)
        if(divProperties[id].TextColor == 'rgb(255, 255, 255)'){
            if(arrayNumbers.length == 10){
                swal({
                    title: "Error",
                    text: "Maximum number of numbers selected",
                    icon: "error",
                    button: "Aww no!",
                  });
            }else{
                arrayNumbers.push(id+1)
                style.boxShadow = 'rgb(193, 255, 0) 7px -2px 44px 12px inset'
        divProperties[id].style = style;
        divProperties[id].TextColor = 'white';
        divProperties[id].clicked = true
            }
           
            
        } else{
            arrayNumbers = this.removeValue(id+1, arrayNumbers);
            style.boxShadow = 'inset 7px -2px 44px 12px #a5dc86'
            divProperties[id].TextColor = 'rgb(255, 255, 255)';
        divProperties[id].style = style;
        divProperties[id].clicked = false
        }
        this.props.callbackGetArrayValues(arrayNumbers)
        
        //

        
        this.setState({divProperties:divProperties});
    }

   
    


    renderAllCards(){
        
       return (<div className = {'KenoContainer'} >
           {
               cardValues.map((value) =>{
                   let id = value.id
                   
                   return(<div style = {value.style} onClick={
                       ()=>{
                           this.mouseClick(id-1)
                       }
                   } 
                    onMouseEnter={() => {
                    this.mouseEnter(id-1)
                   }} onMouseLeave={()=>{
                    this.mouseLeave(id-1)
                   }}>
                       <Typography component="h1" variant="headline" gutterBottom className={'CardText'} style = {{color: value.TextColor}}>
            {id}
        </Typography>
                   </div>)
               })
           }
       </div>)
    }
    

    render(){

        return(
          <div className={'KenoBoard'} style ={{pointerEvents:this.state.pointerEvents}}>
            {this.renderAllCards()}         
            
          </div>
        )}
}
export default KenoBoard;


