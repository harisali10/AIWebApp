import React, { useState, useEffect } from "react";
import MaterialTable from 'material-table';
import axios from 'axios';
import constants from '../../src/utilities/constants';
import BackDropLoader from "../components/BackDrop";
import { Toast } from 'primereact/toast';
import Register from "../components/Register";


const Logs = () => {
    const constant = constants.getConstant();
    const [tableData, setTableData] = useState({ rows: [], columns: [], TableName: '' })
    const [showLoader, setShowLoader] = useState(false)
    const toast = React.useRef(null);

    useEffect(() => {
        fetchLogs();
    }, [])


    async function fetchLogs() {
        setShowLoader(true)
        try {
            const logsRes = await axios.post(`${constant.url}GetPredictionResults`, {
                Header: {
                    Type: 'Log',

                    ShopURL: sessionStorage.getItem("shop")
                }
            })
            setTableData((prevState) =>
                ({ ...prevState, rows: logsRes.data.Message.rows, columns: logsRes.data.Message.columns, TableName: "Logs" }))
        }
        catch (e) {
            toast.current.show({ severity: 'error', summary: 'Failed to get Logs', detail: "Logs Api Response Failed", life: 3000 });
        }
        setShowLoader(false)

    }


    return (<>

        <BackDropLoader backDrop={showLoader}>

        </BackDropLoader>
        <Toast ref={toast} />

        <Register
            columns={tableData.columns}
            rows={tableData.rows}
            TableName={tableData.TableName}
        ></Register>


    </>)
}


export default Logs;


