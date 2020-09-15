import React, {useEffect, useState} from 'react'
import { projectGetWithHeaders } from '../utils/Externalcalls';
import { antdNotification } from '../common/misc';
import SideBar from '../common/SideBar'
import "../styles/projects.css"
import "../styles/folder.css"
import loadIcon from "../assets/images/load.gif"
import OneProject from '../common/OneProject';
import classic from '../assets/images/empty.png'
import ViewFolders from '../common/modals/projectFoldersView'

function Folders() {

    const user = JSON.parse(localStorage.getItem("user"))

    const initialState = {
        user: user,
        isLoading: true,
        projects: [],
        notifications: [{type: "project", content: "You currently do not have any project, create new project to continue"}],
        showContent: false,
        forProject: ""
    };

    const [data, setdata] = useState(initialState)

    useEffect(() => {
        getProjects()
      }, [])

      function goToCreate() {
        window.location.href = "/create-project"
      }

    //   function to get all accessible projects
    function getProjects () {
        projectGetWithHeaders(`project/confirmed/${data.user.id}/confirmed`, {"token": JSON.parse(localStorage.getItem("token"))}).then(projects => {
            setdata({...data, projects: projects.data.data, isLoading: false})
        }).catch(error => {
            antdNotification("error", "Fetch Failed", "Error fetching project details, please reload screen")
        })
    }

    function showPFolders (projectId) {
        setdata({...data, forProject: projectId, showContent: true})
    }

    function closeModal() {
        setdata({...data, showContent: false})
    }

    return (
        <div className = "page">
            <SideBar active = {3} />
            <div  className = "project-view">
                <div className = "view-header">
                    <div>Project Folders</div>
                </div>
                {
                data.isLoading ?
                <div className = "loader-container">
                    <img className = "loader-image" src = {loadIcon} />
                </div> :
                <div>
                    {data.projects.length > 0 ?
                    <div className = "hold-3">
                        {data.projects.map((item, index) => (
                            <div onClick = {() => showPFolders(item.project.id)} className = "project-mile">
                                <div className = "fold-tile">
                                    <img src = {classic} className = "fold-image" />
                                </div>
                                <div className = "fold-tile-detail">
                                    <div className = "folder-name">
                                    {item.project.title}
                                    </div>
                                    <div className = "fold-ceat">
                                       createdAt: {item.project.createdAt}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> : 
                    <div className = "project-empty">
                        <div className = "empty-content">
                            <img className = "middle" src = {classic} />
                        </div>
                    </div>}
                </div>
            }
            </div>
            {
                data.showContent ? <ViewFolders project = {data.forProject} cancel = {() => closeModal()} /> : ""
            }
        </div>
    )
}

export default Folders
