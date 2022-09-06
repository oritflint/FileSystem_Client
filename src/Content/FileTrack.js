
// import './FileTrack.css';
import axios from 'axios';
import { useState, useContext, useRef, useEffect} from "react"
import pdf from '../img/PDFicon.svg'
import png from '../img/IMGicon.svg'
import doc from '../img/DOCicon.svg'
import menu from '../img/menu.svg'
import Navlink from 'react-bootstrap/NavLink'

function FileTrack(props){

    const [isDisplayConfirmDownload, setIsDisplayConfirmDownload] = useState(false)
    const [isDisplayConfirmDelete, setIsDisplayConfirmDelete] = useState(false)
    const [showItemMenu, setShowItemMenu] = useState(false)
    const file = props.file
    const filename = file.name
    const extension = file.extension
    const birthtime = file.birthtime
    const currentPath = props.currentPath
    let fileType = png
    const fileToDownload=`./${currentPath}`
    const btnRef=useRef()
    const itemHover=()=>{

    }

    //ON DELETE_FILE
    //
    const deleteFile=()=> {
        const filePath = filename
        //e.preventDefault()
        axios.post("http://localhost:4000/api/delFile/",{
            currentFile: currentPath + filePath, 
        }).then(res => {
            console.log(res)
        })
        
        props.setRefreshPage(!props.refreshPage)
        setIsDisplayConfirmDelete(false)
    }

    //ON DOUNLOAD_FILE
    //
    function downloadFile(e){
        //debugger
        //e.preventDefault()
        axios.get("http://localhost:4000/api/download?filePath="+e.currentTarget.href+"&fileName="+filename)
        .then(res => {
            console.log(res)
        })
        setIsDisplayConfirmDownload(false)
    }

    switch(extension){
        case '.pdf': 
            fileType = pdf;
            break;
        case '.img': 
            fileType = png;
            break;
        case '.doc': 
        case '.docx': 
            fileType = doc;
            break;
        default:
            fileType = png;
    }
    
    useEffect(()=>{
        const closeMenu=e=>{
            if(e.path[0]!=btnRef.current)
                setShowItemMenu(false)
        };

    document.body.addEventListener('click',closeMenu)
    return()=>document.body.removeEventListener('click',closeMenu)

    },[])

    return(
        <div className="folderTrack" role="navigation"> 
        <div className="menuitem">
        <i className="zmdi zmdi-more zmdi-hc-2x" ref={btnRef} onClick={(e)=>{
                setShowItemMenu(!showItemMenu); 
                e.target.parentNode.parentNode.className="folderTrack fullOpacity"
                } 
            } ></i>
            {showItemMenu && 
            <div aria-labelledby="navbarDropdown" className='menuItemBG'>
                <a className="dropdown-item" href={fileToDownload} onClick={(e)=>{downloadFile(e)}}
                    onMouseOver={(e)=>{e.target.className="dropdown-item-hover"; e.target.children[0].className="zmdi zmdi-download"}} 
                    onMouseOut={(e)=>{e.target.className="dropdown-item"; e.target.children[0].className="zmdi zmdi-download"}} 
                    download>
                    <i className="zmdi zmdi-download"></i>Download
                </a>
                <div className="dropdown-item" 
                    onMouseOver={(e)=>{e.target.className="dropdown-item-hover"; e.target.children[0].className="zmdi zmdi-delete"}} 
                    onMouseOut={(e)=>{e.target.className="dropdown-item"; e.target.children[0].className="zmdi zmdi-delete"}} 
                    onClick={()=>setIsDisplayConfirmDelete(true)}>
                    <i className="zmdi zmdi-delete"></i>Delete
                </div>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">Something else here</a>
            </div>}
         </div>


            <div className="folderIcon"> <img width={30} height={30} src={fileType} alt="" /> </div>
            <div className="folderName">{filename.length>20? filename.substring(0,20)+'...': filename} </div>       
            <div className="folderCreated">created: {birthtime.substring(0,10)} </div>       
            {/* <div className="folderMenu">
                <i className="zmdi zmdi-delete "></i>
                <a className="zmdi zmdi-cloud-download"></a>
            </div>   */}

            {isDisplayConfirmDelete && <div className="popup-bg">
                <div className="popup-content">
                    <div className='closePopupWin'>
                        <i className="zmdi zmdi-close-circle-o zmdi-hc-2x" onClick={()=>setIsDisplayConfirmDelete(false)}></i>
                    </div>
                    <div>
                        <p>Are you sure you want to delete {filename}?</p>
                    </div>
                    <div className='popupButtons'>
                        <button onClick={deleteFile}>Confirm</button>
                        <button onClick={()=>setIsDisplayConfirmDelete(false)}>cancel</button>
                    </div>
                </div>
            </div>}         
{/* 
            {isDisplayConfirmDownload && <div className="popup-bg">
                <div className="popup-content">
                    <i className="zmdi zmdi-close-circle-o" onClick={()=>setIsDisplayConfirmDownload(false)}></i>
                    <p></p>
                    <button onClick={downloadFile}>Confirm</button>
                </div>
            </div>}          */}
        </div>
    )
}

export default FileTrack