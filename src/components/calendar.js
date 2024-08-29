import React, { Component } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import ScheduleDialog from "./scheduleDialog";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
// import axios from "axios";
import DialogSnackbar from "./snackbar";
import AlertDialog from "./confirmDialog";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import { Typography, CardActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dayjs from "dayjs";
import { supabase } from "../client";

class Calendar extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      viewMonth: this.getMonthName(new Date().getMonth()),
      value: 0,
      tabvalue: new Date().getMonth(), //auto focus on current month tab
      scheduleList: [],
      modal: false,
      confirmDel: false,
      popup: false,
      expanded: false,
      popupContent: {
        severity: "",
        message: "",
      },
      activeData: {
        name: "",
        description: "",
        date: "",
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }
  async refreshList() {
    try {
      const response = await supabase.from("schedules").select();
      const data = await response.data
      this.setState({scheduleList:data})
    } catch (error) {
      console.log(error);
    }
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  togglesnack = (snacktype) => {
    this.setState({ popup: !this.state.popup });
    if (snacktype == "delete") {
      this.setState({
        popupContent: {
          severity: "success",
          message: "Task deleted successfully",
        },
      });
    } else if (snacktype == "submit") {
      this.setState({
        popupContent: {
          severity: "success",
          message: "Task submitted successfully",
        },
      });
    } else if (snacktype == "edit") {
      this.setState({
        popupContent: {
          severity: "success",
          message: "Task edited successfully",
        },
      });
    } else if (snacktype == "error") {
      this.setState({
        popupContent: {
          severity: "error",
          message: "Error: please make sure the data are valid",
        },
      });
    }
  };
  handleSubmitItem = (item) => {
    this.toggle();
    try {
      const flagsubmit = this.submitItem(item)
      if(flagsubmit == "error"){
        this.togglesnack("error")
      }else{
        this.togglesnack("submit")
      }
    } catch (error) {
      console.log(error)
      
    }
    this.refreshList()
  };
  async submitItem(item){
    try {
      if(item.id){
        await supabase.from("schedules").update(item).eq('id',item.id).then(
          this.refreshList()
        )
        return "success"
      }
      await supabase.from("schedules").insert(item).then(
        this.refreshList()
      )
      return "success"
    } catch (error) {
      return "error"
    }
  }
  handleDelete = (item) => {
    this.setState({ activeData: item, confirmDel: !this.state.confirmDel });
  };
  handleDeleteItem = (item) =>{
    this.handleDelete()
    item = this.state.activeData
    try {
      this.deleteItem(item)
      this.togglesnack("delete")
    } catch (error) {
      this.togglesnack("error")
      console.log(error)
    }
    this.refreshList()
  }
  async deleteItem(item){
    try {
      await supabase.from("schedules").delete().eq('id', item.id).then(
        this.refreshList()
      )
      return;
    } catch (error) {
      return error
    }
  };
  createItem = () => {
    const item = { name: "", description: "", date: "" };

    this.setState({ activeData: item, modal: !this.state.modal });
  };
  editItem = (item) => {
    this.setState({ activeData: item, modal: !this.state.modal });
  };

  displayMonth = (index) => {
    if (index) {
      return this.setState({ viewMonth: index });
    }
    return this.setState({ viewMonth: "" });
  };
  handleTabList = (event, newValue) => {
    this.setState({ tabvalue: newValue });
  };
  handleItems = (event, newValue) => {
    this.setState({ value: newValue });
  };
  getMonthName = (month) => {
    //get month name for tab header
    const monthList = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const toMonth = monthList[month];
    return toMonth.toUpperCase();
  };
  getDate = (index) => {
    //get current date + day name for tab header
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    const day = weekday[today.getDay() + index];
    return { day, today };
  };

  renderTabList = () => {
    const { tabvalue } = this.state;
    const numbers = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return (
      <Box sx={{ width: "100%", borderColor: "divider" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabvalue}
          onChange={this.handleTabList}
          textColor="primary"
          indicatorColor="primary"
        >
          {numbers.map((month) => (
            <Tab
              label={month}
              iconPosition="end"
              onClick={() => this.displayMonth(month.toUpperCase())}
            />
          ))}
        </Tabs>
      </Box>
    );
  };
  renderSmallTabList = () => {
    const { tabvalue } = this.state;
    const numbers = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return (
      <Box sx={{ width: "100%", borderColor: "divider" }}>
        <Tabs
          variant="scrollable"
          value={tabvalue}
          onChange={this.handleTabList}
          textColor="primary"
          indicatorColor="primary"
        >
          {numbers.map((month) => (
            <Tab
              label={month}
              iconPosition="end"
              onClick={() => this.displayMonth(month.toUpperCase())}
            />
          ))}
        </Tabs>
      </Box>
    );
  };
  renderItems = () => {
    const { viewMonth } = this.state;
    const newSchedule = this.state.scheduleList.filter((schedule) => {
      const dataMonth = Dayjs(schedule.date).month(); //return data month name
      const monthName = this.getMonthName(dataMonth);
      if (monthName == viewMonth) {
        return schedule;
      }
      return;
    });

    return newSchedule.map((item) => (
      <li key={item.id}>
        <Box sx={{ flexGrow: 1, paddingTop: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs>
              <Card>
                <CardContent>
                  <Typography>{item.name}</Typography>
                  <Typography>{item.description}</Typography>
                  <Typography>
                    {Dayjs(item.date).format("dddd, MMMM D, YYYY h:mm A")}{" "}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => this.editItem(item)}
                    size="small"
                    endIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => this.handleDelete(item)}
                    size="small"
                    endIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </li>
    ));
  };

  render() {
    return (
      <div>
        <Card variant="outlined" sx={{ maxWidth: 1000 }}>
          <CardHeader
            title="Schedule"
            subheader="Plan ahead your month with the schedule"
            action={
              <div className="mb-0" align="right">
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={this.createItem}
                >
                  Add Schedule
                </Button>
              </div>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                {this.renderTabList()}
              </Grid>
              <Grid item xs={10} sx={{ display: { xs: 'none', md: 'block' } }} >
                <ul className="list-group list-group-flush border-top-0  ">
                  {this.renderItems()}
                </ul>
              </Grid>
              <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                {this.renderSmallTabList()}
              </Grid>
              <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }} >
                <ul className="list-group list-group-flush border-top-0  ">
                {this.renderItems()}
                </ul>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {this.state.modal ? (
          <ScheduleDialog
            activeData={this.state.activeData}
            toggle={this.toggle}
            onSave={this.handleSubmitItem}
          />
        ) : null}
        {this.state.popup ? (
          <DialogSnackbar
            togglesnack={this.togglesnack}
            popup={this.state.popup}
            popupContent={this.state.popupContent}
          />
        ) : null}
        {this.state.confirmDel ? (
          <AlertDialog
            activeData={this.state.activeData}
            handleDelete={this.handleDelete}
            deleteItem={this.handleDeleteItem}
          />
        ) : null}
      </div>
    );
  }
}

export default Calendar;
