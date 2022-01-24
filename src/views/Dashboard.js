import React, { useEffect, useState } from "react";
import { Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Divider, Typography } from '@material-ui/core';
import PopupLookup from '../PopUpLookUp';
import axios from 'axios';
import constants from '../utilities/constants';
import { getSku } from '../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

let skuColumns = [
    { title: 'Sku', field: 'sku' },
    { title: 'Brand', field: 'brand' },
    { title: 'Product Type', field: 'product_type' }

];

const Dashboard = () => {

    const constant = constants.getConstant()

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
    const [PoupUpLookupOpen, setPoupUpLookupOpen] = useState(false);

    useEffect(() => {
        // fetchSku();
    }, [])


    const skuR = useSelector(skuRes => skuRes)

    useEffect(() => {
        if (skuR.skuRes.skuValue) {
            setPoupUpLookupOpen(true)
            // skuArray
        }
        if (skuR.skuRes.skuArray) {
            setSkuList(skuR.skuRes.skuArray)

        }
        // if()

    }, [skuR])




    const fetchSku = async () => {
        // document.body.style.zoom = "80%";
        try {
            let options = await axios.post(`${constant.url}lookup`, {
                Header: {
                    ShopURL: localStorage.getItem("shop")
                }
            })
            setSkuList(options.data.Message)
        } catch (e) {
            // toast.current.show({
            //     severity: 'error',
            //     summary: 'Failed to get SKUs',
            //     detail: "SKU Api Response Failed",
            //     life: 3000
            // });

        }

    }

    const setLookUpData = async (e, rowData) => {

        // setsku(rowData.sku);
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
            setData(GetData.data.Message.Dashboard.rows)


        }
        catch (e) {
        }

    }

    return (<>
        <skuConsumer>
            {
                (x) => {
                    return <h1>{`${x} haris`}</h1>
                }
            }
        </skuConsumer>
        <div className='p-grid'>
            <div className='p-col-12 p-md-9 p-lg-8'>
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
            <div className='p-col-12 p-md-3 p-lg-4' style={{ paddingRight: 25 }}>
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

        <PopupLookup
            large={true} LookUpHeading={"SKU"}
            LookUpClose={() => setPoupUpLookupOpen(false)} setLookUpData={(e, rowData) => setLookUpData(e, rowData)}
            LookUpOpen={PoupUpLookupOpen} LookupList={{ columns: skuColumns, rows: skuList }} />
    </>)
}

export default Dashboard;