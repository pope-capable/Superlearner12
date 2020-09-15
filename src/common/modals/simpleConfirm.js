import React, {useState, useEffect} from 'react'
import image from "../../assets/images/confirm3.png"
import "../../styles/modals.css"


function SimpleConfirm(props) {
    const initialState = {
        isLoading: false
    };

    const [data, setdata] = useState(initialState)

    function makeRequest() {
        setdata({...data, isLoading: true})
        props.confirm()
    }

    useEffect(() => {
    }, [])


    return (
        <div className = "modal">
            <div className='modal-content'>
                <div className = "modal-header">
                    <div className = "modal-title"><img src = {image} className = "modal-image" />Confirm action</div>
                    <div className = "close-x">X</div>
                </div>
                <div className = "modal-message">
                    {props.message}
                </div>
                <div className = "actions">
                    <button onClick = {props.cancel} className = "cancel">Cancel</button>
                    <button disabled = {data.isLoading} onClick = {e => makeRequest()} className = "confirm">Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default SimpleConfirm
