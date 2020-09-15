import React, { useState, useEffect } from 'react'
import info from '../assets/images/info.png'
import file from '../assets/images/file.png'
import gruid from '../assets/images/gruid.png'
import { Radio } from 'antd';
import { FolderGetWithHeaders, folderPostWithHeaders } from '../utils/Externalcalls';
import { antdNotification } from './misc';
import FolderContent from '../common/modals/folderContent';
import ModelListSelect from '../common/modals/modelSelectSuper';
import ConfirmModal from './modals/simpleConfirm';
import PredictionModal from "./modals/modelPrediction"
import {Switch, Select} from 'antd'

function SuperlearnerTabView(props) {
    const initialState = {
        misingDataPercentage: 0,
        openFolder: false,
        uploads: [],
        metaModel: [{name: "Logistic regression", value: 1}, {name: "Extra tree", value: 2}],
        showModalSelect: false,
        selectedMeta: null,
        compositeModels: [],
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
        type: "Superlearner",
        showPrediction: false,
        slectedModel: null
      };

    //   const [modelPredictiondata, setmodelPredictiondata] = useState()

    const [models, setmodels] = useState([])

    const [superModels, setsuperModels] = useState([])


          //   map identifiers into state
    const [data, setdata] = useState(initialState)

    const { Option } = Select;


    useEffect(() => {
        getFolders()
        getModels()
        getSuperModels()
    }, [])

    function selectFile(dot) {
        setdata({...data, useFile: dot, location: dot.location})
    }

    function closeModal(){
        setdata({...data, openFolder: false, showConfirm: false})
    }

    function closeModel(){
        setdata({...data, showModalSelect: false, showConfirm: false})
    }

    function closePredictionModal(){
        setdata({...data, showPrediction: false})
    }

    function openUploads() {
        setdata({...data, openFolder: true})
    }

    function openmodels() {
        setdata({...data, showModalSelect: true})
    }

    function CompositeModels(modelsArray) {
        setdata({...data, compositeModels: modelsArray})
    }

    function getFolders() {
        FolderGetWithHeaders(`folders/project/${props.project}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(foldersCreated => {
            setdata({...data, uploads: foldersCreated.data.data})
        }).catch(error => {
            antdNotification("error", "Fetch Failed", "Error fetching folders, please ensure a stable connection and reload screen")
        })
    }

    function createModel() {
        folderPostWithHeaders("process/super-create", data, {"token": JSON.parse(localStorage.getItem("token"))}).then(projectCreated => {
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

    function changeFSOption(event) {
        setdata({...data, selectedMeta: event.target.value})
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

    function getSuperModels() {
        FolderGetWithHeaders(`super/created/${props.project}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(superlearvercreated => {
            setsuperModels(superlearvercreated.data.data)
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
            Switch to created super-learner models <Switch defaultChecked = {false} onChange={onChange} />
            </div>
            {
                data.showCreated ?
                <div className = "dpp-view">
                    {
                        superModels.map((item, index) => (
                            <div className = "ptq">
                                <div className = "model-info">
                                    <div>
                                        {item.name}
                                    </div>
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
                data.showPrediction ? <PredictionModal projectId = {data.projectId} type = {2} preSetModel = {data.slectedModel} folders = {data.uploads} cancel = {() => closePredictionModal()} /> : ""
            }
        </div> : 
                <div className = "dpp-view">
            <div className = "dpp-row">
                <div className = "dpp-sf">
                    <div className = "activity-title-mid"> 
                        <span className="input-tag">Output name</span>
                        <input onChange = {e => handleChange(e)} name = "output" className = "custom-input" prefix = "Runner" />
                    </div>
                    <div className = "activity-title-mid"> 
                        <span className="input-tag">StudyId</span>
                        <input onChange = {e => handleChange(e)} name = "studyId" className = "custom-input" prefix = "Runner" />
                    </div>
                    <div className = "activity-title-mid"> 
                        <span className="input-tag">OutcomeId</span>
                        <input onChange = {e => handleChange(e)} name = "outcomeId" className = "custom-input" prefix = "Runner" />
                    </div>
                </div>
            </div>
            <div>
            <img onClick = {e => openUploads()} className = "cloud-image" src = {file} /> select file from upload folders<br/>
                {
                    data.location ? 
                    <div>                
                        File selected: {data.useFile.name}
                    </div> : ""
                }
            </div>
            <div>
                <img onClick = {e => openmodels()} className = "cloud-image" src = {gruid} /> select component models
                    <div>{data.compositeModels.length} Models selected</div>
            </div>
            <div className = "dpp-row">
                <div className = "dpp-sf">
                Select Meta model option
                    <div className = "activity-title-mid"> 
                        <Radio.Group onChange = {e => changeFSOption(e)} value={data.selectedMeta}>
                            {
                                data.metaModel.map((item, index) => (
                                <div>
                                    <Radio value={item.value} />
                                    {item.name}
                                </div>
                                ))
                            }
                        </Radio.Group>
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
                        {
                data.showModalSelect ? <ModelListSelect projectId = {data.projectId} passCmodels = {CompositeModels} models = {models} folders = {data.uploads} cancel = {() => closeModel()} /> : ""
            }
        </div>            }
        </div>
    )
}

export default SuperlearnerTabView