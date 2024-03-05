// import './style.scss';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import { AppContext } from '../../App';
import placeholderpfp from './PlaceholderProfilePic.png'
import websitelogo from './Logo.png'
import Notifications from './Notifications';
import { FaSearch, FaHandsHelping, FaUserFriends, FaMedal, FaBook, FaBrain, FaIdBadge } from 'react-icons/fa';

function SearchBar() {
    const navigate = useNavigate()
    const [SearchQuery, SetQuery] = useState("");
    return (
        <form id='searchbar' onSubmit={(e)=>{e.preventDefault(); if (SearchQuery.length > 0) {navigate({pathname:`/search`,search:`?q=${SearchQuery}`})}}}>
            <FaSearch id='icon'/>
            <input id='search' placeholder='Search' value={SearchQuery} onChange={(e)=>{SetQuery(e.target.value)}}></input>
        </form>
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
                    <div id='links'>
                        <Link to='units'><FaBook id='icon'/></Link>
                        <Link to='repetitions'><FaBrain id='icon'/></Link>
                        <Link to='friends'><FaHandsHelping id='icon'/></Link>
                        <Link to='groups'><FaUserFriends id='icon'/></Link>
                        <Link to='ranking'><FaMedal id='icon'/></Link>
                        {keycloak.hasRealmRole('app-admin') && <Link to='admin'><FaIdBadge id='icon'/></Link>}
                    </div>
                    <SearchBar/>
                </div>
                <div id='right'>
                    <Notifications messages={notifications}/>
                    <Link to={"/profile/"+C.UserData.id} id='profile' className='hovertext'>
                        <p id='username' >{C.UserData.username}</p>
                        <div id='profilepic'>
                            <div id='pfp' style={{ backgroundImage: `url(${C.UserData.picture || placeholderpfp})`, height: 30, width:30 }}></div>
                        </div>
                    </Link>
                    <button className="button" onClick={keycloak.logout}>Log out</button>
                </div>
            </nav>
        )
    }
}