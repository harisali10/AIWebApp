import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { MultiSelect } from 'primereact/multiselect';
// import { Tooltip } from 'primereact/tooltip';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

// let skues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'Haris', 'Ahsan', 'Falana', 'Dhimaka', 'qari Sahab', 'Anda Wala Burger', 'hahahah', 'hari chatni', 'sas']


const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

function getStyles(name, personName, theme) {
    return {
        // fontWeight:
        //     personName.indexOf(name) === -1
        //         ? theme.typography.fontWeightRegular
        //         : theme.typography.fontWeightMedium,
    };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];


const AppColorSwitch = withStyles({
    switchBase: {
        color: '#61ab8e',
        '&$checked': {
            color: '#61ab8e',
        },
        '&$checked + $track': {
            backgroundColor: '#61ab8e',
        },
    },
    checked: {},
    track: {},
})(Switch);

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 310,
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    formControl: {
        margin: theme.spacing(1),
        // minWidth: 320,
        width: '100%',
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    hh: {
        borderRadius: 15
    }
}));


const WizardDialog = (props) => {

    const [selected, setSelected] = useState([]);
    const classes = useStyles();
    const [checked, setChecked] = React.useState([1]);
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        setPersonName(event.target.value);
    };

    const handleToggle = (value) => () => {
        console.log({ value })
        let arr = [...sku]
        let index = arr.indexOf(value)
        arr[index]['checked'] = !arr[index]['checked']
        console.log({ arr })
        setSku(arr)
        //value  = true
        // const currentIndex = checked.indexOf(value);
        // const newChecked = [...checked];

        // console.log({ newChecked })
        // console.log({ value })

        // if (currentIndex === -1) {
        //     newChecked.push(value);
        // } else {
        //     newChecked.splice(currentIndex, 1);
        // }

        // setChecked(newChecked);
    };

    const [sku, setSku] = useState([{ 'name': 'SKU Item 1', 'checked': false }, { 'name': 'SKU Item 2', 'checked': false }, { 'name': 'SKU Item 3', 'checked': true }, { 'name': 'SKU Item 3', 'checked': false }, { 'name': 'SKU Item 3', 'checked': false }])

    return (<>
        <Dialog
            fullScreen={props.fullScreen}
            open={true}
            fullWidth={true}
            maxWidth={'md'}
            className={classes.hh}
            // style={{ borderRadius: 35, border: '2px solid' }}
            TransitionComponent={props.Transition}
            onClose={props.handleClose}
            aria-labelledby="responsive-dialog-title"
        >

            <DialogTitle>

                <Container style={{ fontStyle: 'italic', borderRadius: 25, marginBottom: 25, border: '2px solid #61ab8e', width: 400, height: 50 }}>
                    <Typography variant="subtitle1" align="center" style={{ fontStyle: 'italic', paddingTop: 10, color: '#61ab8e' }}>
                        Billing Information
                    </Typography>
                </Container>
                <IconButton style={{ position: 'absolute', right: '5px', top: '10px' }} aria-label="close" onClick={() => null}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Card
                style={{ fontStyle: 'italic', overflowX: 'hidden', borderRadius: 15, marginBottom: 37, maxWidth: 1200, marginLeft: 20, marginRight: 20, border: '2px solid #61ab8e' }}
            >
                <DialogContent>
                    <DialogContentText>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <List dense className={classes.root}>
                                            {/* [0, 1, 2, 3] */}

                                            {sku.map((value) => {
                                                // const labelId = `checkbox-list-secondary-label-${value}`;
                                                return (
                                                    
                                                        <ListItem key={value} button>
                                                            <ListItemAvatar>
                                                                {/* <Avatar
                                                                alt={`Avatar n°${value + 1}`}
                                                                src={`/static/images/avatar/${value + 1}.jpg`}
                                                            /> */}
                                                                <Avatar style={{ color: "white", backgroundColor: '#61ab8e' }} className={classes.large}>SKU</Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                style={{ paddingLeft: 5 }}
                                                                // id={labelId}
                                                                primary={` ${value['name']}`} />
                                                            <ListItemSecondaryAction>
                                                                <FormControlLabel
                                                                    control={<AppColorSwitch
                                                                        edge="end"
                                                                        name={value['name'].toString()}
                                                                        // style={{ color: 'black' }}
                                                                        onChange={handleToggle(value)}
                                                                        checked={value['checked']}
                                                                        inputProps={{ 'aria-labelledby': 'switch-list-label-bluetooth' }}
                                                                    />}
                                                                >

                                                                </FormControlLabel>
                                                                {/* <FormControlLabel
                                                                control={<PurpleSwitch checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                                                                label="Custom color"
                                                            /> */}

                                                                {/* <Checkbox
                                                                edge="end"
                                                                name={value['name'].toString()}
                                                                onChange={handleToggle(value)}
                                                                checked={value['checked']}
                                                            // checked={value['checked']}
                                                            // inputProps={{ 'aria-labelledby': labelId }}
                                                            /> */}
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    
                                                );
                                            })}
                                        </List>

                                    </Grid>
                                    <Divider orientation="vertical" flexItem />
                                    <Grid item xs={5} style={{ paddingLeft: 60 }}>
                                        {/* <Grid container >
                                            <Grid item xs={12}>
                                                <MultiSelect optionLabel="name" value={cities} options={cities} onChange={(e) => null} />
                                            </Grid>
                                        </Grid>
                                        <Grid container style={{ paddingTop: 30 }} >
                                            <Grid item xs={12}>
                                                <MultiSelect optionLabel="name" value={cities} options={cities} onChange={(e) => null} />
                                            </Grid>
                                        </Grid> */}
                                        <Grid container style={{ paddingTop: 30 }}>
                                            <Grid item xs={12}>
                                                <Tooltip title="DropDown 1">
                                                    <FormControl variant="filled" className={classes.formControl}>
                                                        <InputLabel id="demo-mutiples-chip-label">Chip</InputLabel>
                                                        <Select
                                                            labelId="demo-mutiple-chip-label"
                                                            id="demo-mutiple-chip"
                                                            multiple
                                                            // fullWidth
                                                            // style={{width:'100%'}}
                                                            variant="standard"
                                                            value={personName}
                                                            onChange={handleChange}
                                                            input={<Input id="select-multiple-chip" />}
                                                            renderValue={(selected) => (
                                                                <div className={classes.chips}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={value} className={classes.chip} />
                                                                    ))}
                                                                </div>
                                                            )}
                                                            MenuProps={MenuProps}
                                                        >
                                                            {names.map((name) => (
                                                                <MenuItem key={name} value={name} style={getStyles(name, personName)}>
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Tooltip>

                                            </Grid>
                                        </Grid>
                                        <Grid container style={{ paddingTop: 30 }} >
                                            <Grid item xs={12}>
                                                <Tooltip variant="outlined" title="DropDown 2">
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="demo-mutiples-chip-label">Chip</InputLabel>
                                                        <Select
                                                            labelId="demo-mutiple-chip-label"
                                                            id="demo-mutiple-chip"
                                                            multiple
                                                            // variant="filled"
                                                            // fullWidth
                                                            value={personName}
                                                            onChange={handleChange}
                                                            input={<Input id="select-multiple-chip" />}
                                                            renderValue={(selected) => (
                                                                <div className={classes.chips}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={value} className={classes.chip} />
                                                                    ))}
                                                                </div>
                                                            )}
                                                            MenuProps={MenuProps}
                                                        >
                                                            {names.map((name) => (
                                                                <MenuItem key={name} value={name} style={getStyles(name, personName)}>
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Tooltip>

                                            </Grid>
                                        </Grid>
                                        <Grid container style={{ paddingTop: 30, marginLeft: 9 }} >
                                            <Grid item xs={12}>
                                                <Button style={{ width: '100%', backgroundColor: '#61ab8e' }} onClick={props.handleClose} color="primary" variant="contained" autoFocus>
                                                    SUBMIT
                                                </Button>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </DialogContentText>

                </DialogContent>
                <DialogActions>

                    {/* <Button onClick={props.handleClose} color="secondary" variant="contained" autoFocus>
                        CANCEL
                    </Button>
                    <Button onClick={props.handleClose} color="primary" variant="contained" autoFocus>
                        SUBMIT
                    </Button> */}
                </DialogActions>
            </Card>
        </Dialog>

    </>)
}


export default WizardDialog;