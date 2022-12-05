
import './Layout.css';
// import '../material-design-iconic-font/css/material-design-iconic-font.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import { useState } from 'react'
// import SongList from './content/SongList';
// import SongDetail from './content/SongDetail'
import Header from './Header'
import Main from './Main'
import {Files} from '../Context/AppContext'
import { useState } from 'react';
// import Popup from './Popup'


function Layout(props){
    const [message, setMessage]= useState('')
    //  const [isDisplayPopup, setIsDisplayPopup] = useState(false) 
    return(
        <>     
        <Files.Provider value={[message, setMessage]}>
            <Header />
            <div className='subHeader'>{message}</div> 
            <div className='content'>
                <div className='sideBar'></div>
                <Main />     
            </div>
            
        </Files.Provider>
        </>
    )
}

export default Layout