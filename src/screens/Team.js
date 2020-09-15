import React, {useEffect, useState} from 'react'
import SideBar from '../common/SideBar'
import OneTeam from '../common/Team'
import "../styles/teams.css"
import { getWithHeaders } from '../utils/Externalcalls';
import {List} from 'antd'
import loadIcon from "../assets/images/load.gif"


function Teams() {
    const user = JSON.parse(localStorage.getItem("user"))

    // initialize state
    const initialState = {
        user: user,
        isLoading: false,
        teams: [],
        notifications: [{type: "team", content: "You accepted invitation to new amstterdam team"}],

    };

    const [data, setdata] = useState(initialState)

    useEffect(() => {
        setdata({...data, isLoading: true})
        getWithHeaders(`user-teams/get-joined/${data.user.id}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(joinedTeams => {
            setdata({...data, teams: joinedTeams.data.data, isLoading: false})
        }).catch(error => {

        })
      }, [])

    return (
        <div className = "page">
            <SideBar active = {5} notifications = {data.notifications}/>
            <div className = "team-view">
                <div className = "view-header">
                    <div>Teams</div>
                </div>
                    {
                        data.isLoading ?
                        <div className = "loader-container">
                            <img className = "loader-image" src = {loadIcon} />
                        </div> :
                        <div>
                            <List
                                footer={null}
                                bordered={false}
                                dataSource={data.teams}
                                renderItem={item => (
                                    <List.Item>
                                        <OneTeam team = {item} />
                                    </List.Item>
                                )}
                            />
                        </div>
                    }
            </div>
        </div>
    )
}

export default Teams
