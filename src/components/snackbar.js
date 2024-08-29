import React, { Component } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default class DialogSnackbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }

  render() {
    const { togglesnack, popup, popupContent } = this.props;
    return (
      <div>
        <Snackbar
          open={popup}
          autoHideDuration={3000}
          onClose={togglesnack}
          message="Note archived"
        >
          <Alert
            onClose={togglesnack}
            severity={popupContent.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {popupContent.message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}
