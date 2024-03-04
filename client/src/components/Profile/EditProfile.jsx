import { useParams } from 'react-router-dom';
import placeholderpfp from '../Nav/PlaceholderProfilePic.png'
import {FaPen} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AppContext } from '../../App';
import TextareaAutosize from 'react-textarea-autosize';
import { AccessDenied } from '../AccessDenied'
import { DateFormat } from '../../helpers/DateFormat';
import DataService from '../../DataService';


function UpdateUserData(data) {
    DataService.UpdateUserData(data).then(() => {
        console.log('updated')
    })
}

export function EditProfile() {
    const [Data, SetData] = useState({});
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
                    <div id='editprofilepic'>
                        <label htmlFor="picinput" id='label'>
                        <div id='pfp' style={{ backgroundImage: `url(${C.UserData.pfp || placeholderpfp})`, height: 200, width:200 }}></div>
                            <i><FaPen id='icon'/></i>
                        </label>
                        <input type='file' id='picinput' onChange={(e)=>{SetData({...C.UserData, 'pfp':URL.createObjectURL(e.target.files[0])})}}></input>
                    </div>
                    <div id='side'>
                        <h1 id='username'>{C.UserData.username}</h1>
                        <p>Member since {DateFormat(C.UserData.created_at)}</p>
                        <p>{C.UserData.ongoing_streak} streak</p>
                        <p>{C.UserData.points} points</p>
                        <TextareaAutosize id='bio' className='input' minRows={5} maxLength={400} defaultValue={C.UserData.bio} onChange={(e)=>{SetData({...C.Data, 'bio':e.target.value})}} ></TextareaAutosize>
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