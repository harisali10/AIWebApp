import React, { useEffect, useState } from "react";
import { Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Divider, Card, CardActions, CardContent, Button, Paper, FormControlLabel, Switch } from '@material-ui/core';
import PopupLookup from '../PopUpLookUp';
import { Dialog, DialogContent, IconButton, Typography } from '@material-ui/core'
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import constants from '../utilities/constants';
import { resetSkuValue, resetSkuArray } from '../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import Collapse from '@material-ui/core/Collapse';
import { Toast } from 'primereact/toast';
import BackDropLoader from "../components/BackDrop";
import { motion } from "framer-motion"
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Slide from '@material-ui/core/Slide';
import MaterialTable from 'material-table';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



let skuColumns = [

];

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    container: {
        display: 'flex',
    },
    paper: {
        marginLeft: 10,
        marginRight: 13,
        backgroundColor:'#61ab8e'
    },

});

const constant = constants.getConstant();

const Dashboard = () => {


    const dispatch = useDispatch();
    const toast = React.useRef(null);
    const [showLoader, setShowLoader] = useState(false)

    const [fdfData, setFdfData] = useState({
        averageSales: 0,
        projectedRevLoss: 0,
        projectedSales: 0,
        reOrderQty: 0,
        totalRevenue: 0,
        totalSalesQty: 0,
        totalWeeks: 0

    })

    const [data, setData] = useState({ rows: [], columns: [], TableName: '' })
    const [skuList, setSkuList] = useState([]);
    const [skuName, setSkuName] = useState("");
    const [PoupUpLookupOpen, setPoupUpLookupOpen] = useState(false);

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;


    const skuR = useSelector(skuRes => skuRes)

    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };


    useEffect(() => {
        if (skuR.skuRes.skuValue) {
            setPoupUpLookupOpen(true)
            dispatch(resetSkuValue())
        }
        if (skuR.skuRes.skuArray.length > 0) {
            setSkuList(skuR.skuRes.skuArray)
            // dispatch(resetSkuArray())
        }

    }, [skuR])

    const setLookUpData = async (e, rowData) => {
        setPoupUpLookupOpen(false)
        setShowLoader(true)
        setChecked(false);
        let payload = {
            sku: rowData.sku,
            ShopURL: sessionStorage.getItem("shop")
        }
        try {
            let GetData = await axios.post(`${constant.url}GetData`, payload)
            setFdfData((prevState) => ({
                ...prevState,
                averageSales: GetData.data.Message.FDF_Data[0]['AverageSales'].toFixed(),
                projectedRevLoss: GetData.data.Message.FDF_Data[0]['ProjectedRevLoss'].toFixed(),
                projectedSales: GetData.data.Message.FDF_Data[0]['ProjectedSales'].toFixed(),
                reOrderQty: GetData.data.Message.FDF_Data[0]['ReOrderQty'].toFixed(),
                totalRevenue: GetData.data.Message.FDF_Data[0]['TotalRevenue'].toFixed(),
                totalSalesQty: GetData.data.Message.FDF_Data[0]['TotalSaleQty'].toFixed(),
                totalWeeks: GetData.data.Message.FDF_Data[0]['TotalWeeks'].toFixed()
            }))
            setData(GetData.data.Message.Dashboard.rows)
            setSkuName(rowData.sku)
            // setChecked((prev) => !prev);
            setChecked(true);

        }
        catch (e) {
        }

        setShowLoader(false)

    }

    return (<>

        <BackDropLoader backDrop={showLoader}>

        </BackDropLoader>

        <div style={{ overflowX: 'hidden' }}>

            <div className='p-grid' style={{ paddingTop: 20 }}>
                <div className="p-col-12 p-md-12 p-lg-12" >
                    <Collapse in={checked} timeout={1700}>
                        <Paper elevation={4} className={classes.paper}>
                            <Typography
                                variant="h5"
                                align="center"
                                style={{ paddingTop: 10, paddingBottom: 10,color:'white', fontFamily:'Georgia' }}>
                                {`SKU : ${skuName}`}
                            </Typography>

                        </Paper>
                    </Collapse>
                </div>
                <div className='p-col-12 p-md-9 p-lg-9'>
                    <ResponsiveContainer width="99%" height="50%" aspect={3}>
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

                    </ResponsiveContainer >
                    <ResponsiveContainer width="99%" height="0%" aspect={3}>

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
                    </ResponsiveContainer>

                </div>
                <div className="p-col-12 p-md-3 p-lg-3" style={{ paddingRight: 20 }} >
                    <Card >
                        <div className="p-grid p-justify-center" style={{ backgroundColor: "#61ab8e" }}>
                            <div className='p-col-6'>
                                <h1 style={{ color: 'white', fontFamily: 'Georgia' }}>NUMBERS</h1>
                            </div>

                        </div>
                        {/* <Divider /> */}
                        <div className="p-grid" style={{ backgroundColor: "#f2f2f2" }}>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" style={{ fontStyle: 'italic' }}  >&nbsp;Re Order Qty</Typography>
                            </div>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" align="center" >{fdfData.reOrderQty}</Typography>
                            </div>

                        </div>
                        {/* <Divider /> */}
                        <div className="p-grid">
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" style={{ fontStyle: 'italic' }} >&nbsp;Total Weeks</Typography>
                            </div>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" align="center">{fdfData.totalWeeks}</Typography>
                            </div>

                        </div>
                        {/* <Divider /> */}
                        <div className="p-grid" style={{ backgroundColor: "#f2f2f2" }}>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" style={{ fontStyle: 'italic' }} >&nbsp;Average Sales</Typography>
                            </div>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" align="center">{fdfData.averageSales}</Typography>
                            </div>

                        </div>
                        <div className="p-grid" >
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" style={{ fontStyle: 'italic' }} >&nbsp;Total Sales Quantity</Typography>
                            </div>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" align="center">{fdfData.totalSalesQty}</Typography>
                            </div>

                        </div>
                        <div className="p-grid" style={{ backgroundColor: "#f2f2f2" }}>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" style={{ fontStyle: 'italic' }}>&nbsp;Projected Sales</Typography>
                            </div>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" align="center">{fdfData.projectedSales}</Typography>
                            </div>

                        </div>
                        <div className="p-grid" >
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" style={{ fontStyle: 'italic' }}>&nbsp;Projected Revenue Lost</Typography>
                            </div>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" align="center">{fdfData.projectedRevLoss}</Typography>
                            </div>

                        </div>
                        <div className="p-grid " style={{ backgroundColor: "#f2f2f2" }}>
                            <div className='p-col-6'>
                                <Typography variant="subtitle1" style={{ fontStyle: 'italic' }}>&nbsp;Total Revenue</Typography>
                            </div>
                            <div className='p-col-6 '>
                                <Typography variant="subtitle1" align="center">{fdfData.totalRevenue}</Typography>
                            </div>

                        </div>
                    </Card>
                </div>

            </div>


            <Dialog
                fullWidth={true}
                maxWidth={"lg"}
                TransitionComponent={Transition}
                onClose={() => { setPoupUpLookupOpen(false) }}
                aria-labelledby="customized-dialog-title" open={PoupUpLookupOpen}>
                <MuiDialogTitle disableTypography style={{ paddingBottom: '0px !important' }}>
                    <Typography variant="h6">{"SKU"}</Typography>
                    <IconButton style={{ position: 'absolute', right: '5px', top: '10px' }} aria-label="close" onClick={() => { setPoupUpLookupOpen(false) }}>
                        <CloseIcon />
                    </IconButton>
                </MuiDialogTitle>
                <DialogContent style={{ paddingTop: '0px !important' }}>
                    <MaterialTable
                        style={{
                            border: 'none',
                            boxShadow: 'none'
                        }}
                        icons={{ Filter: () => <div /> }}
                        columns={[
                            { title: 'Sku', field: 'sku' },
                            { title: 'Brand', field: 'brand' },
                            { title: 'Product Type', field: 'product_type' }

                        ]}
                        data={skuList
                        }
                        options={{
                            showTitle: false,
                            search: false,
                            filtering: true,
                            sorting: false,
                            rowStyle: x => {
                                if (x.tableData.id % 2) {
                                    return { backgroundColor: "#f2f2f2", padding: "7px" }
                                }
                                else {
                                    return { padding: "7px" }
                                }
                            },
                            headerStyle: {
                                fontWeight: "bolder",
                                fontStyle: 'italic'
                            },
                        }}
                        onRowClick={(e, x) => setLookUpData(e, x)}

                    />


                </DialogContent>


            </Dialog>


            {/* <PopupLookup
                large={true} LookUpHeading={"SKU"}
                LookUpClose={() => setPoupUpLookupOpen(false)} setLookUpData={(e, rowData) => setLookUpData(e, rowData)}
                LookUpOpen={PoupUpLookupOpen} LookupList={{ columns: skuColumns, rows: skuList }} /> */}
        </div>

    </>)
}

export default Dashboard;