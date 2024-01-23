import { useState } from "react";
import DataService from "../../DataService";


function Validate(Data, GlobalData) {
    console.log(Object.keys(GlobalData).map(x=>x.toLowerCase()))
    if (!Data.unit || Data.unit.length < 5) {
        return "Unit name must be at least 5 characters long!"
    } else if (Object.keys(GlobalData).map(x => x.toLowerCase()).includes(Data.unit.toLowerCase())) {
        return "This unit already exists!"
    }
}


export function UnitCreator(p) {
    const [Data, SetData] = useState({icon:null});
    const [ErrorMessage, SetErrorMessage] = useState("");
    const [Submitting, SetSubmitting] = useState(false);
    
    return (
        <div id='creator'>
            <form>
                <div id='field'>
                    <label>Unit Name:</label>
                    <input className='input' placeholder='Vocabulary' onChange={(e)=>{SetData({...Data, unit:e.target.value})}}/>
                </div>
                <div id='field'>
                    <label>Unit <a href="https://react-icons.github.io/react-icons/icons/fa/">Icon:</a></label>
                    <input className='input' placeholder='pen' onChange={(e) => { SetData({ ...Data, icon: e.target.value }) }} />
                    <span>Icon Preview: <i id='icon' className={"fa-solid fa-"+Data.icon}></i></span>
                </div>

                <p id="error">{ErrorMessage}</p>

                <div id='buttons'>
                <button type='button' className='button' disabled={Submitting} onClick={()=>{
                    SetSubmitting(true)
                    const validationerror = Validate(Data, p.GlobalData)
                    if (validationerror) {
                        SetErrorMessage(validationerror)
                    } else {
                        SetErrorMessage("")
                        DataService.AddUnit(Data).then(()=>{
                            SetErrorMessage("Unit created!")
                        }).catch(()=>{
                            SetErrorMessage("Failed to submit!")
                        })
                    }
                    SetSubmitting(false)
                }}>Submit</button>
            </div>
        </form>
    </div>
    )
}