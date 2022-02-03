import React, { useState, useEffect } from "react";
import MaterialTable from 'material-table';
import axios from 'axios';
import constants from '../../src/utilities/constants';
import { setSkuArray } from "../store/action/action";
import { useDispatch, useSelector } from 'react-redux';
import BackDropLoader from "../components/BackDrop";
import { Toast } from 'primereact/toast';
import queryString from 'query-string';

const constant = constants.getConstant();




const Results = () => {

    const [tableData, setTableData] = useState({ rows: [], columns: [], TableName: '' })
    const [customers, setCustomers] = useState([])
    const [orders, setOrders] = useState([])
    // const [clientId, setClientId] = useState()
    const [products, setProducts] = useState([])
    const [showLoader, setShowLoader] = useState(false)
    const toast = React.useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        let params = queryString.parse(window.location.search)
        console.log({ params })
        if (params.shop != undefined || params.shop != null || Object.keys(params).length != 0) {
            sessionStorage.setItem('shop', params.shop);
        }
        getClientInfo();
        fetchSku();
    }, [])



    window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        return ev.returnValue = 'Are you sure you want to close?';
    });


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
            // else {
            //     setShowDashboardText("We are working on your Data, Please be patient...") // Res set for DashBoards

            // }

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

    return (<>
        <BackDropLoader backDrop={showLoader}>

        </BackDropLoader>
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