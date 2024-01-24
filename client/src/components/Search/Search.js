import { useSearchParams, Link, Navigate } from 'react-router-dom';
import {useEffect, useState} from 'react';
import { FaUser, FaUserFriends } from 'react-icons/fa';

export function Search() {
    const [ Params ] = useSearchParams();
    const [SearchData, SetSearchData] = useState({})
    document.title = `VocaPlace | ${Params.get('q')}`

    if (!Params.get('q') || Params.get('q').length == 0) {return (<Navigate replace to="/"/>) }

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
                        <p>{0} Users</p>
                    </div>
                    <ul id='content'>
                        {/* {friends.map((x) => {return <ListElement data={x} page='profile' key={x.name}/>})} */}
                    </ul>
                </div>
                <div id='groups'>
                    <div id='title'>
                        <FaUserFriends id='icon' />
                        <p>{0} Groups</p>
                    </div>
                    <ul id='content'>
                        {/* {groups.map((x) => {return <ListElement data={x} page='group' key={x.name}/>})} */}
                    </ul>
                </div>
            </div>
        </div>
    )
}