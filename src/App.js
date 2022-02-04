import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import constants from '../src/utilities/constants';
import TopBar from './components/TopBar';
import LinearProgress from '@material-ui/core/LinearProgress';



const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    root: {
        margin: theme.spacing(1),
        maxHeight: 400
    },
 
}));


const constant = constants.getConstant();

const App = (props) => {


    return (<>
        <div style={{ overflowX: 'hidden' ,overflowY: 'hidden' }}>

            <TopBar></TopBar>
            {/* <LinearProgress color='secondary' /> */}
            <div className='p-grid p-justify-center' style={{ height: 130, position: 'relative', bottom: 2 }}>
                <img src="assets/logo/ai_web_logo.png" alt="ai_logo" width="580px" height="220px" />
            </div>
        </div>

    </>
    )
}
export default App;
