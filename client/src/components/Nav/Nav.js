import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import { AppContext } from '../../App';
import placeholderpfp from './PlaceholderProfilePic.png'
import websitelogo from './Logo.png'

export function Nav() {
    const C = useContext(AppContext);
    const { keycloak } = useKeycloak();

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
                </div>
                <div id='right'>
                    <Link to={"/profile/"+C.UserData.userid} id='profile' className='hovertext'>
                        <p id='username' >{C.UserData.username}</p>
                        <img src={C.UserData.pfp || placeholderpfp} height={33} id='profilepic' alt='profilepicture'></img>
                    </Link>
                    <button className="button" onClick={keycloak.logout}>Log out</button>
                </div>
            </nav>
        )
    }
}