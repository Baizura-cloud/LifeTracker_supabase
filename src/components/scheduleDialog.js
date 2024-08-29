import React, { Component } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import Dayjs from 'dayjs';


export default class ScheduleDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeData: this.props.activeData,
      error: false,
      error1: false,
      error2: false,
    };
  }
  handleDateTime = (e) => {
    const date = e.$d.toISOString();
    const activeData = { ...this.state.activeData, date: date };
    this.setState({ activeData });
  };

  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.name == "name") {
      if (e.target.value == "") {
        this.setState({ error: true });
      } else {
        this.setState({ error: false });
      }
    } else if (e.target.name == "description") {
      if (e.target.value == "") {
        this.setState({ error1: true });
      } else {
        this.setState({ error: false });
      }
    }

    const activeData = { ...this.state.activeData, [name]: value };
    this.setState({ activeData });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Dialog fullWidth={true} maxWidth={"sm"} open={true} onClose={toggle}>
        <DialogTitle>Task</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <InputLabel>Name</InputLabel>
          <FormControl error={this.state.error} fullWidth={true}>
            <Input
              type="text"
              id="todo-name"
              name="name"
              value={this.state.activeData.name}
              onChange={this.handleChange}
            />
            <FormHelperText id="my-helper-text">
              {this.state.error ? "Must not empty" : " "}
            </FormHelperText>
          </FormControl>
          <InputLabel sx={{ paddingTop: 2 }}>Description</InputLabel>
          <FormControl error={this.state.error1} fullWidth={true}>
            <Input
              type="text"
              id="todo-description"
              name="description"
              value={this.state.activeData.description}
              onChange={this.handleChange}
            />
            <FormHelperText id="my-helper-text">
              {this.state.error1 ? "Must not empty" : " "}
            </FormHelperText>
          </FormControl>
          <InputLabel sx={{ paddingTop: 2 }}>Date & Time</InputLabel>
          <FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                sx={{ width: "auto" }}
                components={["DateTimePicker", "DateTimePicker"]}
              >
                <DateTimePicker
                  disablePast={true}
                  defaultCalendarDate = {new Date()}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                 value={Dayjs(this.state.activeData.date)}
                  onChange={this.handleDateTime}
                />
              </DemoContainer>
            </LocalizationProvider>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="success"
            onClick={() => onSave(this.state.activeData)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
