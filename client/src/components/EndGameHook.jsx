import { useContext } from "react";
import { useNavigate } from "react-router"

import GameStatusContext from "../contexts/GameStatusContext";
import GameScoreContext from "../contexts/GameScoreContext";
import GameRouteContext from "../contexts/GameRouteContext";


function useEndGame() {
    const {isPlaying, setIsPlaying} = useContext(GameStatusContext);
    const {gameScore, reasonScore, setGameScore, setReasonScore} = useContext(GameScoreContext);
    const {startStation, endStation, selectedSegments, setStartStation, setEndStation, setSelectedSegments} = useContext(GameRouteContext);

    function endGame() {
        setIsPlaying(false);
        setGameScore(null);
        setReasonScore("");
        setStartStation(null);
        setEndStation(null);
        setSelectedSegments(null);
    }

    return endGame;
}

export default useEndGame;
