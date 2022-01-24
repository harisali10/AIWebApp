
import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import SideMenu from "./SideMenu";
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { setSku } from '../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    drawer: {
        width: 210
    }
}));

const TopBar = () => {
    const [sideMenu, setSideMenu] = useState(false);
    const [showSkuIcon, setShowSkuIcon] = useState(false);
    const [skuValue, setSkuValue] = useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();

    const setSkuIconTrue = (state) => {
        setShowSkuIcon(state)
    }

    const openSkuTable = () => {
        dispatch(setSku(true))
        // setSkuValue(true);
    }

    return (<>
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} onClick={() => setSideMenu(true)} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        AI SYSTEMS
                    </Typography>
                    {showSkuIcon && <Button color="inherit" onClick={openSkuTable}>
                        <TouchAppIcon />
                        SKU
                    </Button>}
                    {/* <Button color="inherit">Login</Button> */}

                </Toolbar>
            </AppBar>
        </div>

        <SideMenu sideMenu={sideMenu} drawerStyle={classes.drawer} setSideMenu={setSideMenu} setSkuIconTrue={setSkuIconTrue}>

        </SideMenu>



    </>)
}

export default TopBar;