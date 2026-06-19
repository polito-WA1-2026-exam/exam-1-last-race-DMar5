import { useContext, useEffect, useState, useRef } from "react";
import GameScoreContext from "../contexts/GameScoreContext";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { saveScore } from "../api/api";


function ResultView() {
    const {gameScore, setGameScore, reasonScore} = useContext(GameScoreContext);
    const navigate = useNavigate();
    const [errorScore, setErrorScore] = useState("");
    const saved = useRef(false);
    const [currScore, setCurrScore] = useState(null);

    useEffect(() => {
        if (gameScore === null) return;
        if (gameScore < 0) {
            setCurrScore(0);
        }
        else {
            setCurrScore(gameScore);
        }
        setGameScore(null);
    }, [gameScore]);

    useEffect(() => {
        if (currScore === null) return;
        async function storeScore(score) {
            try { 
                saved.current = await saveScore(score);;
            }
            catch(err) {
                setErrorScore(err.message);
            } 
        }
        if (!saved.current)
            storeScore(currScore);
    }, [currScore]);

    if (!saved && gameScore === null) {
        return <div>Loading score...</div>;
    }
    if (errorScore) {
        return <div>{errorScore}</div>;
    }

    return (<>
        <h1>Score</h1>
        {reasonScore && <div>{reasonScore}</div>}
        <div>{currScore}</div>
        <Button onClick={() => navigate('/game/start')}>Play again</Button>
    </>);
}

export default ResultView