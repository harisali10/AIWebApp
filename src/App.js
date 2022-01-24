import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Grid, Select, Button, Divider, FormControl, InputLabel, MenuItem, FormHelperText, TextField, Drawer, Snackbar, Card, Typography, Backdrop, CircularProgress } from '@material-ui/core';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import constants from '../src/utilities/constants';
import AddIcon from '@material-ui/icons/Add';
import { Toast } from 'primereact/toast';
import CloseIcon from '@material-ui/icons/Close';
import queryString from 'query-string';
import Setups from './Setups/Setups';
import PopupLookup from './PopUpLookUp';
import { Routes, Route, Link, useHistory } from "react-router-dom";
import TopBar from './components/TopBar';
import LinearProgress from '@material-ui/core/LinearProgress';

// import tableComponent from './tableComponent';
// import { Button } from 'primereact/button';


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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


const constant = constants.getConstant();

const App = (props) => {
    // const classes = useStyles();
    // const toast = React.useRef(null);    
    // const [open, setOpen] = React.useState(false);

    // const [showDashboardText, setShowDashboardText] = useState("")
    // const [MTable, setMTable] = useState(true)
    // const [PoupUpLookupOpen, setPoupUpLookupOpen] = React.useState(false);
   
    // const [skuColumns, setSkuColumns] = useState([
    //     { title: 'Sku', field: 'sku' },
    //     { title: 'Brand', field: 'brand' },
    //     { title: 'Product Type', field: 'product_type' }

    // ]);
   
    // const [optionsList, setOptions] = useState([])
   
    // const [sku, setsku] = useState('')
   
   

    // // Shopify.Context.initialize({
    // //   API_KEY: process.env.SHOPIFY_API_KEY,
    // //   API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    // //   SCOPES: process.env.SCOPES.split(","),
    // //   HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
    // //   API_VERSION: ApiVersion.October20,
    // // });

    // useEffect(() => {
    //     getOptionList();
    //     let params = queryString.parse(window.location.search)
    //     // localStorage.setItem("shop", params.shop);
    //     localStorage.setItem("shop", "finosys.myshopify.com");
    //     // tableApiCalls();
    // }, [])

    // async function getOptionList() {
    //     document.body.style.zoom = "80%";
    //     try {
    //         let options = await axios.post(`${constant.url}lookup`, {
    //             Header: {
    //                 ShopURL: localStorage.getItem("shop")
    //             }
    //         })
    //         setOptions(options.data.Message)
    //     } catch (e) {
    //         toast.current.show({
    //             severity: 'error',
    //             summary: 'Failed to get SKUs',
    //             detail: "SKU Api Response Failed",
    //             life: 3000
    //         });

    //     }

    // }

    // const handleLogEvent = async () => {
    //     setTableData((prevState) =>
    //         ({ ...prevState, rows: [], columns: [], TableName: "" }))
    //     setMTable(true);
    //     setLoading(true);
    //     setSetupVisible(false);
    //     setShowDashboard(false);
    //     setShowMsg(false);
    //     setOpen(true);
    //     setShowDashboardText("");
    //     // setMTable(false);
    //     // setShowDashboard(false);
    //     // // setLoading(true);
    //     // setIsResData(false);
    //     // setMTableForLogs(true);

    //     // setShowDashboardText("");
    //     // setSetupVisible(false);
    //     // setHideSkuButton(false)
    //     // setIsResData(false)
    //     // setShowMsg(false);
    //     // console.log({ logs: logsRecords })
    //     // setTableData((prevState) =>
    //     //     ({ ...prevState, rows: logsRecords.rows, columns: logsRecords.columns, TableName: "Logs" }))

    //     try {
    //         const logsRes = await axios.post(`${constant.url}GetPredictionResults`, {
    //             Header: {
    //                 Type: 'Log',
    //                 // ShopURL :"finosys.myshopify.com"
    //                 ShopURL: localStorage.getItem("shop")
    //             }
    //         })
    //         setTableData((prevState) =>
    //             ({ ...prevState, rows: logsRes.data.Message.rows, columns: logsRes.data.Message.columns, TableName: "Logs" }))
    //         // setLoading(false)
    //         setOpen(false);
    //     }
    //     catch (e) {
    //         toast.current.show({ severity: 'error', summary: 'Failed to get Logs', detail: "Logs Api Response Failed", life: 3000 });
    //         console.log(e);
    //         setLoading(false)
    //         setOpen(false);
    //     }

    // }

    // const Dashboard = () => {
    //     setMTable(false);
    //     setSetupVisible(false);
    //     setShowDashboard(true);
    //     setHideSkuButton(true);
    //     setShowMsg(true);
    //     // let payload = {
    //     //     sku: '80V-HONEYMELLOW-3'
    //     // }

    //     // let GetData = await axios.post(`${constant.url}GetData`, payload)
    //     // setData(GetData.data.Message.rows)

    // }


    // // Used For Result Tab
    // const tableApiCalls = async () => {
    //     setMTable(false);
    //     setSetupVisible(false);
    //     setTableData((prevState) =>
    //         ({ ...prevState, rows: [], columns: [], TableName: "" }))
    //     // setLoading(true);
    //     setOpen(true)
    //     setShowDashboardText("");
    //     setHideSkuButton(false);
    //     setShowMsg(true);
    //     setShowDashboard(false);
    //     try {
    //         const res = await axios.post(`${constant.url}GetPredictionResults`, {
    //             Header: {
    //                 ClientID: 1,
    //                 Type: 'Result',
    //                 // ShopURL:""
    //                 ShopURL: localStorage.getItem("shop")
    //             }
    //         })
    //         console.log({ result: res })
    //         if (res.data.Message.rows.length != 0) {
    //             setShowDashboardText("Please Select Your SKU")
    //             setTableData((prevState) =>
    //             ({
    //                 ...prevState,
    //                 rows: res.data.Message.rows,
    //                 columns: res.data.Message.columns,
    //                 TableName: "Stock Out Dashboard"
    //             }))

    //             // setResultRecords((prevState) => ({
    //             //     ...prevState,
    //             //     rows: res.data.Message.rows,
    //             //     columns: res.data.Message.columns,
    //             //     TableName: "Stock Out Dashboard"
    //             // }))
    //             // setLoading(false);
    //             setOpen(false);
    //             setMTable(true);
    //             setShowMsg(false);
    //         }
    //         else {
    //             setShowDashboardText("We are working on your Data, Please be patient...") // Res set for DashBoards

    //         }

    //     }
    //     catch (e) {
    //         toast.current.show({
    //             severity: 'info',
    //             summary: 'No Source Setup found!',
    //             detail: "Please Create Source Setup to show records.",
    //             life: 3000
    //         });
    //         setOpen(false);
    //         setMTable(false);
    //         setShowMsg(true);
    //     }
    //     // try {
    //     //     const logsRes = await axios.post(`${constant.url}GetPredictionResults`, {
    //     //         Header: {
    //     //             Type: 'Log',
    //     //             // ShopURL :"finosys.myshopify.com"
    //     //             ShopURL: localStorage.getItem("shop")
    //     //         }
    //     //     })
    //     //     setLogsRecords((prevState) =>
    //     //         ({ ...prevState, rows: logsRes.data.Message.rows, columns: logsRes.data.Message.columns, TableName: "Logs" }))
    //     //     setLoading(false)
    //     // }
    //     // catch (e) {
    //     //     toast.current.show({ severity: 'error', summary: 'Failed to get Logs', detail: "Logs Api Response Failed", life: 3000 });
    //     //     console.log(e);
    //     //     setLoading(false)
    //     // }
    // }


    // const handleResEvent = async () => {
    //     console.log({ res: resultRecords })
    //     setMTable(true);
    //     setMTableForLogs(false);
    //     // setLoading(true);
    //     setShowDashboardText("");
    //     setIsResData(true)
    //     // setIsResData(true)
    //     setShowDashboard(false);
    //     setSetupVisible(false);
    //     // console.log({ data })
    //     setHideSkuButton(false);
    //     setShowMsg(false);

    //     // try {
    //     //     const res = await axios.post(`${constant.url}GetPredictionResults`, {
    //     //         Header: {
    //     //             ClientID: 1,
    //     //             Type: 'Result',
    //     //             // ShopURL:""
    //     //             ShopURL: localStorage.getItem("shop")
    //     //         }
    //     //     })
    //     //     console.log({ result: res })
    //     //     if (res.data.Message.rows.length != 0) {
    //     //         setShowDashboardText("Please Select Your SKU")

    //     //         setTableData((prevState) => ({
    //     //             ...prevState,
    //     //             rows: res.data.Message.rows,
    //     //             columns: res.data.Message.columns,
    //     //             TableName: "Stock Out Dashboard"
    //     //         }))
    //     //         setLoading(false);

    //     //         setIsResData(true)
    //     //     }
    //     //     else {
    //     //         setShowDashboardText("We are working on your Data, Please be patient...") // Res set for DashBoards

    //     //     }

    //     // }
    //     // catch (e) {
    //     //     toast.current.show({
    //     //         severity: 'info',
    //     //         summary: 'No Source Setup found!',
    //     //         detail: "Please Create Source Setup to show records.",
    //     //         life: 3000
    //     //     });
    //     //     setMTable(false);
    //     //     setShowMsg(true);
    //     // }



    // }


    // // console.log({ logs: resultRecords })
    // // setTableData((prevState) =>
    // //     ({ ...prevState, rows: resultRecords.rows, columns: resultRecords.columns, TableName: "Res" }))

    // // axios.post(`${constant.url}GetPredictionResults`, {
    // //     Header: {
    // //         ClientID: 1,
    // //         Type: 'Result',
    // //         // ShopURL:""
    // //         ShopURL: localStorage.getItem("shop")
    // //     }
    // // })
    // //     .then(function (response) {
    // //         if (response.data.Message.rows.length != 0) {
    // //             setShowDashboardText("Please Select Your SKU")
    // //         }
    // //         else {
    // //             setShowDashboardText("We are working on your Data, Please be patient...")

    // //         }
    // //         setData((prevState) => ({ ...prevState, rows: response.data.Message.rows, columns: response.data.Message.columns, TableName: "Stock Out Dashboard" }))
    // //         setLoading(false);
    // //         if (response.data.Success === false) {
    // //             // toast.current.show({ severity: 'info', summary: 'No Source Setup found!', detail: "Please Create Source Setup to show records.", life: 3000 });
    // //             setMTable(false);
    // //             setShowMsg(true);
    // //         }
    // //         else {
    // //             setMTable(true);
    // //             setShowMsg(false);
    // //         }
    // //     })
    // //     .catch(function (error) {
    // //         // console.log(error);
    // //         setLoading(false)
    // //     });

    // // }


    // const setActive = (i) => {
    //     let arr = optionsList.map((item) => {
    //         item.Avtive = false
    //         return item
    //     })


    //     arr[i].Avtive = !arr[i].Avtive
    //     setOptions([...arr])

    // }

    // // const handleSkuChange = async (val) => {
    // //     setVisibleRight(false)
    // //     // console.log({ val })
    // //     setShowDashboard(true);
    // //     setMTable(false);
    // //     setSetupVisible(false);
    // //     setsku(val);
    // //     let payload = {
    // //         sku: val,
    // //         ShopURL: localStorage.getItem("shop")
    // //     }
    // //     let GetData = await axios.post(`${constant.url}GetData`, payload)
    // //     console.log({ GetData })
    // //     setData(GetData.data.Message.rows)

    // // }

    // const setLookUpData = async (e, rowData) => {
    //     console.log({ e })
    //     console.log(rowData)
    //     setPoupUpLookupOpen(false)
    //     setShowDashboard(true);
    //     setMTable(false);
    //     setSetupVisible(false);
    //     setOpen(true)
    //     setsku(rowData.sku);
    //     let payload = {
    //         sku: rowData.sku,
    //         ShopURL: localStorage.getItem("shop")
    //     }
    //     try {
    //         let GetData = await axios.post(`${constant.url}GetData`, payload)
    //         setFdfData((prevState) => ({
    //             ...prevState,
    //             averageSales: GetData.data.Message.FDF_Data[0]['AverageSales'],
    //             projectedRevLoss: GetData.data.Message.FDF_Data[0]['ProjectedRevLoss'],
    //             projectedSales: GetData.data.Message.FDF_Data[0]['ProjectedSales'],
    //             reOrderQty: GetData.data.Message.FDF_Data[0]['ReOrderQty'],
    //             totalRevenue: GetData.data.Message.FDF_Data[0]['TotalRevenue'].toFixed(2),
    //             totalSalesQty: GetData.data.Message.FDF_Data[0]['TotalSaleQty'],
    //             totalWeeks: GetData.data.Message.FDF_Data[0]['TotalWeeks']
    //         }))
    //         console.log({ GetData })
    //         setData(GetData.data.Message.Dashboard.rows)
    //         setOpen(false)

    //     }
    //     catch (e) {
    //         setOpen(false)
    //     }

    // }


    // const handleClose = () => {
    //     setOpen(false);
    // };
    // const handleToggle = () => {
    //     setOpen(!open);
    // };


    // const openSku = () => {
    //     // setVisibleRight(true)
    //     setPoupUpLookupOpen(true)
    // }

    // const openSetup = () => {
    //     // setup
    //     history.push("/setup");
    //     // setShowMsg(false);
    //     // setSetupVisible(true);
    //     // setShowDashboard(false);
    //     // setHideSkuButton(false);
    //     // setVisibleRight(false);
    //     // setMTable(false);
    // }

    // const closeSku = () => {
    //     setVisibleRight(false)
    // }

    // const openSetup12 = () => {
    //     console.log({ props })
    //     history.push("/about");
    //     // props.history.push("about");
    // }



    return (<>
        <TopBar></TopBar>
        {/* <LinearProgress color='secondary' /> */}
        <div className='p-grid p-justify-center' style={{ height: 130, position: 'relative', bottom: 10 }}>
            <img src="assets/logo/ai_web_logo.png" alt="ai_logo" width="580px" height="220px" />
        </div>
    </>
    )
}
export default App;
