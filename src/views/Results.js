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
import { Toast } from 'primereact/toast';
import queryString from 'query-string';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Slide from '@material-ui/core/Slide';
import { useTheme } from '@material-ui/core/styles';


const constant = constants.getConstant();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Results = () => {

    const [tableData, setTableData] = useState({ rows: [], columns: [], TableName: '' })
    const [customers, setCustomers] = useState([])
    const [orders, setOrders] = useState([])
    // const [clientId, setClientId] = useState()
    const [products, setProducts] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const toast = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
                setOpen(true);
                // setShowDashboardText("We are working on your Data, Please be patient...") // Res set for DashBoards

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
        // setShowLoader(true)
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
        // setShowLoader(false)
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

    window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        return ev.returnValue = 'Are you sure you want to close?';
    });

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
                    <Typography variant="subtitle1" style={{ fontStyle: 'italic' }} >
                        Plan AI is currently working on pulling your Sales and Product data from shopify auotmatically.
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
                        If you have followed the steps above, please be patient your results will be displayed soon.
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

    </>)
}

export default Results;