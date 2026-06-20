import { useState, useEffect } from 'react';

import { ListGroup, Badge, Card } from 'react-bootstrap';

import { getOrderedScores } from '../api/api';

function RankingsView(props) {

    const [scores, setScores] = useState([]);
    const [errormsg, setErrormsg] = useState("");

    useEffect(() => {
        async function getUserScores() {
            try {
                const [orderedScores, message] = await getOrderedScores();
                if (!message) {
                    setScores(orderedScores);
                }
                else {
                    setErrormsg(message);
                }
            }
            catch(err) {
                setErrormsg(err.message);
            }
        }
        getUserScores();
    }, []);

    return <div className="d-flex justify-content-center mt-4">
        <Card className="p-4 shadow-sm" style={{ width: "600px" }}>
            <h3 className="text-center mb-3 text-info fw-bold"> { "Scores of " + props.name + " " + props.surname } </h3>
            { errormsg ? <div className="text-danger text-center">{errormsg}</div> : <ScoresView scores={scores}/> }
        </Card>
    </div>;
}

function ScoresView(props) {
    let result;
    const listScores = props.scores; 

    if (!listScores) {
        result = <div className="text-danger">ERROR: listScores is not available</div>
    }
    else if (listScores.length === 0) {
        result = <div className="text-muted text-center">No scores yet</div>;
    }
    else {
        result = <ListGroup>{
                listScores.map((score, index) => 
                <ListGroup.Item key={"Score " + score.id} 
                                variant={index === 0 ? "info" : undefined}
                                className={
                                    "d-flex justify-content-between align-items-center" +
                                    (index === 0 ? "bg-opacity-25 border-info border-3" : "")
                                }>
                    <span className="fw-bold fs-4">{score.value}</span>
                    <Badge bg="info" className="text-dark fs-6">{score.date}</Badge>
                </ListGroup.Item>)
            }</ListGroup>;
    }

    return result;
}

export default RankingsView