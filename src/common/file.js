
import React, { useState, useEffect } from 'react'
import jsonIcon from "../assets/images/json.png"
import excelIcon from "../assets/images/excel.png"
import pdfIcon from "../assets/images/pdf.png"
import csvIcon from "../assets/images/csv.png"
import unknownIcon from "../assets/images/unknown.png"
import download from "../assets/images/down.png"
import $ from 'jquery';
import "../styles/file.css"


function Onefile(props) {
  const initialState = {
    selected: {},
  };


    useEffect(() => {
    }, [])
    
    const [data, setdata] = useState(initialState)

    function fittingIcon(data) {
        if(data == "json"){
            var bestIcon = jsonIcon
        }else if(data == 'csv'){
            var bestIcon = csvIcon
        }else if(data == 'xlsx'){
            var bestIcon = excelIcon
        }else if(data == "pdf"){
            var bestIcon = pdfIcon
        }else{
            var bestIcon = unknownIcon
        }
        return bestIcon
    }

  function fittingIcon(data) {
    if (data == "json") {
      var bestIcon = jsonIcon;
    } else if (data == "csv") {
      var bestIcon = excelIcon;
    } else if (data == "pdf") {
      var bestIcon = pdfIcon;
    } else {
      var bestIcon = unknownIcon;
    }
    return bestIcon;
  }

  function Download(url) {
    var proxyUrl = "https://cors-anywhere.herokuapp.com/";
    document.getElementById("my_iframe").src = url;
  }

  function clickedFile(file) {
    setdata({ ...data, selected: file });
    props.sendLocation(file);
  }

  function differSelected(fileId) {
    if (props.selectedNeigbour == fileId) {
      var useClass = "file-details-2";
    } else {
      var useClass = "file-details";
    }
    return useClass;
  }

  return (
    <div className="one-file">
      <div className={differSelected(props.file.id)}>{props.file.name}</div>
      <div className="file-img">
        <img
          onClick={(e) => clickedFile(props.file)}
          src={fittingIcon(props.file.type)}
        />
      </div>
      <div
        onClick={(e) => {
          Download(props.file.location);
        }}
      >
        <img className="file-download" src={download} />
      </div>
      <iframe id="my_iframe" style={{ display: "none" }}></iframe>
    </div>
  );
}

export default Onefile;
