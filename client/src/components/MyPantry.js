import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core";
import {Container, IconButton, Typography, Divider, Paper} from '@material-ui/core';
import {Add, Edit, CameraAlt} from '@material-ui/icons'
import './BarcodeScanner'
import ReactiveDialog from "./ReactiveDialog";
import BarcodeScanner from "./BarcodeScanner";

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

function MyPantry(props) {
    const classes = useStyles();

    const [scanner, setScanner] = React.useState({
        'visible'   :   false,
        'camAccess' :   false,
        'paused'    :   true,
        'dialogueOpen'  : false,
    });

    function showScannerDialogue() {
        setScanner({ 'visible' : true, 'camAccess' : true, 'paused' : false, 'dialogueOpen' : true });
    }
    function pauseScanner() {   // Undo with showScannerDialogue
        setScanner({ 'visible' : true, 'camAccess' : true, 'paused' : true, 'dialogueOpen' : true });
    }
    function hideScanner() {    // Undo with showScannerDialogue();
        setScanner({ 'visible' : false, 'camAccess' : false, 'paused' : true, 'dialogueOpen' : true });
    }
    function hideScannerDialogue() {
        setScanner({ 'visible' : false, 'camAccess' : false, 'paused' : true, 'dialogueOpen' : false });
    }
    function processBarcodeNum(data) {
        pauseScanner();
        const openFoodQuery = "https://world.openfoodfacts.org/api/v0/product/" + data.barcodes[0].data + ".json";
        fetch(openFoodQuery)
            .then(res => res.json())    // Wait for all of the JSON to come out of the server
            .then(json => {
                if(json.status === 0) {         // If the barcode number we scanned isn't in the database
                    showScannerDialogue();
                    return;
                }

                const data = {
                    code: json.product.code,
                    product_name: json.product.product_name,
                    generic_name: json.product.generic_name,
                    region: "world",
                    quantity: json.product.quantity,
                };

                fetch('/catalog/create', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data),
                });

                setTimeout(() => {
                    hideScannerDialogue();
                }, 1500);
            });
        return(
            <div>

            </div>
        )
    }


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
                        <IconButton onClick={showScannerDialogue}>
                            <CameraAlt />
                        </IconButton>
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

            <ReactiveDialog open={scanner.dialogueOpen} closeHandler={hideScannerDialogue}>
                <BarcodeScanner
                    closeHandler={hideScannerDialogue}
                    acquisitionVisible={scanner.visible}
                    barcodeHandler={processBarcodeNum}
                    cameraAccess={scanner.camAccess}
                    acquisitionPaused={scanner.paused} />
            </ReactiveDialog>

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
