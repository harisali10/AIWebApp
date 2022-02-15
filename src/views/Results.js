import React, { useState, useEffect } from "react";
import MaterialTable from 'material-table';
import axios from 'axios';
import constants from '../../src/utilities/constants';
import { setSkuArray } from "../store/action/action";
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import BackDropLoader from "../components/BackDrop";
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { Toast } from 'primereact/toast';
import queryString from 'query-string';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Slide from '@material-ui/core/Slide';
import Register from '../components/Register'
import { useTheme } from '@material-ui/core/styles';


const constant = constants.getConstant();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const Results = () => {

    const [tableData, setTableData] = useState({ rows: [], columns: [], TableName: '' })
    const [processDate, setProcessDate] = useState(new Date())
    const [customers, setCustomers] = useState([])
    const [orders, setOrders] = useState([])
    // const [clientId, setClientId] = useState()
    const [products, setProducts] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const toast = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    // CountDownTimer
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [mins, setMins] = useState(0)
    const [seconds, setSeconds] = useState(0)


    const dispatch = useDispatch();

    useEffect(() => {
        let params = queryString.parse(window.location.search)
        console.log({ params })
        if (params.shop != undefined || params.shop != null || Object.keys(params).length != 0) {
            sessionStorage.setItem('shop', params.shop);
        }
        getClientInfo();
        // fetchResults();
        fetchSku();
        return () => {
            setTableData((prevState) =>
            ({
                ...prevState,
                rows: [],
                columns: [],
                TableName: ""
            }))
        };
    }, [])





    async function fetchResults(clientId) {
        setShowLoader(true)
        try {
            const res = await axios.post(`${constant.url}GetPredictionResults`, {
                Header: {
                    ClientID: clientId,
                    Type: 'Result',
                    ShopURL: sessionStorage.getItem("shop")
                }
            })
            if (res.data.Message.rows.length != 0) {

                setTableData((prevState) =>
                ({
                    ...prevState,
                    rows: res.data.Message.rows,
                    columns: res.data.Message.columns,
                    TableName: "Stock Out Dashboard"
                }))
                // setShowMsg(false);
            }

            else {

                let RequestDateTime = res.data.Message.timerResponse.RequestDateTime
                var x = setInterval(async function () {
                    console.log({ RequestDateTime })

                    let currentDate = new Date()
                    var diff = (currentDate.getTime() - new Date(RequestDateTime).getTime()) / 1000;

                    let totalMins = diff /= 60;
                    console.log({ totalMins })
                    let hours = totalMins / 60
                    let mins = totalMins % 60
                    setHours(Math.floor(48 - hours))
                    setMins(Math.floor(60 - mins))
                    // setSeconds(Math.floor(totalSec));
                    // let distance = new Date(RequestDateTime).getTime() - new Date().getTime();
                    // setHours(Math.floor((hours % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                    // setMins(Math.floor((mins % (1000 * 60 * 60)) / (1000 * 60)));
                    // setSeconds(Math.floor((diff % (1000 * 60)) / 1000));
                }, 1000);
                setOpen(true);

            }

        }
        catch (e) {
            toast.current.show({
                severity: 'info',
                summary: 'No Source Setup found!',
                detail: "Please Create Source Setup to show records.",
                life: 3000
            });
        }
        setShowLoader(false)

    }

    const fetchSku = async () => {
        // document.body.style.zoom = "80%";
        try {
            let options = await axios.post(`${constant.url}lookup`, {
                Header: {
                    ShopURL: sessionStorage.getItem("shop")
                }
            })
            dispatch(setSkuArray(options.data.Message))
        } catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'Failed to get SKUs',
                detail: "SKU Api Response Failed",
                life: 3000
            });

        }

    }

    async function getClientInfo() {
        try {
            const res = await axios.post(`${constant.url}GetClientInfo`, {
                Header: {
                    Type: 'Result',
                    ShopURL: sessionStorage.getItem("shop")
                }
            })
            console.log("accessToken", res.data.Message.accessToken)
            // setClientId(res.data.Message.clientID)
            perfoamShopfiyOperations()
            fetchResults(res.data.Message.clientID);
            // getShopifyData(res.data.Message.accessToken)
        }
        catch (e) {
            toast.current.show({
                severity: 'info',
                summary: 'No Source Setup found!',
                detail: "Please Create Source Setup to show records.",
                life: 3000
            });
        }

    }

    async function perfoamShopfiyOperations() {
        axios.post(`${constant.url}GetShopifyData`, {
            Header: {
                ShopURL: sessionStorage.getItem("shop")
            }
        })
            .then(function (response) {
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    // Still Unsed cant access shopify from front end 
    async function getShopifyData(token) {
        try {
            let customerUrl = `https://${sessionStorage.getItem("shop")}/admin/api/2021-10/customers.json`;
            let customers = await axios.get(customerUrl, { 'headers': { 'x-Shopify-Access-Token': token, 'Access-Control-Allow-Origin': "*", 'Access-Control-Allow-Credentials': "true", 'Access-Control-Allow-Headers': "content-type", "Access-Control-Max-Age": "1800", "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS" } })
            console.log({ customers })
            setCustomers(customers)

        }
        catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Failed to get Customers',
                detail: "Customers are not getting from shopify",
                life: 3000
            });
        }
        try {
            let orderUrl = `http://${sessionStorage.getItem("shop")}/admin/api/2021-10/orders.json?status=any`;
            let orders = await axios.get(orderUrl, { 'headers': { 'x-Shopify-Access-Token': token } })
            console.log({ orders })
            setOrders(orders)

        }
        catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Failed to get Orders',
                detail: "Orders are not getting from shopify",
                life: 3000
            });
        }
        try {
            let productUrl = `http://${sessionStorage.getItem("shop")}/admin/api/2021-10/products.json`;
            let products = await axios.get(productUrl, { 'headers': { 'x-Shopify-Access-Token': token } })
            console.log({ products })
            setProducts(orders)

        }
        catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Failed to get Products',
                detail: "Products are not getting from shopify",
                life: 3000
            });
        }

    }

    const handleClose = () => {
        setOpen(false);
    };



    return (<>

        <BackDropLoader backDrop={showLoader}>
        </BackDropLoader>

        <Dialog
            fullScreen={fullScreen}
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>
                <Typography variant="h5" align="center" style={{ color: '#61ab8e', fontFamily: 'Georgia' }} >
                    Welcome to Plan AI
                </Typography>

            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Container style={{ fontStyle: 'italic', borderRadius: 25, border: '2px solid #61ab8e', width: 400, height: 50 }}>
                        <Typography variant="subtitle1" align="center" style={{ fontStyle: 'italic', paddingTop: 10, color: '#61ab8e' }}>
                            {`Hours :${hours} Minutes :${mins}`}
                        </Typography>
                    </Container>
                    <Typography variant="subtitle1" style={{ fontStyle: 'italic' }} >
                        Plan AI is currently working on syncing your Sales and Product data from shopify.
                        However for the app to function properly PLAN AI needs your historical Purchase order and historical inventory data.
                    </Typography>
                    {/* </DialogContentText> */}
                    <Typography variant="subtitle1" align="center" style={{ color: '#61ab8e', fontStyle: 'italic', paddingTop: 7, paddingBottom: 7 }} >
                        Please follow the steps below to complete the setup process.
                    </Typography>
                    <Typography variant="subtitle1" style={{ fontStyle: 'italic' }} >
                        1. Navigate to the setup page by clicking on the Menu Icon in the top left corner and select SETUP.
                    </Typography>
                    <Typography variant="subtitle1" style={{ fontStyle: 'italic' }} >
                        2. Enter your name and select the source that hosts your Purchase Order data.
                    </Typography>
                    <Typography variant="subtitle1" style={{ fontStyle: 'italic' }} >
                        3. Please fill out the form.
                    </Typography>
                    <Typography variant="subtitle1" align="center" style={{ color: '#61ab8e', fontStyle: 'italic' }}  >
                        And You are Done!
                    </Typography>
                    <Typography variant="subtitle1" style={{ fontStyle: 'italic' }}>
                        If you have followed the steps above, please be patient your results are being processed. Keep an eye on the timer for an approximte completion time.
                    </Typography>

                </DialogContentText>

            </DialogContent>
            <DialogActions>

                <Button onClick={handleClose} color="primary" autoFocus>
                    OK ,I got it
                </Button>
            </DialogActions>
        </Dialog>

        <Toast ref={toast} />

        <Register
            columns={tableData.columns}
            rows={tableData.rows}
            TableName={tableData.TableName}
        ></Register>

    </>)
}

export default Results;