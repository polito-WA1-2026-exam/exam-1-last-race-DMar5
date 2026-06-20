import { useState, useEffect } from 'react';

import { ListGroup, Badge } from 'react-bootstrap';

import { getOrderedScores } from '../api/api';

function RankingsView(props) {

    const [scores, setScores] = useState([]);
    const [errormsg, setErrormsg] = useState("");

    useEffect(() => {
        async function getUserScores() {
            try {
                const [orderedScores, message] = await getOrderedScores();
                if ("OK") {
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

    return <>
        <h1> { "Scores of " + props.name + " " + props.surname } </h1>
        { errormsg ? <div>{errormsg}</div> : <ScoresView scores={scores}/> }
    </>;
}

function ScoresView(props) {
    let result;
    const listScores = props.scores; 

    if (!listScores) {
        result = <div>ERROR: listScores is not available</div>
    }
    else if (listScores.length === 0) {
        result = <div>No scores yet</div>;
    }
    else {
        result = <ListGroup>{
                listScores.map((score) => <ListGroup.Item key={"Score " + score.id}>
                    {score.value + "       "}
                    <Badge>{score.date}</Badge>
                </ListGroup.Item>)
            }</ListGroup>;
    }

    return result;
}

export default RankingsView