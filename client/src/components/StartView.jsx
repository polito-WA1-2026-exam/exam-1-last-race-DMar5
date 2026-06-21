import { useContext } from "react";
import { Button, Card } from "react-bootstrap"
import { useNavigate } from "react-router"

import { FaMapLocationDot } from "react-icons/fa6";

import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";
import LinesContext from "../contexts/LineContext";
import GameScoreContext from "../contexts/GameScoreContext";
import GameStatusContext from "../contexts/GameStatusContext";

import { StationsView, SegmentsView, LinesView } from "./MapComponents";

function StartView() {
    const {stations} = useContext(StationsContext);
    const {segments} = useContext(SegmentsContext);
    const {lines} = useContext(LinesContext);
    const {isPlaying, setIsPlaying} = useContext(GameStatusContext);

    const navigate = useNavigate();

    const offsetX = 25;
    const offsetY = 25;
    const cellSize = 60;

    function handleStart() {
        setIsPlaying(true);
        navigate('/game/planning')
    }
        
    return ( <>
        <div className="d-flex mt-1 justify-content-center">
            <div className="p-3 d-flex gap-4 align-items-start" style={{ maxWidth: "1200px", width: "100%" }}>
                <Card className="bg-light shadow-sm" style={{ width: "220px" }}>
                    <LinesView lines={lines}/>
                </Card>
                <svg width={750} height={640} className="border border-dark-subtle rounded">
                    <foreignObject x={690} y={10} width={40} height={40}>
                        <FaMapLocationDot style={{ color: "DeepPink", width: "100%", height: "100%" }}/>
                    </foreignObject>
                    <SegmentsView segments={segments} lines={lines} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
                    <StationsView stations={stations} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
                </svg>
            </div>
        </div>
        <div className="d-flex justify-content-center mb-3">
            <Button className="fw-semibold" variant="success" onClick={() => handleStart()}> Play </Button>
        </div>
    </>
    );
    
}

export default StartView