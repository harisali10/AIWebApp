import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Divider, Button } from '@material-ui/core';
import { Circle, Spinner } from 'react-spinners-css';
import constants from '../utilities/constants';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Select, FormControl, InputLabel, MenuItem, FormHelperText, TextField, Drawer, Snackbar, Typography, Backdrop, CircularProgress } from '@material-ui/core';
import BackDropLoader from "../components/BackDrop";
import Iframe from 'react-iframe'


const constant = constants.getConstant();

const useStyles = makeStyles((theme) => ({

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Privacy = (props) => {
    const classes = useStyles();

    return (
        <div style={{ marginLeft: 32, marginTop: 30 }}>
            <div>
            </div>
            {/* <Toast ref={toast} /> */}
            {
                // loading === true ?
                //     <BackDropLoader backDrop={loading} >
                //     </BackDropLoader>
                //     :
                <div className="p-grid">
                    <div className="p-col-10 p-md-10 p-lg-8 p-offset-1 p-md-offset-1 p-lg-offset-2">
                        <Card title="Privacy Statement">
                            <Divider light style={{ marginBottom: 20 }} />
                            <div className="p-grid">
                                <div className="p-col-12 p-md-12 p-lg-12">
                                {/* <Iframe url="https://drive.google.com/file/d/1BqsLUlr8VmuL4amehtx9GTbRJZ_6MYYd/preview?usp=sharing" */}
                                    <Iframe url="https://drive.google.com/file/d/1BqsLUlr8VmuL4amehtx9GTbRJZ_6MYYd/preview"
                                        width="1140px"
                                        height="1000px%"
                                        // id="myId"
                                        // className="myClassname"
                                        // display="initial"
                                        position="relative" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            }
        </div>
    )
}
export default Privacy;
