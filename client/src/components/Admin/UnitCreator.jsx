import { useState } from "react";
import DataService from "../../DataService";
import { usePopup } from '../Popup.tsx';


function Validate(Data, GlobalData) {
    const units = Object.keys(GlobalData)
    if (!Data.unit || Data.unit.length < 5 || Data.unit.length > 50) {
        return "Unit name must contain between 5 and 50 characters! Please enter a valid name."
    } else if (units.map(x => x.toLowerCase()).includes(Data.unit.toLowerCase())) {
        return "Unit with that name already exists! Please choose another name!"
    }
}


export function UnitCreator(p) {
    const [Data, SetData] = useState({});
    const [Submitting, SetSubmitting] = useState(false);
    const popup = usePopup()

    async function CreateUnit() {
        try {
            SetSubmitting(true)
            const validation_error = Validate(Data, p.GlobalData);
            if (validation_error) {
                popup("Error", validation_error);
                return;
            }
            await DataService.AddUnit(Data);
            p.SetNeedToUpdateData(true);
            popup("Success", "Unit created!");
        } catch (e) {
            console.error(e)
            popup("Error", "Failed to create new unit due to an unknown error.");
        } finally {
            SetSubmitting(false);
        }
    }
    
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
                    <span>Icon Preview: <i id='icon' className={"fa-solid fa-"+(Data.icon || 'book')}></i></span>
                </div>

                <div id='buttons'>
                    <button type='button' className='button' disabled={Submitting} onClick={CreateUnit}>{!Submitting ? 'Submit' : 'Submitting'}</button>
            </div>
        </form>
    </div>
    )
}