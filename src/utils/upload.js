import React from 'react'
import { Upload, message, Button } from 'antd';

const uploadUrl = "https://folder-file.herokuapp.com/file/upload-one"


const settings = (props) => {
  return {
    name: 'document',
    accept: ".csv",
    action: uploadUrl,
    data: {folderId: props.fileMeta},
    headers: {
        token: JSON.parse(localStorage.getItem("token")),
      },
    files: {
      
    },
    
    onChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        props.updateFile(info.file.response)
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    file (){

    }
  }
};

function Uploader(props){
    return(
         <Upload {...settings(props)}>
    <Button>
      Click to Upload
    </Button>
  </Upload>
    );
}

export default Uploader;