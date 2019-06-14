import React, {Component} from "react";
import {Barcode, BarcodePicker, CameraAccess, ScanSettings} from "scandit-sdk";
import ScanditBarcodeScanner from "scandit-sdk-react";
import apiKeys from '../apiKeys';
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography'

export default class BarcodeScanner extends Component {
    licenseKey = apiKeys["scandit-license-key"];
    constructor(props) {
        super(props);
        this.state = {
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
            this.props.acquisitionVisible && (
                <ScanditBarcodeScanner
                    // Library licensing & configuration options (see https://docs.scandit.com/stable/web/globals.html#configure)
                    licenseKey={this.licenseKey}
                    engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk/build" // could also be a local folder, e.g. "build"

                    // Picker events
                    onReady={() => this.setState({ scannerReady: true })}
                    onScan={this.props.barcodeHandler}
                    onScanError={console.log}

                    // Picker options
                    scanSettings={this.getScanSettings()}
                    paused={this.props.acquisitionPaused}
                    accessCamera={this.props.cameraAccess}
                    guiStyle={this.state.guiStyle}
                    playSoundOnScan={this.state.playSoundOnScan}
                    targetScanningFPS={this.state.targetScanningFPS}
                    vibrateOnScan={this.state.vibrateOnScan}
                    videoFit={this.state.videoFit}
                    singleImageMode={this.state.singleImageMode} // only set on component creation, can not be changed afterwards

                    // FIXME: figure out how to reuse the scanner in initialization, like how the documentation says is possible
                />
            )
        );
    };

    render() {
        const scanner = this.getScanner();

        return (
            <div>
                <Typography variant="body2" id="scanner-output" color="textPrimary">
                    {""}
                </Typography>
                {scanner}
            </div>
        );
    }
}

BarcodeScanner.propTypes = {
    closeHandler: PropTypes.func,
    acquisitionVisible: PropTypes.bool.isRequired,
    acquisitionPaused: PropTypes.bool.isRequired,
    cameraAccess: PropTypes.bool.isRequired,
    barcodeHandler: PropTypes.func,
};

