import React, { useState, useEffect } from "react";
import MaterialTable from 'material-table';
import axios from 'axios';
import constants from '../../src/utilities/constants';


const Logs = () => {
    const constant = constants.getConstant();
    const [tableData, setTableData] = useState({ rows: [], columns: [], TableName: '' })

    useEffect(() => {
        fetchLogs();
    }, [])


    async function fetchLogs() {
        try {
            const logsRes = await axios.post(`${constant.url}GetPredictionResults`, {
                Header: {
                    Type: 'Log',
                    // ShopURL :"finosys.myshopify.com"
                    ShopURL: localStorage.getItem("shop")
                }
            })
            setTableData((prevState) =>
                ({ ...prevState, rows: logsRes.data.Message.rows, columns: logsRes.data.Message.columns, TableName: "Logs" }))
            // setLoading(false)
            // setOpen(false);
        }
        catch (e) {
            // toast.current.show({ severity: 'error', summary: 'Failed to get Logs', detail: "Logs Api Response Failed", life: 3000 });
            // console.log(e);
            // setLoading(false)
            // setOpen(false);
        }

    }


    return (<>
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


export default Logs;


