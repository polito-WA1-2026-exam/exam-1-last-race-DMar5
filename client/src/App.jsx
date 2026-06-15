import { useState } from 'react'

import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router';

import { Layout, HomeView } from './components/Layout.jsx'
import { LoginForm, Logout } from './components/LoginOut.jsx'
import { StartView } from './components/StartView.jsx'
import { ResultView } from './components/ResultView.jsx'
import { RankingsView } from './components/RankingsView.jsx'
import { PlanningView } from './components/PlanningView.jsx'
import { ExecutionView } from './components/ExecutionView.jsx'

function App() {

    return (
        <Container>
            <Routes>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<HomeView/>} /> {/*View of rules*/}
                    <Route path='game' element={<StartView/>} />
                    <Route path='planning' element={<PlanningView/>} />
                    <Route path='execute' element={<ExecutionView/>} />
                    <Route path='result' element={<ResultView/>} />
                    <Route path='rankings' element={<RankingsView/>} />
                    <Route path='login' element={<LoginForm/>} />
                    <Route path='logout' element={<Logout/>} />
                </Route>
            </Routes>
        </Container>
    )
}

export default App
