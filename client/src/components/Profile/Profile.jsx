// import './style.scss';
import { useParams } from 'react-router-dom';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import Icon from '../Icon';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import DataService from '../../DataService';
import { DateFormat } from '../../helpers/DateFormat';
import TextareaAutosize from 'react-textarea-autosize';

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

function UpdateUserData(data) {
    if (!data.picture || data.picture.size < 1000000) {
        console.log(data)
    } else {
        console.log('file too big')
    }
    // DataService.UpdateUserData(data).then((res) => {
    //     if (data.picture) {
    //         console.log(res)
    //         // C.SetUserData(...C.UserData, picture)
    //     }
    //     console.log('updated')
    // }).catch((e) => {
    //     console.log(e)
    // })
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
    const [Loading, SetLoading] = useState(true);
    const C = useContext(AppContext);
    const { id } = useParams()
    const [ProfileData, SetProfileData] = useState({});

    const [EditingProfile, SetEditingProfile] = useState(false);
    const [EditingData, SetEditingData] = useState({});
    const [PicturePreview, SetPicturePreview] = useState(null);

    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

    useEffect(() => {
        if (C.AppReady) {
            DataService.GetProfileData(id).then((data)=> {
                SetProfileData({...data, relationship:SetRelationship(data.relationship, C.UserData.id)})
                document.title = `VocaPlace | ${data.user.username}`
                console.log(data)
                SetLoading(false)
            })
        }
    }, [C.AppReady, id])


    function SendInvite() {
        DataService.SendFriendRequest(id).then((relationship) => {
            SetProfileData({...ProfileData, relationship:SetRelationship(relationship, C.UserData.id)})
            console.log(relationship)
        })
    }

    function AcceptInvite() {
        DataService.AcceptFriendRequest(id).then((res) => {
            SetProfileData({ ...ProfileData, relationship: 'friends' })
        })
    }

    function DeleteFriend() {
        DataService.DeleteFriend(id).then((res) => {
            SetProfileData({...ProfileData, relationship:null})
        })
    }

    function CancelInvite() {
        DataService.CancelFriendRequest(id).then((res) => {
            SetProfileData({ ...ProfileData, relationship: null })
        })
    }

    function DeleteInvite() {
        DataService.DeleteFriendRequest(id).then((res) => {
            SetProfileData({ ...ProfileData, relationship: null })
        })
    }

    function DeletePicture() { // state only IDK FIGURE THIS OUT
        const data = {...EditingData}
        delete data.picture // deleted in separate endpoint
        SetEditingData(data)
        SetPicturePreview('deleted')
    }


    return (
        Loading ? <div>Loading</div> :
        <div id="Profile">
            <div id='banner'>
                <div id='left'>
                    {!EditingProfile && <div id='profilepic' style={{ backgroundImage: `url(${ProfileData.user.picture || placeholderpfp})`, height: 200, width:200 }}></div>}
                    {EditingProfile && <div id='pfp-editor'>
                        <div id='editprofilepic'> 
                            <label htmlFor="picinput" id='label'>
                                <div id='pfp' style={{ backgroundImage: `url(${(PicturePreview == 'deleted' && placeholderpfp) || PicturePreview || C.UserData.picture || placeholderpfp})`, height: 200, width:200 }}></div>
                                <Icon icon='pen'/>
                            </label>
                                <input type='file' id='picinput' key={Date.now()} onChange={(e) => { if (e.target.files.length === 1 & e.target.files[0].type.startsWith('image')) {SetPicturePreview(URL.createObjectURL(e.target.files[0])); SetEditingData({...EditingData, 'picture':e.target.files[0]})}}}></input>
                        </div>
                        {(PicturePreview !== 'deleted' && (EditingData.picture || C.UserData.picture)) && <button className='button light' id='removepic' onClick={DeletePicture}>Remove Picture</button>}
                        {EditingData.picture != null && <div id='picinfo'>
                            <p id='size'>{`File size: ${Math.ceil(EditingData.picture.size/1024)}KB`}</p>
                            <p id='error'>{EditingData.picture.size > 1000000 && 'File is too big!'}</p>
                        </div>}
                    </div>}

                    <div id='data'>
                        <h1 id='username'>{ProfileData.user.username}</h1>
                        <p>Member since {DateFormat(ProfileData.user.created_at)}</p>
                        <p>{ProfileData.user.ongoing_streak} streak</p>
                        <p>{ProfileData.user.points} points</p>
                        {!EditingProfile && <p>{ProfileData.user.bio}</p>}
                        {EditingProfile && <TextareaAutosize id='bio' className='input' minRows={3} maxLength={400} defaultValue={C.UserData.bio} onChange={(e) => { SetEditingData({ ...EditingData, 'bio': e.target.value }) }} ></TextareaAutosize>}
                    </div>
                </div>
                {(id === C.UserData.id) ? // self only
                    <div id='buttons'> 
                        {!EditingProfile && <button className='button' onClick={()=>SetEditingProfile(true)}>Edit Profile</button>}
                        {EditingProfile && <button className='button' onClick={()=>UpdateUserData(EditingData)}>Save Changes</button>}
                        {EditingProfile && <button className='button light' onClick={() => {SetEditingProfile(false); SetEditingData({}); SetPicturePreview(null)}}>Discard Changes</button>}
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
            <div id='social'>
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
            </div>
           

            
        </div>
    )
}