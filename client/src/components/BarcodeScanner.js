import React, {Component} from "react";
import {Barcode, BarcodePicker, CameraAccess, CameraSettings, ScanSettings} from "scandit-sdk";
import ScanditBarcodeScanner from "scandit-sdk-react";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import {CameraAlt} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import apiKeys from '../../../apiKeys'

class BarcodeScanner extends Component {
    // FIXME: Need way to register individual apps with unique key. Need way to keep this from github in future
    licenseKey = apiKeys["scandit-license-key"];
    constructor(props) {
        super(props);
        // Build a state, can be updated with calls to this.setState()
        this.state = {
            shouldShowScannerComponent: false,  // Don't show the scanner
            paused: true,                       // and pause the scanning to start
            accessCamera: false,                // and don't access the ca,mera to begin
            cameras: [],                        // Array containing cameras that are available
            cameraSettings: {
                resolutionPreference: CameraSettings.ResolutionPreference.HD
            },
            enableCameraSwitcher: true,         // Allow switching from front to back facing camera
            enablePinchToZoom: true,            // Supposed on only work in chrome
            enableTapToFocus: true,             // Same story
            enableTorchToggle: true,            // Turns the flash on and off
            guiStyle: BarcodePicker.GuiStyle.NONE,
            playSoundOnScan: true,              // Beeping sound when you scan something
            targetScanningFPS: 30,               // The lower the number, the less resources required
            vibrateOnScan: false,               // Only on devices with haptic feedback
            videoFit: BarcodePicker.ObjectFit.COVER,
            visible: true,
            singleImageMode: {
                desktop: { always: false, allowFallback: true },
                mobile: { always: false, allowFallback: true }
            }
        };

        CameraAccess.getCameras().then(cameras => this.setState({ cameras }));
    }

    // Set up which types of barcodes we will allow to be scanned. These five should cover everything.
    getScanSettings = () => {
        const scanSettings = new ScanSettings();
        scanSettings.enableSymbologies(Barcode.Symbology.QR);
        scanSettings.enableSymbologies(Barcode.Symbology.UPCA);
        scanSettings.enableSymbologies(Barcode.Symbology.UPCE);
        scanSettings.enableSymbologies(Barcode.Symbology.EAN8);
        scanSettings.enableSymbologies(Barcode.Symbology.EAN13);

        return scanSettings;
    };

    getScanner = () => {
        return (
            this.state.shouldShowScannerComponent && (
                <ScanditBarcodeScanner
                    // Library licensing & configuration options (see https://docs.scandit.com/stable/web/globals.html#configure)
                    licenseKey={this.licenseKey}
                    engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk/build" // could also be a local folder, e.g. "build"

                    // Picker events
                    onReady={() => this.setState({ scannerReady: true })}
                    onScan={processScan}
                    onScanError={console.log}
                    // Fallback methods ?
                    // onSubmitFrame={console.log}
                    // onProcessFrame={console.log}

                    // Picker options
                    scanSettings={this.getScanSettings()}
                    paused={this.state.paused}
                    accessCamera={this.state.accessCamera}
                    camera={this.state.activeCamera}
                    cameraSettings={this.state.cameraSettings}
                    enableCameraSwitcher={this.state.enableCameraSwitcher}
                    enablePinchToZoom={this.state.enablePinchToZoom}
                    enableTapToFocus={this.state.enableTapToFocus}
                    enableTorchToggle={this.state.enableTorchToggle}
                    guiStyle={this.state.guiStyle}
                    playSoundOnScan={this.state.playSoundOnScan}
                    targetScanningFPS={this.state.targetScanningFPS}
                    vibrateOnScan={this.state.vibrateOnScan}
                    videoFit={this.state.videoFit}
                    visible={this.state.visible}
                    singleImageMode={this.state.singleImageMode} // only set on component creation, can not be changed afterwards


                    // FIXME: figure out how to reuse the scanner in initialization, like how the documentation says is possible
                />
            )
        );
    };


    render() {
        const scanner = this.getScanner();

        // FIXME: initialize, show, then hide and turn off as soon as a code is captured, no buttons required

        const showButton = (
            <button
                onClick={() => this.setState({ shouldShowScannerComponent: true })}
                disabled={this.state.shouldShowScannerComponent}
            >
                Show
            </button>
        );
        const hideButton = (
            <button
                onClick={() =>
                    this.setState({
                        shouldShowScannerComponent: false,
                        scannerReady: false
                    })
                }
                disabled={!this.state.shouldShowScannerComponent}
            >
                Hide
            </button>
        );

        const startButton = (
            <button
                onClick={() => this.setState({ paused: false, accessCamera: true })}
                disabled={!this.state.shouldShowScannerComponent || !this.state.paused}
            >
                Start
            </button>
        );
        const stopButton = (
            <button
                onClick={() => this.setState({ paused: true })}
                disabled={!this.state.shouldShowScannerComponent || this.state.paused}
            >
                Pause
            </button>
        );

        return (
            <div>
                <div>
                    {showButton}
                    {hideButton}
                </div>
                {startButton}
                {stopButton}
                {scanner}
            </div>
        );
    }
}

function processScan(props) {
    const newCode = "https://world.openfoodfacts.org/api/v0/product/" + props.barcodes[0].data + ".json";
    fetch(newCode)
        .then(res => res.json())
        .then(res => {
            storeScanJSON(res);
        });
}

function storeScanJSON(json) {
    // If the barcode number we scanned isn't in the database
    if(json.status === 0) {
        document.getElementById("scanner-output").innerHTML = "Hmmm... I don't know that one.";
        return;
    }

    const name = json.product.product_name;
    const code = json.product.code;

    document.getElementById("scanner-output").innerHTML = name + ' ' + code;

    const data = {
        code: json.product.code,
        product_name: json.product.product_name,
        generic_name: json.product.generic_name,
        region: "world",
        quantity: json.product.quantity,
    };

    console.log(data);

    fetch('/catalog/create', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((res) => {
        console.log(res);
    })
}

function ScannerDialog(props) {
    const { fullScreen } = props;
    const [open, setOpen] = React.useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <CameraAlt />
            </IconButton>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Scan an item"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id={"scanner-output"}>

                    </DialogContentText>
                    <BarcodeScanner />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

ScannerDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ScannerDialog);