import './style.scss';
import { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import { LoadingScreen } from './components/LoadingScreen.jsx';

import { NotFound } from './components/NotFound.jsx';
import { Home } from './components/Home/Home.jsx';
import { Profile } from './components/Profile/Profile.jsx';
import { Group } from'./components/Groups/Group.jsx'
import { Nav } from './components/Nav/Nav.jsx';
import { Footer } from './components/Nav/Footer.jsx'
import { Units } from './components/Units/Units.jsx'
import { Topics } from './components/Units/Topics.jsx';
import { Admin } from './components/Admin/Admin.jsx'
import { Repetitions } from './components/Repetitions/Repetitions.jsx';
import { Friends } from './components/Friends/Friends.jsx';
import { Groups } from './components/Groups/Groups.jsx';
import { Ranking } from './components/Ranking/Ranking.jsx';
import { Questions } from './components/Units/Questions.jsx';
import { Search } from './components/Search/Search.jsx';
import DataService from "./DataService.js"

export const AppContext = createContext();

function App() {
  const [UserData, SetUserData] = useState({});
  const [AppReady, SetAppReady] = useState(false);
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (keycloak.authenticated) {
      DataService.GetUserData(keycloak.token).then((res) => {
        SetUserData(res.data)
        SetAppReady(true)
      })
    } else if (initialized) { // keycloak loaded but not logged in
      SetAppReady(true)
    }
  }, [keycloak, initialized])


  return (
    (!AppReady) ? <LoadingScreen/> :
    <div id="App">
      <AppContext.Provider value={{UserData, SetUserData, AppReady}}>
        <Nav/>
        <Routes>
          <Route path='' element={<Home/>}/>
          
          {keycloak.authenticated && (<>
            <Route path='profile/:id' element={<Profile/>}/>
            <Route path='groups/:id' element={<Group/>}/>
            <Route path='repetitions' element={<Repetitions />} />
            <Route path='repetitions/set' element={<Questions type='repetition'/>} />
            <Route path='units/:unitid/:topicid' element={<Questions type='normal'/>} />
            <Route path='units/:unitid' element={<Topics/>}/>
            <Route path='units' element={<Units/>}/>
            <Route path='friends' element={<Friends/>}/>
            <Route path='groups' element={<Groups/>}/>
            <Route path='ranking' element={<Ranking />} />
            <Route path='search' element={<Search />} />
            {keycloak.hasRealmRole('app-admin') && <Route path='admin' element={<Admin />} />}
          </>)}

          <Route path='*' element={<NotFound/>}/>
        </Routes>
        <Footer/>
      </AppContext.Provider>
    </div>
  )
}

export default App;
