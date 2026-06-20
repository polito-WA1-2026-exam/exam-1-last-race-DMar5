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
                    <circle cx={px} cy={py} r={4} fill="black" stroke="black" strokeWidth={2}/>
                    <text x={px + 4} 
                          y={py - 6} 
                          fontSize="14px" 
                          fontFamily="sans-serif"
                          letterSpacing="0.3px">{st.station_name}</text>
                </g>
            })}
        </>
    );
}

function SegmentsView(props) {
    const segments = props.segments;
    const lines = props.lines;
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
                const colour = lines.find(l => l.id === seg.line_id).line_colour;

                return <line key={seg.id} x1={px1} y1={py1} x2={px2} y2={py2} stroke={colour} strokeWidth={2}/>
            })}
        </>
    );
}

function LinesView(props) {
    const lines = props.lines;
    return (<div className="d-flex flex-column gap-2">
        {lines.map(line => <div key={line.id} className="d-flex align-items-center gap-2 ms-2">
          <div
            className="rounded"
            style={{
              width: "30px",
              height: "6px",
              backgroundColor: line.line_colour
            }}
          />
          <span className="fw-semibold" style={{color : line.line_colour}}>{line.line_name}</span>
        </div>
        )}
    </div>);
}

export { StationsView, SegmentsView, LinesView }