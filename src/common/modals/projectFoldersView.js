import React, {useState, useEffect} from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Onefile from "../file"
import Uploader from '../../utils/upload'
import empty from '../../assets/images/nofile.png'
import folder from '../../assets/images/folder2.png'
import "../../styles/modals.css"
import { FolderGetWithHeaders } from '../../utils/Externalcalls';
import loadIcon from "../../assets/images/load.gif"



function ProjectFolderContent(props) {
    const initialState = {
        isLoading: true,
        files: [],
        folders: [],
        newUpload: {},
        slected: {},
        pontFolder: {},
        folderSelected: false,
        openProject: props.project
    };

    const [folderFiles, setfolderFiles] = useState([])

    const [data, setdata] = useState(initialState)


    useEffect(() => {
        getFolders()
    }, [])
    
    function getFolders() {
        FolderGetWithHeaders(`folders/project/${data.openProject}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(filesInFolder => {
            setdata({...data, folders: filesInFolder.data.data, isloading: false})
        }).catch(err => {
            setdata({...data, isloading: false})
        })
    }

    function getFiles() {
        FolderGetWithHeaders(`file/all/${data.pontFolder.id}`, {"token": JSON.parse(localStorage.getItem("token"))}).then(filesInFolder => {
            setfolderFiles(filesInFolder.data.data)
        }).catch(err => {
            setdata({...data, isloading: false})
        })
    }

    function fileUploaded(newFile) {
        getFiles()
    }

    function getselectedLocation(location) {
        setdata({...data, slected: location})
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
        // getFiles()
    }

    function showContent(){
        // setdata({...data, isloading: true})
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

    return (
        <div className = "file-modal">
            <div className='file-modal-content'>
            {
                data.folders.length < 1 ?
                <div className = "loader-container">
                    <img className = "loader-image" src = {loadIcon} />
                </div> :
                <div>
                {
                    !data.folderSelected ? 
                    <div>
                        <div className = "file-modal-title">Select Folder <div onClick = {props.cancel} className = "close-x">X</div></div>
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
                            {data.pontFolder.name == "Uploads" ?
                            <div className = "upload-button">
                                <Uploader fileMeta = {data.pontFolder.id} updateFile = {fileUploaded} />
                            </div> : 
                            <div></div>}
                                </div>
                            }
                            </div>
}
                        </div>
        </div>
    )
}

export default ProjectFolderContent
