import React, { useState } from "react";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EventNoteIcon from '@material-ui/icons/EventNote';
import SettingsIcon from '@material-ui/icons/Settings';
import Drawer from '@material-ui/core/Drawer';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';


let menuItems = [{
    menuItemName: "RESULTS",
    menuItemIcon: <AssignmentIcon />,
    path: "/"

}, {
    menuItemName: "DASHBOARD",
    menuItemIcon: <DashboardIcon />,
    path: "/dashboard"
},
{
    menuItemName: "LOGS",
    menuItemIcon: <EventNoteIcon />,
    path: "/logs"
},
{
    menuItemName: "SETUP",
    menuItemIcon: <SettingsIcon />,
    path: "/setup"

}
]


const SideMenu = (props) => {

    const [openMenu, setOpenMenu] = useState(false);
    let history = useHistory();

    console.log({ props })

    const openMenuBar = () => {
        setOpenMenu(true)
    }


    function handleMenuClick(e) {
        if (e.target.outerText === "DASHBOARD") {
            props.setSkuIconTrue(true)
        } else {
            props.setSkuIconTrue(false)

        }
        console.log(e.target.outerText)
    }

    return (<>

        <Drawer elevation={15}
            anchor={'left'}
            classes={{ paper: props.drawerStyle }}
            onClose={() => props.setSideMenu(false)}
            open={props.sideMenu} >
            <div className='p-grid'>
                <div className='p-col-12' >
                    <List>
                        <ListItem button component={Link} to="/" onClick={() => null}>
                            <ListItemIcon> <MenuIcon /> </ListItemIcon>
                            <ListItemText primary="AI SYSTEMS" />
                        </ListItem>
                    </List>
                    <Divider />
                </div>
                <div className='p-gird'>
                    {
                        menuItems.map((item) => {
                            return (<>
                                <div className='p-col-12'>
                                    <List>
                                        <ListItem button to={item.path} component={Link} onClick={(e) => handleMenuClick(e)}>
                                            <ListItemIcon> {item.menuItemIcon} </ListItemIcon>
                                            <ListItemText primary={item.menuItemName} />
                                        </ListItem>
                                    </List>
                                </div>
                            </>)
                        })
                    }
                </div>
            </div>
        </Drawer>

    </>)
}

export default SideMenu;