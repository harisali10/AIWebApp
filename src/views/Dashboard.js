import React, { useEffect, useState } from "react";
import { Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Divider, Typography, Card, CardActions, CardContent, Button, Paper, FormControlLabel, Switch } from '@material-ui/core';
import PopupLookup from '../PopUpLookUp';
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

let skuColumns = [
    { title: 'Sku', field: 'sku' },
    { title: 'Brand', field: 'brand' },
    { title: 'Product Type', field: 'product_type' }

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
    },

});



const Dashboard = () => {

    const constant = constants.getConstant();
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
            {/* <FormControlLabel
                control={<Switch checked={checked} onChange={handleChange} />}
                label="Show"
            /> */}

            <div className='p-grid' style={{ paddingTop: 20 }}>
                <div className="p-col-12 p-md-12 p-lg-12" >
                    <Collapse in={checked} timeout={1700}>
                        {/* <Card style={{ backgroundColor: 'blue' }} className={classes.paper}></Card>  80V-HONEYMELLOW-6 */}
                        <Paper elevation={4} className={classes.paper}>
                            {/* <div className="p-grid ">
                                <div className="p-col-12  p-md-6 p-lg-6">
                                    <div className="p-grid">
                                        <div className="p-col-1 p-md-1 p-lg-1">
                                            <ErrorOutlineIcon style={{ color: "#61ab8e" }} />
                                        </div> */}
                            {/* <div className="p-col-11 p-md-11 p-lg-11"> */}
                            <Typography variant="h5" align="center" style={{ paddingTop: 10, paddingBottom: 10 , }}>{`SKU : ${skuName}`} </Typography>
                            {/* </div> */}

                            {/* </div>

                                </div>
                            </div> */}


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

            <PopupLookup
                large={true} LookUpHeading={"SKU"}
                LookUpClose={() => setPoupUpLookupOpen(false)} setLookUpData={(e, rowData) => setLookUpData(e, rowData)}
                LookUpOpen={PoupUpLookupOpen} LookupList={{ columns: skuColumns, rows: skuList }} />
        </div>

    </>)
}

export default Dashboard;