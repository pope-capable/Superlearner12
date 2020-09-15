import React, {useState, useEffect} from 'react'
import {Steps, Carousel, Modal} from "antd"
import ConfirmModal from "../common/modals/simpleConfirm"
import SideBar from '../common/SideBar'
import "../styles/projects.css"
import classic from "../assets/images/preate.png"
import CheckableTag from 'antd/lib/tag/CheckableTag'
import { projectPostWithHeaders } from '../utils/Externalcalls'
import { antdNotification } from '../common/misc';



function CreateProject() {

    const initialState = {
        isLoading: false,
        title: null,
        description: null,
        notifications: [{type: "project", content: "You currently do not have any project, create new project to continue"}],
        ready: true,
        showConfirm: false,
        user: JSON.parse(localStorage.getItem("user"))
    };

    const [data, setdata] = useState(initialState)

    useEffect(() => {
    }, [])


    function confirmCreation() {
        setdata({...data, showConfirm: true})
    }

    function closeModal() {
        setdata({...data, showConfirm: false})
    }

    function createProject() {
        projectPostWithHeaders("project/create", {...data, userId: data.user.id}, {"token": JSON.parse(localStorage.getItem("token"))}).then(projectCreated => {
            antdNotification("success", "Success", projectCreated.data.message)
            window.location.href = `/project-space/${projectCreated.data.data.id}`
        }).catch(error => {
            antdNotification("error", "Project Creation Failed", error.message)
            setdata({...data, showConfirm: false})
        })
    }
    // function to update state with input
    function handleChange (event) {
        setdata({
            ...data,
            [event.target.name]: event.target.value
          });
    }

    return (
        <div className = "page">
            <SideBar active = {1} notifications = {data.notifications} />
            <div className = "project-view">
            <div className = "view-header">
            <div>Projects</div>
            </div>
                    <div className = "project-create-view">
                        <div className = "activity-title">
                            <img className = "flag" src = {classic} />
                            <div>
                                Create new project
                            </div>
                        </div>
                                <div>
                                    <div className = "activity-title-mid"> 
                                    <span class="input-tag">Project Title</span>
                                    <input name = "title" onChange = {e => handleChange(e)} className = "custom-input" prefix = "Runner" />
                                    </div>
                                    <div className = "activity-title-2"> 
                                        <span class="input-tag-textarea">Project Description</span>
                                        <textarea name = "description" onChange = {e => handleChange(e)} className = "custom-textarea" prefix = "Runner" />
                                    </div>
                                    <div>
                                        {
                                            data.ready ? <button onClick = {e => confirmCreation()} className = "proceed-button">Next</button> : "Fill details to continue"
                                        }
                                    </div>
                                </div>
                                {
                                    data.showConfirm ? <ConfirmModal cancel = {() => closeModal()} confirm = {() => createProject()} message = {"Confirm project creation, this will affect your available disk space as new file directories will be created"} /> : ""
                                }
                    </div>
            </div>
            </div>
    )
}

export default CreateProject
