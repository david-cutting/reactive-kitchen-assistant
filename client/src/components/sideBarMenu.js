import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Dashboard from '@material-ui/icons/Dashboard'
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import RestaurantMenu from '@material-ui/icons/RestaurantMenu'
import Favorite from '@material-ui/icons/Favorite'
import {Link} from 'react-router-dom'
import navigation from '../App.json'
import Kitchen from '@material-ui/icons/Kitchen'
import BarChart from '@material-ui/icons/BarChart'
import Layers from '@material-ui/icons/Layers'
import AccountBox from '@material-ui/icons/AccountBox'
import Settings from '@material-ui/icons/Settings'
import Train from '@material-ui/icons/Train'


const getIcon = (name) => {
    switch(name) {
        case "RestaurantMenu":
            return (<RestaurantMenu/>);
        case "Favorite":
            return (<Favorite/>);
        case "Dashboard":
            return (<Dashboard/>);
        case "Kitchen":
            return (<Kitchen/>);
        case "ShoppingCart":
            return (<ShoppingCart/>);
        case "BarChart":
            return (<BarChart/>);
        case "Layers":
            return (<Layers/>);
        case "AccountBox":
            return (<AccountBox/>);
        case "Settings":
            return (<Settings/>);
        default:
            return (<Train/>);
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

const secondaryNavItems = navigation.App["secondary-nav"].map((each) =>
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
        {secondaryNavItems}
    </div>
);