/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'

const Auth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTabUrl, setCurrentTabUrl] = useState(''); // Your existing state
  
    // Function to request Firebase user state from background
    const getFirebaseUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_FIREBASE_USER' });
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
    const handleSignIn = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await chrome.runtime.sendMessage({ type: 'FIREBASE_SIGN_IN_GOOGLE' });
        if (response.success) {
          setUser(response.user);
          console.log("Signed in Firebase:", response.user);
        } else {
          setError(response.error || "Sign-in failed.");
          console.error("Sign-in error:", response.error);
        }
      } catch (err) {
        setError("An unexpected error occurred during sign-in.");
        console.error("Unexpected sign-in error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    // Function to handle Sign-Out
    const handleSignOut = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await chrome.runtime.sendMessage({ type: 'FIREBASE_SIGN_OUT' });
        if (response.success) {
          setUser(null);
          console.log("Signed out Firebase.");
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
          <p>Please sign in to use all features.</p>
          <button
            onClick={handleSignIn}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign In with Google
          </button>
        </div>
      )}
    </div>

    {/* Your other application content goes here */}
    <div className="mt-6">
      {/* Placeholder for your Upwork/Cover Letter logic */}
      <p>This is where your cover letter generation UI would go, accessible after sign-in.</p>
      {user && (
          <div className="mt-4 p-3 border rounded">
              <h3 className="font-semibold">User Data from Firestore (example)</h3>
              {/* You'd fetch and display specific user data from Firestore here if needed */}
              <p>User is signed in and registered in Firestore.</p>
              {/* Example of showing user's email from Firebase Auth, which is also implicitly in Firestore */}
              <p>Email: {user.email}</p>
              {/* More specific data from Firestore could be fetched here */}
          </div>
      )}
    </div>
  </div>
  )
}

export default Auth