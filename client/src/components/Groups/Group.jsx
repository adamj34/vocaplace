import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import Icon from '../Icon';
import TextareaAutosize from 'react-textarea-autosize';
import { usePopup } from '../Popup.tsx';
import { ValidateGroup } from './ValidateGroup.ts';
import { socket } from '../../socket.js';



export function Group() {
    const { groupid } = useParams()
    const C = useContext(AppContext);
    const navigate = useNavigate();
    const popup = usePopup()

    const [GroupData, SetGroupData] = useState({});
    const [Members, SetMembers] = useState([]);
    const [PendingMembers, SetPendingMembers] = useState([]);

    const [ChatMessages, SetChatMessages] = useState([]);
    const [NewChatMessage, SetNewChatMessage] = useState('');
    const [SendingChatMessage, SetSendingChatMessage] = useState(false);
    const [LeavingGroup, SetLeavingGroup] = useState(false);

    const [ManagingGroup, SetManagingGroup] = useState(false);
    const [UpdatedGroupData, SetUpdatedGroupData] = useState({});
    const [PicturePreview, SetPicturePreview] = useState(null);
    const [PictureWillBeDeleted, SetPictureWillBeDeleted] = useState(false);
    const [Saving, SetSaving] = useState(false);

    function IsGroupAdmin(userid) {
        const user = Members.find(m => m.id === userid)
        return user && user.admin === true
    }

    function IsUserGroupMember() {
        
        return Members.find(m => m.id === C.UserData.id && m.accepted )
    }

    function IsUserPendingMember() {
        return PendingMembers.find(m => m.id === C.UserData.id)
    }

    function isMyMessage(messageid) {
        return ChatMessages.find(m => m.id === messageid && m.user_id === C.UserData.id)
    }

    function SendChatMessage() {
        if (NewChatMessage) {
            SetSendingChatMessage(true)
            DataService.SendGroupMessage(groupid, {message:NewChatMessage,groupId:groupid}).then((res) => {
                const user = Members.find(u => u.id === res.data.user_id)
                SetChatMessages([{...res.data, user}, ...ChatMessages])
            }).catch(e => {
                console.error(e)
                popup('Error', 'Failed to send message due to an unknown error.')
            })
            console.log(ChatMessages);
            popup('Info','Message was sent')
            SetNewChatMessage('')
            SetSendingChatMessage(false)
        }
    }

    function DeleteChatMessage(id) {
        DataService.DeleteGroupMessage(id).then(() => {
            SetChatMessages(ChatMessages.filter(m => m.id !== id))
        }).catch(e => {
            console.error(e)
            popup('Error', 'Failed to delete message due to an unfknown error.')
        })

    }

       

    function RequestToJoinGroup() {
        DataService.SendGroupJoinRequest(groupid).then(() => {
            SetPendingMembers([...PendingMembers, C.UserData])
        }).catch(e => {
            console.error(e)
            popup("Error", "Failed to request to join due to an unknown error.")
        })
    }

    function AcceptJoinRequest(userid) {
        DataService.AcceptGroupJoinRequest(groupid, userid).then(() => {
            const member = PendingMembers.find(x => x.id === userid)
            SetMembers([...Members, member])
            SetPendingMembers(PendingMembers.filter(x => x.id !== userid))
        }).catch(e => {
            console.error(e)
            popup('Error','Failed to accept join request due to an unknown error.')
        })
    }

    function KickUser(userid) {
        DataService.RemoveUserFromGroup(groupid, userid).then(() => {
            SetMembers(Members.filter(x => x.id !== userid))
            SetPendingMembers(PendingMembers.filter(x => x.id !== userid))
        }).catch(e => {
            console.error(e)
            popup('Error', 'Failed to remove user due to an unknown error.')
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
                popup('Success', `Group ownership was passed to ${Members.find(x => x.id === userid).username}.`)
            }).catch(e => {
                console.error(e)
                popup('Error', 'Failed to pass group ownership due to an unknown error.')
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
                    console.error(e)
                    popup('Error', 'Failed to leave the group due to an unknown error.')
                })
            } else {
                popup('Error', 'You must transfer group ownership to another member before leaving the group!')
                SetLeavingGroup(false)
            }
        }
    }

    function DeleteGroup() {
        if (window.confirm(`Are you sure you want to delete ${GroupData.group_name}? This cannot be reversed!`)) {
            DataService.DeleteGroup(groupid).then(() => {
                navigate('/')
            }).catch(e => {
                console.error(e)
                popup('Error', 'Failed to delete the group due to an unknown error.')
            })
        }
    }

    function UpdateGroupData() {
        if (Object.keys(UpdatedGroupData).length > 0) { // nothing to update
            if (!UpdatedGroupData.picture || UpdatedGroupData.picture.size < 1000000) {
                SetSaving(true)
                const validation_error = ValidateGroup(UpdatedGroupData, true)
                if (validation_error) {
                    popup('Error', validation_error)
                    SetSaving(false)
                } else {
                    DataService.UpdateGroupData(groupid, UpdatedGroupData).then((res) => {
                        SetGroupData(res.data)

                        if (PictureWillBeDeleted) {
                            DataService.DeleteGroupPicture(groupid).then(() => {
                                SetGroupData({ ...GroupData, picture: null })
                                SetSaving(false)
                                ResetEditor()
                            }).catch((e) => {
                                console.error(e)
                                popup("Error", "Failed to remove group picture due to an unknown error.")
                                SetSaving(false)
                            })
                        } else {
                            SetSaving(false)
                            ResetEditor()
                        }
                    }).catch((e) => {
                        console.error(e)
                        if (e.response && e.response.status === 409) {
                            popup("Error", "Group with that name already exists! Please choose another name.")
                        } else {
                            popup("Error", "Failed to create group due to an unknown error.")
                        }
                        SetSaving(false)
                    })
                }
            } else {
                popup("Error", "Picture file cannot be bigger than 1MB! Please upload a smaller file.")
                SetSaving(false)
            }
        } else {
            if (PictureWillBeDeleted && GroupData.picture) {
                SetSaving(true)
                DataService.DeleteGroupPicture(groupid).then(() => {
                    SetGroupData({ ...GroupData, picture: null })
                    SetSaving(false)
                    ResetEditor()
                }).catch((e) => {
                    console.error(e)
                    popup("Error", "Failed to delete group picture due to an unknown error.")
                    SetSaving(false)
                })
            } else {
                ResetEditor()
            }
        }
    }

    function AddNewPicture(file) {
        if (file && file.type.startsWith('image')) {
            SetPicturePreview(URL.createObjectURL(file))
            SetUpdatedGroupData({ ...UpdatedGroupData, 'picture': file })
            SetPictureWillBeDeleted(false)
        }
    }

    function DeletePicture() {
        const datawithoutpic = { ...UpdatedGroupData }
        delete datawithoutpic.picture
        SetUpdatedGroupData(datawithoutpic)
        SetPicturePreview(placeholderpfp)
        SetPictureWillBeDeleted(true)
    }

    function ResetEditor() {
        SetManagingGroup(false)
        SetUpdatedGroupData({})
        SetPicturePreview(null)
        SetPictureWillBeDeleted(false)
    }


    useEffect(() => {
        if (C.AppReady) {
            DataService.GetGroupData(groupid).then((data) => {
                SetGroupData(data.group)
                const groupmembers = data.members.filter(m => m.accepted)
                const pendingmembers = data.members.filter(m => !m.accepted)
                SetMembers(groupmembers)
                SetPendingMembers(pendingmembers)
                

                if (groupmembers.find(m => m.id === C.UserData.id)) {
                socket.emit('connectToGroupChat', groupid)
                } 
                
                socket.on('newMessage', (message) => {
                    console.log("I GOT A NEW MESSAGE", message);
                    SetChatMessages(previousMessages => [message, ...previousMessages]);
                })
                socket.on('deleteMessage', (messageId) => {
                    SetChatMessages(previousMessages => previousMessages.filter(m => m.id !== messageId));
                })
              
                socket.on('joinGroup', (user) => {
                    SetPendingMembers(previousMembers => [...previousMembers, user]);
                })
                socket.on('acceptMember', (userId) => {
                    const newMember = PendingMembers.find(x => x.id === userId)
                    if (newMember) {
                        SetMembers(previousMembers => [...previousMembers, newMember])
                        SetPendingMembers(previousPending => previousPending.filter(x => x.id !== userId))
                    }
                    if (userId === C.UserData.id) {
                        popup('Success', 'Your join request was accepted!')
                    }
                    
                })
                ///Socket events sent directly to the specific user when user does not have access to the group chat
                socket.on('IGotAccepted', (groupId) => {
                    console.log("I GOT ACCEPTED", groupId);
                    if (groupId == groupid) {
                    SetMembers(previousMembers => [...previousMembers, C.UserData])
                    SetPendingMembers(previousPending => previousPending.filter(x => x.id !== C.UserData.id))
                        if (window.location.pathname === `/groups/${groupId}`) {
                            window.location.reload()
                        }
                
                    }
                })
                socket.on('IGotRejected', (groupId) => {
                    if (groupId == groupid) {
                    SetMembers(previousMembers => previousMembers.filter(m => m.id !== C.UserData.id));    
                    SetPendingMembers(previousPending => previousPending.filter(m => m.id !== C.UserData.id))
                    }
                }
                )
                ////////////////////
                socket.on('deleteMember', (userId) => {
                    SetMembers(previousMembers => previousMembers.filter(m => m.id !== userId));
                    SetPendingMembers(previousPending => previousPending.filter(m => m.id !== userId));
                    if (userId === C.UserData.id) {
                        popup('Info', 'You were removed from the group.')
                        socket.emit('leaveGroupChat', groupid)
                        socket.off('newMessage')
                        socket.off('deleteMessage')
                        socket.off('joinGroup')
                        socket.off('acceptMember')  
                        socket.off('deleteMember')
                        socket.off('newAdmin')
                        socket.off('deleteGroup')
                        
                    }
                })
                
                    socket.on('newAdmin', (userid) => {
                        SetMembers(prevMembers => {
                            const newmembers = [...prevMembers];
                            const previousAdmin = newmembers.find(x => x.admin === true);
                            const newAdminUser = newmembers.find(x => x.id === userid);
            
                            if (previousAdmin) {
                                previousAdmin.admin = false;
                            }
            
                            if (newAdminUser) {
                                newAdminUser.admin = true;
                            }
                             newmembers.map(x => x.id === C.UserData.id ? previousAdmin : x);
                            newmembers.map(x => x.id === userid ? newAdminUser : x);

            
                            return newmembers;
                        });
                })
            
                socket.on('deleteGroup', () => {
                    navigate('/groups')
                })
                SetChatMessages(data.messages.reverse())
                document.title = `VocaPlace | ${data.group.group_name}`
            }).catch((e)=>{
                console.error(e)
                navigate('/groups')
            })
                
        }

        return () => {
            socket.emit('leaveGroupChat', groupid)
            socket.off('newMessage')
            socket.off('deleteMessage')
            socket.off('joinGroup')
            socket.off('acceptMember')
            socket.off('deleteMember')
            socket.off('newAdmin')
            socket.off('deleteGroup')

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
                                    {IsGroupAdmin(C.UserData.id) && <Icon icon='trash' className='hovertext' onClick={() => {if (window.confirm(`Are you sure you want to kick ${u.username} from the group?`)) {KickUser(u.id)}} }/>}
                                    {IsGroupAdmin(C.UserData.id) && <Icon icon='star' className='hovertext' onClick={() => PassAdmin(u.id)}/>}
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
                            </div>
                        )
                    })}
                </div>}
            </div>

            {IsUserGroupMember() && <div id='chat'>
                <p id='title'>Group Chat</p>
                <div id='window'>
                        {ChatMessages.map((m, i) => {
                            return (
                            <div id='message' key={i}>
                                {(i === ChatMessages.length-1 || ChatMessages[i + 1].user_id !== m.user_id) ?
                                    <div id='messagedata'>
                                    <Link key={i} to={`/profile/${m.user_id}`}>
                                         <div id="user">
                                            <div id='pfp' style={{ backgroundImage: `url(${m.picture || placeholderpfp})`, height: 30, width: 30 }}></div>
                                            <p id="username">{m.username || "Deleted Member"} {m.admin && (<i className="fas fa-crown" />)|| ""}</p>
                                        </div>
                                    </Link>
                                    <p id='time'>{m.created_at}</p>
                                </div> : null}
                                    <p id='messagecontent'>{m.message} {(isMyMessage(m.id) || IsGroupAdmin(C.UserData.id)) && <Icon icon='trash' className='hovertext' onClick={() => DeleteChatMessage(m.id)}/>}</p>
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
                            <p id='role'>Group {IsGroupAdmin(C.UserData.id) ? "Owner" : "Member"}</p>
                        </div>
                </div>
                <div id='buttons'>
                    {IsGroupAdmin(C.UserData.id) && <div id='admin'>
                            {!ManagingGroup && <button className='button' onClick={() => { SetManagingGroup(true) }}>Manage Group</button>}
                            {ManagingGroup && <>
                            <div id='field'>
                                <label>Group Name:</label>
                                <input className='input' placeholder={GroupData.group_name} disabled={Saving} onChange={(e) => { SetUpdatedGroupData({ ...UpdatedGroupData, group_name: e.target.value }) }} />
                            </div>
                            <div id='field'>
                                <label>Group Description:</label>
                                    <TextareaAutosize id='bio' className='input' minRows={4} maxLength={300} defaultValue={GroupData.bio} disabled={Saving} onChange={(e) => { SetUpdatedGroupData({ ...UpdatedGroupData, bio: e.target.value }) }} ></TextareaAutosize>
                            </div>
                             <div id='field'>
                                <span>Group Picture{UpdatedGroupData.picture && ` (${Math.ceil(UpdatedGroupData.picture.size / 1024)}KB)`}:</span>
                                <div id="pic-section">
                                    <div id="buttons">
                                        <label htmlFor="picinput" >
                                            <p id="inputbutton" className="button">Upload New Picture</p>
                                            <input type='file' id='picinput' key={Date.now()} disabled={Saving} onChange={(e) => AddNewPicture(e.target.files[0])}></input>
                                        </label>
                                        <button type="button" className='button light' id='removepic' disabled={Saving} onClick={DeletePicture}>Remove Picture</button>
                                    </div>
                                        <div id='pfp' style={{ backgroundImage: `url(${PicturePreview || GroupData.picture || placeholderpfp})` }}></div>
                                </div>
                            </div>
                                <button className='button' onClick={UpdateGroupData} disabled={Saving}>{Saving ? 'Saving' : 'Save Changes'}</button>
                                <button className='button light' disabled={Saving} onClick={() => { if (Object.keys(UpdatedGroupData).length === 0 || window.confirm("Are you sure? Updated data will be lost.")) { ResetEditor() } }}>Discard Changes</button>
                            </>}
                    </div>}
                    {!ManagingGroup && <button className='button light' disabled={LeavingGroup} onClick={LeaveGroup}>{!LeavingGroup ? 'Leave Group' : 'Leaving'}</button>}
                    {ManagingGroup && <button className='button light' onClick={DeleteGroup}>Delete Group</button>}
                </div>
            </div>}

            </div>
           
        </div>
    )
}