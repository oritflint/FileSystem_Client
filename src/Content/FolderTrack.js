import folderIcon from '../img/folderIcon.svg'
// import './FolderTrack.css';


function FolderTrack(props){

    const folderName = props.folderName
    const currentPath = props.currentPath
    
    const changePath =()=>{
        props.setCurrentPath(currentPath + folderName + "/")
    }
    return(
        <div className="folderTrack" onDoubleClick={changePath}> 
            <div className="folderIcon"><img src={folderIcon} alt="" /></div>
            <div className="folderName">{props.folderName.length>20? props.folderName.substring(0,20)+'...': props.folderName}</div> 
        </div>
    )
}

export default FolderTrack