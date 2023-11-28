import { useState, useContext } from 'react';
import TagsInput from 'react-tagsinput'

function QuestionManager(p) {
    const [QuestionData, SetQuestionData] = useState({});

    return (
        <div id='manager'>
            <form id='questionform'>
                <div id='left'>
                    <div id='field'>
                        <label htmlFor='polishQuestionBody'>Polish Question: </label>
                        <input className='input' name='polishQuestionBody' value={'hey'}/>
                    </div>
                    <div id='field'>
                        <label htmlFor='polishQuestionBody'>Polish Possible Answers: </label>
                        <input className='input' name='polishQuestionBody' value={'hey'}/>
                    </div>
                </div>
                   <div id='middle'>
                    <div id='field'>
                        <label htmlFor='englishQuestionBody'>English Question: </label>
                        <input className='input' name='englishQuestionBody' value={'hey'}/>
                    </div>
               </div>
               <div id='right'>
                    <div id='field'>
                        <label>Unit:</label>
                        <button type='button' className='selectbutton'>Choose</button>
                    </div>
                    <div id='field'>
                        <label>Topic:</label>
                        <button type='button' className='selectbutton'>Choose</button>
                    </div>
                    <div id='field'>
                        <label>Difficulty:</label>
                        <button type='button' className='selectbutton'>Choose</button>
                    </div>
                </div>                        
            </form>
            <div id='buttons'>
                <button className='button'>Save</button>
                <button className='button'>Delete</button>
            </div>
        </div>
    )
}

function UnitManager(p) {
    const [UnitData, SetUnitData] = useState(p.data || {});
    return (
        <div id='manage'>
            <form id='unitform'>
                <div id='field'>
                    <label htmlFor='unitname'>Unit Name: </label>
                    <input className='input' name='unitname' value={UnitData.name}/>
                </div>
            </form>
            <div id='buttons'>
                <button className='button'>Save</button>
                <button className='button'>Delete</button>
            </div>
        </div>
    )
}

function UnitCreator(p) {
    const [UnitData, SetUnitData] = useState({});
    return (
        <div id='creator'>
            <form>
                <div id='field'>
                    <label>Unit Name:</label>
                    <input className='input' placeholder='Vocabulary' onChange={(e)=>{SetUnitData({...UnitData, unitname:e.target.value})}}/>
                </div>
                <div id='field'>
                    <label>Date Created:</label>
                    <input className='input'type='date' defaultValue={new Date().toISOString().substring(0, 10)} onChange={(e)=>{SetUnitData({...UnitData, datecreated:e.target.value})}}/>
                </div>
                <div id='buttons'>
                    <button className='button'>Submit</button>
                </div>
            </form>
        </div>
    )
}

function TopicCreator(p) {
    const [TopicData, SetTopicData] = useState({});
    const [ShowUnits, SetShowUnits] = useState(false);

    return (
        <div id='creator'>
            <form>
            <   div id='field'>
                    <label>Unit:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={()=>SetShowUnits(!ShowUnits)}>{(TopicData.unitname) || "Choose"}</button>
                        {ShowUnits && <div id='select' onMouseLeave={()=>SetShowUnits(false)}>
                            <div id='select-scroll'>
                                {Object.keys(p.units).map((u) => {return (<>
                                        <div className={u==TopicData.unitid && 'chosen'} onClick={()=>{SetShowUnits(!ShowUnits); SetTopicData({...TopicData, unitid:u, unitname:p.units[u].name})}}>{p.units[u].name}</div>
                                </>)})}
                            </div>
                        </div>}
                    </div>
                </div>
                <div id='field'>
                    <label>Topic Name:</label>
                    <input className='input' onChange={(e)=>{SetTopicData({...TopicData, topicname:e.target.value})}} placeholder='Animals'/>
                </div>
                <div id='field'>
                    <label>Date Created:</label>
                    <input className='input'type='date' defaultValue={new Date().toISOString().substring(0, 10)} onChange={(e)=>{SetTopicData({...TopicData, datecreated:e.target.value})}}/>
                </div>
                <div id='buttons'>
                    <button className='button'>Submit</button>
                </div>
            </form>
        </div>
    )
}

function QuestionCreator(p) {
    const [QuestionData, SetQuestionData] = useState({});
    const [ShowTopics, SetShowTopics] = useState(false);
    const [ShowDifficulty, SetShowDifficulty] = useState(false);
    const [ShowType, SetShowType] = useState(false);

    return (
        <div id='creator'>
            <form>
                <div id='field'>
                    <label>Unit and Topic:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={()=>SetShowTopics(!ShowTopics)}>{QuestionData.unitname || "Choose"}{QuestionData.topicname && QuestionData.unitname && " | "}{(QuestionData.topicname) || ""}</button>
                        {ShowTopics && <div id='select' onMouseLeave={()=>SetShowTopics(false)}>
                            <div id='select-scroll'>
                                {Object.keys(p.units).map((u) => {return (<>
                                    <div id='topic' className='disabled'>{p.units[u].name}</div>
                                    {Object.keys(p.units[u].topics).map((t) => {return (<>
                                        <div id='question'className={t==QuestionData.topicid && u==QuestionData.unitid && 'chosen'} onClick={()=>{SetShowTopics(false); SetQuestionData({...QuestionData, unitid:u, unitname:p.units[u].name, topicid:t, topicname:p.units[u].topics[t].name})}}>{p.units[u].topics[t].name}</div>
                                    </>)})}
                                </>)})}
                            </div>
                        </div>}
                    </div>
                </div>
                <div id='field'>
                    <label>Type:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={()=>SetShowType(!ShowType)}>{QuestionData.type || "Choose"}</button>
                        {ShowType && <div id='select' onMouseLeave={()=>SetShowType(false)}>
                            <div id='select-scroll'>
                                {['Pick', 'Order', 'Connect'].map((t) => {return (<>
                                    <div className={t==QuestionData.type && 'chosen'} onClick={()=>{SetShowType(false); SetQuestionData({...QuestionData, type:t,})}}>{t}</div>
                                </>)})}
                            </div>
                        </div>}
                    </div>
                </div>
                
                <div id='field'>
                    <label>Question:</label>
                    <input className='input' placeholder={(QuestionData.type == 'Connect' && "Connect the words with their meaning in English.") || (QuestionData.type == 'Order' && "Put the words in the correct order to translate: 'Ona ma psa.'") || "Which of these are vehicles?"} required onChange={(e)=>{SetQuestionData({...QuestionData, englishquestion:e.target.value})}}/>
                </div>
                {(QuestionData.type == 'Pick') && <div id='field'>
                    <label>Correct Answers:</label>
                    <input className='input' placeholder="Motorcycle, Bus, Car" onChange={(e)=>{SetQuestionData({...QuestionData, englishcorrectanswers:e.target.value})}}/>
                </div>}
                {(QuestionData.type == 'Pick') && <div id='field'>
                    <label>Incorrect Answers:</label>
                    <input className='input' placeholder="Hospital, Crocodile, Juice, Wardrobe" onChange={(e)=>{SetQuestionData({...QuestionData, englishincorrectanswers:e.target.value})}}/>
                </div>}
                {(QuestionData.type == 'Order') && <div id='field'>
                    <label>Correct Answers:</label>
                    <TagsInput
                        className='wordinput'
                        value={QuestionData.ordervalues || []}
                        addKeys={[9,32,188,13]} // tab,space,comma,enter
                        maxLength={20}
                        onlyUnique={true}
                        maxTags={10}
                        onChange={(t) => SetQuestionData({...QuestionData, ordervalues:t})}
                    />
                    {/* <input className='input' placeholder="Oni mają psa," onChange={(e)=>{SetQuestionData({...QuestionData, englishcorrectanswers:e.target.value})}}/> */}
                </div>}
                <div id='field'>
                    <label>Difficulty:</label>
                    <div id='selectfield'>
                        <button className='selectbutton' type='button' onClick={()=>SetShowDifficulty(!ShowDifficulty)}>{(QuestionData.difficulty == 1 && 'Easy') || (QuestionData.difficulty == 2 && 'Medium') || (QuestionData.difficulty == 3 && 'Hard') || "Choose"}</button>
                        {ShowDifficulty && <div id='select' onMouseLeave={()=>SetShowDifficulty(false)}>
                            <div id='select-scroll'>
                                {[1,2,3].map((d) => {return (<>
                                    <div className={d==QuestionData.difficulty && 'chosen'} onClick={()=>{SetShowDifficulty(false); SetQuestionData({...QuestionData, difficulty:d,})}}>{d==1 && 'Easy'}{d==2 && 'Medium'}{d==3 && 'Hard'}</div>
                                </>)})}
                            </div>
                        </div>}
                    </div>
                </div>
                <div id='field'>
                    <label>Date Created:</label>
                    <input className='input'type='date' defaultValue={new Date().toISOString().substring(0, 10)} onChange={(e)=>{SetQuestionData({...QuestionData, datecreated:e.target.value})}}/>
                </div>
                  
                <div id='buttons'>
                    <button className='button'>Submit</button>
                </div>
            </form>
        </div>
    )
}

// function TopicManager(p) {
//     const [TopicData, SetTopicData] = useState(p.data || {});
//     const [ShowUnits, SetShowUnits] = useState(false);
//     return (
//         <div id='manage'>
//             <form id='topicform'>
//                 <div id='left'>
//                     <div id='field'>
//                         <label htmlFor='unitname'>Topic Name: </label>
//                         <input className='input' name='unitname' value={TopicData.name}/>
//                     </div>
//                     <div id='selectunit'>
//                         <button className='selectbutton' onClick={()=>SetShowUnits(!ShowUnits)}>{(TopicData.unit.name) || "Choose"}</button>
//                         {ShowUnits &&
//                         <div id='select'>
//                             <div id='select-scroll'>
//                                 {Object.keys(p.units).map((u) => {return (<>
//                                     <div id='unit' className={u==Managed.id && Managed.type=='unit' && 'chosen'} onClick={()=>{SetShowManageQuestions(!ShowManageQuestions); SetManaged({type:'unit',id:u,data:Units[u]})}}>{Units[u].name}</div>
//                                 </>)})}
//                             </div>
//                         </div>}
//                     </div>
//                 </div>
//             </form>
//             <div id='buttons'>
//                 <button className='button'>Save</button>
//                 <button className='button'>Delete</button>
//             </div>
//         </div>
//     )
// }


export function Admin() {
    document.title = `VocaPlace | Admin`
    const units = { // placeholder
        '1':{
            'name':'Vocabulary',
            'topics':{
                '1':{
                    'name':'Animals',
                    'questions':['u1t1q1', 'u1t1q2', 'u1t1q3']
                },
                '2':{
                    'name':'plants',
                    'questions':['u1t2q1', 'u1t2q2', 'u1t2q3']
                }
            }
        },
        '2':{
            'name':'Grammar and idioms',
            'topics':{
                '1':{
                    'name':'Verbs',
                    'questions':['u2t1q1', 'u2t1q2', 'u2t1q3'],
                    'datecreated':'24.11.2023'
                },
                '2':{
                    'name':'Tenses',
                    'questions':['u2t2q1', 'u2t2q2', 'u2t2q3'],
                    'datecreated':'20.01.2023'
                }
            }
        }
    }
    const [Units, SetUnits] = useState(units);
    const [ShowManageQuestions, SetShowManageQuestions] = useState(false);
    const [ShowCreate, SetShowCreate] = useState(false);
    const [Managed, SetManaged] = useState({});
    const [Created, SetCreated] = useState({});

    return (
        <div id='Admin'>
             <div id='header'>
                <h1>Admin Page</h1>
                <p>Manage questions, users and groups.</p>
            </div>

            <div id='create'>
                <div id='subheader'>
                    <h3>Add new:</h3>
                    <div id='selectcreated'>
                        <button className='selectbutton' onClick={()=>SetShowCreate(!ShowCreate)}>{Created.type || "Choose"}</button>
                        {ShowCreate && <div id='select' onMouseLeave={()=>SetShowCreate(false)}>
                            <div id='select-scroll'>
                                {['unit', 'topic', 'question'].map((v) => {return (
                                    <div id='pick' className={v==Created.type && 'chosen'} onClick={()=>{SetShowCreate(!ShowCreate); SetCreated({type:v})}}>{v}</div>
                                )})}
                            </div>
                        </div>}
                    </div>
                </div>
                {Created.type =='unit' && <UnitCreator/>}
                {Created.type =='topic' && <TopicCreator units={Units}/>}
                {Created.type =='question' && <QuestionCreator units={Units}/>}
            </div>
            <div className='line'></div>

            <div id='managequestions'>
                <div id='subheader'>
                    <h3>Manage{Managed.type && " "+Managed.type}:</h3>
                    <div id='selectquestion'>
                        <button className='selectbutton' onClick={()=>SetShowManageQuestions(!ShowManageQuestions)}>{(Managed.data && Managed.data.name) || Managed.data || "Choose"}</button>
                        {ShowManageQuestions &&
                        <div id='select'>
                            <div id='select-scroll'>
                                {Object.keys(Units).map((u) => {return (<>
                                    <div id='unit' className={u==Managed.id && Managed.type=='unit' && 'chosen'} onClick={()=>{SetShowManageQuestions(!ShowManageQuestions); SetManaged({type:'unit',id:u,data:Units[u]})}}>{Units[u].name}</div>
                                    {Object.keys(Units[u].topics).map((t) => {return (<>
                                        <div id='topic' className={t==Managed.id && Managed.type=='topic' &&'chosen'} onClick={()=>{SetShowManageQuestions(!ShowManageQuestions); SetManaged({type:'topic',id:t,data:Units[u].topics[t]})}}>{Units[u].topics[t].name}</div>
                                            {Units[u].topics[t].questions.map((q) => {
                                                return <div id='question' className={q==Managed.id && Managed.type=='question' && 'chosen'} onClick={()=>{SetShowManageQuestions(!ShowManageQuestions); SetManaged({type:'question',id:q,data:q})}}>{q}</div>;
                                            })}
                                    </>)})}
                                </>)})}
                            </div>
                        </div>}
                    </div>
                </div>
                {/* {Managed.type =='question' && <QuestionManager data={Managed.data}/>}
                {Managed.type =='topic' && <TopicManager data={Managed.data} units={Units}/>}
                {Managed.type =='unit' && <UnitManager data={Managed.data}/>} */}
            </div>

            

            
        </div>
    )
}