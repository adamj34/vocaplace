import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import { AppContext } from '../../App';
import placeholderpfp from './PlaceholderProfilePic.png'
import websitelogo from './Logo.png'
import {FaSearch, FaBell} from 'react-icons/fa';
import Notifications from './Notifications';

function SearchBar() {
    return (
        <div id='SearchBar'>
            <FaSearch id='icon'/>
            <input id='search' className='input' placeholder='Search...'></input>
        </div>
    )
}



export function Nav() {
    const C = useContext(AppContext);
    const { keycloak } = useKeycloak();
    const notifications = ["Message 1", "Message 2", "Message 3","Message 1", "Message 2", "Message 3","Message 1", "Message 2", "Message 3","Message 1", "Message 2", "Message 3"]// placeholder

    if (!keycloak.authenticated) {
        return (
            <nav id ="Nav">
                <div id='left'>
                    <Link to="">
                        <img id='websitelogo' src={websitelogo} alt='logo'></img>
                    </Link>
                </div>
                <div id='right'>
                    <button className="button" onClick={keycloak.login}>Log in</button>
                    <p>or</p>
                    <button className="button" onClick={keycloak.register}>Create account</button>
                </div>
            </nav>
        )
    } else {
        return (
            <nav id ="Nav">
                <div id='left'>
                    <Link to="">
                        <img id='websitelogo' src={websitelogo}></img>
                    </Link>
                    <SearchBar/>
                </div>
                <div id='right'>
                    <Notifications messages={notifications}/>
                    <Link to={"/profile/"+C.UserData.userid} id='profile' className='hovertext'>
                        <p id='username' >{C.UserData.username}</p>
                        <div id='profilepic'>
                            <div id='pfp' style={{ backgroundImage: `url(${C.UserData.pfp || placeholderpfp})`, height: 30, width:30 }}></div>
                        </div>
                    </Link>
                    <button className="button" onClick={keycloak.logout}>Log out</button>
                </div>
            </nav>
        )
    }
}