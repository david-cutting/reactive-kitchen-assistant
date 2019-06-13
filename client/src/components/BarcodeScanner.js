import React, {Component} from "react";
import {Barcode, BarcodePicker, CameraAccess, CameraSettings, ScanSettings} from "scandit-sdk";
import ScanditBarcodeScanner from "scandit-sdk-react";
import apiKeys from '../apiKeys';
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography'

export default class BarcodeScanner extends Component {
    licenseKey = apiKeys["scandit-license-key"];
    constructor(props) {
        super(props);
        this.state = {
            disableScanDB: true,
            paused: false,                       // and pause the scanning to start
            guiStyle: BarcodePicker.GuiStyle.NONE,
            playSoundOnScan: true,              // Beeping sound when you scan something
            targetScanningFPS: 15,               // The lower the number, the less resources required
            vibrateOnScan: false,
            videoFit: BarcodePicker.ObjectFit.COVER,
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
            this.props.isVisible && (
                <ScanditBarcodeScanner
                    // Library licensing & configuration options (see https://docs.scandit.com/stable/web/globals.html#configure)
                    licenseKey={this.licenseKey}
                    engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk/build" // could also be a local folder, e.g. "build"

                    // Picker events
                    onReady={() => this.setState({ scannerReady: true })}
                    onScan={this.processScan}
                    onScanError={console.log}

                    // Picker options
                    scanSettings={this.getScanSettings()}
                    paused={this.state.paused}
                    accessCamera={this.props.isVisible}
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

    processScan = (props) => {
        this.setState({ paused: true }); // Turn the scanner off once we've acquired a target

        const newCode = "https://world.openfoodfacts.org/api/v0/product/" + props.barcodes[0].data + ".json";
        fetch(newCode)
            .then(res => res.json())
            .then(json => {
                const outField = document.getElementById('scanner-output');

                // If the barcode number we scanned isn't in the database
                if(json.status === 0) {
                    outField.innerHTML = "Hmmm... I don't know that one. You can add it manually and associate that barcode with it.";
                    this.setState({ paused: false });   // Turn the scanner back on
                    return;
                }

                outField.innerHTML = json.product.product_name + ' ' + json.product.code;

                const data = {
                    code: json.product.code,
                    product_name: json.product.product_name,
                    generic_name: json.product.generic_name,
                    region: "world",
                    quantity: json.product.quantity,
                };

                if(!this.state.disableScanDB) {
                    fetch('/catalog/create', {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(data),
                    });
                }

                setTimeout(() => {
                    this.setState({shouldShowScannerComponent: false});
                    this.props.closeHandler();
                }, 1500);
            });

    };

    render() {
        const scanner = this.getScanner();

        return (
            <div>
                <Typography variant="body2" id="scanner-output" color="textPrimary">
                    |
                </Typography>
                {scanner}
            </div>
        );
    }
}

BarcodeScanner.propTypes = {
    closeHandler: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
};

