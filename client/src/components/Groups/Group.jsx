import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import Icon from '../Icon';
import TextareaAutosize from 'react-textarea-autosize';

const chatmessages = [ // placeholder
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'joe', content: 'hello there', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'general kenobi' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'joe', content: 'bajojajo' },
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

export function Group() {
    const { groupid } = useParams()
    const C = useContext(AppContext);
    const navigate = useNavigate();

    const [GroupData, SetGroupData] = useState({});
    const [Members, SetMembers] = useState([]);
    const [PendingMembers, SetPendingMembers] = useState([]);
    const [ChatMessages, SetChatMessages] = useState([]);
    const [ManagingGroup, SetManagingGroup] = useState(false);
    const [UpdatedGroupData, SetUpdatedGroupData] = useState({group_name:GroupData.group_name});
    const [NewChatMessage, SetNewChatMessage] = useState('');
    const [SendingChatMessage, SetSendingChatMessage] = useState(false);
    const [ErrorMessage, SetErrorMessage] = useState('');
    const [LeavingGroup, SetLeavingGroup] = useState(false);

    function IsGroupAdmin(userid) {
        const user = Members.find(m => m.id === userid)
        return user && user.admin === true
    }

    function IsUserGroupMember() {
        return Members.find(m => m.id === C.UserData.id) != null
    }

    function SendChatMessage() {
        if (NewChatMessage) {
            SetSendingChatMessage(true)
            console.log('sending message: ',NewChatMessage)
            SetNewChatMessage('')
            SetSendingChatMessage(false)
        }
    }

    function RequestToJoinGroup() {
        console.log('joining group')
    }

    function LeaveGroup() {
        SetLeavingGroup(true)
        // if (window.confirm(`Are you sure you want to leave ${GroupData.group_name}?`)) {
            DataService.RemoveUserFromGroup(groupid, C.UserData.id).then((res) => {
                console.log('left!', res)
                SetLeavingGroup(false)
            }).catch(e => {
                SetErrorMessage('Failed to leave the group!')
                SetLeavingGroup(false)
            })
        // }
    }

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetGroupData(groupid).then((data) => {
                SetGroupData(data.group)
                SetMembers(data.members.filter(m=>m.accepted))
                SetPendingMembers(data.members.filter(m => !m.accepted))
                SetChatMessages(chatmessages.reverse()) // placeholder
                document.title = `VocaPlace | ${data.group.group_name}`
                console.log(data)
                console.log('accepted:', data.members.filter(m => m.accepted))
                console.log('pending:', data.members.filter(m => !m.accepted))
            }).catch(()=>navigate('/groups'))
        }
    }, [C.AppReady, groupid])

    return (
        <div id="Group">
            <div id='header'>
                <h1>{GroupData.group_name}</h1>
                <p>{GroupData.bio || 'The owner of this group was too busy studying to set a description...'}</p>
            </div>

            <div id='content'>

            
            <div id='members' >
                <p id='title'>{Members.length} group member{Members.length !== 1 && 's'}</p>
                <div id='memberlist'>
                    {Members.map((u, i) => {
                        return (
                            <div key={i} id='member'>
                                <Link to={`/profile/${u.id}`}>
                                    <div id="user">
                                        <div id='pfp' style={{ backgroundImage: `url(${u.picture || placeholderpfp})`, height: 30, width: 30 }}></div>
                                        <p id="username">{u.username} {u.admin && (<Icon icon='crown' />)}</p>
                                    </div>
                                </Link>
                                {ManagingGroup && u.id !== C.UserData.id && <div id='buttons'>
                                    {IsGroupAdmin(C.UserData.id) && <Icon icon='trash' />}
                                    {IsGroupAdmin(C.UserData.id) && <Icon icon='star' />}
                                </div>}
                            </div>)
                    })}
                </div>
                {IsGroupAdmin(C.UserData.id) && <div id='pending-member-list'>
                    <p id='title'>{PendingMembers.length} pending request{PendingMembers.length !== 1 && 's'}</p>
                    {PendingMembers.map((u, i) => {
                        return (
                            <div key={i} id='member'>
                                <Link to={`/profile/${u.id}`}>
                                    <div id="user">
                                        <div id='pfp' style={{ backgroundImage: `url(${u.picture || placeholderpfp})`, height: 30, width: 30 }}></div>
                                        <p id="username">{u.username}</p>
                                    </div>
                                </Link>
                                <button className='button'></button>
                            </div>)
                    })}
                </div>}
            </div>

            {IsUserGroupMember() && <div id='chat'>
                <p id='title'>Group Chat</p>
                <div id='window'>
                        {ChatMessages.map((m, i) => {
                            return (
                            <div id='message' key={i}>
                                {(i === 0 || ChatMessages[i - 1].username !== m.username) ?
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
                    <form id='input-section' onSubmit={(e) => {e.preventDefault(); SendChatMessage()}}>
                    <input className='input' disabled={SendingChatMessage} value={NewChatMessage} onChange={e=>SetNewChatMessage(e.target.value)}></input>
                    <button className='button' disabled={SendingChatMessage}>{!SendingChatMessage ? 'Send' : 'Sending'}</button>
                </form>
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
                                <input className='input' placeholder={GroupData.group_name} onChange={(e) => { SetUpdatedGroupData({ ...UpdatedGroupData, group_name: e.target.value }) }} />
                            </div>
                            <div id='field'>
                                <label>Group Description:</label>
                                <TextareaAutosize id='bio' className='input' minRows={4} maxLength={300} placeholder={GroupData.bio} onChange={(e) => { SetUpdatedGroupData({ ...UpdatedGroupData, bio: e.target.value }) }} ></TextareaAutosize>
                            </div>
                            <button className='button' onClick={() => { SetManagingGroup(false) }}>Save Changes</button>
                            <button className='button light' onClick={() => { SetManagingGroup(false) }}>Discard Changes</button>
                            </>}
                    </div>}
                    {!ManagingGroup && <button className='button light' disabled={LeavingGroup} onClick={LeaveGroup}>{!LeavingGroup ? 'Leave Group' : 'Leaving'}</button>}
                </div>
                <span id='error'>{ErrorMessage}</span>
            </div>}

            </div>
           
        </div>
    )
}