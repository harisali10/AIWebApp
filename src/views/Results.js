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
import WizardDialog from './WizardDialog';
import MultiStep from 'react-multistep/dist/index'

const constant = constants.getConstant();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// let shpName = "stores/n9xqzkpx1"



let skues = [
    'Arial', 'Ketchup', 'OppoA7'
]


const Results = () => {

    const [tableData, setTableData] = useState({ rows: [], columns: [], TableName: '' })
    const [processDate, setProcessDate] = useState(new Date())
    const [customers, setCustomers] = useState([])
    const [orders, setOrders] = useState([])
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
        console.log({ loca: window.location })
        if (params.signed_payload != undefined || params.signed_payload != null || Object.keys(params).length != 0) {
            sessionStorage.setItem('signed_payload', params.signed_payload);
            // sessionStorage.setItem('RequestDateTime', new Date())
        }
        getClientInfo();
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



    const cardTimer = () => {
        console.log({ har: sessionStorage.getItem('RequestDateTime') })
        if (sessionStorage.getItem('RequestDateTime') === null) { // sets curr datetime in session storage on first run.
            var RequestDateTime = new Date()
            sessionStorage.setItem('RequestDateTime', RequestDateTime)
        }
        else {
            var RequestDateTime = sessionStorage.getItem('RequestDateTime')// gets datetime set in session storage in prev step.
        }
        var x = setInterval(async function () {
            let currentDate = new Date()
            var diff = (currentDate.getTime() - new Date(RequestDateTime).getTime()) / 1000;

            let totalMins = diff /= 60;

            let hours = totalMins / 60
            let mins = totalMins % 60
            setHours(Math.floor(48 - hours))
            setMins(Math.floor(60 - mins))
        }, 1000);
        setOpen(true);
    }

    async function fetchResults(clientId) {
        setShowLoader(true)
        try {
            const res = await axios.post(`${constant.url}GetPredictionResults?shop=${sessionStorage.getItem('shop')}`
            )
            if (res.data.Message.rows === undefined || res.data.Message.rows.length === 0) {
                if (!res.data.Message.hasOwnProperty('timerResponse')) {
                    var RequestDateTime = new Date()
                }
                else {
                    var RequestDateTime = res.data.Message.timerResponse.RequestDateTime
                }
                var x = setInterval(async function () {
                    let currentDate = new Date()

                    var diff = (currentDate.getTime() - new Date(RequestDateTime).getTime()) / 1000;

                    let totalMins = diff /= 60;
                    let hours = totalMins / 60
                    let mins = totalMins % 60
                    setHours(Math.floor(48 - hours))
                    setMins(Math.floor(60 - mins))
                }, 1000);
                setOpen(true);
            }

            else if (res.data.Message.rows.length != 0) {

                setTableData((prevState) =>
                ({
                    ...prevState,
                    rows: res.data.Message.rows,
                    columns: res.data.Message.columns,
                    TableName: "Stock Out Dashboard"
                }))
                // setShowMsg(false);
            }

            // }

        }
        catch (e) {
            // toast.current.show({
            //     severity: 'error',
            //     summary: 'No Source Setup found!',
            //     detail: "Please Create Source Setup to show records.",
            //     life: 3000
            // });
        }
        setShowLoader(false)

    }

    const fetchSku = async () => {
        // document.body.style.zoom = "80%";
        try {
            let options = await axios.post(`${constant.url}lookup?shop=${sessionStorage.getItem('shop')}`
                // , {
                // Header: {
                //     ShopURL: sessionStorage.getItem("shop")
                // }
                // }
            )
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
                    body: sessionStorage.getItem('signed_payload') === undefined ? "" : sessionStorage.getItem('signed_payload')
                }
            })
            if (res.data.Success) {
                sessionStorage.setItem('clientId', res.data.Message.clientID);
                sessionStorage.setItem('shop', res.data.Message.shop);
                sessionStorage.setItem('accessToken', res.data.Message.accessToken);
                // perfoamShopfiyOperations()
                fetchResults(res.data.Message.clientID);
                perfoamBigCommerceOperations()
                fetchSku();

            }
            else {
                cardTimer()
            }
        }
        catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'No Client Found',
                detail: "No Client Found Against given Shop Url",
                life: 3000
            });
        }

    }

    async function perfoamBigCommerceOperations() {
        axios.post(`${constant.url}GetShopifyData?shop=${sessionStorage.getItem('shop')}`)
            .then(function (response) {
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    // Still Unsed cant access shopify from front end 

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
                        If you have followed the steps above, please be patient your results are being processed. Keep an eye on the timer for an approximate completion time.
                    </Typography>

                </DialogContentText>

            </DialogContent>
            <DialogActions>

                <Button onClick={handleClose} color="primary" autoFocus>
                    OK ,I got it
                </Button>
            </DialogActions>
        </Dialog>

        <WizardDialog
            fullScreen={fullScreen}
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
        >
        </WizardDialog>

        <Toast ref={toast} />

        {/* <Register
            columns={tableData.columns}
            rows={tableData.rows}
            TableName={tableData.TableName}
        ></Register> */}

    </>)
}

export default Results;
