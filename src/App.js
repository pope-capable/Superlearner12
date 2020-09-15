import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, withRouter, Route, Switch} from "react-router-dom"
import Home from "../src/screens/Home"
import Entry from "../src/screens/Entry"
import Dashboard from "../src/screens/Projects"
import Models from "../src/screens/Models"
import Folders from "../src/screens/Folders"
import Processes from "../src/screens/Processes"
import Teams from "../src/screens/Team"
import CreateProject from "../src/screens/CreateProject"
import ProjectSpace from "../src/screens/ProjectSpace"
import ProjectProcesses from "../src/screens/ProjectProcesses"
import ModelCompare from "../src/screens/ModelCompare"

import './App.css';
import reducer from './utils/reducer'
import { AuthenticationContext } from "../src/utils/reducer";


const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};


function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <AuthenticationContext.Provider value={{state,  dispatch}}    >
      <Router>
          <Switch>
            <Route exact path = "/" component = {Home}/>
            <Route exact path = "/entry/:pp" component = {Entry} />
            <Route exact path = "/dashboard" component = {Dashboard} />
            <Route exact path = "/models" component = {Models} />
            <Route exact path = "/folders" component = {Folders} />
            <Route exact path = "/processes" component = {Processes} />
            <Route exact path = "/teams" component = {Teams} />
            <Route exact path = "/create-project" component = {CreateProject} />
            <Route exact path = "/project-space/:slug" component = {ProjectSpace} />
            <Route exact path = "/project/:slug/:slug2" component = {ProjectProcesses} />
            <Route exact path = "/models-compare/:slug/:slug2" component = {ModelCompare} />
          </Switch>
        </Router>
      </AuthenticationContext.Provider>
  );
}

export default App;
