/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";

const Auth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTabUrl, setCurrentTabUrl] = useState(""); // Your existing state

  // NEW: State for email/password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to request Firebase user state from background
  const getFirebaseUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chrome.runtime.sendMessage({
        type: "GET_FIREBASE_USER",
      });
      if (response.user) {
        setUser(response.user);
        console.log("Current Firebase user:", response.user);
      } else {
        setUser(null);
        console.log("No Firebase user found.");
      }
    } catch (err) {
      console.error("Error getting Firebase user:", err);
      setError("Failed to get user status.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chrome.runtime.sendMessage({
        type: "FIREBASE_SIGN_IN_GOOGLE",
      });
      if (response.success) {
        setUser(response.user);
        console.log("Signed in Firebase with Google:", response.user);
      } else {
        setError(response.error || "Sign-in with Google failed.");
        console.error("Google Sign-in error:", response.error);
      }
    } catch (err) {
      setError("An unexpected error occurred during Google sign-in.");
      console.error("Unexpected Google sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to handle Email Sign Up
  const handleEmailSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chrome.runtime.sendMessage({
        type: "FIREBASE_SIGN_UP_EMAIL",
        email,
        password,
      });
      if (response.success) {
        setUser(response.user);
        console.log("Signed up Firebase with Email:", response.user);
      } else {
        setError(response.error || "Email sign-up failed.");
        console.error("Email sign-up error:", response.error);
      }
    } catch (err) {
      setError("An unexpected error occurred during email sign-up.");
      console.error("Unexpected email sign-up error:", err);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to handle Email Sign In
  const handleEmailSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chrome.runtime.sendMessage({
        type: "FIREBASE_SIGN_IN_EMAIL",
        email,
        password,
      });
      if (response.success) {
        setUser(response.user);
        console.log("Signed in Firebase with Email:", response.user);
      } else {
        setError(response.error || "Email sign-in failed.");
        console.error("Email sign-in error:", response.error);
      }
    } catch (err) {
      setError("An unexpected error occurred during email sign-in.");
      console.error("Unexpected email sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Sign-Out
  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chrome.runtime.sendMessage({
        type: "FIREBASE_SIGN_OUT",
      });
      if (response.success) {
        setUser(null);
        setEmail(""); // Clear inputs on sign out
        setPassword("");
        console.log("Signed out from Firebase.");
      } else {
        setError(response.error || "Sign-out failed.");
        console.error("Sign-out error:", response.error);
      }
    } catch (err) {
      setError("An unexpected error occurred during sign-out.");
      console.error("Unexpected sign-out error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Your existing logic for tab URL ---
  useEffect(() => {
    // Request current tab URL on component mount
    chrome.runtime.sendMessage({ type: "get_tab_url" }, (response) => {
      if (response && response.url) {
        setCurrentTabUrl(response.url);
      }
    });

    // Listen for URL updates from background.js
    //   const listener = (message, sender, sendResponse) => {
    const listener = (message) => {
      if (message.type === "tab_url_updated") {
        setCurrentTabUrl(message.url);
      }
    };
    chrome.runtime.onMessage.addListener(listener);

    // Clean up listener
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);
  // --- End of existing logic ---

  // Check Firebase user status on component mount
  useEffect(() => {
    getFirebaseUser();
  }, []);

  return (
    <div className="App p-4">
      <h1 className="text-xl font-bold mb-4">Upwork Quick Cover Letter</h1>
      <p className="text-gray-600 mb-4">Current Tab URL: {currentTabUrl}</p>

      <div className="auth-section border p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Authentication</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : user ? (
          <div>
            <p>Welcome, {user.displayName || user.email}!</p>
            <p className="text-sm text-gray-500">UID: {user.uid}</p>
            <button
              onClick={handleSignOut}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2">Please sign in or sign up.</p>

            {/* Email/Password Inputs */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />

            {/* Email/Password Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleEmailSignUp}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sign Up with Email
              </button>
              <button
                onClick={handleEmailSignIn}
                className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Sign In with Email
              </button>
            </div>

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In with Google
            </button>
          </div>
        )}
      </div>

      {/* Your other application content goes here */}
      <div className="mt-6">
        <p>This is where your cover letter generation UI would go, accessible after sign-in.</p>
        {user && (
            <div className="mt-4 p-3 border rounded">
                <h3 className="font-semibold">User Data from Firestore (example)</h3>
                <p>User is signed in and registered in Firestore.</p>
                <p>Email: {user.email}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
