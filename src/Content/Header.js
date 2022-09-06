
// import './Header.css';
import logo from '../img/antCloud.svg'

function Header(props){
    return(
        <div className="header"> 
            <div className='logo'>
                <img alt="" src={logo} width="100" height="40" />
                <span>ANTS cloud</span>
            </div> 
            <p>wellcome Orit! </p>       
        </div>
    ) 
}
 export default Header