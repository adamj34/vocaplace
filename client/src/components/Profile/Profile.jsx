// import './style.scss';
import { useParams } from 'react-router-dom';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import Icon from '../Icon';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import { DateFormat } from '../../helpers/DateFormat';
import { LoadingScreen } from '../LoadingScreen';
import TextareaAutosize from 'react-textarea-autosize';
import { usePopup } from '../Popup.tsx';

function SetRelationship(rel, me) {
    if (!rel) {
        return null
    } else if ((rel.relationship === 'pending_user1_user2' && rel.user1_id === me) || (rel.relationship === 'pending_user2_user1' && rel.user2_id === me)) {
        return 'i_invited_them'
    } else if ((rel.relationship === 'pending_user1_user2' && rel.user2_id === me) || (rel.relationship === 'pending_user2_user1' && rel.user1_id === me)) {
        return 'they_invited_me'
    } else if (rel.relationship === 'friends') {
        return 'friends'
    }
}
function ListElement(p) {
    return (
        <li>
            <Link to={`../${p.page}/${p.data.id}`} className='hovertext'>
                <div id='listitem'>
                    <img src={p.data.picture || placeholderpfp} height={33} id='pfp' alt='profilepicture'></img>
                    <p>{p.data.username || p.data.group_name}</p>
                </div>
            </Link>
        </li>
    )
}

export function Profile() {
    const C = useContext(AppContext);
    const { id } = useParams()
    const [ProfileData, SetProfileData] = useState({});
    const [LoadingProfile, SetLoadingProfile] = useState(true);
    const popup = usePopup()

    const [EditingProfile, SetEditingProfile] = useState(false);
    const [EditingData, SetEditingData] = useState({});
    const [PicturePreview, SetPicturePreview] = useState(null);
    const [PictureWillBeDeleted, SetPictureWillBeDeleted] = useState(false);
    const [Saving, SetSaving] = useState(false);

    useEffect(() => {
        if (C.AppReady) {
            SetLoadingProfile(true) // for jumping between profiles
            DataService.GetProfileData(id).then((data)=> {
                SetProfileData({...data, relationship:SetRelationship(data.relationship, C.UserData.id)})
                document.title = `VocaPlace | ${data.user.username}`
                window.scrollTo({ top: 0, left: 0});
                SetLoadingProfile(false)
            }).catch(e => {
                console.error(e)
                if (e.response && e.response.status === 404) {
                    popup('Error', 'User was not found. Please make sure you enter a correct user ID.')
                } else if (e.response && e.response.status === 422) {
                    popup('Error', 'Invalid user ID! Please enter a valid user ID.')
                } else {
                    popup('Error', 'Failed to load profile due to an unknown error.')
                }
                SetLoadingProfile(false)
            })
        }
    }, [C.AppReady, id, C.UserData.id])


    function SendInvite() {
        DataService.SendFriendRequest(id).then((relationship) => {
            SetProfileData({...ProfileData, relationship:SetRelationship(relationship, C.UserData.id)})
        }).catch(e => {
            console.error(e)
            popup("Error", "Failed to send a friend request due to an unknown error.")
        })
    }

    function CancelInvite() {
        DataService.CancelFriendRequest(id).then(() => {
            SetProfileData({ ...ProfileData, relationship: null })
        }).catch(e => {
            console.error(e)
            popup("Error", "Failed to cancel friend request due to an unknown error.")
        })
    }

    function AcceptInvite() {
        DataService.AcceptFriendRequest(id).then(() => {
            SetProfileData({ ...ProfileData, relationship: 'friends' })
        }).catch(e => {
            console.error(e)
            popup("Error", "Failed to accept friend request due to an unknown error.")
        })
    }

    function DeleteInvite() {
        DataService.DeleteFriendRequest(id).then(() => {
            SetProfileData({ ...ProfileData, relationship: null })
        }).catch(e => {
            console.error(e)
            popup("Error", "Failed to delete friend request due to an unknown error.")
        })
    }

    function DeleteFriend() {
        DataService.DeleteFriend(id).then(() => {
            SetProfileData({...ProfileData, relationship:null})
        }).catch(e => {
            console.error(e)
            popup("Error", "Failed to delete friend due to an unknown error.")
        })
    }

    function AddNewPicture(file) {
        if (file && file.type.startsWith('image')) {
            SetPicturePreview(URL.createObjectURL(file))
            SetEditingData({ ...EditingData, 'picture': file })
            SetPictureWillBeDeleted(false)
        }
    }

    function DeletePicture() {
        const datawithoutpic = {...EditingData}
        delete datawithoutpic.picture
        SetEditingData(datawithoutpic)
        SetPicturePreview(placeholderpfp)
        SetPictureWillBeDeleted(true)
    }

    function UpdateUserData() {
        if ( Object.keys(EditingData).length > 0 ) { // nothing to update
            if (!EditingData.picture || EditingData.picture.size < 1000000) {
                SetSaving(true)
                DataService.UpdateUserData(EditingData).then((res) => {
                    C.SetUserData(res.data)
                    SetProfileData({...ProfileData, user:res.data})

                    if (PictureWillBeDeleted) {
                        DataService.DeleteProfilePicture().then(() => {
                            C.SetUserData({ ...C.UserData, picture: null })
                            SetProfileData({ ...ProfileData, user: { ...ProfileData.user, picture: null } })
                            SetSaving(false)
                            ResetEditor()
                        }).catch((e) => {
                            console.error(e)
                            popup("Error", "Failed to update profile due to an unknown error.")
                            SetSaving(false)
                        })
                    } else {
                        SetSaving(false)
                        ResetEditor()
                    }   
                }).catch((e) => {
                    console.error(e)
                    popup("Error", "Failed to update profile due to an unknown error.")
                    SetSaving(false)
                })
            } else {
                popup("Error", "Picture file cannot be bigger than 1MB! Please upload a smaller file.")
                SetSaving(false)
            }
        } else {
            if (PictureWillBeDeleted && C.UserData.picture) {
                SetSaving(true)
                DataService.DeleteProfilePicture().then(() => {
                    C.SetUserData({ ...C.UserData, picture: null })
                    SetProfileData({ ...ProfileData, user: { ...ProfileData.user, picture: null } })
                    SetSaving(false)
                    ResetEditor()
                }).catch((e) => {
                    console.error(e)
                    popup("Error", "Failed to update profile due to an unknown error.")
                    SetSaving(false)
                })
            } else {
                ResetEditor()
            }
        }
    }

    function ResetEditor() {
        SetEditingProfile(false)
        SetEditingData({})
        SetPicturePreview(null)
        SetPictureWillBeDeleted(false)
    }


    return (
        (LoadingProfile || Object.keys(ProfileData).length === 0) ? <LoadingScreen/> : <div id="Profile">
            <div id='banner'>
                <div id='left'>
                    <div id='pfp-section'>
                        <div id='pfp' style={{ backgroundImage: `url(${PicturePreview || ProfileData.user.picture || placeholderpfp})`, height: 200, width:200 }}></div>
                        {EditingProfile && <div id='editor'>
                                {!Saving && <label htmlFor="picinput" className='button'>Upload new picture</label>}
                                <input type='file' id='picinput' className='button' key={Date.now()} onChange={(e) => AddNewPicture(e.target.files[0])}></input>
                                {!Saving && <button className='button light' id='removepic' onClick={DeletePicture}>Remove Picture</button>}
                                {(!Saving && EditingData.picture != null) && <span id='size'>{`File size: ${Math.ceil(EditingData.picture.size / 1024)}KB`}</span>}
                        </div>}
                    </div>

                    <div id='data'>
                        <h1 id='username'>{ProfileData.user.username}</h1>
                        <p>Member since {DateFormat(ProfileData.user.created_at)}</p>
                        <p>{ProfileData.user.ongoing_streak} streak</p>
                        <p>{ProfileData.user.points} points</p>
                        {!EditingProfile ? <p>{ProfileData.user.bio}</p> :
                        <TextareaAutosize id='bio' className='input' minRows={3} maxLength={400} defaultValue={C.UserData.bio} disabled={Saving} onChange={(e) => { SetEditingData({ ...EditingData, 'bio': e.target.value }) }} ></TextareaAutosize>}
                    </div>
                </div>
                {(id === C.UserData.id) ? // self only
                    <div id='buttons'> 
                        {!EditingProfile && <button className='button' onClick={()=>SetEditingProfile(true)}>Edit Profile</button>}
                        {EditingProfile && <>
                        <button className='button' onClick={UpdateUserData} disabled={Saving}>{Saving ? 'Saving' : 'Save Changes'}</button>
                        {!Saving && <button className='button light' onClick={ResetEditor}>Discard Changes</button>}
                        </>}
                    </div> 
                
                // friends
                :<div id='buttons'>
                        {!ProfileData.relationship && <button className='button' onClick={SendInvite}>Add Friend</button>}
                        {ProfileData.relationship === 'i_invited_them' && <button className='button light' onClick={CancelInvite}>Cancel Invite</button>}
                        {ProfileData.relationship === 'they_invited_me' && (<>
                            <p>This user has sent you a friend request.</p>
                            <button className='button' onClick={AcceptInvite}>Accept</button>
                            <p id='or'>or</p>
                            <button className='button light' onClick={DeleteInvite}>Delete</button>
                        </>)}
                        {ProfileData.relationship === 'friends' && <button className='button' onClick={DeleteFriend}>Remove Friend</button>}
                    </div>
                }
                
            </div>
            {!EditingProfile && <div id='social'>
                <div id='friends'>
                    <div id='title'>
                        <Icon icon='user-friends'/>
                        <p>{ProfileData.friends.length} Friend{ProfileData.friends.length !== 1 && 's'}</p>
                    </div>
                    <ul id='content'>
                        {ProfileData.friends.map((x) => {return <ListElement data={x} page='profile' key={x.id}/>})}
                    </ul>
                </div>
                <div id='groups'>
                    <div id='title'>
                        <Icon icon='people-group'/>
                        <p>{ProfileData.groups.length} Group{ProfileData.groups.length !== 1 && 's'}</p>
                    </div>
                    <ul id='content'>
                        {ProfileData.groups.map((x) => {return <ListElement data={x} page='groups' key={x.id}/>})}
                    </ul>
                </div>
            </div>}
           

            
        </div>
    )
}