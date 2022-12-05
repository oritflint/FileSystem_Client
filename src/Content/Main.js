import axios from 'axios';
import FolderTrack from './FolderTrack'
import FileTrack from './FileTrack'
import { useState, useRef, useEffect, useContext } from "react"
// import {BsCloudUpload} from 'react-icons/bs'
import myCloud from '../img/myCloud.svg'
import addFolder from '../img/addFolder.svg'
import addFile from '../img/addFile.svg'
import search from '../img/search.svg'
import {Files} from '../Context/AppContext'


function Main({setIsDisplayPopup}){

    const folderName = useRef() //for new folder to create
    const message = useRef()

    const setMessage =useContext(Files)[1]
    const [currentPath,setCurrentPath]=useState('root/')   //where we are now
    const [state,setState] = useState({fileName: ''})   //for new file to upload
    const [isDisplayUpload,setIsDisplayUpload] =useState(false) //popup to show when click the uploade file button
    const [isDisplayAddFolder,setIsDisplayAddFolder] =useState(false)   //popup to show when click the create folder button
    const [arrFiles,setArrFiles]=useState([])   //current folder files
    const [arrFolder,setArrFolder]=useState([])   //current folder files
    const [refreshPage,setRefreshPage]=useState(false)   //current folder files


    //ON PAGE_LOAD:
    //fetch all './root' files
    useEffect(()=>{
        console.log("MAIN-MSIN-MAIN currentPath:", currentPath)
         axios.get(`http://localhost:4000/api/?path=${currentPath}`)
        .then(res => {
            const fullArr = res.data
            console.log(fullArr)
            setArrFiles(fullArr.filter(e => e.type.includes("File")))
            setArrFolder(fullArr.filter(e => e.type.includes("Dir")))
        })   
    },[currentPath, refreshPage])


    //ON UPLOAD_FILE
    //save file in current folder
    const onUploadFile=(e)=> {
        e.preventDefault()
        const formData = new FormData()
        formData.append('userFile', state.fileName)
        formData.append('filePath', currentPath)
        const res = axios.post(`http://localhost:4000/api/upload/?path=${currentPath}`, formData, {
        }).then(res => {
        console.log("🚀 ~ file: Main.js ~ line 51 ~ onUploadFile ~ res.data", res.data)
            if(res.data.status==300){
                message.current.value = res.data.statusText
            }
            else{
                setRefreshPage(!refreshPage)
                setIsDisplayUpload(false)  
            }          
        })


    }

    //ON CREATE_FOLDER
    //add new named sub-folder in currenr place
    const createFolder=(e)=> {
        debugger
        const newDir = folderName.current.value
        let resData =''
        //e.preventDefault()
        axios.post("http://localhost:4000/api/newDir/",{
            currentPath: './'+currentPath, 
            newDir: newDir
        }).then(res => {
            resData = res.data
            console.log("res in:",resData)
            setIsDisplayAddFolder(false)

            if(resData.status==300){
                setMessage(resData.statusText)
                console.log(resData.statusText)
            }
            else{
                setCurrentPath(currentPath + newDir + '/')
            }
        })

    }

    const onFileChange=(e) =>{
        setState({ fileName: e.target.files[0] })
    }

    const addFolderComponent=()=>{
        setIsDisplayAddFolder(true)
    }

    const displayUploadComponent=()=>{
        setIsDisplayUpload(true)
    }

    //למנוע 
    //e.stopPropagation()
    //

    const arrPath = currentPath.split('/')
    arrPath.length=arrPath.length-1
    const goToFolder = ()=>{
        if(currentPath!= 'root/'){
            const lasSleshtIndex = currentPath.substring(0, currentPath.length-1).lastIndexOf('/')
            const parentFolder = currentPath.substring(0, lasSleshtIndex)
            setCurrentPath(parentFolder+'/')
            }
        }
    return(
        <div className="main" > 
            <div className="buttons">
                <button><img src={myCloud} alt="" />Your drive</button> 
                <button onClick={addFolderComponent}><img src={addFolder} alt="" />New folder</button> 
                <button onClick={displayUploadComponent}><img src={addFile} alt="" />New upload</button> 
                <div className='searchSection'><input type="text" placeholder='search files'></input><div className='srcIcon'><img src={search} alt="" /></div></div> 
            </div>  
            <div className='Title'>
                <div className=''>Browse files and folders</div>
                <div className='breadcrumb'>
                    <p>
                        <i className="zmdi zmdi-folder-outline"></i> ./{arrPath.map((folder,i)=>{
                            return <label key={i} className='folderLink' onClick={goToFolder}>{folder}/</label>
                        })}
                        <i onClick={goToFolder} alt="back to folder" className="zmdi zmdi-chevron-up"></i>
                    </p>
                </div>
            </div>
            {isDisplayAddFolder && <div className="popup-bg">       
            <div className="popup-content">
                <div className='closePopupWin'>
                    <i className="zmdi zmdi-close-circle-o" onClick={()=>setIsDisplayAddFolder(false)}></i>
                </div>    
                <div>
                    <p>folder name:</p> 
                    <input type="text" ref={folderName}></input>
                </div>
                <div className='popupButtons'>
                    <button onClick={createFolder}>Create</button>
                    <button onClick={()=>setIsDisplayAddFolder(false)}>Cancel</button>
                </div> 
            </div>
        </div>}
{/* <BsCloudUpload /> */}
            {isDisplayUpload && <div className="popup-bg">
                <div className="popup-content">
                    <div  className='closePopupWin'>
                        <i className="zmdi zmdi-close-circle-o zmdi-hc-2x" onClick={()=>setIsDisplayUpload(false)}></i>
                    </div>
                    <form className='form-frame' onSubmit={onUploadFile}>
                        <div className="form-group">
                            <input type="file" onChange={onFileChange} />
                        </div>
                        <div className='popupButtons'>
                        <button className="btn btn-primary" type="submit">Upload file</button>
                        <button className="btn btn-primary" onClick={()=>setIsDisplayUpload(false)}>Cancel</button>
                            
                        </div>
                            <input className="popup-message" type="text" width={300} ref={message}></input>
                        
                    </form>
                </div>
            </div>}
            {/* var fileName = 'my file(2).txt';
var header = "Content-Disposition: attachment; filename*=UTF-8''" 
             + encodeRFC5987ValueChars(fileName); */}

            <div className="userContent">
                {arrFolder.length > 0?
                    arrFolder.map((element, i)=>{
                    return <FolderTrack key={i} currentPath={currentPath} setCurrentPath={setCurrentPath} folderName={element.name} />
                }): arrFiles.length === 0? <div className="folderTrack">
                    <div className="folderName">{"Folder is empty"}</div>
                    </div> :""}
            </div> 
            <div className="userContent">
                {arrFiles.length > 0?
                    arrFiles.map((element,i)=>{
                    return <FileTrack key={i} currentPath={currentPath} file={element} showItemMenu={false} />
                }): ''}
            </div> 
     
        </div>
    )
}

export default Main