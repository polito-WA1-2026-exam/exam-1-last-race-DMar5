import { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { doLogin, doLogout } from '../api/auth.js';

function LoginForm(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errormsg, setErrormsg] = useState("");

    const doSubmit = async (ev) => {
        ev.preventDefault();
        setErrormsg("");

        try {
            if (!username || !password) {
                setErrormsg("Please, fill in all the fields.");
                return;
            }
            const user = await doLogin(username, password);
            props.updateUser(user);
        }
        catch(err) {
            setErrormsg(err.message);
        }
    } 

    return <Container onSubmit={doSubmit}>
        <Form>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={username} onChange={(ev) => setUsername(ev.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
            {errormsg && <div className="text-danger">{errormsg}</div>}
        </Form>
    </Container>;
}

function Logout(props) {

    let result = "Logout completed";

    useEffect(()=>{
        doLogout().then(props.updateUser({id: undefined, name: undefined, surname: undefined, email: undefined}))
                  .catch((err)=> result = err.message);
    }, []);

    return <h1>{result}</h1>;
}

export { LoginForm, Logout }