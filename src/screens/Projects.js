import React, {useEffect, useState} from 'react'
import SideBar from '../common/SideBar'
import "../styles/projects.css"
import classic from "../assets/images/preate.png"
import { projectGetWithHeaders } from '../utils/Externalcalls';
import { antdNotification } from '../common/misc';
import loadIcon from "../assets/images/load.gif"
import OneProject from '../common/OneProject';


function Projects() {
    const user = JSON.parse(localStorage.getItem("user"))

    const initialState = {
        user: user,
        isLoading: true,
        projects: [],
        notifications: [{type: "project", content: "You currently do not have any project, create new project to continue"}]
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
    
    return (
        <div className = "page">
            <SideBar active = {1} notifications = {data.notifications} />
            <div className = "project-view">
            <div className = "view-header">
            <div>Projects</div>
            <div onClick = {e => goToCreate()} className = "create-new"><img className = "middle-small" src = {classic} />
                Create project</div>
            </div>
            {/* set loading */}
            {
                data.isLoading ?
                <div className = "loader-container">
                    <img className = "loader-image" src = {loadIcon} />
                </div> :
                <div>
                    {data.projects.length > 0 ?
                    <div>
                        {data.projects.map((item, index) => (
                            <OneProject oneProject = {item}  />
                        ))}
                    </div> : 
                    <div className = "project-empty">
                        <div onClick = {e => goToCreate()} className = "empty-content">
                            <img className = "middle" src = {classic} />
                            <div>
                                Create new project
                            </div>
                        </div>
                    </div>}
                </div>
            }
            </div>
        </div>
    )
}

export default Projects
