import React, {useState} from 'react'
import '../styles/navbar.css';
// import MenuIcon from '@material-ui/icons/Menu';


 function NavBar(props) {
     const [showMenu, setshowMenu] = useState(false)

    function toggleMenu() {
        if(showMenu){
            setshowMenu(false)
        }else{
            setshowMenu(true)
        }
      }

    return (
        <div className = "master-nav">
        <div className = "nav-main">
            <div onClick = {e => window.location.href = "/"} className = "nav-one"><div className = "nav-name">Super Learner</div>
            <div className = "screens">
                <div className = "nav-item">About</div>
                <div className = "nav-item">Use case</div>
                <div className = "nav-item">Partners</div>

            </div>
            </div>
            {props.showEntry ? "" : 
                <div className = "pages">
                <div onClick = {e => window.location.href = "/entry/login"} ><button className = "login">Login</button></div>
                    <div onClick = {e => window.location.href = "/entry/signup"} ><button className = "sign-up">Signup</button></div>    
                    </div>}
                </div>
                <div className = "menu">
                    {/* <MenuIcon onClick = {e => toggleMenu()} style={{ color: "#1F3D51" }} /> */}
                </div>
        {/* smaller screen display for nav */}
        <div>
        {showMenu ? <div className = "pages-600">
            <div onClick = {e => window.location.href = "/about"} className = "nav-item-600" >About</div>
            <div onClick = {e => window.location.href = "/support"} className = "nav-item-600">Support</div>
    </div> : ""}
    </div>
    </div>
    )
}

export default NavBar;
