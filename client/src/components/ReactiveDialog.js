import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";

function ReactiveDialog(props) {
    const { fullScreen } = props;

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={props.closeHandler}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Scan an item"}</DialogTitle>
                <DialogContent>
                    {props.children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.closeHandler} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

ReactiveDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    closeHandler: PropTypes.func.isRequired,
};

export default withMobileDialog()(ReactiveDialog);