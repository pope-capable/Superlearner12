import React, {useState, useEffect} from 'react'
import "../styles/common.css"
import { getWithHeaders } from '../utils/Externalcalls'

function OneTeam(props) {
        // initialize input identifiers
        const initialState = {
            isSubmitting: false
          };
    
        //   map identifiers into state
        const [data, setdata] = useState(initialState)

    useEffect(() => {
      }, [])

    return (
        <div className = "otc">
            <div className = "team-name">{props.team.team.name}</div>
            <div>{props.team.status}</div>
        </div>
    )
}

export default OneTeam
