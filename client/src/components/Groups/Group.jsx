import { useParams, Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import { useKeycloak } from '@react-keycloak/web';
import { LoginRequired } from '../LoginRequired';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import Icon from '../Icon';
import TextareaAutosize from 'react-textarea-autosize';

export function Group() {
    const { id } = useParams()
    const C = useContext(AppContext);
    const [GroupData, SetGroupData] = useState({group:{}, members:[]});
    const [ManagingGroup, SetManagingGroup] = useState(false);
    const [UpdatedGroupData, SetUpdatedGroupData] = useState({group_name:GroupData.group.group_name});

    function IsGroupAdmin(userid) {
        const user = GroupData.members.find(m => m.id === userid)
        return user && user.admin === true
    }

    function IsUserGroupMember() {
        return GroupData.members.find(m => m.id === C.UserData.id) == null
    }
    
    const chatmessages = [ // placeholder
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'joe', content: 'hello there', posted: '14:05'},
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'general kenobi'},
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test'},
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'joe', content: 'bajojajo'},
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test2' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test3' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4' },
        { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'test', content: 'test4' },
    ]

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetGroupData(id).then((data) => {
                data.members.push({...data.members[0], admin: false}) // placeholders
                data.members.push({ ...data.members[0], admin: false })
                data.members.push({ ...data.members[0] })
                SetGroupData(data)
                document.title = `VocaPlace | ${data.group.group_name}`
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
                <p>{GroupData.group.bio || 'The owner of this group was too busy studying to set a description...'}</p>
            </div>

            <div id='content'>

            
            <div id='members' >
                <p id='title'>{GroupData.members.length} group member{GroupData.members.length > 1 && 's'}</p>
                <div id='memberlist'>
                    {GroupData.members.map((u, i) => {
                        return (
                            <div key={i} id='member'>
                                <Link key={i} to={`/profile/${u.id}`}>
                                    <div id="user">
                                        <div id='pfp' style={{ backgroundImage: `url(${u.picture || placeholderpfp})`, height: 30, width: 30 }}></div>
                                        <p id="username">{u.username} {u.admin && (<Icon icon='crown' />)}</p>
                                    </div>
                                </Link>
                                {ManagingGroup && <div id='buttons'>
                                    {IsGroupAdmin(C.UserData.id) && <Icon icon='trash' />}
                                    {IsGroupAdmin(C.UserData.id) && <Icon icon='star' />}
                                </div>}
                                
                            </div>)
                    })}
                </div>
            </div>

            {IsUserGroupMember() && <div id='chat'>
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
                                    <p id='messagecontent'>{m.content} {IsGroupAdmin(C.UserData.id) && <Icon icon='trash'/>}</p>
                            </div>)
                        })}
                </div>
            </div>}

            {!IsUserGroupMember() && <div id='hiddenchat'>
                <p id='title'>Join the group to access the group chat</p>
                <button className='button'>Request to join the group</button>
                <p>You will be notified once the group owner accepts your join request.</p>
            </div>}

            {IsUserGroupMember() && <div id='right'>
                <div id='user'>
                        <div id='pfp' style={{ backgroundImage: `url(${C.UserData.picture || placeholderpfp})`, height: 80, width: 80 }}></div>
                        <div id='data'>
                            <p id="username">{C.UserData.username}</p>
                            <p id='role'>{IsGroupAdmin(C.UserData.userid) ? "Group Owner" : "Group Member"}</p>
                        </div>
                </div>
                <div id='buttons'>
                    {IsGroupAdmin(C.UserData.id) && <div id='admin'>
                            {!ManagingGroup && <button className='button' onClick={() => { SetManagingGroup(true) }}>Manage Group</button>}
                            {ManagingGroup && <>
                            <div id='field'>
                                <label>Group Name:</label>
                                <input className='input' placeholder={GroupData.group.group_name} onChange={(e) => { SetUpdatedGroupData({ ...UpdatedGroupData, group_name: e.target.value }) }} />
                            </div>
                            <div id='field'>
                                <label>Group Description:</label>
                                <TextareaAutosize id='bio' className='input' minRows={4} maxLength={300} placeholder={GroupData.group.bio} onChange={(e) => { SetUpdatedGroupData({ ...UpdatedGroupData, bio: e.target.value }) }} ></TextareaAutosize>
                            </div>
                            <button className='button' onClick={() => { SetManagingGroup(false) }}>Save Changes</button>
                            <button className='button light' onClick={() => { SetManagingGroup(false) }}>Discard Changes</button>
                            </>}
                    </div>}
                    {!ManagingGroup && <button className='button light'>Leave Group</button>}
                </div>
            </div>}

            </div>
           
        </div>
    )
}