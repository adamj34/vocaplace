import './style.scss';
import { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";

import { NotFound } from './components/NotFound';
import { Home } from './components/Home/Home';
import { Profile } from './components/Profile/Profile';
import { Group } from'./components/Group/Group'
import { SubmitTask } from './components/SubmitTask/SubmitTask';
import { Nav } from './components/Nav/Nav';
import { Footer } from './components/Nav/Footer'
import { Units } from './components/Units/Units.js'
import { EditProfile } from './components/Profile/EditProfile'
import { Topics } from './components/Units/Topics';
import { Admin } from './components/Admin/Admin'
import { Repetitions } from './components/Repetitions/Repetitions.js';
import { Friends } from './components/Friends/Friends';
import { Groups } from './components/Groups/Groups';
import { Ranking } from './components/Ranking/Ranking';
import { Questions } from './components/Units/Questions.js';
import { Search } from './components/Search/Search.js';
import DataService from "./DataService.js"

export const AppContext = createContext();

function App() {
  const [UserData, SetUserData] = useState({});
  const [AppReady, SetAppReady] = useState(false);
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (keycloak.authenticated) {
      DataService.SetToken(keycloak.token)
      keycloak.loadUserProfile().then(async (d) => {
        const userdata = await DataService.GetUserData()
        SetUserData(userdata.data)
        SetAppReady(true)
      })}
    } ,[initialized])

  return (
    <div id="App">
      <AppContext.Provider value={{UserData,SetUserData,AppReady}}>
        <Nav/>
        <Routes>
          <Route path='' element={<Home/>}/>
          <Route path='profile/:id' element={<Profile/>}/>
          <Route path='profile/:id/edit' element={<EditProfile/>}/>
          <Route path='group/:id' element={<Group/>}/>
          <Route path='task/submit' element={<SubmitTask/>}/>
          <Route path='repetitions' element={<Repetitions />} />
          <Route path='repetitions/set' element={<Questions type='repetition'/>} />
          <Route path='units/:unitid/:topicid' element={<Questions type='normal'/>} />
          <Route path='units/:unitid' element={<Topics/>}/>
          <Route path='units' element={<Units/>}/>
          <Route path='admin' element={<Admin/>}/>
          <Route path='friends' element={<Friends/>}/>
          <Route path='groups' element={<Groups/>}/>
          <Route path='ranking' element={<Ranking />} />
          <Route path='search' element={<Search />} />


          <Route path='*' element={<NotFound/>}/>
        </Routes>
        <Footer/>
      </AppContext.Provider>
    </div>
    
  );
}

export default App;
