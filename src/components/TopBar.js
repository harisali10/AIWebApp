
import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import ContactsIcon from '@material-ui/icons/Contacts';
import IconButton from '@material-ui/core/IconButton';
import SideMenu from "./SideMenu";
import TouchAppIcon from '@material-ui/icons/TouchApp';
import Tooltip from '@material-ui/core/Tooltip';
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
        fontFamily: 'Georgia'
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
        console.log({ state })
        setShowSkuIcon(state)
    }

    const openSkuTable = () => {
        // alert("haris")
        dispatch(setSku(true))

    }

    const showContactUs = () => {
        window.location.href = "mailto:arehman@theaisystems.com"
    }

    return (<>
        <div className={classes.root}>
            <AppBar position="fixed" style={{ backgroundColor: "#61ab8e" }}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} onClick={() => setSideMenu(true)} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title} >
                        PLAN AI
                    </Typography>
                    {/* <img src="assets/logo/AiLogo.png" alt="ai_logo" width="180px" height="120px" /> */}
                    <Button color="inherit" onClick={() => showContactUs()}>
                        <Tooltip title="Contact Us">
                            <ContactsIcon />
                        </Tooltip>

                    </Button>
                    {
                        showSkuIcon === true ? <Button color="inherit" onClick={openSkuTable}>
                            <Tooltip title="Select SKU">
                                <TouchAppIcon />
                            </Tooltip>
                            SKU
                        </Button> : null
                    }
                    {/* {showSkuIcon && 
                    } */}
                </Toolbar>
            </AppBar>
        </div>

        <SideMenu
            sideMenu={sideMenu}
            drawerStyle={classes.drawer}
            setSideMenu={setSideMenu}
            setSkuIconTrue={setSkuIconTrue}>

        </SideMenu>



    </>)
}

export default TopBar;