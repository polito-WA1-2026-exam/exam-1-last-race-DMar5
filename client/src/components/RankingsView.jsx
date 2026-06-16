import { useState, useEffect } from 'react';

import { ListGroup, Badge } from 'react-bootstrap';

import { getOrderedScores } from '../api/api';

function RankingsView(props) {

    const [scores, setScores] = useState([]);
    const [errormsg, setErrormsg] = useState("");

    useEffect(() => {
        getOrderedScores().then((orderedScores) => setScores(orderedScores))
                        .catch((err) => setErrormsg(err.message))
    }, []);

    console.log("Scores state: " + scores);

    return <>
        <h1> { "Scores of " + props.name + " " + props.surname } </h1>
        { errormsg ? <div>{errormsg}</div> : <ScoresView scores={scores}/> }
    </>;
}

function ScoresView(props) {
    let result;
    const listScores = props.scores; 

    console.log("ScoresView received: " + listScores);

    if (!listScores) {
        result = <div>ERROR: listScores is not available</div>
    }
    else if (listScores.length === 0) {
        result = <div>No scores yet</div>;
    }
    else {
        result = <ListGroup>{
                listScores.map((score) => <ListGroup.Item>
                    {score.value + "       "}
                    <Badge>{score.date}</Badge>
                </ListGroup.Item>)
            }</ListGroup>;
    }

    return result;
}

export default RankingsView