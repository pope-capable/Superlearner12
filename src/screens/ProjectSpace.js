import React, {useState, useEffect} from 'react'
import {Steps, Carousel, Modal} from "antd"
import ConfirmModal from "../common/modals/simpleConfirm"
import SideBar from '../common/SideBar'
import Onefile from "../common/file"
import OneFileContent from "../common/modals/oneFolderContent"
import "../styles/projects.css"
import services from "../assets/images/service2.png"
import cfolder from "../assets/images/folder2.png"
import working from "../assets/images/work2.svg"
import { projectGetWithHeaders, FolderGetWithHeaders } from '../utils/Externalcalls'
import loadIcon from "../assets/images/load.gif"
import { antdNotification } from '../common/misc';
import FormList from 'antd/lib/form/FormList'
import empty from '../assets/images/nofile.png'



function ProjectSpace(props) {

    const initialState = {
        isLoading: true,
        title: null,
        description: null,
        notifications: [{type: "project", content: "You currently do not have any project, create new project to continue"}],
        ready: false,
        project: {},
        folders: [],
        frequentFiles: [],
        openFolder: false,
        focusFolder: {}
    };

    const [data, setdata] = useState(initialState)

    useEffect(() => {
        projectDetail()
    }, [])

    // function to get project detail
    function projectDetail () {
        projectGetWithHeaders(`project/detail/${props.match.params.slug}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(projectDetails => {
            FolderGetWithHeaders(`folders/project/${props.match.params.slug}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(foldersCreated => {
                setdata({...data, folders: foldersCreated.data.data, project: projectDetails.data.data, isLoading: false})
            }).catch(error => {
                antdNotification("error", "Fetch Failed", "Error fetching folders, please ensure a stable connection and reload screen")
            })
        }).catch(error => {
            antdNotification("error", "Fetch Failed", "Error fetching project details, please reload screen")
        })
    }


    // function to enter a project
    function enterProject() {
        window.location.href = `/project/${data.project.id}/${data.project.title}`
    }

    // function to update state with input
    function handleChange (event) {

    }

    function folderStyle (type) {
        if(type == "system"){
            var useStyle = "system-folder"
        }else{
            var useStyle = "user-folder"
        }
        return useStyle
    }

    function openFolder(folder) {
        setdata({...data, focusFolder: folder, openFolder: true})
    }

    function closeModal() {
        setdata({...data, openFolder: false})
    }

    function selectFile(dot) {

    }

    return (
        <div className = "page">
            <SideBar active = {1} notifications = {data.notifications} />
            <div className = "project-view">
                <div className = "view-header">
                    <div>Project: {data.isLoading ? "fetching project information" : data.project.title}</div>
                </div>
                {
                data.isLoading ?
                <div className = "loader-container">
                    <img className = "loader-image" src = {loadIcon} />
                </div> : 
                <div className = "project-summary">
                <div className = "summary-row">
                        <div className = "folders">
                            <div className = "folders-view">
                                <div className = "over-head">Folders</div>
                                {data.folders.map((item, index) => (
                                    <div className = {folderStyle(item.type)} onClick = {e => openFolder(item)}>
                                        <img src = {cfolder} className = "c-folder" />{item.name}
                                    </div>
                                ))}
                            </div>
                            <div className = "frequent-view">
                                <div className = "over-head">Recent Results</div>
                                {
                                    data.frequentFiles.length < 1 ?
                                    <div className = "llo">
                                        <img src = {empty} />
                                        <div>No recent results</div>
                                    </div> :
                                    <div className = "frequent-view-content">
                                    {data.frequentFiles.map((item, index) => (
                                        <Onefile file = {item}  />
                                    ))}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className = "access">
                            <img className = "mascot" src = {working} />
                            <div>Access management under development</div>
                        </div>
                    </div>
                    <div className = "summary-row">
                        <div className = "process-entrance" onClick = {e => enterProject()}>
                            <img className = "mascot" src = {services} />
                            <div>Enter processes</div>
                        </div>
                        <div className = "project-description">{data.project.description}</div>
                    </div>
                </div>
            }
            </div>
            {
                data.openFolder ? <OneFileContent select = {selectFile} folder = {data.focusFolder} cancel = {() => closeModal()} /> : ""
            }
            </div>
    )
}

export default ProjectSpace
