//background.js
/* eslint-disable no-undef */

// Firebase imports
// import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// For Firebase App initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

// For Firebase Authentication
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword, // <-- NEW
  signInWithEmailAndPassword, // <-- NEW
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// For Firebase Firestore
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyATdirGsASIu97iDkF09qPkalYrp6sWJMA",
  authDomain: "auth-extension-e9a97.firebaseapp.com",
  projectId: "auth-extension-e9a97",
  storageBucket: "auth-extension-e9a97.firebasestorage.app",
  messagingSenderId: "261523942348",
  appId: "1:261523942348:web:c49b440d35da2b5f258b69",
  measurementId: "G-H4DQNQM1P9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Helper function to handle Firestore user profile creation/update ---
// This function will now be called by the onAuthStateChanged listener
async function manageUserFirestoreProfile(user) {
  if (!user) {
    console.log("Firestore: User is null, skipping profile management.");
    return;
  }
  try {
    console.log("Firestore: Attempting to manage user profile for UID:", user.uid);
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.log("Firestore: User profile does not exist, creating new one.");
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null, // displayName might be null for email/password sign-ups initially
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        plan: 'free',
        customSetting: 'default'
      });
      console.log("Firestore: New user registered/updated in Firestore:", user.uid);
    } else {
      console.log("Firestore: User profile exists, updating lastLogin.");
      await setDoc(userDocRef, {
        lastLogin: serverTimestamp(),
      }, { merge: true });
      console.log("Firestore: Existing user logged in, Firestore profile updated:", user.uid);
    }
  } catch (firestoreError) {
    console.error("Firestore: Error managing user profile for UID", user.uid, ":", firestoreError);
    // DO NOT rethrow here, as this function is part of a listener,
    // not directly linked to a client-side promise rejection.
    // If a Firestore error occurs here, the user is still authenticated via Firebase Auth.
    // You might want to log this error to a remote monitoring service.
  }
}

// --- Firebase Authentication & Firestore Logic ---

// NEW: This listener will be the primary source of truth for user state changes
// It fires whenever the user logs in, logs out, or the token refreshes.
onAuthStateChanged(auth, (user) => {
  console.log("Auth State Changed! User:", user ? user.uid : "null");
  // Manage Firestore profile whenever auth state changes to a signed-in user
  manageUserFirestoreProfile(user);
});

async function handleGoogleSignIn() {
  console.log("Auth: Handling Google Sign-In request.");
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ 'interactive': true }, async function(googleAccessToken) {
      if (chrome.runtime.lastError) {
        console.error("Auth: Google Auth Error from chrome.identity:", chrome.runtime.lastError.message);
        return reject({ success: false, error: chrome.runtime.lastError.message });
      }
      if (!googleAccessToken) {
        console.error("Auth: Google Access Token not received.");
        return reject({ success: false, error: "Google Access Token not received." });
      }

      try {
        console.log("Auth: Signing in with Firebase credential from Google token.");
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user; // Get user from credential result

        console.log("Auth: Firebase user signed in (Google):", user.uid);
        // REMOVED: await manageUserFirestoreProfile(user);
        // This is now handled by the onAuthStateChanged listener, which is more reliable.

        resolve({ success: true, user: user.toJSON() });

      } catch (firebaseError) {
        console.error("Auth: Firebase Google Sign-In error:", firebaseError);
        reject({ success: false, error: firebaseError.message });
      }
    });
  });
}

// --- Email/Password Sign Up ---
async function handleEmailSignUp(email, password) {
  console.log("Auth: Handling Email Sign-Up request for email:", email);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Auth: Firebase user signed up (Email):", user.uid);
    // REMOVED: await manageUserFirestoreProfile(user);
    // This is now handled by the onAuthStateChanged listener.

    return { success: true, user: user.toJSON() };
  } catch (error) {
    console.error("Auth: Firebase Email Sign-Up error:", error);
    return { success: false, error: error.message || "An unknown error occurred during sign-up." };
  }
}

// --- Email/Password Sign In ---
async function handleEmailSignIn(email, password) {
  console.log("Auth: Handling Email Sign-In request for email:", email);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Auth: Firebase user signed in (Email):", user.uid);
    // REMOVED: await manageUserFirestoreProfile(user);
    // This is now handled by the onAuthStateChanged listener.

    return { success: true, user: user.toJSON() };
  } catch (error) {
    console.error("Auth: Firebase Email Sign-In error:", error);
    return { success: false, error: error.message || "An unknown error occurred during sign-in." };
  }
}

async function handleFirebaseSignOut() {
  console.log("Auth: Handling Firebase Sign-Out request.");
  try {
    await firebaseSignOut(auth);
    console.log("Auth: Firebase user signed out.");
    return { success: true };
  } catch (error) {
    console.error("Auth: Firebase Sign-Out error:", error);
    return { success: false, error: error.message };
  }
}

async function getCurrentFirebaseUser() {
  console.log("Auth: Checking current Firebase user status.");
  // Use onAuthStateChanged for a single-shot check. This ensures we're getting
  // the most accurate, up-to-date user object from Firebase Auth's internal state.
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Unsubscribe immediately after the first state is received
      if (user) {
        console.log("Auth: Found current user:", user.uid);
        resolve({ user: user.toJSON() });
      } else {
        console.log("Auth: No current user found.");
        resolve({ user: null });
      }
    });
  });
}
// --- Existing background.js logic with new message handlers ---

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// ✅ Respond to side panel asking for current tab URL
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background: Received message type:", message.type);

  // This `true` indicates that `sendResponse` will be called asynchronously.
  // We wrap the entire logic in a try-catch to ensure sendResponse is *always* called.
  let handled = false; // Flag to ensure we don't accidentally call sendResponse twice

  const sendResponseWrapper = (response) => {
    if (!handled) {
      sendResponse(response);
      handled = true;
    } else {
      console.warn("Background: sendResponse called multiple times for message type:", message.type);
    }
  };

  (async () => { // Use an async IIFE to await promises within the listener
    try {
      let response;
      if (message.type === "get_tab_url") {
        const tabs = await new Promise(res => chrome.tabs.query({ active: true, currentWindow: true }, res));
        const tab = tabs[0];
        response = { url: tab?.url || "" };
      } else if (message.type === 'FIREBASE_SIGN_IN_GOOGLE') {
        response = await handleGoogleSignIn();
      } else if (message.type === 'FIREBASE_SIGN_UP_EMAIL') {
        response = await handleEmailSignUp(message.email, message.password);
      } else if (message.type === 'FIREBASE_SIGN_IN_EMAIL') {
        response = await handleEmailSignIn(message.email, message.password);
      } else if (message.type === 'FIREBASE_SIGN_OUT') {
        response = await handleFirebaseSignOut();
      } else if (message.type === 'GET_FIREBASE_USER') {
        response = await getCurrentFirebaseUser();
      } else {
        console.warn("Background: Unknown message type received:", message.type);
        response = { success: false, error: "Unknown message type." };
      }
      sendResponseWrapper(response);
    } catch (e) {
      console.error("Background: Uncaught error in message listener for type", message.type, ":", e);
      // Ensure that even unexpected errors send a response
      sendResponseWrapper({ success: false, error: e.message || "An unhandled error occurred in background script." });
    }
  })();

  return true; // Important: Indicates that sendResponse will be called asynchronously
});

// ✅ Send URL update to side panel when tab changes
function notifySidePanelWithTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      chrome.runtime.sendMessage({
        type: "tab_url_updated",
        url: activeTab.url,
      });
    }
  });
}

// 🔄 When user switches tabs
chrome.tabs.onActivated.addListener(() => {
  console.log("Tab activated");
  notifySidePanelWithTabUrl();
});

// 🔁 When URL or page content is reloaded/changed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    console.log("Tab updated:", tab.url);
    notifySidePanelWithTabUrl();
  }
});

// 🔃 Vite HMR (only for dev)
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    chrome.runtime.reload();
  });
}
