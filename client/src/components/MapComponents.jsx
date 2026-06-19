import { ListGroup } from "react-bootstrap";

function StationsView(props) {
    const stations = props.stations;
    const cellSize = props.cellSize;
    const offsetX = props.offsetX;
    const offsetY = props.offsetY;

    return (
        <>
            {stations.map(st => {
                const px = offsetX + st.x*cellSize;
                const py = offsetY + st.y*cellSize;

                return <g key={st.id}>
                    <circle cx={px} cy={py} r={8} fill="white" stroke="black" strokeWidth={2}/>
                    <text x={px + 12} y={py + 4}>{st.station_name}</text>
                </g>
            })}
        </>
    );
}

function SegmentsView(props) {
    const segments = props.segments;
    const cellSize = props.cellSize;
    const offsetX = props.offsetX;
    const offsetY = props.offsetY;

    return (
        <>
            {segments.map(seg => {
                const px1 = offsetX + seg.x1*cellSize;
                const py1 = offsetY + seg.y1*cellSize;
                const px2 = offsetX + seg.x2*cellSize;
                const py2 = offsetY + seg.y2*cellSize;

                return <line key={seg.id} x1={px1} y1={py1} x2={px2} y2={py2} stroke="black" strokeWidth={2}/>
            })}
        </>
    );
}

function LinesView(props) {
    const lines = props.lines;
    return (<ListGroup>
        {lines.map(line => <ListGroup.Item key={line.id}>
                {line.line_name}
           </ListGroup.Item>
        )}
    </ListGroup>);
}

export { StationsView, SegmentsView, LinesView }