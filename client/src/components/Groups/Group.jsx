import { useParams, Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import { useKeycloak } from '@react-keycloak/web';
import { LoginRequired } from '../LoginRequired';
import placeholderpfp from '../Nav/PlaceholderProfilePic.png'

export function Group() {
    const { id } = useParams()
    document.title = `VocaPlace | Group name`
    const C = useContext(AppContext);
    const [GroupData, SetGroupData] = useState({group:{}, members:[]});
    
    const chatmessages = [ // placeholder
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'joe', content: 'hello there', posted: '14:05'},
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'general kenobi'},
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test'},
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'joe', content: 'bajojajo'},
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test2' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test3' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4' },
    ]

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetGroupData(id).then((data) => {
                data.members.push({...data.members[0], admin: false}) // placeholders
                data.members.push({ ...data.members[0], admin: false })
                data.members.push({ ...data.members[0] })
                SetGroupData(data)
                console.log(data)
            })
        }
    }, [C.AppReady])

    const { keycloak } = useKeycloak();
    if (!keycloak.authenticated) { return <LoginRequired /> }

    return (
        <div id="Group">
            <div id='header'>
                <h1>{GroupData.group.group_name}</h1>
                <p>{GroupData.group.bio}</p>
            </div>

            <div id='content'>

            
            <div id='members' >
                <p id='title'>{GroupData.members.length} group member{GroupData.members.length > 1 && 's'}</p>
                <div id='memberlist'>
                    {GroupData.members.map((u, i) => {
                        return (
                        <Link key={i} to={`/profile/${u.id}`}>
                            <div id="user">
                                <div id='pfp' style={{ backgroundImage: `url(${u.picture || placeholderpfp})`, height: 30, width: 30 }}></div>
                                <p id="username">{u.username} {u.admin && (<i className="fas fa-crown" />)}</p>
                            </div>
                        </Link>)
                    })}
                </div>
            </div>

            <div id='chat'>
                <p id='title'>Group Chat</p>
                <div id='window'>
                        {chatmessages.map((m, i) => {
                            return (
                            <div id='message'>
                                {(i == 0 || chatmessages[i - 1].username != m.username) ?
                                    <div id='messagedata'>
                                    <Link key={i} to={`/profile/${m.id}`}>
                                         <div id="user">
                                            <div id='pfp' style={{ backgroundImage: `url(${m.picture || placeholderpfp})`, height: 30, width: 30 }}></div>
                                            <p id="username">{m.username} {m.admin && (<i className="fas fa-crown" />)}</p>
                                        </div>
                                    </Link>
                                    <p id='time'>{m.posted}</p>
                                </div> : null}
                                <p id='messagecontent'>{m.content}</p>
                            </div>)
                        })}
                </div>

            </div>


            </div>
           
        </div>
    )
}