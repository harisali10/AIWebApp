import React from "react";
import MaterialTable from 'material-table';

export default function Register(props) {
    return (<>
        <MaterialTable
            style={{
                padding: '10px',
                boxShadow: 'none'
            }}
            title=
            {
                <div className="table-button" >
                    <span className="table-title" style={{ fontWeight: "bold", fontSize: "20px" }}>{props.TableName}</span>


                </div>
            }
            isLoading={false}
            columns={props.columns}
            data={props.rows}
            localization={{
                body: {
                    emptyDataSourceMessage: 'Opps ! No records',
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