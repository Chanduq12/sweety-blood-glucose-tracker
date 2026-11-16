import { useState } from "react";
import API from "./api";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        const response = await API.post("/auth/login", {
          email,
          password,
        });

        setToken(response.data.token);
      } else {
        const response = await API.post("/auth/register", {
          name,
          email,
          password,
        });

        setMessage(response.data.message + " Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong."
      );
    }
  };

  if (token) {
    return <Dashboard token={token} />;
  }

  return (
    <div className="app">
      <div className="auth-card">
        <div className="logo">💗 Sweety</div>

        <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>
        <p className="subtitle">Blood Glucose Tracker</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {message && <p className="switch">{message}</p>}

        <p className="switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;