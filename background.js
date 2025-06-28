//background.js
/* eslint-disable no-undef */


// Firebase imports
// import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// For Firebase App initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

// For Firebase Authentication
import { getAuth, GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// For Firebase Firestore
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyATdirGsASIu97iDkF09qPkalYrp6sWJMA",
  authDomain: "auth-extension-e9a97.firebaseapp.com",
  projectId: "auth-extension-e9a97",
  storageBucket: "auth-extension-e9a97.firebasestorage.app",
  messagingSenderId: "261523942348",
  appId: "1:261523942348:web:c49b440d35da2b5f258b69",
  measurementId: "G-H4DQNQM1P9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Firebase Authentication & Firestore Logic ---

async function handleGoogleSignInAndFirestoreRegistration() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ 'interactive': true }, async function(googleAccessToken) {
      if (chrome.runtime.lastError) {
        console.error("Google Auth Error:", chrome.runtime.lastError.message);
        return reject({ success: false, error: chrome.runtime.lastError.message });
      }

      try {
        // Use Google Access Token to sign in with Firebase
        // NOTE: For GoogleAuthProvider.credential, an ID Token is often preferred.
        // `chrome.identity.getAuthToken` provides an access token.
        // Firebase Auth's signInWithCredential often needs the ID token for Google.
        // You might need to fetch the ID token if accessToken alone isn't enough.
        // However, recent Firebase versions often handle the access token well for Google.

        // If you encounter issues, uncomment the following block to explicitly fetch ID token:
        /*
        const idTokenResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${googleAccessToken}`);
        if (!idTokenResponse.ok) {
            throw new Error(`Failed to get ID token: ${idTokenResponse.statusText}`);
        }
        const idTokenData = await idTokenResponse.json();
        const idToken = idTokenData.id_token;
        const credential = GoogleAuthProvider.credential(idToken); // Only ID token needed for this overload
        */

        // Simpler approach (often works with latest Firebase)
        const credential = GoogleAuthProvider.credential(null, googleAccessToken); // ID token, Access Token


        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        console.log("Firebase user signed in:", user.uid);

        // --- Handle Firestore registration/update ---
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // New user: Create a new document with initial data
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(), // Use serverTimestamp for accurate time
            lastLogin: serverTimestamp(),
            // Add any other custom initial fields here for new users
            plan: 'free',
            customSetting: 'default'
          });
          console.log("New user registered in Firestore:", user.uid);
        } else {
          // Existing user: Update lastLogin time (merge to avoid overwriting other fields)
          await setDoc(userDocRef, {
            lastLogin: serverTimestamp(),
          }, { merge: true });
          console.log("Existing user logged in, Firestore profile updated:", user.uid);
        }

        resolve({ success: true, user: user.toJSON() });

      } catch (firebaseError) {
        console.error("Firebase Sign-In/Firestore error:", firebaseError);
        reject({ success: false, error: firebaseError.message });
      }
    });
  });
}

async function handleFirebaseSignOut() {
  try {
    await firebaseSignOut(auth);
    console.log("Firebase user signed out.");
    return { success: true };
  } catch (error) {
    console.error("Firebase Sign-Out error:", error);
    return { success: false, error: error.message };
  }
}

async function getCurrentFirebaseUser() {
  return new Promise((resolve) => {
    // onAuthStateChanged is designed to be a long-lived listener.
    // For a single check, it's good practice to unsubscribe immediately.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve({ user: user.toJSON() });
      } else {
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
  if (message.type === "get_tab_url") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      sendResponse({ url: tab?.url || "" });
    });
    return true; // Allows async sendResponse
  }
  else if (message.type === 'FIREBASE_SIGN_IN_GOOGLE') { // NEW MESSAGE TYPE
    handleGoogleSignInAndFirestoreRegistration()
      .then(response => sendResponse(response))
      .catch(error => sendResponse(error));
    return true;
  } else if (message.type === 'FIREBASE_SIGN_OUT') { // NEW MESSAGE TYPE
    handleFirebaseSignOut()
      .then(response => sendResponse(response))
      .catch(error => sendResponse(error));
    return true;
  } else if (message.type === 'GET_FIREBASE_USER') { // NEW MESSAGE TYPE
    getCurrentFirebaseUser()
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ user: null, error: error.message }));
    return true;
  }
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
