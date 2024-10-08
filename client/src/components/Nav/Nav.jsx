// import './style.scss';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import { AppContext } from '../../App';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import websitelogo from '../../images/Logo.png'
import Notifications from './Notifications';
import Icon from '../Icon';

function SearchBar() {
    const navigate = useNavigate()
    const [SearchQuery, SetQuery] = useState("")
    
    return (
        <form id='searchbar' onSubmit={(e)=>{e.preventDefault(); if (SearchQuery.length > 0) {navigate({pathname:`/search`,search:`?q=${SearchQuery}`}); SetQuery('')}}}>
            <Icon icon='search'/>
            <input id='search' placeholder='Search' value={SearchQuery} onChange={(e)=>{SetQuery(e.target.value)}}></input>
        </form>
    )
}

export function Nav() {
    const C = useContext(AppContext);
    const { keycloak } = useKeycloak();

    if (!keycloak.authenticated) {
        return (
            <header id="Nav">
                <section id='left'>
                    <Link to="">
                        <img id='websitelogo' src={websitelogo} alt='logo'></img>
                    </Link>
                </section>
                <section id='right'>
                    <button className="button" onClick={keycloak.login}>Log in</button>
                    <span>or</span>
                    <button className="button" onClick={keycloak.register}>Create account</button>
                </section>
            </header>
        )
    } else {
        return (
            <header id="Nav">
                <section id='left'>
                    <Link to="">
                        <img id='websitelogo' alt='logo' src={websitelogo}></img>
                    </Link>
                    <nav id='links'>
                        <Link to='units'>
                            <Icon icon='book' className='hovertext'/>
                        </Link>
                        <Link to='repetitions'>
                            <Icon icon='brain' className='hovertext' />
                        </Link>
                        <Link to='friends'>
                            <Icon icon='user-friends' className='hovertext' />
                        </Link>
                        <Link to='groups'>
                            <Icon icon='people-group' className='hovertext' />
                        </Link>
                        <Link to='ranking'>
                            <Icon icon='medal' className='hovertext' />
                        </Link>
                        {keycloak.hasRealmRole('app-admin') && <Link to='admin'>
                            <Icon icon='id-badge' className='hovertext' />
                        </Link>}
                    </nav>
                    <SearchBar/>
                </section>
                <section id='right'>
                    <Notifications/>
                    <Link to={"/profile/"+C.UserData.id} id='profile' className='hovertext'>
                        <span id='username' >{C.UserData.username}</span>
                        <div id='pfp' style={{ backgroundImage: `url(${C.UserData.picture || placeholderpfp})`, height: 40, width:40 }}/>
                    </Link>
                    <button className="button" onClick={() => keycloak.logout({ redirectUri: `${window.location.protocol}//${window.location.host}/` })}>Log out</button>
                </section>
            </header>
        )
    }
}