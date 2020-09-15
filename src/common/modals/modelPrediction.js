import React, {useState, useEffect} from 'react'
import { Upload, message, Button, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Onefile from "../file"
import Uploader from '../../utils/upload'
import empty from '../../assets/images/nofile.png'
import folder from '../../assets/images/folder2.png'
import "../../styles/modals.css"
import { FolderGetWithHeaders, folderPostWithHeaders } from '../../utils/Externalcalls';
import { antdNotification } from '../misc';


function PredictionModal(props) {
    const initialState = {
        isLoading: true,
        files: [],
        folders: props.folders,
        newUpload: {},
        slected: {},
        uploadedFile: null,
        pontFolder: {},
        folderSelected: false,
        output: null,
        modelType: props.preSetModel.type,
        location: props.preSetModel.location,
        location1: props.preSetModel.location1,
        location2: props.preSetModel.location2,
        projectId: props.projectId,
        isloading: false,
        type: "prediction"
    };

    const [folderFiles, setfolderFiles] = useState([])

    const [data, setdata] = useState(initialState)


    useEffect(() => {
    }, [])

    function getFiles() {
        FolderGetWithHeaders(`file/all/${data.pontFolder.id}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(filesInFolder => {
            setdata({...data, files: filesInFolder.data.data, isloading: false})
        }).catch(err => {
            setdata({...data, isloading: false})
        })
    }

    function fileUploaded(newFile) {
        getFiles()
    }

    function getselectedLocation(file) {
        setdata({...data, slected: file, uploadedFile: file.location})
    }

    function styleselected(styleme) {
        if(data.pontFolder.id == styleme.id){
            var styleFolder = "one-folder-selected"
        }else{
            var styleFolder = "one-folder"
        }
        return styleFolder
    }

    function putpontFolder(selectedFold) {
        var newSelect = JSON.parse(JSON.stringify(selectedFold))
        setdata({...data, pontFolder: newSelect})
    }

    function showContent(){
        FolderGetWithHeaders(`file/all/${data.pontFolder.id}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(filesInFolder => {
            setdata({...data, isloading: false, folderSelected: true})
            setfolderFiles(filesInFolder.data.data)
        }).catch(err => {
            setdata({...data, isloading: false})
        })
        // setdata({...data, folderSelected: true})

    }

    function backFolder() {
        setdata({...data, folderSelected: false})
    }

    function handleChange(event) {
        setdata({
            ...data,
            [event.target.name]: event.target.value
          });
    }

    function createModel() {
        setdata({...data, isLoading: true})
        if(props.type == 1){
            folderPostWithHeaders("process/create_prediction", data, {"token": JSON.parse(localStorage.getItem("token"))}).then(projectCreated => {
                antdNotification("success", "Prediction Started", projectCreated.data.message)
                props.cancel()
            }).catch(error => {
                antdNotification("error", "Project Creation Failed", error.message)
                setdata({...data, showConfirm: false})
            })
        }else{
            folderPostWithHeaders("super/create_prediction", data, {"token": JSON.parse(localStorage.getItem("token"))}).then(projectCreated => {
                antdNotification("success", "Super prediction Started", projectCreated.data.message)
                props.cancel()
            }).catch(error => {
                antdNotification("error", "Pediction Creation Failed", error.message)
                setdata({...data, showConfirm: false})
            })
        }

    }

    return (
        <div className = "file-modal">
            <div className='file-modal-content'>
                {
                    !data.folderSelected ? 
                    <div>
                        <div className = "file-modal-title">Select File for prediction <div onClick = {props.cancel} className = "close-x">X</div></div>
                        <div className = "file-modal-inner-content">
                            {
                                data.folders.map((item, index) => (
                                    <div onClick = {() => putpontFolder(item)} className = {styleselected(item)}>
                                        <img src = {folder} />
                                        <div>
                                        {item.name}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div><button disabled = {data.isloading} onClick = {() => showContent()} className = "next-button">Next</button></div>
                        </div> :
                        <div>
                            <div className = "file-modal-title"><div onClick = {e => backFolder()} className = "back-link">back</div>Folder: {data.pontFolder.name}<div>{">" + data.slected.name}</div>
                            <div onClick = {props.cancel} className = "close-x">X</div></div>
                            <div className = "file-modal-inner-content">
                                {
                                    folderFiles.length < 1 ?
                                    <div className = "empty-folder">
                                        <img src = {empty} />
                                        <div>This folder is empty</div>
                                    </div> :
                                    <div className = "file-modal-body">
                                        {folderFiles.map((item, index) => (
                                            <Onefile file = {item} sendLocation = {getselectedLocation} selectedNeigbour = {data.slected.id}  />
                                        ))}
                                    </div>
                                }
                            </div>
                            <div className = "prediction-space">
                                <input name = "output" onChange = {e => handleChange(e)} className = "use-input" placeholder="enter output file name here" />
                            <button className = "use-button" onClick = {e => createModel()}>{data.isloading ? "loading..." : "Start"}</button>
                            </div>
                                </div>
                            }
                        </div>
        </div>
    )
}

export default PredictionModal
