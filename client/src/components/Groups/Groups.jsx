import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../App";
import placeholderpfp from '../../images/PlaceholderProfilePic.png'
import { Link, useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import DataService from "../../DataService";
import { usePopup } from "../Popup.tsx";
import { ValidateGroup } from './ValidateGroup.ts';


const placeholder = [
    {
        "id": 1,
        "group_name": "Englovers",
        "bio": "English is the best!",
        "picture": null
    },
    {
        "id": 2,
        "group_name": "BestFriends",
        "bio": "Hello! Join the group and let's study together!",
        "picture": null
    }
]

export function Groups() {
    document.title = `VocaPlace | Groups`
    const C = useContext(AppContext);
    const navigate = useNavigate();
    const popup = usePopup()
    const [Groups, SetGroups] = useState([]);

    const [NewGroupData, SetNewGroupData] = useState([]);
    const [NewGroupPicturePreview, SetNewGroupPicturePreview] = useState(null);
    const [Submitting, SetSubmitting] = useState(false);
    const [SearchQuery, SetSearchQuery] = useState('');
    
    useEffect(() => {
        if (C.AppReady) {
            DataService.GetUserGroups().then((res) => {
                SetGroups(res.data)
            }).catch(e => {
                console.error(e)
                popup("Error", "Failed to load groups due to an unknown error.")
            })
        }
    }, [C.AppReady])

    function AddNewPicture(file) {
        if (file && file.type.startsWith('image')) {
            SetNewGroupPicturePreview(URL.createObjectURL(file))
            SetNewGroupData({ ...NewGroupData, 'picture': file })
        }
    }

    function DeletePicture() {
        const datawithoutpic = { ...NewGroupData }
        delete datawithoutpic.picture
        SetNewGroupData(datawithoutpic)
        SetNewGroupPicturePreview(null)
    }

    return (
        <div id="Groups">
            <div id='header'>
                <h1>Groups</h1>
                <p>Get in touch with others.</p>
            </div>

            <div id="content">
                <div id="grouplist">
                    {Groups.length === 0 && <p>You haven't joined any groups yet.</p>}
                    {Groups.length > 0 && <input className="input" placeholder="Filter groups" onChange={e => SetSearchQuery(e.target.value)}></input>}
                    {Groups.map((g, i) => {
                        return (
                            g.group_name.toLowerCase().includes(SearchQuery.toLowerCase()) && <Link key={i} to={`/groups/${g.id}`}>
                                <div id="group">
                                    <div id='pfp' style={{ backgroundImage: `url(${g.picture || placeholderpfp})`, height: 60, minWidth: 60 }}></div>
                                    <div id="groupdata">
                                        <h3>{g.group_name} {g.admin && (<i className="fas fa-crown" />)}</h3>
                                        <p>{g.bio}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div id="groupcreator">
                    <h3>Create New Group</h3>
                    <form>
                        <div id='field'>
                            <label>Group Name:</label>
                            <input className='input' placeholder='Students' onChange={(e) => { SetNewGroupData({ ...NewGroupData, group_name: e.target.value }) }} />
                        </div>
                        <div id='field'>
                            <label>Group Description:</label>
                            <TextareaAutosize id='bio' className='input' minRows={4} maxLength={300} placeholder='We love learning English!' onChange={(e) => { SetNewGroupData({ ...NewGroupData, bio: e.target.value }) }} ></TextareaAutosize>
                        </div>
                        <div id='field'>
                            <span>Group Picture{NewGroupData.picture && ` (${Math.ceil(NewGroupData.picture.size / 1024)}KB)`}:</span>
                            <div id="pic-section">
                                <div id="buttons">
                                    <label htmlFor="picinput">
                                        <p id="inputbutton" className="button" onClick={()=>document.getElementById('picinput').click()}>Upload New Picture</p>
                                        <input type='file' id='picinput' key={Date.now()} onChange={(e) => AddNewPicture(e.target.files[0])}></input>
                                    </label>
                                    <button type="button" className='button light' id='removepic' onClick={DeletePicture}>Remove Picture</button>
                                </div>
                                
                                <div id='pfp' style={{ backgroundImage: `url(${NewGroupPicturePreview || placeholderpfp})`}}></div>
                            </div>
                            
                        </div>
                        

                        <button type='button' className='button' disabled={Submitting} onClick={() => {
                            SetSubmitting(true)
                            const validation_error = ValidateGroup(NewGroupData)
                            if (validation_error) {
                                popup('Error', validation_error)
                                SetSubmitting(false)
                            } else {
                                DataService.CreateGroup(NewGroupData).then((res) => {
                                    navigate(`/groups/${res.data.id}`)
                                }).catch((e) => {
                                    console.error(e)
                                    if (e.response && e.response.status === 409) {
                                        popup("Error", "Group with that name already exists! Please choose another name.")
                                    } else {
                                        popup("Error", "Failed to create group due to an unknown error.")
                                    }
                                    SetSubmitting(false)
                                })
                            }
                        }}>{ !Submitting ? 'Create Group' : 'Creating'}</button>
                    </form>
                </div>
            </div>
           
        </div>
        
    )
}