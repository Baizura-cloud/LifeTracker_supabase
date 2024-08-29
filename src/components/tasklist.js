import React, { Component } from "react";
import Modal from "./modal";
import AlertDialog from "./confirmDialog";
// import axios from "axios";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DialogSnackbar from "./snackbar";
import { CardHeader } from "@mui/material";
import { supabase } from "../client";

class Tasklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: true, // active tab
      value: 0,
      todoList: [],
      modal: false, //submit & edit dialog open@close
      confirmDel: false, //confirm delete dialog open@close
      popup: false, //snackbar open@close
      popupContent: { //snackbar type & message
        severity: "",
        message: "",
      },
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
    };
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  componentDidMount() {
    this.refreshList();
  }

  async refreshList() {
    try {
      const response = await supabase.from("todos").select();
      const data = await response.data
      this.setState({todoList:data})
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
  handleDelete = (item) => {
    this.setState({ activeItem: item, confirmDel: !this.state.confirmDel });
  };
  handleSubmitItem = (item) => {
    this.toggle();
    try {
      this.submitItem(item)
      this.togglesnack("submit")
    } catch (error) {
      console.log(error)
      this.togglesnack("error")
    }
    this.refreshList()
  };
  async submitItem(item){
    try {
      if(item.id){
        await supabase.from("todos").update(item).eq('id',item.id).then(
          this.refreshList()
        )
        return;
      }
      await supabase.from("todos").insert(item).then(
        this.refreshList()
      )
      return;
    } catch (error) {
      return error
    }
  }
  handleDeleteItem = (item) =>{
    this.handleDelete()
    item = this.state.activeItem
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
      await supabase.from("todos").delete().eq('id', item.id).then(
        this.refreshList()
      )
      return;
    } catch (error) {
      return error
    }
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    const { value } = this.state;
    return (
      <Box sx={{ width: "100%", borderColor: "divider" }}>
        <Tabs
          centered
          value={value}
          onChange={this.handleChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label="Completed Task"
            icon={<TaskAltIcon />}
            iconPosition="end"
            onClick={() => this.displayCompleted(true)}
          />
          <Tab
            label="Incompleted Task"
            icon={<NotInterestedIcon />}
            iconPosition="end"
            textColor="secondary"
            onClick={() => this.displayCompleted(false)}
            
          />
        </Tabs>
      </Box>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li key={item.id}>
        <Accordion sx={{marginTop:2}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id={item.id}
          >
            <Typography>{item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2">{item.description}</Typography>
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => this.editItem(item)}
              size="small"
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => this.handleDelete(item)}
              size="small"
            >
              Delete
            </Button>
          </AccordionActions>
        </Accordion>
      </li>
    ));
  };

  render() {
    return (
      <div>
        <Card variant="outlined" sx={{ minWidth: 275 }}>
          <CardHeader
            title="Task"
            subheader="Breakdown your daily task"
            action={
              <div className="mb-0" align="right">
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={this.createItem}
                >
                  Add task
                </Button>
              </div>
            }
          />
          <CardContent>
            {this.renderTabList()}
            <ul className="list-group list-group-flush border-top-0  ">
              {this.renderItems()}
            </ul>
          </CardContent>
        </Card>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmitItem}
          />
        ) : null}
        {this.state.confirmDel ? (
          <AlertDialog
            activeItem={this.state.activeItem}
            handleDelete={this.handleDelete}
            deleteItem={this.handleDeleteItem}
          />
        ) : null}
        {this.state.popup ? (
          <DialogSnackbar
            togglesnack={this.togglesnack}
            popup={this.state.popup}
            popupContent={this.state.popupContent}
          />
        ) : null}
      </div>
    );
  }
}

export default Tasklist;
