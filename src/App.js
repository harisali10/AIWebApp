import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
// import dotenv from "dotenv";
import { Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import {
    Grid, Button, Select, FormControl, InputLabel, MenuItem, FormHelperText, TextField, Backdrop, CircularProgress, Drawer ,Snackbar 
} from '@material-ui/core';
// import Defaults from "../defaults"
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import constants from '../src/utilities/constants';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

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
    }
}));


const constant = constants.getConstant();

const App = () => {
    const classes = useStyles();
    const [data, setData] = useState({ rows: [], columns: [], TableName: '' })
    const [MTable, setMTable] = useState(true)
    const [optionsList, setOptions] = useState([])
    const [sku, setsku] = useState('')
    const [loading, setLoading] = useState(false)
    const [visibleRight, setVisibleRight] = useState(false)


    // Shopify.Context.initialize({
    //   API_KEY: process.env.SHOPIFY_API_KEY,
    //   API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    //   SCOPES: process.env.SCOPES.split(","),
    //   HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
    //   API_VERSION: ApiVersion.October20,
    // });

    useEffect(() => {
        getOptionList();
    }, [])

    async function getOptionList() {
        let options = await axios.get(`${constant.url}lookup/`)
        console.log({ options: options.data.Message })
        setOptions(options.data.Message)

    }


    // Depreciated 
    // const fetchData = async () => {
    //     setMTable(true);
    //     axios.post(`https://ai-apps.azurewebsites.net/api/v1/GetShopifyData`, {
    //         Header: {
    //             ClientID: 1,
    //             ShopURL: process.env.SHOP
    //         }
    //     })
    //         .then(function (response) {
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });

    // }


    const fetchLogs = () => {
        setMTable(true);
        setLoading(true)
        axios.post(`${constant.url}GetPredictionResults`, {
            Header: {
                ClientID: 1,
                Type: 'Log',
                // ClientName:ctx.state.shopify.id,
                // APIKey:ctx.query.code,
                ShopURL: process.env.SHOP
                // AccessToken:ctx.state.shopify.accessToken
            }
        })
            .then(function (response) {
                setData((prevState) =>
                    ({ ...prevState, rows: response.data.Message.rows, columns: response.data.Message.columns, TableName: "Logs" }))
                setLoading(false)
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false)
            });

    }

    const Dashboard = async () => {
        setMTable(false);
        let payload = {
            sku: '80V-HONEYMELLOW-3'
        }

        let GetData = await axios.post(`${constant.url}GetData`, payload)
        setData(GetData.data.Message.rows)

    }

    const fetchResults = () => {
        setMTable(true);
        setLoading(true)
        axios.post(`${constant.url}GetPredictionResults`, {
            Header: {
                ClientID: 1,
                Type: 'Result',
                // ClientName:ctx.state.shopify.id,
                // APIKey:ctx.query.code,
                ShopURL: process.env.SHOP,
                // AccessToken:ctx.state.shopify.accessToken
            }
        })
            .then(function (response) {
                setData((prevState) => ({ ...prevState, rows: response.data.Message.rows, columns: response.data.Message.columns, TableName: "Stock Out Dashboard" }))
                // rows = response.Messaage.rows
                setLoading(false)
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false)
            });

    }


    const setActive = (i) => {
        let arr = optionsList.map((item) => {
            item.Avtive = false
            return item
        })


        arr[i].Avtive = !arr[i].Avtive
        setOptions([...arr])

    }

    const handleSkuChange = (val) => {
        setVisibleRight(false)
        console.log({ val })

    }

    const openSku = () => {
        setVisibleRight(true)
    }

    return (
        <>

            {/* <Grid > */}
            <Grid container spacing={0} style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 7 }}>
                <Grid item xs={1}>
                    <Button variant="outlined" onClick={fetchLogs} color="primary">Get Logs</Button>
                </Grid>
                <Grid item xs={1}>

                    <Button onClick={fetchResults} variant="outlined" color="primary">Get Res </Button>

                </Grid>

                <Grid item xs={1}>
                    <Button onClick={Dashboard} variant="outlined" color="primary">Dashboard</Button>

                </Grid>
                <Grid item xs={7}>

                </Grid>


                <Grid container item xs={2} justify="flex-end" style={{paddingRight:21}}>
                    <Button variant="outlined"  onClick={openSku} color="primary" startIcon={<AddIcon />}>
                        Add SKU
                    </Button>
                    {/* <Button onClick={openSku} color="primary">Choose SKU</Button> */}
                    {/* <TextField
                        fullWidth
                        label={"Please Select SKU"}
                        variant="outlined"
                        disabled={false}
                        id={1}
                        select
                        value={sku}
                        onChange={(e) => setsku(e.target.value)}
                    // helperText={"Please Select Value"}
                    >
                        {optionsList.length ? optionsList.map((item, index) => (
                            item.code ?
                                <MenuItem key={index} value={item.code} className={classes.root}>
                                    {item.value}
                                </MenuItem>
                                :
                                <MenuItem key={index} value={item.sku} className={classes.root}>
                                    {item.sku}
                                </MenuItem>
                        ))
                            : <MenuItem className={classes.root}>
                                No Options
                            </MenuItem>
                        }
                    </TextField> */}

                </Grid>

            </Grid>



            {MTable === true ?
                <MaterialTable
                    style={{
                        padding: '10px'
                    }}
                    title=
                    {
                        <div className="table-button" >
                            <span className="table-title" style={{ fontWeight: "bold", fontSize: "20px" }}>{data.TableName}</span>


                        </div>
                    }
                    isLoading={loading}
                    columns={data.columns}
                    data={data.rows}
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
                        }
                    }}
                // actions={actionCol}
                />
                :
                <div>
                    <ComposedChart
                        width={2000}
                        height={450}
                        data={data}
                        margin={{
                            top: 50,
                            right: 30,
                            left: 20,
                            bottom: 5,
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
                        width={2000}
                        height={450}
                        data={data}
                        margin={{
                            top: 50,
                            right: 30,
                            left: 20,
                            bottom: 5,
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
            }

            <Drawer elevation={0}
                anchor={'right'}
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
            </Drawer>
        </>
    )
}
export default App;
