import React, {Component} from "react";
import {Barcode, BarcodePicker, CameraAccess, CameraSettings, ScanSettings} from "scandit-sdk";
import ScanditBarcodeScanner from "scandit-sdk-react";

class BarcodeScanner extends Component {
    // FIXME: Need way to register individual apps with unique key. Need way to keep this from github in future
    licenseKey = "***REMOVED***";

    constructor(props) {
        super(props);
        // Build a state, can be updated with calls to this.setState()
        this.state = {
            shouldShowScannerComponent: false,  // Don't show the scanner
            paused: true,                       // and pause the scanning to start
            accessCamera: false,                // and don't access the camera to begin
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
            targetScanningFPS: 5,               // The lower the number, the less resources required
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
                    onScan={console.log}
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
                <h1>react-scandit-websdk Demo</h1>
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

export default BarcodeScanner;