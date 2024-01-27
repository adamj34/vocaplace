import { useSearchParams, Link, Navigate } from 'react-router-dom';
import {useEffect, useState, useContext} from 'react';
import { FaUser, FaUserFriends } from 'react-icons/fa';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import { useKeycloak } from '@react-keycloak/web';
import { LoginRequired } from '../LoginRequired';
import placeholderpfp from '../Nav/PlaceholderProfilePic.png'


function ListElement(p) {
    return (
        <li>
            <Link to={"../" + p.page + "/" + p.data.id} className='hovertext'>
                <div id='listitem'>
                    <img src={p.data.pic || placeholderpfp} height={33} id='profilepic' alt='profilepicture'></img>
                    <p>{p.data.username || 'undefined'}</p>
                </div>
            </Link>
        </li>
    )
}


export function Search() {
    const [ Params ] = useSearchParams();
    const [SearchData, SetSearchData] = useState({matchedGroups:[], matchedUsers:[]})
    document.title = `VocaPlace | ${Params.get('q')}`
    const C = useContext(AppContext);

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetSearchResults(Params.get('q')).then((data) => {
                SetSearchData(data.data)
                console.log(data.data)
            })
        }
    }, [C.AppReady, Params])

    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) { return <LoginRequired /> }

    if (!Params.get('q') || Params.get('q').length == 0) {return (<Navigate replace to="/"/>)}

    return (
        <div id="Search">
            <div id='header'>
            <h1>Search Results</h1>
                <p>{Params.get('q')}</p>
            </div>
            <div id='data'>
                <div id='friends'>
                    <div id='title'>
                        <FaUser id='icon' />
                        <p>{SearchData.matchedUsers.length} Users</p>
                    </div>
                    <ul id='content'>
                        {/* {friends.map((x) => {return <ListElement data={x} page='profile' key={x.name}/>})} */}
                        {SearchData.matchedUsers.map((x) => {return <ListElement data={x} page='profile'/>})}
                    </ul>
                </div>
                <div id='groups'>
                    <div id='title'>
                        <FaUserFriends id='icon' />
                        <p>{SearchData.matchedGroups.length} Groups</p>
                    </div>
                    <ul id='content'>
                        {/* {groups.map((x) => {return <ListElement data={x} page='group' key={x.name}/>})} */}
                    </ul>
                </div>
            </div>
        </div>
    )
}