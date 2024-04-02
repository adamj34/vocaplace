import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import Icon from '../Icon';
import TextareaAutosize from 'react-textarea-autosize';
import { usePopup } from '../Popup.tsx';

const chatmessages = [ // placeholder
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'joe', content: 'hello there', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'general kenobi', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'joe', content: 'bajojajo', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test2', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test3', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'admin', content: 'test4', posted: '14:05' },
    { id: 'a3b53c8d-f4d4-471c-98db-36061f5da067', username: 'test', content: 'test4', posted: '14:05' },
]

export function Group() {
    const { groupid } = useParams()
    const C = useContext(AppContext);
    const navigate = useNavigate();
    const popup = usePopup()

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
        return Members.find(m => m.id === C.UserData.id)
    }

    function IsUserPendingMember() {
        return PendingMembers.find(m => m.id === C.UserData.id)
    }

    function SendChatMessage() {
        if (NewChatMessage) {
            SetSendingChatMessage(true)
            console.log('sending message: ',NewChatMessage)
            popup('Error','krystian dodaj sockety :(')
            SetNewChatMessage('')
            SetSendingChatMessage(false)
        }
    }

    function RequestToJoinGroup() {
        DataService.SendGroupJoinRequest(groupid).then(() => {
            SetPendingMembers([...PendingMembers, C.UserData])
        }).catch(e => {
            console.log(e)
        })
    }

    function AcceptJoinRequest(userid) {
        DataService.AcceptGroupJoinRequest(groupid, userid).then(() => {
            const member = PendingMembers.find(x => x.id === userid)
            SetMembers([...Members, member])
            SetPendingMembers(PendingMembers.filter(x => x.id !== userid))
        }).catch(e => {
            console.log(e)
            popup('Error','Failed to accept group join request due to an unknown error. Please try again later.')
        })
    }

    function KickUser(userid) {
        DataService.RemoveUserFromGroup(groupid, userid).then(() => {
            SetMembers(Members.filter(x => x.id !== userid))
            SetPendingMembers(PendingMembers.filter(x => x.id !== userid))
        }).catch(e => {
            console.log(e)
            popup('Error', 'Failed to remove user due to an unknown error. Please try again later.')
        })
    }

    function PassAdmin(userid) {
        if (window.confirm(`Are you sure you pass group ownership to ${Members.find(x=>x.id===userid).username}?`)) {
            DataService.PassGroupAdmin(groupid, userid).then(() => {
                const newmembers = [...Members]
                newmembers.find(x => x.id === C.UserData.id).admin = false
                newmembers.find(x => x.id === userid).admin = true
                SetMembers(newmembers)
                SetManagingGroup(false)
            }).catch(e => {
                console.log(e)
                popup('Error', 'Failed to pass group ownership due to an unknown error. Please try again later.')
            })
        }
    }

    function LeaveGroup() {
        SetLeavingGroup(true)
        if (window.confirm(`Are you sure you want to leave ${GroupData.group_name}?`)) {
            if (!IsGroupAdmin(C.UserData.id)) {
                DataService.RemoveUserFromGroup(groupid, C.UserData.id).then(() => {
                    SetPendingMembers(PendingMembers.filter(x => x.id !== C.UserData.id))
                    SetMembers(Members.filter(x => x.id !== C.UserData.id))
                    SetLeavingGroup(false)
                }).catch(e => {
                    console.log(e)
                    popup('Error', 'Failed to leave the group due an unknown error. Please try again later.')
                })
            } else {
                popup('Could not leave group', 'You must transfer group ownership to another member before leaving the group!')
                SetLeavingGroup(false)
            }
        }
    }

    function DeleteGroup() {
        if (window.confirm(`Are you sure you want to delete ${GroupData.group_name}? This cannot be reversed!`)) {
            DataService.DeleteGroup(groupid).then(() => {
                navigate('/')
            }).catch(e => {
                console.log(e)
                SetErrorMessage('Failed to delete the group!')
            })
        }
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
                                    {IsGroupAdmin(C.UserData.id) && <Icon icon='trash' onClick={() => {if (window.confirm(`Are you sure you want to kick ${u.username} from the group?`)) {KickUser(u.id)}} }/>}
                                    {IsGroupAdmin(C.UserData.id) && <Icon icon='star' onClick={() => PassAdmin(u.id)}/>}
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
                                <div id='buttons'>
                                    <button className='button' onClick={()=>AcceptJoinRequest(u.id)}>Accept</button>
                                    or
                                    <button className='button light' onClick={()=>KickUser(u.id)}>Decline</button>
                                </div>
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
                    <input className='input' placeholder={`Send a message to ${GroupData.group_name}`} disabled={SendingChatMessage} value={NewChatMessage} onChange={e=>SetNewChatMessage(e.target.value)}></input>
                    <button className='button' disabled={SendingChatMessage}>{!SendingChatMessage ? 'Send' : 'Sending'}</button>
                </form>
            </div>}

            {!IsUserGroupMember() && <div id='hiddenchat'>
                <p id='title'>Join the group to access the group chat</p>
                {!IsUserPendingMember() && <button className='button' onClick={RequestToJoinGroup}>Request to join the group</button>}
                {IsUserPendingMember() && <button className='button light' onClick={LeaveGroup}>Cancel join request</button>}
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
                    {ManagingGroup && <button className='button light' onClick={DeleteGroup}>Delete Group</button>}
                </div>
                <span id='error'>{ErrorMessage}</span>
            </div>}

            </div>
           
        </div>
    )
}