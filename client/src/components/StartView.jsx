import { useContext } from "react";
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router"

import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";
import LinesContext from "../contexts/LineContext";
import GameScoreContext from "../contexts/GameScoreContext";

import { StationsView, SegmentsView, LinesView } from "./MapComponents";

function StartView() {
    const {stations} = useContext(StationsContext);
    const {segments} = useContext(SegmentsContext);
    const {lines} = useContext(LinesContext);

    const navigate = useNavigate();

    const offsetX = 20;
    const offsetY = 20;
    const cellSize = 50;
        
    return (
        <div>
            <LinesView lines={lines}/>
            <svg width={700} height={600}>
                <StationsView stations={stations} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
                <SegmentsView segments={segments} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
            </svg>
            <Button onClick={() => navigate('/game/planning')}> Play </Button>
        </div>
    );
    
}

export default StartView