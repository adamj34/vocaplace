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
import { Units } from './components/Units/Units'
import { EditProfile } from './components/Profile/EditProfile'
import { Topics } from './components/Units/Topics';
import { Admin } from './components/Admin/Admin'
import { Revisions } from './components/Revisions/Revisions';
import { Friends } from './components/Friends/Friends';
import { Groups } from './components/Groups/Groups';
import { Ranking } from './components/Ranking/Ranking';
import DataService from "./DataService.js"

export const AppContext = createContext();

function App() {
  const [UserData, SetUserData] = useState({});
  const { keycloak, initialized } = useKeycloak();

  // useEffect(() => {
  //   if (keycloak.authenticated) {
  //     keycloak.loadUserProfile().then(async (data) => {
  //      SetUserData({userid:data.id, username:data.username})
  //       const d = await DataService.GetUserData()
  //       console.log(d)
  //     })}
  //   } ,[initialized])

  useEffect(() => {
    if (keycloak.authenticated) {
      keycloak.loadUserProfile().then((data) => {
        fetch(`http://localhost:8000/user`,
          { method: 'GET', headers: { Authorization: `Bearer ${keycloak.token}` } })
          .then(response => response.json())
          .then(data => { console.log(data) })
      }).catch((err) => console.log(err))
    }
  }, [initialized])

  return (
    <div id="App">
      <AppContext.Provider value={{UserData,SetUserData}}>
        <Nav/>
        <Routes>
          <Route path='' element={<Home/>}/>
          <Route path='profile/:id' element={<Profile/>}/>
          <Route path='profile/:id/edit' element={<EditProfile/>}/>
          <Route path='group/:id' element={<Group/>}/>
          <Route path='task/submit' element={<SubmitTask/>}/>
          <Route path='units/:unitid' element={<Topics/>}/>
          <Route path='units' element={<Units/>}/>
          <Route path='admin' element={<Admin/>}/>
          <Route path='revisions' element={<Revisions/>}/>
          <Route path='friends' element={<Friends/>}/>
          <Route path='groups' element={<Groups/>}/>
          <Route path='ranking' element={<Ranking />} />


          <Route path='*' element={<NotFound/>}/>
        </Routes>
        <Footer/>
      </AppContext.Provider>
    </div>
    
  );
}

export default App;
