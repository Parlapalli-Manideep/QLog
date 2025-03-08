import React, { useState } from "react";
import axios from "axios";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useLocation } from "react-router-dom";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const BASE_URL = "http://localhost:3000/users";

const AuthPage = () => {
  const location = useLocation()
  const role = location.state.role ||{}
  console.log("Role: ",role)  

  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(BASE_URL);
      if (res.data.some((user) => user.email === email)) {
        return setMessage("User already exists! Please log in.");
      }
      await createUserWithEmailAndPassword(auth, email, password);
      const newUser = { id: Date.now(), name, email, method: "email" };
      await axios.post(BASE_URL, newUser);
      setMessage("Signup Successful! Redirecting to login...");
      setIsSignup(false);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(BASE_URL);
      const user = res.data.find((user) => user.email === email && user.method === "email");
      if (!user) {
        return setMessage("No account found. Please sign up.");
      }
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login Successful!");
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await axios.get(BASE_URL);
      if (!res.data.some((u) => u.email === user.email)) {
        await axios.post(BASE_URL, { id: Date.now(), name: user.displayName, email: user.email, method: "google" });
      }
      setMessage("Google Sign-in Successful!");
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-75 shadow-lg rounded">
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/bb/a3/97/predator-ride-in-the.jpg?w=900&h=500&s=1"
            alt="Auth Illustration"
            className="img-fluid w-100 h-100 rounded-start"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="col-md-6 p-5 text-center">
          <h2 className="mb-4">{isSignup ? "Sign Up" : "Log In"}</h2>
          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            {isSignup && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {isSignup ? "Sign Up" : "Log In"}
            </button>
          </form>

          <hr className="my-4" />
          <button className="btn btn-danger w-100" onClick={handleGoogleSignIn}>
            <i className="bi bi-google me-2"></i> Sign in with Google
          </button>

          <p className="mt-3">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Log in" : "Sign up"}
            </span>
          </p>
          {message && <p className="text-danger mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
