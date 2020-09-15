import React, {useState, useEffect} from 'react'
import {Steps, Carousel, Modal} from "antd"
import ConfirmModal from "../common/modals/simpleConfirm"
import SideBar from '../common/SideBar'
import Onefile from "../common/file"
import FileContent from "../common/modals/folderContent"
import "../styles/projects.css"
import "../styles/projectProcesses.css"
import cloud from "../assets/images/cloud.png"
import { projectGetWithHeaders } from '../utils/Externalcalls'
import loadIcon from "../assets/images/load.gif"
import { antdNotification } from '../common/misc';
import DataPreprocessing from '../common/dataPP'
import ActiveProcesses from '../common/processes'
import ModelTabView from '../common/modelsTab'
import SuperLearner from '../common/superLearner'


function ProjectProcesses(props) {

    const initialState = {
        isLoading: true,
        activeSection: 1,
        notifications: [{type: "project", content: "You currently do not have any project, create new project to continue"}],
        ready: false,
        project: {},
        section: [{id: 1, name: "Data Pre-processing"}, {id: 2, name: "Models"}, {id: 3, name: "Super Learner"}, {id: 4, name: "Processes"}],
        openFolder: false,
        focusFolder: {}
    };

    const [data, setdata] = useState(initialState)

    useEffect(() => {
        projectDetail()
    }, [])

    // function to toggle class tabs
    function rightClass(check) {
        if(check == data.activeSection){
            var rigthStyle = "opened-tab"
        }else{
            var rigthStyle = "closed-tab"
        }
        return rigthStyle
    }

    function setActiveSection(set) {
        setdata({...data, activeSection: set})
    }
    // function to get project detail
    function projectDetail () {
        // projectGetWithHeaders(`project/detail/${props.match.params.slug}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(projectDetails => {
        //     setdata({...data, project: projectDetails.data.data, isLoading: false})
        // }).catch(error => {
        //     antdNotification("error", "Fetch Failed", "Error fetching project details, please reload screen")
        // })
                    setdata({...data, isLoading: false})
    }


    function closeModal() {
        setdata({...data, openFolder: false})
    }

    // function to show process components
    function showComponent() {
        if(data.activeSection == 1){
            var activeComponent = <DataPreprocessing project = {props.match.params.slug} />
        }else if(data.activeSection == 4){
            var activeComponent = <ActiveProcesses project = {props.match.params.slug} />
        }else if(data.activeSection == 2){
            var activeComponent = <ModelTabView project = {props.match.params.slug}/>
        }else if(data.activeSection == 3){
            var activeComponent = <SuperLearner project = {props.match.params.slug} />
        }
        return activeComponent
    }

    return (
        <div className = "page">
            <SideBar active = {1} notifications = {data.notifications} />
            <div className = "project-view">
                <div className = "view-header">
                    <div>Project: {data.isLoading ? "fetching project information" : props.match.params.slug2}</div>
                    <div className = "hold-sections">
                        {data.section.map((item, index) => (
                            <div onClick = {e => setActiveSection(item.id)} className = {rightClass(item.id)}>{item.name}</div>
                        ))}
                    </div>
                </div>
                {
                data.isLoading ?
                <div className = "loader-container">
                    <img className = "loader-image" src = {loadIcon} />
                </div> : 
                <div className = "project-summary">
                    <div className = "project-message"><img className = "cloud-image" src ={cloud} /> Kindly Select one of the options to continue</div>
                    {showComponent()}
                </div>
            }
            </div>
            {
                data.openFolder ? <FileContent folder = {data.focusFolder} cancel = {() => closeModal()} /> : ""
            }
            </div>
    )
}

export default ProjectProcesses
