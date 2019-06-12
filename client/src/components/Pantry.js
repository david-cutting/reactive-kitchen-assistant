import React from 'react';
import Container from '@material-ui/core/Container';
import {makeStyles} from "@material-ui/core";
import BarcodeScanner from './BarcodeScanner';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    button: {
        margin: theme.spacing(1),
    },

}));


export default function Pantry() {
    const classes = useStyles();

    return(
        <Container maxWidth="lg" className={classes.container}>

                {/* Actions grid, no paper theme */}
                    {/* Add */}
                        {/* Need a barcode scanning method and lookup method */}
            <BarcodeScanner/>


                    {/* Lookup */}
                        {/* Give a barcode scanning option, slider to adjust or delete button */}

                {/* Paper grid, cascading down the page, loads as you scroll */}
                    {/* Recent activity */}


        </Container>
    );
}