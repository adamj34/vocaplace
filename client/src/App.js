import './style.scss';
import { Routes, Route } from 'react-router-dom';

import { NotFound } from './components/NotFound';
import { Home } from './components/Home/Home';
import { Profile } from './components/Profile/Profile';
import { Group } from'./components/Group/Group'
import { SubmitTask } from './components/SubmitTask/SubmitTask';
import { Nav } from './components/Nav/Nav';

function App() {
  return (
    <div id="App">
      <Nav/>
     <Routes>
          <Route path='' element={<Home/>}/>
          <Route path='profile/:id' element={<Profile/>}/>
          <Route path='group/:id' element={<Group/>}/>
          <Route path='task/submit' element={<SubmitTask/>}/>


          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path='*' element={<NotFound/>}/>
        </Routes>
    </div>
    
  );
}

export default App;
