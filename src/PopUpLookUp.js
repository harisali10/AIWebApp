import React, { useState, useEffect } from 'react';
// import { Dialog } from 'primereact/dialog';
import { Dialog, DialogContent, IconButton, Typography } from '@material-ui/core'
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table'

const PopupLookup = (props) => {
  
    const [property, setProperty] = useState({
        lookUpFilter: null,
        pageSize: 20
    })

    useEffect(() => {
        if (!props.LookUpOpen && property.lookUpFilter) {
            setProperty({ lookUpFilter: null, pageSize: 20 })
        }

    }, []);


    const pageChange = (e) => {
        setProperty({ ...property, pageSize: e })
    }

    var { LookUpClose, setLookUpData, LookUpOpen } = props;
    return (

        // <Dialog dismissable={true} style={props.large === true ? { width: "80%", marginLeft: '2cm' } : { width: "50%", marginLeft: '2cm' }} header={props.LookUpHeading} visible={LookUpOpen} modal={true} onHide={LookUpClose}  >
        <Dialog
            fullWidth={true}
            maxWidth={props.large === true ? "lg" : "md"}
            onClose={LookUpClose}
            aria-labelledby="customized-dialog-title" open={LookUpOpen}>
            <MuiDialogTitle disableTypography style={{ paddingBottom: '0px !important' }}>
                <Typography variant="h6">{props.LookUpHeading}</Typography>
                <IconButton style={{ position: 'absolute', right: '5px', top: '10px' }} aria-label="close" onClick={LookUpClose}>
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>
            <DialogContent style={{ paddingTop: '0px !important' }}>
                {props.LookupList &&
                    <MaterialTable
                        style={{
                            border: 'none',
                            // backgroundColor: 'transparent',
                            boxShadow: 'none',
                            paddingTop: '0px !important'
                        }}
                        // isLoading={props.LookupList.columns.length > 0 ? false : true}
                        icons={{ Filter: () => <div /> }}
                        options={{
                            pageSize: props.changeSize === true ? props.pageSize : 20,
                            selection: props.selection,
                            // pageSizeOptions: [15],
                            rowStyle: x => {
                                if (x.tableData.id % 2) {
                                    return { backgroundColor: "#f2f2f2", padding: "7px" }
                                }
                                else {
                                    return { padding: "7px" }
                                }
                            }
                            ,
                            showTitle: false,
                            search: true,
                            filtering: true,
                            filterCellStyle: {
                                paddingTop: 1,
                                paddingBottom: 1,
                            },
                            headerStyle: {
                                fontWeight: "bolder"
                            },
                            showTextRowsSelected: false,
                        }}
                        onRowClick={(e, x) => setLookUpData && setLookUpData(e, x)}
                        onChangeRowsPerPage={(e) => { console.log("Page change", e) }}
                        columns={props.LookupList.columns}
                        data={props.LookupList.rows}
                        onSelectionChange={props.onSelectionChange}
                    />
                }
            </DialogContent>

            {props.DialogActions &&
                <MuiDialogActions>
                    <Button autoFocus onClick={props.ok} variant="outlined"  >Save</Button>
                    {/* <Button autoFocus onClick={() => setBatchDetailsLookupOpen(false)} variant="outlined">Close</Button> */}
                </MuiDialogActions>}
        </Dialog>
    )
}


PopupLookup.propTypes = {
    LookUpClose: PropTypes.func,
    setLookUpData: PropTypes.func,
    onSelChangeLookUpData: PropTypes.func,
    lookUpOpen: PropTypes.bool
};


export default PopupLookup;