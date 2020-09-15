import React, { useState, useEffect } from 'react'
import info from '../assets/images/info.png'
import file from '../assets/images/file.png'
import { Radio } from 'antd';
import { FolderGetWithHeaders, folderPostWithHeaders } from '../utils/Externalcalls';
import { antdNotification } from './misc';
import FolderContent from '../common/modals/folderContent';
import ConfirmModal from './modals/simpleConfirm';
import PredictionModal from "./modals/modelPrediction"
import {Switch, Select} from 'antd'

function ModelsTabView(props) {
    const initialState = {
        misingDataPercentage: 0,
        openFolder: false,
        uploads: [],
        useFile: {},
        location: "",
        studyId: "",
        outcomeId: "",
        outcome: "",
        showConfirm: false,
        showCreated: false,
        projectId: props.project,
        value: null,
        models: [],
        type: "model",
        showPrediction: false,
        slectedModel: null
      };

    //   const [modelPredictiondata, setmodelPredictiondata] = useState()

      const [models, setmodels] = useState([])

          //   map identifiers into state
    const [data, setdata] = useState(initialState)

    const { Option } = Select;


    useEffect(() => {
        getFolders()
        getModels()
    }, [])

    function selectFile(dot) {
        setdata({...data, useFile: dot, location: dot.location})
    }

    function closeModal(){
        setdata({...data, openFolder: false, showConfirm: false})
    }

    function closePredictionModal(){
        setdata({...data, showPrediction: false})
    }

    function openUploads() {
        setdata({...data, openFolder: true})
    }

    function getFolders() {
        FolderGetWithHeaders(`folders/project/${props.project}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(foldersCreated => {
            setdata({...data, uploads: foldersCreated.data.data})
        }).catch(error => {
            antdNotification("error", "Fetch Failed", "Error fetching folders, please ensure a stable connection and reload screen")
        })
    }

    function createModel() {
        folderPostWithHeaders("process/create", data, {"token": JSON.parse(localStorage.getItem("token"))}).then(projectCreated => {
            antdNotification("success", "Success", projectCreated.data.message)
            window.location.reload()
        }).catch(error => {
            antdNotification("error", "Project Creation Failed", error.message)
            setdata({...data, showConfirm: false})
        })
    }

    function handleChange(event) {
        setdata({
            ...data,
            [event.target.name]: event.target.value
          });
    }

    function handleSelectChange(event) {
        setdata({
            ...data,
            value: event
          });
    }

    function confirmCreation() {
        setdata({...data, showConfirm: true})
    }

    function onChange(checked) {
        setdata({...data, showCreated: checked})
    }

    function getModels() {
        FolderGetWithHeaders(`model/get-all/${props.project}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(modelsCreated => {
            setmodels(modelsCreated.data.data)
        }).catch(error => {
            antdNotification("error", "Fetch Failed", "Error fetching folders, please ensure a stable connection and reload screen")
        })
    }

    function showPrediction(useModel) {
        setdata({...data, showPrediction: true, slectedModel: useModel})
    }


    return (
        <div>
            <div className = "switch-model-view">
            Switch to created models <Switch defaultChecked = {false} onChange={onChange} />
            </div>
            {
                data.showCreated ?
                <div className = "dpp-view">
                    {
                        models.map((item, index) => (
                            <div className = "ptq">
                                <div className = "model-info">
                                    <div>
                                        {item.name}
                                    </div>
                                    <div className = "reason">{item.type}</div>
                                </div>
                                <div>
                                    <button className = "predict-button" onClick = {() => showPrediction(item)}>
                                        Predict
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                                {
                data.showPrediction ? <PredictionModal projectId = {data.projectId} type = {1} preSetModel = {data.slectedModel} folders = {data.uploads} cancel = {() => closePredictionModal()} /> : ""
            }
        </div> : 
                <div className = "dpp-view">
            <div className = "dpp-row">
                <div className = "dpp-sf">
                    <div className = "activity-title-mid"> 
                        <span className="input-tag">Output name</span>
                        <input onChange = {e => handleChange(e)} name = "output" className = "custom-input" prefix = "Runner" />
                    </div>
                    <img onClick = {e => openUploads()} className = "cloud-image" src = {file} /> select file from upload folders
                </div>
            </div>
            <div>
                {
                    data.location ? 
                    <div>                
                        File selected: {data.useFile.name}
                    </div> : ""
                }
            </div>
            <div className = "dpp-row">
                <div className = "dpp-sf">
                    <div className = "activity-title-mid"> 
                        <Select defaultValue="Select Model Script" onChange = {handleSelectChange} name = "value" style={{ width: 600 }} >
                            <Option value = {11}>Linear SVM</Option>
                            <Option value={12}>KNN</Option>
                            <Option value={13}>Decision Tree</Option>
                            <Option value={14}>MixedNB</Option>
                            <Option value={15}>MLP</Option>
                            <Option value={16}>Random Forest</Option>
                            <Option value={17}>RBFSVM</Option>
                        </Select>
                    </div>
                    <div className = "activity-title-mid"> 
                        <span className="input-tag">Study Id</span>
                        <input onChange = {e => handleChange(e)} name = "studyId" className = "custom-input" prefix = "Runner" />
                    </div>
                    <div className = "activity-title-mid"> 
                        <span className="input-tag">Outcome ID</span>
                        <input onChange = {e => handleChange(e)} name = "outcomeId" className = "custom-input" prefix = "Runner" />
                    </div>
                </div>
            </div>
            <div className = "dpp-row">
                <button onClick = {e => confirmCreation()} className = "proceed-button-2">Next</button>
            </div>
            {
                data.openFolder ? <FolderContent select = {selectFile} folders = {data.uploads} cancel = {() => closeModal()} /> : ""
            }
            {
                data.showConfirm ? <ConfirmModal cancel = {() => closeModal()} confirm = {() => createModel()} message = {"Confirm project creation, this will affect your available disk space as new file directories will be created"}/> : ""
            }
        </div>            }
        </div>
    )
}

export default ModelsTabView