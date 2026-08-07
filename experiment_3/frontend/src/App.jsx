import { useState } from "react";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );
    const [message, setMessage] = useState("");

    // Login
    const login = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            // Store JWT token
            localStorage.setItem("token", data.token);
            setToken(data.token);

            setMessage("Login successful!");
        } catch (error) {
            console.error(error);
            setMessage("Server error");
        }
    };

    // Access protected profile
    const accessProfile = async () => {
        try {
            const response = await fetch(
                "http://127.0.0.1:5000/profile",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            setMessage(
                `${data.message}\nWelcome ${data.user.username}`
            );
        } catch (error) {
            console.error(error);
            setMessage("Server error");
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUsername("");
        setPassword("");
        setMessage("Logged out successfully");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f4f6f8"
            }}
        >
            <div
                style={{
                    width: "380px",
                    padding: "35px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                    textAlign: "center"
                }}
            >
                <h1>JWT Authentication</h1>

                {!token ? (
                    <form onSubmit={login}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            style={{
                                width: "90%",
                                padding: "10px",
                                margin: "10px 0"
                            }}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            style={{
                                width: "90%",
                                padding: "10px",
                                margin: "10px 0"
                            }}
                        />

                        <button
                            type="submit"
                            style={{
                                padding: "10px 25px",
                                marginTop: "10px",
                                cursor: "pointer"
                            }}
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <div>
                        <p>You are logged in.</p>

                        <button
                            onClick={accessProfile}
                            style={{
                                padding: "10px 20px",
                                margin: "10px",
                                cursor: "pointer"
                            }}
                        >
                            Access Protected Profile
                        </button>

                        <br />

                        <button
                            onClick={logout}
                            style={{
                                padding: "10px 25px",
                                cursor: "pointer"
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}

                {message && (
                    <p
                        style={{
                            marginTop: "20px",
                            whiteSpace: "pre-line"
                        }}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;