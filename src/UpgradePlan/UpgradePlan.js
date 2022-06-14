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

const constant = constants.getConstant();

const useStyles = makeStyles((theme) => ({

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const UpgradePlan = (props) => {
    const classes = useStyles();
    const toast = React.useRef(null);

    const Upgrade = () => {

        let Header = {
            ShopURL: sessionStorage.getItem("shop"),
        }
        axios.post(`${constant.url}UpgradePlan`, { Header })
            .then(function (response) {
                if (response.data.Success === true) {
                    window.location=response.data.Message
                    // toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Setup Source Created!', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error Message', detail: response.data.Message, life: 3000 });
                }
            })
            .catch(function (error) {
                toast.current.show({ severity: 'error', summary: 'Error Message', detail: error.message, life: 3000 });
            });
    }

    return (
        <div style={{ marginLeft: 32, marginTop: 30 }}>
            <div>
            </div>
            <Toast ref={toast} />
            <div className="p-grid">
                <div className="p-col-10 p-md-10 p-lg-8 p-offset-1 p-md-offset-1 p-lg-offset-2">
                    <Card title="Upgrade Plan">
                        <Divider light style={{ marginBottom: 20 }} />
                        <div className="p-grid">
                            <div className="p-col-12 p-md-12 p-lg-12">

                                <Typography variant="h6" >
                                    PlanAI is much more than just sales analytics. it is a SMART SUPPLY CHAIN MANAGEMENT TOOL which can be used to effectively optimize your supply chain.
                                    Upgrade your plan now to access the full suite of features that PlanAI has to offer which includes:
                                </Typography>

                                <Typography variant="h6" >
                                    <ui>
                                        <ul><b>Forecasting: </b>Based on the analysis of sales, trends, vendor lead time and other exogenous and endogenous features, PlanAI can forecast future sales, required inventory and safety stock levels etc.</ul>
                                        <ul><b>Supply Chain Analytics: </b>Use PlanAI's data-driven dashboards to analyze and prioritize your supply chain.</ul>
                                        <ul><b>Stockout Analysis: </b>PlanAI can provid you with Stockout Predictions that enables merchants like you to order optimum inventory at the required time.</ul>
                                        <ul><b>Smart ERP Integrations: </b>PlanAI combines your off premise stock, purchase and other data in a single data source for AI based predictions and deep analytics.</ul>
                                    </ui>

                                </Typography>
                                <Typography variant="h6" >
                                    To provide you with effective insights and predictions PLANAI will need access to your inventory & historical Purchase orders. PlanAI can be integrated with your ERP or external systems which you can do so on your own through smart connectors deployed in PlanAI or you can contact us help you along with this proccess.
                                </Typography>

                                <Typography variant="h6" >
                                    For any queries or a personalised demo of PlanAI's capabilities please contact us.
                                </Typography>

                            </div>
                            <div className="p-col-12 p-md-12 p-lg-4">

                            </div>
                            <div className="p-col-12 p-md-12 p-lg-4">
                                <Button onClick={Upgrade} style={{ width: '100%', backgroundColor: '#61ab8e', color: 'white' }} variant="contained" >Upgrade Now</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default UpgradePlan;
