import React, { useState, useEffect } from "react";
import MaterialTable from 'material-table';
import axios from 'axios';
import constants from '../../src/utilities/constants';
import BackDropLoader from "../components/BackDrop";
// import { Toast } from 'primereact/toast';
import Register from "../components/Register";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Logs = () => {
    const constant = constants.getConstant();
    const [tableData, setTableData] = useState({ rows: [], columns: [], TableName: '' })
    const [showLoader, setShowLoader] = useState(false)
    // const toast = React.useRef(null);


    const notify = async () => {

        // const resolveAfter3Sec = new Promise((resolve, rej) => fetchLogs());
        // resolveAfter3Sec.catch((er) => {
        //     console.log("err",er)
        // })
        // toast.promise(
        //     resolveAfter3Sec,
        //     {
        //         pending: 'Promise is pending',
        //         success: 'Promise resolved 👌',
        //         error: 'Promise rejected 🤯'
        //     }
        // )
        const resolveAfter3Sec = new Promise(async (resolve, reject) => {
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
                resolve(1)
            }
            catch (e) {
                reject(0)
                // toast.current.show({ severity: 'error', summary: 'Failed to get Logs', detail: "Logs Api Response Failed", life: 3000 });
            }


            setShowLoader(false)

        });
        console.log({ resolveAfter3Sec })
        toast.promise(
            resolveAfter3Sec,
            {
                pending: 'Promise is pending',
                success: 'Promise resolved 👌',
                error: 'Promise rejected 🤯'
            }
        )
    };

    useEffect(() => {
        // fetchLogs();
    }, [])


    async function fetchLogs() {
        setShowLoader(true)
        // notify()
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
            // toast.current.show({ severity: 'error', summary: 'Failed to get Logs', detail: "Logs Api Response Failed", life: 3000 });
        }
        setShowLoader(false)

    }


    return (<>

        <BackDropLoader backDrop={showLoader}>

        </BackDropLoader>
        {/* <Toast ref={toast} /> */}
        <button onClick={notify}>Notify!</button>
        <ToastContainer />

        {
            !showLoader &&
            <Register
                columns={tableData.columns}
                rows={tableData.rows}
                TableName={tableData.TableName}
            ></Register>
        }

    </>)
}


export default Logs;


