import { useContext, useState } from 'react'

import { Container } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router';

import { Layout, HomeView } from './components/Layout.jsx';
import { LoginForm, Logout } from './components/LoginOut.jsx';
import StartView from './components/StartView.jsx';
import ResultView from './components/ResultView.jsx';
import RankingsView from './components/RankingsView.jsx';
import PlanningView from './components/PlanningView.jsx';
import ExecutionView from './components/ExecutionView.jsx';

import UserContext from './contexts/UserContext.js';

function App() {

    const navigate = useNavigate();

    // User Handling

    const [user, setUser] = useState({id: undefined, name: undefined, surname: undefined, email:undefined});

    const updateUser = (newUser) => {
        setUser({id: newUser.id, name: newUser.name, surname: newUser.surname, email: newUser.email});
        navigate('/');
    }

    return (
        <UserContext.Provider value={user}>
            <Container>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={<HomeView />} />
                        <Route path='game' element={<StartView />} />
                        <Route path='planning' element={<PlanningView />} />
                        <Route path='execute' element={<ExecutionView />} />
                        <Route path='result' element={<ResultView />} />
                        <Route path='rankings' element={<RankingsView name={user.name} surname={user.surname}/>} />
                        <Route path='login' element={<LoginForm updateUser={updateUser}/>} />
                        <Route path='logout' element={<Logout updateUser={updateUser}/>} />
                    </Route>
                </Routes>
            </Container>
        </UserContext.Provider>
    )
}

export default App
