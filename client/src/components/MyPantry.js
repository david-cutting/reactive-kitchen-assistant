import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core";
import {Container, IconButton, Typography, Divider, Paper} from '@material-ui/core';
import {Add, Edit, CameraAlt} from '@material-ui/icons'
import './BarcodeScanner'
import ScannerDialog from "./BarcodeScanner";


const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
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
}));

function MyPantry() {
    const classes = useStyles();

    return (
        <div>
            <Container maxWidth="xs" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs>
                        <IconButton>
                            <Add />
                        </IconButton>
                        <br/>
                        <Typography variant="body2" color="textSecondary" align="center">
                            Manual Add
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <ScannerDialog/>
                        <Typography variant="body2" color="textSecondary" align="center">
                            Scan Item
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <IconButton>
                            <Edit/>
                        </IconButton>
                        <br/>
                        <Typography variant="body2" color="textSecondary" align="center">
                            Edit Item
                        </Typography>
                    </Grid>
                </Grid>
                <br/>
                <Divider />
            </Container>

            {/* The news feed feature */}
            <Container maxWidth="md" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant={"h6"} align={"left"}>
                                Sample card
                            </Typography>
                            <Typography variant={"body2"} align={"left"}>
                                Sample card
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default MyPantry;
