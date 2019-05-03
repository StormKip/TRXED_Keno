import React, {Component} from 'react';
import AppBarCustom from "../components/AppBarCustom";
import Utils from '../utils/index';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Typography} from '@material-ui/core';
import swal from 'sweetalert';
import KenoBoard from '../components/KenoBoard'
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import RemoveIcon from '@material-ui/icons/Remove'
import StarClosedIcon from '../components/StarClosedSVG'
import TrxIcon from '../components/TrxIcon';
import AnimatedNumber from 'animated-number-react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

//const socket = socketIOClient('http://localhost:4001');
const styles = {
    Paper: {padding:20, marginTop: 10, marginBottom:10, marginLeft:10},
    GridCon: { height:'52vh', width: '100%'},
    imgStyle:{display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            width:160,
            height:160
}
};

/*
* TRXED:
    (base58) TDUxqD6iKDLU4f9B2hBVZdCogHPSuqvKew
    (hex) 41268907202a231d119288fb1b316b52093449249a

* */

const SECRET_HASH = "0xbce57ec951304d8c5b3d33595eafc715bfea643cc9281a7936f8ff37bf952bea"
const FOUNDATION_ADDRESS = 'TLYw2bgCDqHrMFVAcv6GnYMXPwfwcbhxLs';

// const socket = socketIOClient("http://192.168.0.138:4001");
// const dimStyle = {
//     width: '100%',
//     pointerEvents: 'none',
//     filter: 'brightness(50%)',
//     transition: '0.3s'
// };
// const normStyle = {
//     width: '100%',
//     transition: '0.3s'
// }
const contractAddress = "TVZJUJiQZ8pNrYAGVqnuVqAyJ3e5vphr4R";//'TUNhBUhK5VjrnLs3mvJsA3YhT7cjF1hjCf'TFPEK3yFiMafKGefye8Huq2z7YvEtCWwVB;
let cardValues =[];

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
    },
    TextColor: '#a5dc86',
    clicked:false
}
cardValues.push(tempProperties)
}   
        
let defaultCardValues = cardValues
let numbersArray = []
let picksToMatch = new Map()
let id = 0
class Index extends Component{

    constructor(props) {
        super(props);
        this.kenoBoard = React.createRef();

        this.state= {
                betAmount:0,
                contractValue:0,
                trxBalance:0,
                tronwebaddress:'',
                tronWeb: {
                installed: false,
                loggedIn: false},
                kenoBoardProps:[],
                loading: false,
            trxAmount:10,
            quickPickAmount:0,
                selectedNumbers:[],
                pointerEvents:'auto',
                rows: []
        };
        this.increaseNum = this.increaseNum.bind(this);
        this.decreaseNum = this.decreaseNum.bind(this);
        this.clearBoard = this.clearBoard.bind(this)
        this.setQuickPick = this.setQuickPick.bind(this)
        this.fetchArrayValues = this.fetchArrayValues.bind(this)
        this.playKeno = this.playKeno.bind(this)
        numbersArray = []
        for(let i = 1; i<81;i++){
            numbersArray.push(i)
        }
        

    }

    setMap(){
        picksToMatch.set(0,[0,0,0,0,0,0,0,0,0,0,0]);
        picksToMatch.set(1,[0,2,0,0,0,0,0,0,0,0,0]);
        picksToMatch.set(2,[0,0,11,0,0,0,0,0,0,0,0]);
        picksToMatch.set(3,[0,0,3,17,0,0,0,0,0,0,0]);
        picksToMatch.set(4,[0,0,1,7,50,0,0,0,0,0,0]);
        picksToMatch.set(5,[0,0,1,2,15,75,0,0,0,0,0]);
        picksToMatch.set(6,[0,0,0,1,12,50,100,0,0,0,0]);
        picksToMatch.set(7,[0,0,0,1,5,21,75,250,0,0,0]);
        picksToMatch.set(8,[0,0,0,1,3,8,20,100,500,0,0]);
        picksToMatch.set(9,[0,0,0,1,2,4,6,50,150,1000,0]);
        picksToMatch.set(10,[0,0,0,0,2,4,10,25,100,1000,2500]);
    }

    createData(match, prize) {
        id += 1;
        return { id, match, prize};
      }

    componentWillMount(){
        id
        let rows = [this.createData(10,'--'),
    this.createData(9,'--'),
    this.createData(8,'--'),
    this.createData(7,'--'),
    this.createData(6,'--'),
    this.createData(5,'--'),
    this.createData(4,'--'),
    this.createData(3,'--'),
    this.createData(2,'--'),
    this.createData(1,'--')]
    this.setState({rows:rows})
  }


    async componentDidMount() {
        //TRONLINK TRX
        //-------------------------------------------------------------------------------------------------------------
        // console.log(cardValues)
        this.setMap()
        let TRX_BAL = 0;
        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };

            if(tronWebState.installed) {
                this.setState({
                    tronWeb:
                    tronWebState
                });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if(tries >= 10) {
                    const TRONGRID_API = "https://api.shasta.trongrid.io";

                    window.tronWeb =  TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

                if(!tronWebState.installed)
                    return tries++;

                this.setState({
                    tronWeb: tronWebState
                });

                resolve();
            }, 100);
        });

        if(!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', async() => {
                const tmp_tronwebaddress = Utils.tronWeb.address.fromHex(((await Utils.tronWeb.trx.getAccount()).address).toString())
                await this.setState({tronwebaddress : tmp_tronwebaddress});

               //console.log("tmp_tronwebaddress", tmp_tronwebaddress);
                TRX_BAL =await Utils.tronWeb.trx.getBalance(tmp_tronwebaddress);
                await this.setState({trxBalance: TRX_BAL});
                if(this.state.tronWeb.loggedIn)
                    return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }

        await Utils.setTronWeb(window.tronWeb, contractAddress);
        const tmp_tronwebaddress = Utils.tronWeb.address.fromHex(((await Utils.tronWeb.trx.getAccount()).address).toString())
        await this.setState({tronwebaddress : tmp_tronwebaddress});

        console.log("tmp_tronwebaddress", tmp_tronwebaddress);
//  --------------------------------------------------------------------------------------------------------------------
        TRX_BAL =await Utils.tronWeb.trx.getBalance(this.state.tronwebaddress);
        await this.setState({trxBalance: TRX_BAL});
        console.log(TRX_BAL);

        let CONTRACT_BAL = await tronWeb.trx.getBalance("TRo5WSFNoyzKyv98S55v7pxem8dC5LzR3K");
        await this.setState({contractValue: CONTRACT_BAL});
        console.log(CONTRACT_BAL);
        
        // this.startCloseListener();
        // let cardValues = []
        
        // for(let i = 1; i<81 ;i++){
        //     cardValues.push(i)
        // }
        // cardValues.map((value) =>{
        //     console.log(value)
        // })
console.log("hello")
    
        
};

    async playKeno(userNums){
        if(userNums.length < 1){
            swal({
                title: "Error",
                text: "No Numbers Chosen",
                icon: "error",
                button: "Aww no!",
              });
              return;
        }
        let winningNums = this.quickPick(20);
        let currentNumber;
        let correctValues =[]
        this.setState({pointerEvents:'none'})
        this.setState({loading: true})
        let trxValue = this.state.trxAmount;
        let gameID
        await Utils.contract.playGame(trxValue * 1000000).send({
            shouldPollResponse:true,
            callValue:trxValue * 1000000
        }).then(res => {
            gameID = Utils.tronWeb.toDecimal(res)
            console.log(gameID)
            console.log("Bet Complete", gameID)});

        for(let i = 0;i<userNums.length;i++){
        currentNumber = userNums[i];
        for(let j = 0; j<winningNums.length;j++){
            if(currentNumber == winningNums[j]){
                correctValues.push(currentNumber)
            } 
         }    
        }

        
        let picksAmount = userNums.length;
        let correctValuesAmount = correctValues.length;
        let winningArray = picksToMatch.get(picksAmount);
        let winningValue = winningArray[correctValuesAmount] * trxValue;
        console.log("Winning Amount: ",winningValue, winningArray[correctValuesAmount], trxValue)
        if(winningValue>0){
            await Utils.contract.payWinners(winningValue * 1000000, gameID).send({
                shouldPollResponse:true,
                callValue:0
            }).then(res => {
                console.log("PAID")});
        }
        let incorrectValues =winningNums.filter(val => !correctValues.includes(val));
        this.kenoBoard.current.playKeno(incorrectValues, correctValues,userNums, winningValue);
        let TRX_BAL =await Utils.tronWeb.trx.getBalance(this.state.tronwebaddress);
        await this.setState({trxBalance: TRX_BAL});
        this.setState({loading: false})
    }

//----------------------------MiniFunctions-------------------------------//
    increaseNum(state, value){
        
        if(state == 'quickPickAmount' && this.state[state] == 10){
            swal({
                title: "Error",
                text: "Maximum number of numbers selected",
                icon: "error",
                button: "Aww no!",
              });
        }else{
            this.setState({[state]:  this.state[state] + value})
        }
        if(state == 'trxAmount'){
            let winningArray = picksToMatch.get((this.state.selectedNumbers).length);
            let rows = this.state.rows
            let trxVal = this.state.trxAmount + value
            for(let i = 0; i <10;i++){
                if(rows[i].prize !== '--'){
                    rows[i].prize = winningArray[10-i] * trxVal
                }
            }
        }
        
    }

    decreaseNum(state, value){
        console.log(state)
        if(state == 'quickPickAmount'){
            if (this.state[state]==0){
            return    
            } else{
                this.setState({[state]:  this.state[state] - value});
                
            }
        }
        if (this.state[state]!==10){
        this.setState({[state]:  this.state[state] - value});
        }

        if(state == 'trxAmount'){
            let winningArray = picksToMatch.get((this.state.selectedNumbers).length);
            let rows = this.state.rows
            let trxVal = this.state.trxAmount - value
            for(let i = 0; i <10;i++){
                if(rows[i].prize !== '--'){
                    rows[i].prize = winningArray[10-i] * trxVal
                }
            }
        }
        
    }

    fetchArrayValues(array){
        let trxValue = this.state.trxBalance;
        let picksAmount = array.length;
        let winningArray
        if(picksAmount > 10){
             winningArray = picksToMatch.get(this.state.selectedNumbers.length);
        }else{
             winningArray = picksToMatch.get(picksAmount)
        
        }
        let prizeArray = this.state.rows;
        for(let i = 0; i<10;i++){
            if(winningArray[i+1] == 0){
                prizeArray[9-i].prize = "--"
            } else{
                prizeArray[9-i].prize = winningArray[i+1] * this.state.trxAmount
            }
        }
        this.setState({rows:prizeArray})
        this.setState({selectedNumbers:array})
        
//---------------------- Broken Code-------------------------------------------------//
        // if(array.length<=10){
        //     let amount =  picksToMatch.get(array.length)
        // for(let i = 0; i<amount.length;i++){
        //     amount[i] = amount[i] * this.state.trxAmount
        // }
        // }
        
    }
    loadingGrid(){
        return (
            <div className="lds-css ng-scope"><div style={{width:'100%',height:'100%', marginLeft:53}} className="lds-double-ring"><div></div><div></div></div>
              </div>
          );
}
    quickPick(amount){
      
        return this.shuffle(numbersArray,amount)
    
        
    }
     shuffle(array, size) {
        var i = array.length,
        j = 0,
        temp;

    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
        let finishedArray=[]
        for(let i =0; i<size;i++){
            finishedArray.push(array[i])
        }
    
        return finishedArray;
    }

    clearBoard(){
        let rows = this.state.rows;
        for(let i = 0; i <10;i++){
            rows[i].prize = '--'
        }
        this.setState({selectedNumbers:[]})
        this.kenoBoard.current.clearBoard(this.state.selectedNumbers);
        this.setState({pointerEvents:'auto'})
    }
    setQuickPick(){
        if(this.state.quickPickAmount == 0){
            swal({
                title: "Error",
                text: "Please choose amount for Quick Pick",
                icon: "error",
                button: "Aww no!",
              });
        } else{
            let quickPickAmount = this.state.quickPickAmount
            let values = this.quickPick(quickPickAmount)
            this.kenoBoard.current.quickPick(values,this.state.selectedNumbers);
        }
       
    }
//-------------------------------------------------------------------------//
formatValue = value => `${Number(value/1000000).toFixed(2)} TRX`
    render(){
        const { response } = this.state;

        return(
            <AppBarCustom contractValue = {this.state.contractValue}>
                <style jsx global>
                {`
            
      body{
        background-image: url('../static/images/back2.jpg');
        overflow: hidden;
        background-size:contain;
      }
      .MuiRadio-root-95 {
    color: rgb(255, 255, 255);
}

@keyframes lds-double-ring {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes lds-double-ring {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes lds-double-ring_reverse {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }
  @-webkit-keyframes lds-double-ring_reverse {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }
  .lds-double-ring {
    position: relative;
  }
  .lds-double-ring div {
    position: absolute;
    width: 160px;
    height: 160px;
    top: 20px;
    left: 20px;
    border-radius: 50%;
    border: 8px solid #000;
    border-color: #f90013 transparent #f90013 transparent;
    -webkit-animation: lds-double-ring 0.8s linear infinite;
    animation: lds-double-ring 0.8s linear infinite;
  }
  .lds-double-ring div:nth-child(2) {
    width: 140px;
    height: 140px;
    top: 30px;
    left: 30px;
    border-color: transparent #ffe700 transparent #ffe700;
    -webkit-animation: lds-double-ring_reverse 0.8s linear infinite;
    animation: lds-double-ring_reverse 0.8s linear infinite;
  }
  .lds-double-ring {
    width: 91px !important;
    height: 91px !important;
    -webkit-transform: translate(-45.5px, -45.5px) scale(0.455) translate(45.5px, 45.5px);
    transform: translate(-45.5px, -45.5px) scale(0.455) translate(45.5px, 45.5px);
  }

#clearButton{
    margin-left: -176px;
    width: 130px;
    height: 29px;
    margin-top: 18px;
    text-align: center;
    vertical-align: middle;
    position: relative;
    text-align: center;
    top: 50%;
    font-size: x-large;
}

#clearButton:hover{
    color: #ff7c7c;
}

#resetButton{
    margin-left: 337px;
    box-shadow: inset 0px 0px 15px 3px rgb(232, 115, 115);
    width: 180px;
    background-color: #ffffff;
    background: linear-gradient(to bottom,#1f1010 5%,#a28e8e 100%);
    font-size: 55px;
    height: 65px;
    border-radius: 16px 16px 0px 0px;
    font-family: inherit;
}
#resetButton:hover{
    background:linear-gradient(to bottom, #a28e8e 5%, #1f1010 100%);
    color: #49ebec;
}

.myButton {
	-moz-box-shadow: 0px 0px 15px 3px #23395e;
	-webkit-box-shadow: 0px 0px 15px 3px #23395e;
	box-shadow: 0px 0px 15px 3px #23395e;
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #2e466e), color-stop(1, #415989));
	background:-moz-linear-gradient(top, #2e466e 5%, #415989 100%);
	background:-webkit-linear-gradient(top, #2e466e 5%, #415989 100%);
	background:-o-linear-gradient(top, #2e466e 5%, #415989 100%);
	background:-ms-linear-gradient(top, #2e466e 5%, #415989 100%);
	background:linear-gradient(to bottom, #2e466e 5%, #415989 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#2e466e', endColorstr='#415989',GradientType=0);
	background-color:#2e466e;
	-moz-border-radius:16px;
	-webkit-border-radius:16px;
	border-radius:16px;
	border:1px solid #1d3e70;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:17px;
	font-weight:bold;
	padding:9px 13px;
	text-decoration:none;
    text-shadow:0px 3px 2px #263666;
    text-align: center;
    height: fit-content;
    width: fit-content;
}
.myButton:hover {
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #415989), color-stop(1, #2e466e));
	background:-moz-linear-gradient(top, #415989 5%, #2e466e 100%);
	background:-webkit-linear-gradient(top, #415989 5%, #2e466e 100%);
	background:-o-linear-gradient(top, #415989 5%, #2e466e 100%);
	background:-ms-linear-gradient(top, #415989 5%, #2e466e 100%);
	background:linear-gradient(to bottom, #415989 5%, #2e466e 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#415989', endColorstr='#2e466e',GradientType=0);
    background-color:#415989;
    color: #31e81d
}
.myButton:active {
	position:relative;
    top:1px;
}

#goButton {
    box-shadow: inset 0px 0px 15px 3px rgb(193,255,0);
    border-radius: 16px 16px 0px 0px;
    height: 85px;
    width: 205px;
    /* vertical-align: middle; */
    /* position: relative; */
    /* text-align: center; */
    /* top: 17%; */
    font-size: 75px;
    font-family: inherit;
    margin-left: 85px;
    margin-top: 30px;
}

.informationDiv{
    box-shadow: inset 0px 0px 44px 0px rgb(193,193,193);
    border-top-right-radius: 30px;
    background-color: rgba(125,125,125,0.4);
    border-top-left-radius: 30px;
    margin-top: 10px;
    width: 80%;
    height: 150px;
    /* margin: 0px auto; */
    /* margin-left: 40px; */
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: absolute;
    left: 10%;
}

.MuiTypography-body2-45 {
    color: rgba(255, 255, 255, 0.87);
    font-size: 0.875rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.01071em;
}

.TextStyle{
    font-family: serif;
    color: rgb(187, 114, 114);
    text-align: center;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
}

.MainDiv{
    border: 2px solid grey;
    border-radius: 9px;
     display:flex;
}
.imageCenter{ 
    display: block;
    margin-left: auto;
    margin-right: auto;
    width:120px; 
    height:120px;
}

 .GameDiv {
    border: 2px solid #3c3c3c;
    border-radius: 9px;
    margin-top: 15px;
    padding: 3px;
    width: 200px;
    margin: 0 auto;
    box-shadow: inset 7px -2px 44px 12px rgb(111, 91, 191);
 }
 .GameClosedContainer{
    display: grid;
    grid-gap: 20px;
    grid-template-columns: auto auto auto;
    padding: 10px;
 }
 .KenoContainer{
    display: grid;
    grid-gap: 5px;
    grid-template-columns: auto auto auto auto auto auto auto auto auto auto;
    padding: 10px;
 }

 .RevealContainer{
    display: inline-block;
    margin: 0px auto;
    width: 100%;
    transition: all .2s ease-in-out;
 }

 .KenoText{
    
    font-size: 67px;
    background: -webkit-linear-gradient(#3f00ff,#fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        width:100%;
        font-family: initial;
        margin-top: auto;
    margin-bottom: auto;
 }

 .MultiplierText{
    font-size: 25px;
    background: -webkit-linear-gradient(#75f390,#fff); 
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        font-family: initial;
        margin-top: auto;
    margin-bottom: auto;
    float:right; 
    width:auto
 }

 .CardText{
    width: 100%;
    /* height: 100%; */
    text-align: center;
    vertical-align: middle;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    /* margin: 0px auto; */
    color: white
 }
 
 .KenoBoard{
    box-shadow: inset 0px 0px 44px 0px rgb(255, 255, 255);
    border-radius: 30px;
    margin-top: -40px;
    width: 63%;
    margin: 0px auto;
 }

 .PaymentDiv{
    box-shadow: inset 0px 0px 44px 0px rgb(0, 67, 255);
    /* border-radius: 30px; */
    /* border-top-left-radius: 15px; */
    width: 260px;
    height: 250px;
    /* border-top-right-radius: 15px; */
    /* border-bottom-left-radius: 5px; */
    border-radius: 15px 15px 5px 5px;
     
    }

    .NumberDiv{
        margin: 0px auto;
        height: 80%;
        margin-top: 17px;
        width: 120px;
        box-shadow: inset 0px 0px 44px 0px rgb(0,67,255);
        border-radius: 15px;
    }
   


    `}</style>
<div style={{height:'calc(100vh - 70px)', margin: '0 auto'}}>
    <div>
        <div className={'PaymentDiv'} style={{float:'left'}}>
             <img class = 'imageCenter' 
             src={"../static/images/trxCoin.png"} 
             style={{width:120,height:120,marginTop:12}}
             />
                   
            <div style={{width:'100%', height:'60px'}}> 
                <Fab 
                   color="primary" 
                   aria-label="Add" 
                   style={{
                       float:'left', 
                       marginLeft:7, 
                       color: 'white', 
                       boxShadow: 'inset 0px 0px 44px 0px rgb(0, 0, 0)'
                       }}
                       onClick={() =>{
                        this.decreaseNum('trxAmount', 10)
                    }}>
                       <RemoveIcon />
                </Fab>
                <Fab 
                    color="primary" 
                    aria-label="Add" 
                    style={{
                        float:'right', 
                        marginRight:7, 
                        color: 'white',
                        boxShadow: 'inset 0px 0px 44px 0px rgb(0, 0, 0)'
                        }}
                        onClick={() =>{
                            this.increaseNum('trxAmount', 10)
                        }}>
                        <AddIcon />
                </Fab>
                <div className={'NumberDiv'}>
                       <Typography 
                       className={'CardText'}
                       component="h1" 
                       variant="headline" 
                       gutterBottom  
                       style = {{
                           color: "white",
                           marginTop:8
                           }} >
                       {this.state.trxAmount}
                       </Typography>
                </div>
            </div>
            <div style={{textAlign:'center'}}>
                            <Typography style={{color:'aqua' ,fontSize:25, fontFamily:'inherit'}}>
                            <TrxIcon width={25}/>
                            <AnimatedNumber
                                value={this.state.trxBalance}
                                formatValue={this.formatValue}
                                duration={200}
                            />
                            </Typography>
                </div>
        </div>
        <div style={{float:'right', display:'grid'}}>
                   <div className={'PaymentDiv'} style={{float:'right', height:200}}>
                        <div style={{width:'100%'}}>
                        <Typography component="h1" variant="headline" gutterBottom className={'KenoText'} style = {{fontSize:'38px',    borderBottom: '2px #552fab96 solid'}}>
                        Multiplier
                      </Typography>
                        </div>
                        <div style={{    padding: 7, borderBottom: '2px #552fab96 solid',height:32}}>
                        <div style={{float:'left'}}>
                        <StarClosedIcon />
                            <StarClosedIcon/>
                            <StarClosedIcon/>
                        </div>
                            <Typography component="h1" variant="headline" gutterBottom className={'MultiplierText'}>
                        10X
                      </Typography>
                        </div>
                        <div  style={{    padding: 7, borderBottom: '2px #552fab96 solid',height:32}}>
                            <div style={{float:'left'}}>
                            <StarClosedIcon/>
                            <StarClosedIcon/></div>
                            <Typography component="h1" variant="headline" gutterBottom className={'MultiplierText'}>
                        3X
                      </Typography>
                        </div>
                        <div  style={{    padding: 7,height:30}}>
                            <div style={{float:'left'}}>
                            <StarClosedIcon/></div>
                            <Typography component="h1" variant="headline" gutterBottom className={'MultiplierText'}>
                        1X
                      </Typography>
                        </div>
                   </div>

                   <div className={'PaymentDiv'} style={{marginTop:'20px',height:392}} >
                        <div style={{width:'100%'}}>
                        <Typography component="h1" variant="headline" gutterBottom className={'KenoText'} style = {{fontSize:'38px',    borderBottom: '2px #552fab96 solid'}}>
                        Prize Table
                      </Typography>
                        </div>
                        {/* <PrizeTable prizaTableValues ={this.state.prizaTableValues}/> */}
                        <Paper  style={{backgroundColor: 'transparent' ,width: '100%',marginTop: 'auto',overflowX: 'hidden',}}>
                            <Table>
                                <TableHead>
                                <TableRow style={{height:36,     fontSize: 'x-large',}}>
                                    <TableCell align="center" style={{fontSize:'larger',     paddingRight: 29, color: '#a2a2a2'}}>Match</TableCell>
                                    <TableCell   style={{fontSize:'larger', color: '#a2a2a2'}}>Prize</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.rows.map(row => (
                                    <TableRow key={row.id} style={{    height: 30, textAlign:"center"}}>
                                    <TableCell  align="center" style = { {   fontSize: 'x-large',padding: '0px 45px 0px 20px','border-bottom': '2px #552fab96 solid',
                            borderRight: '2px #552fab96 solid', color: '#a2a2a2'} }>{row.match}</TableCell>
                                    <TableCell align="center"  style = { {   fontSize: 'x-large',padding: '0px 45px 0px 20px','border-bottom': '2px #552fab96 solid', color: '#a2a2a2'} }>{row.prize}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </Paper>
                       
                        
                   </div>
                   </div>
                   <KenoBoard ref = {this.kenoBoard} callbackGetArrayValues = {this.fetchArrayValues} />
                   
    </div>
                   <div className={'informationDiv'}>
                           <div style= {{display:'flex', width:414}}>
                   <div style={{width:231, height:50, marginLeft:20,marginTop:11}}>
                   <Fab 
                   size="small"
                   color="primary" 
                   aria-label="Add" 
                   style={{
                       float:'left', 
                       marginLeft:7, 
                       color: 'white', 
                       boxShadow: 'inset 0px 0px 44px 0px rgb(0, 0, 0)'
                       }}
                       onClick={() =>{
                        this.decreaseNum('quickPickAmount', 1)
                    }}>
                       <RemoveIcon />
                </Fab>
                <Fab
                size="small" 
                    color="primary" 
                    aria-label="Add" 
                    style={{
                        float:'right', 
                        marginRight:7, 
                        color: 'white',
                        boxShadow: 'inset 0px 0px 44px 0px rgb(0, 0, 0)'
                        }}
                        onClick={() =>{
                            this.increaseNum('quickPickAmount', 1)
                        }}>
                        <AddIcon />
                </Fab>
                
                <div className={'NumberDiv'} style={{height:'46px', marginTop:'0px',}}>
                       <Typography 
                       className={'CardText'}
                       component="h1" 
                       variant="headline" 
                       gutterBottom  
                       style = {{
                           color: "white"
                           }} >
                       {this.state.quickPickAmount}
                       </Typography>
                </div>
                </div>
                <div style={{    display: 'flex',
    marginLeft: 26,
    marginTop: 11, height:'fit-content'}}>
                <div className = {'myButton'} style={{marginTop:5}}  onClick = {this.setQuickPick}>
                QUICK PICK
                </div>
                </div>
                <div style={{    display: 'flex',
    marginLeft: -175}}>
                <div id={'clearButton'} className = {'myButton '} onClick = {this.clearBoard}>
              CLEAR
                </div>
                </div>
                </div>
                <div>
                <div id={'goButton'} className = {'myButton '} onClick = {()=>{
                    this.playKeno(this.state.selectedNumbers)
                }} style={{pointerEvents: this.state.pointerEvents}}>
              {!this.state.loading ? 'GO' : this.loadingGrid()}
                </div>
                <div id={'resetButton'} className = {'myButton '} onClick = {()=>{
                    this.clearBoard(this.state.selectedNumbers)
                }}>
              RESET
                </div>
                </div>

                   </div>
</div>
            </AppBarCustom>
        )
    }
}


export default Index;

