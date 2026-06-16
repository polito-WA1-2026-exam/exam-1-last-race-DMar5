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
            return user;
        }
        else {
            throw new Error("Login failed");
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
            return true;
        }
        else {
            throw new Error("Logout failed");
        }
    }
    catch(err) {
        throw new Error("Network error", {cause:err});
    }
}

async function checkSession() {
    try {
        const response = await fetch("http://localhost:3001/api/sessions/current", { credentials: "include" });
        if (response.ok) {
            return await response.json();
        }
        else {
            return null;
        }
    }
    catch(err) {
        throw new Error("Network error", {cause:err});
    }
}

export { doLogin, doLogout, checkSession }