import React, { useState, useEffect } from 'react'
import { Progress, Avatar } from 'antd';
import "../styles/sidebar.css"
import { getWithHeaders } from '../utils/Externalcalls';
import pro from "../assets/images/project.png"
import models from "../assets/images/tred.png"
import fold from "../assets/images/folder.png"
import process from "../assets/images/proc.png"
import team from "../assets/images/team.png"


function ProjectSummary(props) {
    const user = JSON.parse(localStorage.getItem("user"))
    // initialize state
    const initialState = {
        user: user,
        disk: {},
        user_name: "",
        email: "",
        isLoading: true,
        errorMessage: null
      };

      const [data, setdata] = useState(initialState)

      useEffect(() => {
      }, [])

    return (
        <div>
            Summary
        </div>
    )
}

export default ProjectSummary