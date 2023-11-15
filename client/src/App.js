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

export const AppContext = createContext();

function App() {
  const [UserData, SetUserData] = useState({});
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (keycloak.authenticated) {
      keycloak.loadUserProfile().then((data) => {
       SetUserData({userid:data.id, username:data.username})
      })}
    } ,[initialized])

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
          <Route path='units' element={<Units/>}/>

          <Route path='*' element={<NotFound/>}/>
        </Routes>
        <Footer/>
      </AppContext.Provider>
    </div>
    
  );
}

export default App;
