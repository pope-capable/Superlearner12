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
import { FolderGetWithHeaders, folderPostWithHeaders } from '../utils/Externalcalls';
import { antdNotification } from '../common/misc';
import FolderContent from '../common/modals/folderContent';
import ModelListSelect from '../common/modals/modelSelect';
import file from '../assets/images/file.png'
import gruid from '../assets/images/gruid.png'


function ModelComparison(props) {

    const initialState = {
        isLoading: false,
        activeSection: 1,
        notifications: [{type: "project", content: "You currently do not have any project, create new project to continue"}],
        ready: false,
        project: {},
        section: [{id: 1, name: "Data Pre-processing"}, {id: 2, name: "Models"}, {id: 3, name: "Super Learner"}, {id: 4, name: "Processes"}],
        openFolder: false,
        focusFolder: {},
        comparingModels: [],
        showModalSelect: false,
        location: "",
        studyId: "",
        outcomeId: "",
        outcome: "",
        output: "",
        showConfirm: false,
        showCreated: false,
        projectId: props.match.params.slug,
        value: null,
        models: [],
        type: "model-compare",
        uploads: []
    };

    const [data, setdata] = useState(initialState)

    const [models, setmodels] = useState([])


    useEffect(() => {
        getModels()
        getFolders()
    }, [])


    function closeModal() {
        setdata({...data, openFolder: false})
    }

    function handleChange(event) {
        setdata({
            ...data,
            [event.target.name]: event.target.value
          });
    }

    function openUploads() {
        setdata({...data, openFolder: true})
    }

    function openmodels() {
        setdata({...data, showModalSelect: true})
    }

    function CompositeModels(modelsArray) {
        setdata({...data, comparingModels: modelsArray})
    }

    
    function getModels() {
        FolderGetWithHeaders(`model/get-all/${props.match.params.slug}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(modelsCreated => {
            setmodels(modelsCreated.data.data)
        }).catch(error => {
            antdNotification("error", "Fetch Failed", "Error fetching folders, please ensure a stable connection and reload screen")
        })
    }

    function closeModal(){
        setdata({...data, openFolder: false, showConfirm: false, showModalSelect: false})
    }

    
    function confirmCreation() {
        setdata({...data, showConfirm: true})
    }

    function createModel() {
        folderPostWithHeaders("process/compare-model", data, {"token": JSON.parse(localStorage.getItem("token"))}).then(projectCreated => {
            antdNotification("success", "Success", projectCreated.data.message)
            window.location.reload()
        }).catch(error => {
            antdNotification("error", "Project Creation Failed", error.message)
            setdata({...data, showConfirm: false})
        })
    }

    function getFolders() {
        FolderGetWithHeaders(`folders/project/${props.match.params.slug}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(foldersCreated => {
            setdata({...data, uploads: foldersCreated.data.data})
        }).catch(error => {
            antdNotification("error", "Fetch Failed", "Error fetching folders, please ensure a stable connection and reload screen")
        })
    }

    function selectFile(dot) {
        setdata({...data, useFile: dot, location: dot.location})
    }

    return (
        <div className = "page">
            <SideBar active = {2} notifications = {data.notifications} />
            <div className = "project-view">
                <div className = "view-header">
                    <div>Compare Models in: {data.isLoading ? "fetching project information" : props.match.params.slug2}</div>
                    
                </div>
                {
                data.isLoading ?
                <div className = "loader-container">
                    <img className = "loader-image" src = {loadIcon} />
                </div> : 
                <div className = "project-summary">
                    <div className = "project-message"><img className = "cloud-image" src ={cloud} /> Kindly Select one of the options to continue</div>
                        <div className = "dpp-view">
                            <div className = "dpp-row">
                                <div className = "dpp-sf">
                                    <div className = "activity-title-mid"> 
                                        <span className="input-tag">Output name</span>
                                        <input onChange = {e => handleChange(e)} name = "output" className = "custom-input" prefix = "Runner" />
                                    </div>
                                    <div className = "activity-title-mid"> 
                                        <span className="input-tag">StudyId</span>
                                        <input onChange = {e => handleChange(e)} name = "studyId" className = "custom-input" prefix = "Runner" />
                                    </div>
                                    <div className = "activity-title-mid"> 
                                        <span className="input-tag">OutcomeId</span>
                                        <input onChange = {e => handleChange(e)} name = "outcomeId" className = "custom-input" prefix = "Runner" />
                                    </div>
                                </div>
                            </div>
                    <div>
                    <img onClick = {e => openUploads()} className = "cloud-image" src = {file} /> select file from upload folders<br/>
                        {
                            data.location ? 
                            <div>                
                                File selected: {data.useFile.name}
                            </div> : ""
                        }
                    </div>
                    <div>
                        <img onClick = {e => openmodels()} className = "cloud-image" src = {gruid} /> select component models
                            <div>{data.comparingModels.length} Models selected</div>
                    </div>
                    <div className = "dpp-row">
                <button onClick = {e => confirmCreation()} className = "proceed-button-2">Next</button>
            </div>
                </div>
            </div>
            }
            </div>
            {
                data.openFolder ? <FolderContent select = {selectFile} folders = {data.uploads} cancel = {() => closeModal()} /> : ""
            }
                                    {
                data.showModalSelect ? <ModelListSelect projectId = {data.projectId} passCmodels = {CompositeModels} models = {models} folders = {data.uploads} cancel = {() => closeModal()} /> : ""
            }
                        {
                data.showConfirm ? <ConfirmModal cancel = {() => closeModal()} confirm = {() => createModel()} message = {"Confirm model comparison creation, this will affect your available disk space as new file directories will be created"}/> : ""
            }
            </div>
    )
}

export default ModelComparison
