import { useParams } from 'react-router-dom';
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import {FaPen} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AppContext } from '../../App';
import TextareaAutosize from 'react-textarea-autosize';
import { AccessDenied } from '../AccessDenied'
import { DateFormat } from '../../helpers/DateFormat';
import DataService from '../../DataService';


function UpdateUserData(data) {
    console.log(data)
    DataService.UpdateUserData(data).then((res) => {
        if (data.picture) {
            console.log(res)
            // C.SetUserData(...C.UserData, picture)
        }
        console.log('updated')
    }).catch((e) => {
        console.log(e)
    })
}

export function EditProfile() {
    const [Data, SetData] = useState({});
    const [PicturePreview, SetPicturePreview] = useState(null);
    const C = useContext(AppContext);
    const { id } = useParams()
    document.title = `Duolingo | Edit Profile`

    if (C.UserData.id != id) {
        return <AccessDenied/>
    }
    

    // placeholders
    const privateprofile = false
    
    return (
        <div id="EditProfile">
            <div id='banner'>
                <div id='left'>
                    <div id='pfp-wrapper'>
                        <div id='editprofilepic'> 
                            <label htmlFor="picinput" id='label'>
                                <div id='pfp' style={{ backgroundImage: `url(${PicturePreview || C.UserData.picture || placeholderpfp})`, height: 200, width:200 }}></div>
                                <i><FaPen id='icon'/></i>
                            </label>
                            <input type='file' id='picinput' onChange={(e) => { if (e.target.files.length === 1) {SetPicturePreview(URL.createObjectURL(e.target.files[0])); SetData({...Data, 'picture':e.target.files[0]})}}}></input>
                        </div>
                        {Data.picture != null && <div id='info'>
                            <p id='size'>{`File size: ${Math.ceil(Data.picture.size/1024)}KB`}</p>
                            <p id='error'>{Data.picture.size > 1000000 && 'File is too big!'}</p>
                        </div>}
                    </div>
                    <div id='side'>
                        <h1 id='username'>{C.UserData.username}</h1>
                        <p>Member since {DateFormat(C.UserData.created_at)}</p>
                        <p>{C.UserData.ongoing_streak} streak</p>
                        <p>{C.UserData.points} points</p>
                        <TextareaAutosize id='bio' className='input' minRows={5} maxLength={400} defaultValue={C.UserData.bio} onChange={(e)=>{SetData({...Data, 'bio':e.target.value})}} ></TextareaAutosize>
                    </div>
                </div>
                <div id='buttons'>
                    <button className='button' onClick={()=>{UpdateUserData(Data)}}>Save Changes</button>
                    <button className='button'>Set profile to {privateprofile == false ? 'private' : "public"}</button>
                    <Link to="./../"><button className='button' onClick={() => {window.confirm('Are you sure you want to leave?')}}>Back</button></Link>
                </div>
            </div>
           

            
        </div>
    )
}