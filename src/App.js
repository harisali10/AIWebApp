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
import tableComponent from './tableComponent';
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

const App = () => {
    const classes = useStyles();
    const toast = React.useRef(null);
    const [resultRecords, setResultRecords] = useState({ rows: [], columns: [], TableName: '' })
    const [logsRecords, setLogsRecords] = useState({ rows: [], columns: [], TableName: '' })
    const [tableData, setTableData] = useState({ rows: [], columns: [], TableName: '' })
    const [data, setData] = useState({ rows: [], columns: [], TableName: '' })
    const [isResData, setIsResData] = useState(true)



    const [open, setOpen] = React.useState(false);

    const [showDashboardText, setShowDashboardText] = useState("")
    const [MTable, setMTable] = useState(true)
    const [PoupUpLookupOpen, setPoupUpLookupOpen] = React.useState(false);
    const [MTableForLogs, setMTableForLogs] = React.useState(false);

    const [skuColumns, setSkuColumns] = useState([
        { title: 'Sku', field: 'sku' },
        { title: 'Brand', field: 'brand' },
        { title: 'Product Type', field: 'product_type' }

    ]);
    const [showMsg, setShowMsg] = useState(false)
    const [showDashboard, setShowDashboard] = useState(false)
    const [optionsList, setOptions] = useState([])
    const [fdfData, setFdfData] = useState({
        averageSales: 0,
        projectedRevLoss: 0,
        projectedSales: 0,
        reOrderQty: 0,
        totalRevenue: 0,
        totalSalesQty: 0,
        totalWeeks: 0

    })
    const [sku, setsku] = useState('')
    const [hideSkuButton, setHideSkuButton] = useState(false)
    const [loading, setLoading] = useState(true)
    const [visibleRight, setVisibleRight] = useState(false)
    const [setupVisible, setSetupVisible] = useState(false)


    // Shopify.Context.initialize({
    //   API_KEY: process.env.SHOPIFY_API_KEY,
    //   API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    //   SCOPES: process.env.SCOPES.split(","),
    //   HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
    //   API_VERSION: ApiVersion.October20,
    // });

    useEffect(() => {
        getOptionList();
        let params = queryString.parse(window.location.search)
        localStorage.setItem("shop", params.shop);
        // localStorage.setItem("shop", "finosys.myshopify.com");
        tableApiCalls();
    }, [])

    async function getOptionList() {
        document.body.style.zoom = "80%";
        try {
            let options = await axios.post(`${constant.url}lookup`, {
                Header: {
                    ShopURL: localStorage.getItem("shop")
                }
            })
            setOptions(options.data.Message)
        } catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'Failed to get SKUs',
                detail: "SKU Api Response Failed",
                life: 3000
            });

        }

    }

    const handleLogEvent = async () => {
        setTableData((prevState) =>
            ({ ...prevState, rows: [], columns: [], TableName: "" }))
        setMTable(true);
        setLoading(true);
        setSetupVisible(false);
        setShowDashboard(false);
        setShowMsg(false);
        setOpen(true);
        setShowDashboardText("");
        // setMTable(false);
        // setShowDashboard(false);
        // // setLoading(true);
        // setIsResData(false);
        // setMTableForLogs(true);

        // setShowDashboardText("");
        // setSetupVisible(false);
        // setHideSkuButton(false)
        // setIsResData(false)
        // setShowMsg(false);
        // console.log({ logs: logsRecords })
        // setTableData((prevState) =>
        //     ({ ...prevState, rows: logsRecords.rows, columns: logsRecords.columns, TableName: "Logs" }))

        try {
            const logsRes = await axios.post(`${constant.url}GetPredictionResults`, {
                Header: {
                    Type: 'Log',
                    // ShopURL :"finosys.myshopify.com"
                    ShopURL: localStorage.getItem("shop")
                }
            })
            setTableData((prevState) =>
                ({ ...prevState, rows: logsRes.data.Message.rows, columns: logsRes.data.Message.columns, TableName: "Logs" }))
            // setLoading(false)
            setOpen(false);
        }
        catch (e) {
            toast.current.show({ severity: 'error', summary: 'Failed to get Logs', detail: "Logs Api Response Failed", life: 3000 });
            console.log(e);
            setLoading(false)
            setOpen(false);
        }

    }

    const Dashboard = () => {
        setMTable(false);
        setSetupVisible(false);
        setShowDashboard(true);
        setHideSkuButton(true);
        setShowMsg(true);
        // let payload = {
        //     sku: '80V-HONEYMELLOW-3'
        // }

        // let GetData = await axios.post(`${constant.url}GetData`, payload)
        // setData(GetData.data.Message.rows)

    }


    // Used For Result Tab
    const tableApiCalls = async () => {
        setMTable(false);
        setSetupVisible(false);
        setTableData((prevState) =>
            ({ ...prevState, rows: [], columns: [], TableName: "" }))
        // setLoading(true);
        setOpen(true)
        setShowDashboardText("");
        setHideSkuButton(false);
        setShowMsg(true);
        setShowDashboard(false);
        try {
            const res = await axios.post(`${constant.url}GetPredictionResults`, {
                Header: {
                    ClientID: 1,
                    Type: 'Result',
                    // ShopURL:""
                    ShopURL: localStorage.getItem("shop")
                }
            })
            console.log({ result: res })
            if (res.data.Message.rows.length != 0) {
                setShowDashboardText("Please Select Your SKU")
                setTableData((prevState) =>
                ({
                    ...prevState,
                    rows: res.data.Message.rows,
                    columns: res.data.Message.columns,
                    TableName: "Stock Out Dashboard"
                }))

                // setResultRecords((prevState) => ({
                //     ...prevState,
                //     rows: res.data.Message.rows,
                //     columns: res.data.Message.columns,
                //     TableName: "Stock Out Dashboard"
                // }))
                // setLoading(false);
                setOpen(false);
                setMTable(true);
                setShowMsg(false);
            }
            else {
                setShowDashboardText("We are working on your Data, Please be patient...") // Res set for DashBoards

            }

        }
        catch (e) {
            toast.current.show({
                severity: 'info',
                summary: 'No Source Setup found!',
                detail: "Please Create Source Setup to show records.",
                life: 3000
            });
            setOpen(false);
            setMTable(false);
            setShowMsg(true);
        }
        // try {
        //     const logsRes = await axios.post(`${constant.url}GetPredictionResults`, {
        //         Header: {
        //             Type: 'Log',
        //             // ShopURL :"finosys.myshopify.com"
        //             ShopURL: localStorage.getItem("shop")
        //         }
        //     })
        //     setLogsRecords((prevState) =>
        //         ({ ...prevState, rows: logsRes.data.Message.rows, columns: logsRes.data.Message.columns, TableName: "Logs" }))
        //     setLoading(false)
        // }
        // catch (e) {
        //     toast.current.show({ severity: 'error', summary: 'Failed to get Logs', detail: "Logs Api Response Failed", life: 3000 });
        //     console.log(e);
        //     setLoading(false)
        // }
    }


    const handleResEvent = async () => {
        console.log({ res: resultRecords })
        setMTable(true);
        setMTableForLogs(false);
        // setLoading(true);
        setShowDashboardText("");
        setIsResData(true)
        // setIsResData(true)
        setShowDashboard(false);
        setSetupVisible(false);
        // console.log({ data })
        setHideSkuButton(false);
        setShowMsg(false);

        // try {
        //     const res = await axios.post(`${constant.url}GetPredictionResults`, {
        //         Header: {
        //             ClientID: 1,
        //             Type: 'Result',
        //             // ShopURL:""
        //             ShopURL: localStorage.getItem("shop")
        //         }
        //     })
        //     console.log({ result: res })
        //     if (res.data.Message.rows.length != 0) {
        //         setShowDashboardText("Please Select Your SKU")

        //         setTableData((prevState) => ({
        //             ...prevState,
        //             rows: res.data.Message.rows,
        //             columns: res.data.Message.columns,
        //             TableName: "Stock Out Dashboard"
        //         }))
        //         setLoading(false);

        //         setIsResData(true)
        //     }
        //     else {
        //         setShowDashboardText("We are working on your Data, Please be patient...") // Res set for DashBoards

        //     }

        // }
        // catch (e) {
        //     toast.current.show({
        //         severity: 'info',
        //         summary: 'No Source Setup found!',
        //         detail: "Please Create Source Setup to show records.",
        //         life: 3000
        //     });
        //     setMTable(false);
        //     setShowMsg(true);
        // }



    }


    // console.log({ logs: resultRecords })
    // setTableData((prevState) =>
    //     ({ ...prevState, rows: resultRecords.rows, columns: resultRecords.columns, TableName: "Res" }))

    // axios.post(`${constant.url}GetPredictionResults`, {
    //     Header: {
    //         ClientID: 1,
    //         Type: 'Result',
    //         // ShopURL:""
    //         ShopURL: localStorage.getItem("shop")
    //     }
    // })
    //     .then(function (response) {
    //         if (response.data.Message.rows.length != 0) {
    //             setShowDashboardText("Please Select Your SKU")
    //         }
    //         else {
    //             setShowDashboardText("We are working on your Data, Please be patient...")

    //         }
    //         setData((prevState) => ({ ...prevState, rows: response.data.Message.rows, columns: response.data.Message.columns, TableName: "Stock Out Dashboard" }))
    //         setLoading(false);
    //         if (response.data.Success === false) {
    //             // toast.current.show({ severity: 'info', summary: 'No Source Setup found!', detail: "Please Create Source Setup to show records.", life: 3000 });
    //             setMTable(false);
    //             setShowMsg(true);
    //         }
    //         else {
    //             setMTable(true);
    //             setShowMsg(false);
    //         }
    //     })
    //     .catch(function (error) {
    //         // console.log(error);
    //         setLoading(false)
    //     });

    // }


    const setActive = (i) => {
        let arr = optionsList.map((item) => {
            item.Avtive = false
            return item
        })


        arr[i].Avtive = !arr[i].Avtive
        setOptions([...arr])

    }

    // const handleSkuChange = async (val) => {
    //     setVisibleRight(false)
    //     // console.log({ val })
    //     setShowDashboard(true);
    //     setMTable(false);
    //     setSetupVisible(false);
    //     setsku(val);
    //     let payload = {
    //         sku: val,
    //         ShopURL: localStorage.getItem("shop")
    //     }
    //     let GetData = await axios.post(`${constant.url}GetData`, payload)
    //     console.log({ GetData })
    //     setData(GetData.data.Message.rows)

    // }

    const setLookUpData = async (e, rowData) => {
        console.log({ e })
        console.log(rowData)
        setPoupUpLookupOpen(false)
        setShowDashboard(true);
        setMTable(false);
        setSetupVisible(false);
        setOpen(true)
        setsku(rowData.sku);
        let payload = {
            sku: rowData.sku,
            ShopURL: localStorage.getItem("shop")
        }
        try {
            let GetData = await axios.post(`${constant.url}GetData`, payload)
            setFdfData((prevState) => ({
                ...prevState,
                averageSales: GetData.data.Message.FDF_Data[0]['AverageSales'],
                projectedRevLoss: GetData.data.Message.FDF_Data[0]['ProjectedRevLoss'],
                projectedSales: GetData.data.Message.FDF_Data[0]['ProjectedSales'],
                reOrderQty: GetData.data.Message.FDF_Data[0]['ReOrderQty'],
                totalRevenue: GetData.data.Message.FDF_Data[0]['TotalRevenue'].toFixed(2),
                totalSalesQty: GetData.data.Message.FDF_Data[0]['TotalSaleQty'],
                totalWeeks: GetData.data.Message.FDF_Data[0]['TotalWeeks']
            }))
            console.log({ GetData })
            setData(GetData.data.Message.Dashboard.rows)
            setOpen(false)

        }
        catch (e) {
            setOpen(false)
        }

    }


    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };


    const openSku = () => {
        // setVisibleRight(true)
        setPoupUpLookupOpen(true)
    }

    const openSetup = () => {
        setShowMsg(false);
        setSetupVisible(true);
        setShowDashboard(false);
        setHideSkuButton(false);
        setVisibleRight(false);
        setMTable(false);
    }

    const closeSku = () => {
        setVisibleRight(false)
    }



    return (
        <div style={{ overflowX: 'hidden' }}>
            <div className='p-grid p-justify-center' style={{ height: 130, position: 'relative', bottom: 38 }}>
                {/* <img src="assets/logo/app_logo.jpeg" alt="app_logo" style={{}} width="400px" height="160px" /> */}
                <img src="assets/logo/ai_web_logo.png" alt="ai_logo" width="580px" height="220px" />
                {/* <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif', color: '#3f51b5' }}>The AI Systems</h1></div> */}
            </div>
            <Toast ref={toast} />
            <Divider light />
            <div className='p-grid' >
                <div className='p-col-2 p-md-1 p-lg-1' style={{ paddingTop: 15, marginLeft: 5 }}>
                    {/* <Button onClick={handleResEvent} style={{ width: '100%' }} variant="contained" color="primary">Results</Button> */}
                    <Button onClick={tableApiCalls} style={{ width: '100%' }} variant="contained" color="primary">Results</Button>
                </div>
                <div className='p-col-3 p-md-1 p-lg-1' style={{ paddingTop: 15, }}>
                    <Button onClick={Dashboard} style={{ width: '100%', }} variant="contained" color="primary">Dashboard</Button>
                </div>
                <div className='p-col-2 p-md-1 p-lg-1' style={{ paddingTop: 15 }} >
                    <Button variant="contained" style={{ width: '100%', }} onClick={handleLogEvent} color="primary">Logs</Button>
                </div>
                <div className='p-col-2 p-md-1 p-lg-1' style={{ paddingTop: 15, }}>
                    <Button variant="contained" style={{ width: '100%' }} onClick={openSetup} color="primary" >Setup</Button>
                </div>
                {hideSkuButton === true ? <div className='p-col-2 p-md-1 p-lg-1' style={{ paddingTop: 15, }}>
                    <Button variant="contained" style={{ width: '100%', }} onClick={openSku} color="primary" startIcon={<AddIcon />}>SKU</Button>
                </div> : null}

            </div>
            <Divider light />
            {/* <tableComponent
                tableName={logsRecords.TableName}
                rows={logsRecords.rows}
                columns={logsRecords.rows}></tableComponent> */}

            {MTable === true ?
                <MaterialTable
                    style={{
                        padding: '10px',
                        boxShadow: 'none'
                    }}
                    title=
                    {
                        <div className="table-button" >
                            <span className="table-title" style={{ fontWeight: "bold", fontSize: "20px" }}>{tableData.TableName}</span>


                        </div>
                    }
                    isLoading={false}
                    columns={tableData.columns}
                    // columns={tableData.columns}
                    // data={tableData.rows}
                    data={tableData.rows}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'No records to display',
                            filterRow: {
                                filterTooltip: 'Filter'
                            }
                        }
                    }}
                    icons={{ Filter: () => <div /> }}
                    options={{
                        actionsColumnIndex: -1,
                        pageSize: 10,
                        pageSizeOptions: [5, 10, 20, 30],
                        search: true,
                        filtering: true,
                        headerStyle: {
                            fontWeight: 'bold',
                            paddingLeft: '10px',
                            paddingRight: '0px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            textAlign: 'left'
                        },
                        rowStyle: x => {
                            if (x.tableData.id % 2) {
                                return { backgroundColor: "#f2f2f2", padding: "7px" }
                            }
                            else {
                                return { padding: "7px" }
                            }
                        }
                    }}
                />
                : null}




            {showMsg === true ?
                <div className='p-grid p-justify-center' >
                    <h2 style={{ marginTop: '1%' }}>{showDashboardText}</h2>
                </div>
                : null}
            {setupVisible === true ?
                <Setups />
                : null}
            {showDashboard === true ?
                <div className='p-grid'>
                    <div className='p-col-9'>
                        <ComposedChart
                            width={1480}
                            height={450}
                            data={data}
                            margin={{
                                top: 0,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}

                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="WeekOfYear" />
                            <YAxis yAxisId={"left"} type="number" domain={[0, 600]} />
                            <YAxis yAxisId={"right"} orientation={"right"} type="number" domain={[0, 600]} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId={"left"} dataKey="Opening_Stock" fill="#fc0324" />
                            <Line yAxisId={"right"} dataKey="SS" fill="#03fc17" />
                        </ComposedChart>

                        <ComposedChart
                            width={1480}
                            height={450}
                            data={data}
                            margin={{
                                top: 0,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="WeekOfYear" />
                            <YAxis yAxisId={"left"} type="number" domain={[0, 100]} />
                            <YAxis yAxisId={"right"} orientation={"right"} type="number" domain={[0, 600]} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId={"left"} dataKey="Sales" fill="#387318" />
                            <Line yAxisId={"right"} type="monotone" dataKey="Purchases" fill="#704a1a" />
                        </ComposedChart>
                    </div>
                    <div className='p-col-3' style={{ paddingRight: 25 }}>
                        {/* <h5>Haris Ali</h5> */}
                        <div className="card card-w-title " style={{ boxShadow: "-1px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)" }} >
                            <div className='p-grid'>
                                <div className='p-col-1'>
                                </div>
                                <div className='p-col-11'>
                                    <h1 style={{ color: '#56af8e' }}>Numbers</h1>
                                </div>
                            </div>
                            <Divider />
                            <div className='p-grid'>
                                <div className="p-col-1"></div>
                                <div className='p-col-7'>

                                    <Typography variant="h6">Re Order Qty</Typography>
                                </div>
                                <div className='p-col-4'>
                                    <Typography variant="h6">{fdfData.reOrderQty}</Typography>
                                    {/* <p>123</p> */}
                                </div>
                            </div>
                            <div className='p-grid'>
                                <div className="p-col-1"></div>
                                <div className='p-col-7'>
                                    <Typography variant="h6">Total Weeks</Typography>

                                </div>
                                <div className='p-col-4'>
                                    <Typography variant="h6">{fdfData.totalWeeks}</Typography>
                                    {/* <p>123</p> */}
                                </div>
                            </div>
                            <div className='p-grid'>
                                <div className="p-col-1"></div>
                                <div className='p-col-7'>
                                    <Typography variant="h6">Average Sales</Typography>

                                    {/* <p>Average Sales</p> */}
                                </div>
                                <div className='p-col-4'>
                                    <Typography variant="h6">{fdfData.averageSales}</Typography>
                                    {/* <p>123</p> */}
                                </div>
                            </div>
                            <div className='p-grid'>
                                <div className="p-col-1"></div>
                                <div className='p-col-7'>
                                    <Typography variant="h6"> Total Sales Quantity</Typography>
                                    {/* <p> Total Sales Quantity</p> */}
                                </div>
                                <div className='p-col-4'>
                                    <Typography variant="h6">{fdfData.totalSalesQty}</Typography>
                                    {/* <p>123</p> */}
                                </div>
                            </div>
                            <div className='p-grid'>
                                <div className="p-col-1"></div>
                                <div className='p-col-7'>
                                    <Typography variant="h6">Total Revenue</Typography>
                                </div>
                                <div className='p-col-4'>
                                    <Typography variant="h6">{fdfData.totalRevenue}</Typography>
                                    {/* <p>123</p> */}
                                </div>
                            </div>
                            <div className='p-grid'>
                                <div className="p-col-1"></div>
                                <div className='p-col-7'>
                                    <Typography variant="h6"> Projected Sales</Typography>
                                    {/* <p> Projected Sales</p> */}
                                </div>
                                <div className='p-col-4'>
                                    <Typography variant="h6">{fdfData.projectedSales}</Typography>
                                    {/* <p>123</p> */}
                                </div>
                            </div>
                            <div className='p-grid'>
                                <div className="p-col-1"></div>
                                <div className='p-col-7'>
                                    <Typography variant="h6"> Projected Revenue Loss</Typography>
                                    {/* <p> Projected Revenue Loss</p> */}
                                </div>
                                <div className='p-col-4'>
                                    <Typography variant="h6">{fdfData.projectedRevLoss}</Typography>
                                    {/* <p>123</p> */}
                                </div>
                            </div>
                            <Divider />
                        </div>
                    </div>
                </div>
                :
                null}


            <div style={{ marginTop: '120px' }}>
                <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', backgroundColor: '#3f51b5', color: 'white', textAlign: 'center', height: 60}}>
                    <a  style={{ color: "white", fontSize: 25,  }} href="https://drive.google.com/file/d/1hfs1aTjM8rowsKfhNl0f_pci76mTs6pP/view?usp=sharing"> Privacy</a>
                    <a style={{ color: "white", fontSize: 25, paddingLeft:35  }} href="mailto:arehman@theaisystems.com">Contact Us</a>
                </div>
            </div>

            {/* <div className="p-grid p-align-center p-justify-center" style={{ backgroundColor: "#3f51b5", height: 100 }}>
                <div className="p-col-2">
                    <a style={{ color: "white", fontSize: 25, paddingLeft: 70 }} href="https://drive.google.com/file/d/1hfs1aTjM8rowsKfhNl0f_pci76mTs6pP/view?usp=sharing">privacy</a>
                </div>
                <div className="p-col-2">
                    <a style={{ color: "white", fontSize: 25 }} href="mailto:arehman@theaisystems.com">Contact Us</a>
                </div>

            </div> */}

            {/* <Drawer elevation={0}
                anchor={'right'}
                onClose={closeSku}
                open={visibleRight} >
                <div style={{ padding: 30 }}>
                    <div style={{ backgroundColor: 'white', width: 300 }} />
                    <div className="p-grid">
                        <div className="p-col-8">
                            <h1 style={{ alignContent: 'center' }}>SKU's</h1>
                        </div>
                    </div>

                    <div className="p-grid">

                        <div className="p-col-3" style={{ width: 600 }} >
                            <ul style={{ display: "flex", flexDirection: 'row', flexWrap: 'wrap' }}>
                                {optionsList.map((eachItem, i) => {
                                    return <li key={i} style={{ width: 190, margin: 10, fontSize: 16, cursor: 'pointer', color: eachItem.Avtive ? "blue" : "black", textDecorationLine: eachItem.Avtive ? "underline" : "none" }}
                                        onMouseOver={() => setActive(i)}
                                        // onMouseDown={()=>setInActive(i)}
                                        // onClick={() => null} >{eachItem.sku}</li>
                                        onClick={() => handleSkuChange(eachItem.sku)} >{eachItem.sku}</li>
                                })}
                            </ul>
                        </div>
                    </div>

                </div>
            </Drawer> */}
            {/* <tableComponent
                tableName={isResData === true ? resultRecords.TableName : logsRecords.TableName}
                rows={isResData === true ? resultRecords.rows : logsRecords.rows}
                columns={isResData === true ? resultRecords.rows : logsRecords.rows}></tableComponent>
                 */}
            {/* <div>
                <
            </div> */}

            <PopupLookup large={true} LookUpHeading={"SKU"}
                LookUpClose={() => setPoupUpLookupOpen(false)} setLookUpData={(e, rowData) => setLookUpData(e, rowData)}
                LookUpOpen={PoupUpLookupOpen} LookupList={{ columns: skuColumns, rows: optionsList }} />
            <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop>


        </div >
    )
}
export default App;
