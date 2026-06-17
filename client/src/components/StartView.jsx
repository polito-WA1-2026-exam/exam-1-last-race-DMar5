import { Button } from "react-bootstrap"
import { useNavigate } from "react-router"
import { StationsView, SegmentsView } from "./MapComponents";
import { useContext } from "react";
import StationsContext from "../contexts/StationsContext";
import SegmentsContext from "../contexts/SegmentsContext";

function StartView() {
    const {stations, errorSt} = useContext(StationsContext);
    const {segments, errorSeg} = useContext(SegmentsContext);

    const navigate = useNavigate();

    // Error handling
    if (errorSt) {
        return (<div>{"Error with stations loading " + errorSt}</div>);
    }

    else if (errorSeg) {
        return (<div>{"Error with segments loading " + errorSeg}</div>);
    }

    else if (stations.length === 0) {
        return (<div>{"Error: stations list is empty"}</div>);
    }

    else if (segments.length === 0) {
        return (<div>{"Error: segments list is empty"}</div>);
    }
        
    else {
        const offsetX = 20;
        const offsetY = 20;
        const cellSize = 50;

        return (
            <div>
                <svg width={700} height={600}>
                    <StationsView stations={stations} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
                    <SegmentsView segments={segments} offsetX={offsetX} offsetY={offsetY} cellSize={cellSize}/>
                </svg>
                <Button onClick={() => navigate('/planning')}> Play </Button>
            </div>
        );
    }
}

export default StartView