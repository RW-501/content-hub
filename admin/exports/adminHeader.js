// adminHeader.js

// authSection.js
(function () {
  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `

  main {
    min-height: 100%;
}

.hidden {
display = "none";
}
    #auth-section {
      place-items: center;
      width: 50%;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: all 0.3s ease-in-out;
      font-family: Arial, sans-serif;
    }

    @media (max-width: 768px) {
      #auth-section {
        width: 80%;
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      #auth-section {
        width: 95%;
        padding: 1rem;
      }
    }

    #auth-section h2 {
      margin-bottom: 1rem;
      color: #1f2937;
    }

    #auth-section input {
      width: 100%;
      padding: 10px;
      margin: 0.5rem 0;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      font-size: 14px;
    }

    #auth-section button {
      width: 100%;
      padding: 10px;
      margin-top: 1rem;
      background: #4f46e5;
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s;
    }

    #auth-section button:hover {
      background: #4338ca;
    }
  `;
  document.head.appendChild(style);

})();


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDoc,  setDoc, doc, updateDoc, arrayUnion, addDoc, serverTimestamp, deleteDoc  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { showToast } from "https://contenthub.guru/exports/showToast.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBXZcSYdspfi2jBipwUFeNmKZgU02ksg8c",
  authDomain: "contentmanagement-8af61.firebaseapp.com",
  projectId: "contentmanagement-8af61",
  storageBucket: "contentmanagement-8af61.firebasestorage.app",
  messagingSenderId: "579537581112",
  appId: "1:579537581112:web:736c7faafaf1391ce1e2cd",
  measurementId: "G-ZPWGF7YMPE"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export function loadAdminHeader(targetId = "admin-header") {
  const container = document.getElementById(targetId);
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Hover effect helper
  function addHoverEffect(btn) {
    btn.addEventListener("mouseenter", () => (btn.style.opacity = "0.8"));
    btn.addEventListener("mouseleave", () => (btn.style.opacity = "1"));
  }

  // Generic button creator
  function createDashboardButton(text, url, bgColor = "#4f46e5", onClick,ID) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className = "btn-dashboard";
    btn.style.background = bgColor;
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.padding = "6px 12px";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.id = ID;

    if (onClick) {
      btn.addEventListener("click", onClick);
    } else if (url) {
      btn.addEventListener("click", () => (window.location.href = url));
    }

    addHoverEffect(btn);
    return btn;
  }

  // Header wrapper
  const header = document.createElement("header");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.padding = "15px 20px";
  header.style.background = "#1f2937";
  header.style.color = "#fff";
  header.style.fontFamily = "Arial, sans-serif";
  header.style.flexWrap = "wrap";
  header.style.gap = "10px";

  // Left section: Title
  const title = document.createElement("h2");
  title.textContent = "Admin Dashboard";
  title.style.margin = "0";
  header.appendChild(title);

  // Right section: Buttons
  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.alignItems = "center";
  btnContainer.style.gap = "10px";

  // Add buttons
  btnContainer.appendChild(createDashboardButton("Home", "https://contenthub.guru"));
  btnContainer.appendChild(createDashboardButton("Admin Home", "https://contenthub.guru/admin"));
  btnContainer.appendChild(createDashboardButton("Sitemap", "https://contenthub.guru/admin/sitemap.html", "#10b981"));
  btnContainer.appendChild(createDashboardButton("Linker", "https://contenthub.guru/admin/linker.html", "#10b981"));
  btnContainer.appendChild(createDashboardButton("Translate", "https://contenthub.guru/admin/translate.html", "#36099fff"));
  btnContainer.appendChild(createDashboardButton("SEO Helper", "https://contenthub.guru/admin/seo-helper.html", "#f59e0b"));
  btnContainer.appendChild(createDashboardButton("Show Analytics", null, "#10b981", () => {
    const analyticsPanel = document.getElementById("analyticsPanel");
    if (analyticsPanel) analyticsPanel.style.display = analyticsPanel.style.display === "none" ? "block" : "none";
  },"showAnalytics"));
  btnContainer.appendChild(createDashboardButton("Logout", null, "#ef4444", async () => {
    if (window.firebase && firebase.auth) {
      await firebase.auth().signOut();
      window.location.reload();
    }
  },'logoutBtn'));

  header.appendChild(btnContainer);
  container.appendChild(header);
}


function loadFontAwesome() {
  const id = "fontawesome-css";
  if (document.getElementById(id)) return; // prevent duplicates

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  link.crossOrigin = "anonymous";

  document.head.appendChild(link);
}

// Usage
loadFontAwesome();
