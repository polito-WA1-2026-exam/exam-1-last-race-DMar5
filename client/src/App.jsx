import { useContext, useEffect, useState } from 'react'
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
import StationsContext from './contexts/StationsContext.js';
import SegmentsContext from './contexts/SegmentsContext.js';
import GameScoreContext from './contexts/GameScoreContext.js';
import GameRouteContext from './contexts/GameRouteContext.js';

import { getStations, getSegments } from './api/api.js';

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
            <AppProvider>
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
            </AppProvider>
        </UserContext.Provider>
    )
}

function AppProvider({children}) {
    return (<StationsProvider>
        <SegmentsProvider>
            <GameProvider>
                {children}
            </GameProvider>
        </SegmentsProvider>
    </StationsProvider>);
}

function StationsProvider({children}) {
    const user = useContext(UserContext);

    const [stations, setStations] = useState([]);
    const [errorSt, setError] = useState("");

    useEffect(() => {
        async function getStationsList() {
            try {
                if (!user.id) {
                    setStations([]);
                    return;
                }
                else {
                    const list_stations = await getStations();
                    setStations(list_stations);
                    setError("");
                }
            }
            catch(err) {
                setError(err.message);
            }
        }
        getStationsList();
    }, [user.id]);

    return (<StationsContext.Provider value={{stations, errorSt}}>
        {children}
    </StationsContext.Provider>);
    
}

function SegmentsProvider({children}) {
    const user = useContext(UserContext);

    const [segments, setSegments] = useState([]);
    const [errorSeg, setError] = useState("");

    useEffect(() => {
        async function getSegmentsList() {
            try {
                if (!user.id) {
                    setSegments([]);
                    return;
                }
                else {
                    const list_segments = await getSegments();
                    setSegments(list_segments);
                    setError("");
                }
            }
            catch(err) {
                setError(err.message);
            }
        }
        getSegmentsList();
    }, [user.id]);

    return (<SegmentsContext.Provider value={{segments, errorSeg}}>
        {children}
    </SegmentsContext.Provider>);
}

function GameProvider({children}) {
    const [startStation, setStartStation] = useState(null);
    const [endStation, setEndStation] = useState(null);
    const [selectedSegments, setSelectedSegments] = useState(new Set());
    const [gameScore, setGameScore] = useState(20);
    const [reasonScore, setReasonScore] = useState("");
    return (<GameScoreContext.Provider value={{gameScore, reasonScore, setGameScore, setReasonScore}}>
        <GameRouteContext.Provider value={{startStation, endStation, selectedSegments, setStartStation, setEndStation, setSelectedSegments}}>
            {children}
        </GameRouteContext.Provider>
    </GameScoreContext.Provider>);
}

export default App