import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import SettingsIcon from '@material-ui/icons/Settings'
import AccountIcon from '@material-ui/icons/AccountBox'
import RestaurantMenu from '@material-ui/icons/RestaurantMenu'
import Favorite from '@material-ui/icons/Favorite'
import {Link} from 'react-router-dom';
import navigation from '../App.json';
import * as Icons from '@material-ui/icons';


const getIcon = (name) => {
    switch(name) {
        case "RestaurantMenu":
            return (<RestaurantMenu/>);
        case "Favorite":
            return (<Favorite/>);
        default:
            return (<LayersIcon/>);
    }
};

const mainNavItems = navigation.App["primary-nav"].map((each) =>
    <ListItem button component={Link} to={each.path}>
        <ListItemIcon>
            {getIcon(each.icon)}
        </ListItemIcon>
        <ListItemText primary={each.name} />
    </ListItem>
);

export const mainListItems = (
    <div>
        {mainNavItems}
    </div>
);

export const secondaryListItems = (
    <div>
        <ListItem button component={Link} to={"/account"}>
            <ListItemIcon>
                <AccountIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
        </ListItem>
        <ListItem button component={Link} to={"/settings"}>
            <ListItemIcon>
                <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
        </ListItem>
    </div>
);