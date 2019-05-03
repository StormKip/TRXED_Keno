import React, {Component} from 'react';
import * as Colors from 'material-ui/styles/colors';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme  from '@material-ui/core/styles/createMuiTheme';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography'
import TrxIcon from '../components/TrxIcon';
import CarIcon from '../components/CarIcon';
import FistIcon from '../components/FistIcon';
import FacebookIcon from '../components/FacebookSVG';
import TwitterIcon from '../components/TwitterSVG';
import TelegramIcon from '../components/TelegramSVG';
import KenoIcon from '../components/KenoIcon';
const muiTheme = createMuiTheme ({
    palette: {
        textColor: Colors.darkBlack,
        primary1Color: Colors.white,
        primary2Color: Colors.yellow50,
        accent1Color: Colors.redA200,
        pickerHeaderColor: Colors.darkBlack,
        alternateTextColor: Colors.redA200
    },
    appBar: {
        height: 60,
    },
    typography: {
        useNextVariants: true,
    },
});

export default (props) =>{
    return(
        <MuiThemeProvider theme={muiTheme}>
            <AppBar position='static' style={{ display: 'block'  ,   backgroundColor: 'rgba(0, 0, 0, 0.37)'}}>
                <CarIcon/>
                <FistIcon/>
                <KenoIcon/>
                    <Typography component="h1" variant="headline" gutterBottom className={'KenoText'} style={{display:'inline', marginLeft:91, width:'23%'}}>
            Keno Lottery
        </Typography>
                <TelegramIcon/>
                <TwitterIcon/>
                <FacebookIcon/>
                

            </AppBar>
            {props.children}
        </MuiThemeProvider>
    );
};