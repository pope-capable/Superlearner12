import React, { useState, useEffect } from 'react'
import info from '../assets/images/info.png'
import file from '../assets/images/file.png'
import { Radio } from 'antd';
import { FolderGetWithHeaders, folderPostWithHeaders } from '../utils/Externalcalls';
import { antdNotification } from './misc';
import FolderContent from '../common/modals/folderContent';
import ConfirmModal from './modals/simpleConfirm'

function DataPP(props) {

    const initialState = {
        actionSelected: "",
        first: false,
        actions: [{name: "Missing Data", value: 1}, {name: "Fix Outliners", value: 2}, {name: "Feature Selection", value: 3}],
        fsOptions: [{name: "RFA", value: 1}, {name: "BORUTA", value: 2}],
        isSubmitting: false,
        value: 0,
        fsValue: 0,
        uploads: null,
        openFolder: false,
        useFile: {},
        location: null,
        sd: 1,
        output: null,
        showConfirm: false,
        type: "Data-pp",
        projectId: props.project,
        act_column: null,
        outc: null,
        misingDataPercentage: 0
      };

    useEffect(() => {
        getFolders()
    }, [])

    const [data, setdata] = useState(initialState)

    // change action function
    function changeAction(event) {
        setdata({...data, value: event.target.value})
    }

    function changeFSOption(event) {
        setdata({...data, fsValue: event.target.value})
    }
    // open uploads folder for selection
    function openUploads() {
        setdata({...data, openFolder: true})
    }

    function closeModal(){
        setdata({...data, openFolder: false, showConfirm: false})
    }

    function selectFile(dot) {
        setdata({...data, useFile: dot, location: dot.location})
    }

    function getFolders() {
        FolderGetWithHeaders(`folders/project/${props.project}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(foldersCreated => {
            setdata({...data, uploads: foldersCreated.data.data})
        }).catch(error => {
            antdNotification("error", "Fetch Failed", "Error fetching folders, please ensure a stable connection and reload screen")
        })
    }

    function changeSD(direction) {
        if(direction == "-" && data.sd > 0){
            setdata({...data, sd: data.sd - 1})
        }
        if(direction == "+" && data.sd < 10){
            setdata({...data, sd: data.sd + 1})
        }
    }

    function changeMD(direction) {
        if(direction == "-" && data.misingDataPercentage > 0){
            setdata({...data, misingDataPercentage: data.misingDataPercentage - 5})
        }
        if(direction == "+" && data.misingDataPercentage < 100){
            setdata({...data, misingDataPercentage: data.misingDataPercentage + 5})
        }
    }

    function manualMDchange(event) {
        if(event.target.value < 101 && event.target.value > -1){
            setdata({...data, misingDataPercentage: event.target.value})
        }else{
            setdata({...data, misingDataPercentage: 0})
        }
    }

    function confirmCreation() {
        setdata({...data, showConfirm: true})
    }

    function handleChange(event) {
        setdata({
            ...data,
            [event.target.name]: event.target.value
          });
    }

    function createProcess() {
        folderPostWithHeaders("process/create", data, {"token": JSON.parse(localStorage.getItem("token"))}).then(projectCreated => {
            antdNotification("success", "Success", projectCreated.data.message)
            window.location.reload()
        }).catch(error => {
            antdNotification("error", "Project Creation Failed", error.message)
            setdata({...data, showConfirm: false})
        })
    }

    // this function adds the final data entry section to the data pre-processing screen
    function finalSection(lastStep) {
        if(lastStep == 2 && data.location){
            var lastData =
            <div className = "dpp-sd">
                <div>Arrange Standard Deviation</div>
                <div className = "dpp-pom">
                    <div className = "dpp-roll">
                    <div onClick = {e => changeSD("-")} className = "neg-sd">-</div>
                    <div className = "display-sd">{data.sd}</div>
                    <div onClick = {e => changeSD("+")} className = "pos-sd">+</div>
                    </div>
                </div>
                <div className = "dpp-row">
                    <button onClick = {e => confirmCreation()} className = "proceed-button-2">Next</button>
                </div>
            </div>
        }else if(lastStep == 3 && data.location){
            var lastData =
            <div className = "dpp-sd">
                Pick Feature Selection Method 
                <Radio.Group onChange = {e => changeFSOption(e)} value={data.fsValue}>
                    {
                        data.fsOptions.map((item, index) => (
                        <div>
                            <Radio value={item.value} />
                            {item.name}
                        </div>
                        ))
                    }
                </Radio.Group>
                <div className = "activity-title-mid"> 
                    <span class="input-tag">Study/Index Column</span>
                    <input name = "act_column" onChange = {e => handleChange(e)} className = "custom-input" prefix = "Runner" />
                </div>
                <div className = "activity-title-mid"> 
                    <span class="input-tag">Outcome Name</span>
                    <input name = "outc" onChange = {e => handleChange(e)} className = "custom-input" prefix = "Runner" />
                </div>
                <div className = "dpp-row">
                    <button onClick = {e => confirmCreation()} className = "proceed-button-2">Next</button>
                </div>
            </div>
        }else if(lastStep == 1 && data.location){
            var lastData =
            <div className = "dpp-sd">
                <div>Remove missing data row Above</div>
                <div className = "dpp-pom">
                    <div className = "dpp-roll">
                    <div onClick = {e => changeMD("-")} className = "neg-sd">-</div>
                    <input onChange = {e => manualMDchange(e)} value = {data.misingDataPercentage} className = "display-sd"/>
                    <div onClick = {e => changeMD("+")} className = "pos-sd">+</div>
                    </div>
                </div>
                <div className = "dpp-row">
                    <button onClick = {e => confirmCreation()} className = "proceed-button-2">Next</button>
                </div>
            </div>
        }
        return lastData
    }

    return(
        <div className = "dpp-view">
            <div className = "dpp-actions">
                {
                    data.actions.map((item, index) => (
                    <div className = "dpp-action">
                        <Radio.Group onChange = {e => changeAction(e)} value={data.value}>
                        <Radio value={item.value} />
                        {item.name}
                        <img src = {info} className = "dpp-action-img"/>
                        </Radio.Group>
                    </div>
                    ))
                }
            </div>
            <div className = "dpp-row">
                {data.value > 0 ?
                <div className = "dpp-sf">
                    <div className = "activity-title-mid"> 
                        <span className="input-tag">Output name</span>
                        <input name = "output" onChange = {e => handleChange(e)} className = "custom-input" prefix = "Runner" />
                    </div>
                    <img onClick = {e => openUploads()} className = "cloud-image" src = {file} /> select file from upload folders
                </div>: 
                ""}
            </div>
            <div>
                {
                    data.location ? 
                    <div>                
                        File selected: {data.useFile.name}
                    </div> : ""
                }
            </div>
            <div>
                {
                    finalSection(data.value)
                }
            </div>
            {
                data.openFolder ? <FolderContent select = {selectFile} folders = {data.uploads} cancel = {() => closeModal()} /> : ""
            }
            {
                data.showConfirm ? <ConfirmModal cancel = {() => closeModal()} confirm = {() => createProcess()} message = {"Confirm project creation, this will affect your available disk space as new file directories will be created"} /> : ""
            }
        </div>
    )
}

export default DataPP