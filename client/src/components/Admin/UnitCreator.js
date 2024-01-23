import { useState } from "react";
import DataService from "../../DataService";


function Validate(UnitData, units) {
    if (!UnitData.unit || UnitData.unit.length < 5) {
        return "Unit name must be at least 5 characters long!"
    } else if (Object.values(units).map(x => x.unit.toLowerCase()).includes(UnitData.unit.toLowerCase())) {
        return "This unit already exists!"
    }
}


export function UnitCreator(p) {
    const [UnitData, SetUnitData] = useState({});
    const [ErrorMessage, SetErrorMessage] = useState("");
    const [Submitting, SetSubmitting] = useState(false);
    
    return (
        <div id='creator'>
            <form>
                <div id='field'>
                    <label>Unit Name:</label>
                    <input className='input' placeholder='Vocabulary' onChange={(e)=>{SetUnitData({...UnitData, unit:e.target.value})}}/>
                </div>
                <div id='field'>
                    <label>Unit <a href="https://react-icons.github.io/react-icons/icons/fa/">Icon:</a></label>
                    <input className='input' placeholder='pen' onChange={(e) => { SetUnitData({ ...UnitData, icon: e.target.value }) }} />
                    <span>Icon Preview: <i id='icon' className={"fa-solid fa-"+UnitData.icon}></i></span>
                </div>

                <p id="error">{ErrorMessage}</p>

                <div id='buttons'>
                <button type='button' className='button' disabled={Submitting} onClick={()=>{
                    SetSubmitting(true)
                    const validationerror = Validate(UnitData, p.units)
                    if (validationerror) {
                        SetErrorMessage(validationerror)
                    } else {
                        SetErrorMessage("")

                        DataService.AddUnit(UnitData).then(()=>{
                            SetSubmitting(false)
                            SetErrorMessage("Unit created!")
                        }).catch(()=>{
                            SetErrorMessage("Failed to submit!")
                            SetSubmitting(false)
                        })
                    }
                }}>Submit</button>
            </div>
        </form>
    </div>
    )
}