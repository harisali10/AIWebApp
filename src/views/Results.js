import React, { useState, useEffect } from "react";
import MaterialTable from 'material-table';
import axios from 'axios';
import constants from '../../src/utilities/constants';
import { setSkuArray } from "../store/action/action";
import { useDispatch, useSelector } from 'react-redux';
import BackDropLoader from "../components/BackDrop";
import { Toast } from 'primereact/toast';

const constant = constants.getConstant();




const Results = () => {


    const [tableData, setTableData] = useState({ rows: [], columns: [], TableName: '' })

    const [showLoader, setShowLoader] = useState(false)
    const toast = React.useRef(null);



    const dispatch = useDispatch();

    useEffect(() => {
        // let params = queryString.parse(window.location.search)
        localStorage.setItem("shop", "finosys.myshopify.com");
        fetchResults();
        fetchSku();
    }, [])


    async function fetchResults() {
        setShowLoader(true)
        try {
            const res = await axios.post(`${constant.url}GetPredictionResults`, {
                Header: {
                    ClientID: 1,
                    Type: 'Result',
                    // ShopURL:""
                    ShopURL: localStorage.getItem("shop")
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
                    ShopURL: localStorage.getItem("shop")
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