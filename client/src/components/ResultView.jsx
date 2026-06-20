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
                const result = await saveScore(score);
                if (result === "OK") {
                    saved.current = true;
                }
                else {
                    setErrorScore(result);
                }
                
            }
            catch(err) {
                setErrorScore(err.message);
            } 
        }
        if (!saved.current)
            storeScore(currScore);
    }, [currScore]);

    if (errorScore) {
        return <div className="text-danger">{errorScore}</div>;
    }

    return (<div className="d-flex flex-column align-items-center mt-5">
        <h1 className="fw-bold text-info display-3 mb-3">Final score</h1>
        {reasonScore && <p className="text-muted fs-5 mb-2">{reasonScore}</p>}
        <div className="display-1 fw-bold text-info mb-4">{currScore}</div>
        <Button className="fw-semibold" variant="success" onClick={() => navigate('/game/start')}>Play again</Button>
    </div>);
}

export default ResultView