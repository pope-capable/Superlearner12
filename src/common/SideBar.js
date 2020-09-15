import React, { useState, useEffect } from 'react'
import { Progress, Avatar } from 'antd';
import "../styles/sidebar.css"
import { getWithHeaders } from '../utils/Externalcalls';
import { AuthenticationContext } from "../utils/reducer";
import pro from "../assets/images/project.png"
import models from "../assets/images/tred.png"
import fold from "../assets/images/folder.png"
import process from "../assets/images/proc.png"
import team from "../assets/images/team.png"
import logout from "../assets/images/out.png"
import { antdNotification } from './misc';


function SideBar(props) {
    const { dispatch } = React.useContext(AuthenticationContext);
    const user = JSON.parse(localStorage.getItem("user"))
    // initialize state
    const initialState = {
        user: user,
        disk: {},
        notifications: [{type: "project", content: "You currently do not have any project, create new project to continue"}],
        user_name: "",
        email: "",
        isLoading: true,
        errorMessage: null
      };

      const [data, setdata] = useState(initialState)

      useEffect(() => {
        setdata({...data, isLoading: true})
        getWithHeaders(`disk/get-usage/${data.user.id}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(diskUsage => {
            setdata({...data, disk: diskUsage.data.data, isLoading: false})
        })
      }, [])

      function setActive(data) {
          if(data == props.active){
              var style = "active"
          }
          else{
              var style = "inactive"
          }
          return style
      }

      function moveAround(data) {
        window.location.href = data
      }

      function colorNotification(data) {
          if(data.type == "project"){
              var useClass = "project-note"
          }else if(data.type == "team"){
              var useClass = "team-note"
          }
          return useClass
      }

      function signOut() {
        dispatch({type: "LOGOUT"})
        antdNotification("success", "Thank you", "Thank you for using super learner, log back in t pickup where you left")
        window.location.href = "/entry/login"
      }

    return (
        <div className = "sideBar">
            <div className = "user_details">
                <div className = "user-row">
                    <Avatar className = "avatar" size={50} src= {data.user.profile_picture} /> {data.user.email}
                </div>
                <div className = "mem-lab">Memory</div>
                <div className = "user-row-short">
                    <Progress showInfo = {false} strokeColor={{'0%': '#91d5ff', '100%': '#003a8c', }} percent={data.disk.percentageUsed}/>
                </div>
                <div className = "mem-data">{data.isLoading ? "Analyzing memory usage..." : data.disk.percentageUsed + "% of storage exhausted"}</div>
            </div>
            <div onClick = {e => signOut()} className = "logout">
                Logout <img className = "log-out" src = {logout}/>
            </div>
            <div className = "lower-side">
                <div className = "sections">
                    <div onClick = {e => {moveAround("/dashboard")}} className = {setActive(1)}><img className = "img" src = {pro} />Projects</div>
                    <div onClick = {e => {moveAround("/models")}} className = {setActive(2)}><img className = "img" src = {models} />Models</div>
                    <div onClick = {e => {moveAround("/folders")}} className = {setActive(3)}><img className = "img" src = {fold} />Folders</div>
                    {/* <div onClick = {e => {moveAround("/processes")}} className = {setActive(4)}><img className = "img" src = {process} />Processes</div>
                    <div onClick = {e => {moveAround("/teams")}} className = {setActive(5)}><img className = "img" src = {team} />Teams</div> */}
                </div>
                <div>
                    {data.notifications.map((item, index) => (
                        <div className = {colorNotification(item)}>
                            {item.content}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default SideBar