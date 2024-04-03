import { useSearchParams, Link, Navigate } from 'react-router-dom';
import {useEffect, useState, useContext} from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import Icon from '../Icon';
import { usePopup } from '../Popup.tsx';


function ListElement(p) {
    return (
        <li>
            <Link to={"../" + p.page + "/" + p.data.id} className='hovertext'>
                <div id='listitem'>
                    <img src={p.data.picture || placeholderpfp} height={33} id='profilepic' alt='profilepicture'></img>
                    <p>{p.data.username || p.data.group_name || 'undefined'}</p>
                </div>
            </Link>
        </li>
    )
}


export function Search() {
    const [ Params ] = useSearchParams();
    const [SearchData, SetSearchData] = useState({matchedGroups:[], matchedUsers:[]})
    const C = useContext(AppContext);
    const popup = usePopup()

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetSearchResults(Params.get('q')).then((data) => {
                SetSearchData(data.data)
                document.title = `VocaPlace | ${Params.get('q')}`
            }).catch(e => {
                console.log(e)
                popup("Error", "Failed to load search results due to an unknown error.")
            })
        }
    }, [C.AppReady, Params])

    if (!Params.get('q') || Params.get('q').length === 0) {return (<Navigate replace to="/"/>)}

    return (
        <div id="Search">
            <div id='header'>
            <h1>Search</h1>
                <p>Results for {Params.get('q')}.</p>
            </div>
            <div id='data'>
                <div id='friends'>
                    <div id='title'>
                        <Icon icon='user-friends'/>
                        <p>{SearchData.matchedUsers.length} Users</p>
                    </div>
                    <ul id='content'>
                        {SearchData.matchedUsers.map((x) => {return <ListElement data={x} page='profile'/>})}
                    </ul>
                </div>
                <div id='groups'>
                    <div id='title'>
                        <Icon icon='people-group'/>
                        <p>{SearchData.matchedGroups.length} Groups</p>
                    </div>
                    <ul id='content'>
                        {SearchData.matchedGroups.map((x) => { return <ListElement data={x} page='groups' /> })}
                    </ul>
                </div>
            </div>
        </div>
    )
}