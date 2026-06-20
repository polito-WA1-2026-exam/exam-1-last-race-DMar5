async function doLogin(username, password) {
    try {
        const response = await fetch("http://localhost:3001/api/sessions", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        if (response.ok) {
            const user = await response.json();
            return [user, null];
        }
        else {
            return [null, "Login failed: " + response.status + " " + response.statusText];
        }
    }
    catch(err) {
        throw new Error("Network error", {cause:err});
    }
}

async function doLogout() {
    try {
        const response = await fetch("http://localhost:3001/api/sessions/current", {
            method: "DELETE",
            credentials: "include"
        });
        if (response.ok) {
            return "OK";
        }
        else {
            return "Logout failed: " + response.status + " " + response.statusText;
        }
    }
    catch(err) {
        throw new Error("Network error", {cause:err});
    }
}

export { doLogin, doLogout }