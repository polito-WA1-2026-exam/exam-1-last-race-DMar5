import { Button } from "react-bootstrap"
import { useNavigate } from "react-router"

function StartView() {
    const navigate = useNavigate();
    return <>
        <h1>Here you can start the game</h1>
        <Button onClick={() => navigate('/planning')}> Play </Button>
    </>;
}

export default StartView