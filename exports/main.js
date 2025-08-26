import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, 
    addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, arrayUnion  } 
    from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import { showToast } from "https://contenthub.guru/exports/showToast.js";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBXZcSYdspfi2jBipwUFeNmKZgU02ksg8c",
  authDomain: "contentmanagement-8af61.firebaseapp.com",
  projectId: "contentmanagement-8af61",
  storageBucket: "contentmanagement-8af61.appspot.com",
  messagingSenderId: "579537581112",
  appId: "1:579537581112:web:736c7faafaf1391ce1e2cd",
  measurementId: "G-ZPWGF7YMPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);




document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.style.opacity = 0;
    body.style.transition = "opacity 2s ease-in-out";
    body.style.opacity = 1;
    console.log('Loading...');
  });
  


const DEBUG = false;

let loadCount = 0;
let totalFileSize = 0; // To accumulate the file size of scripts
let pageStartTime = performance.now(); // Start tracking page load time
const loadedScripts = new Set();
const currentPath = window.location.pathname;



function logExecutionTime(scriptName, startTime, fileSize) {
    if (DEBUG) {
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        console.log(
            `${scriptName} initialized. Execution Time: ${executionTime.toFixed(2)} ms. File Size: ${fileSize}. Load Count: ${loadCount++}`
        );
    }

    // Add the file size to the total
    if (fileSize !== "unknown" && fileSize !== "not available") {
        totalFileSize += parseFloat(fileSize);
    }

    // Log the total page size and time when all scripts are loaded
    if (loadCount === "end") {
        const pageEndTime = performance.now();
        const pageLoadTime = (pageEndTime - pageStartTime) / 1000; // in seconds
        console.log(`Total Page Load Time: ${pageLoadTime.toFixed(2)} seconds.`);
        console.log(`Total Page Size: ${totalFileSize.toFixed(2)} KB.`);
    }
}

async function loadScript(src, { async = false, defer = false, type = 'text/javascript' } = {}, callback) {
    if (loadedScripts.has(src)) {
        console.log(`Script already loaded: ${src}`);
        if (callback) callback();
        return;
    }

    const startTime = performance.now();

    let fileSize = "unknown";
    try {
        const response = await fetch(src, { method: 'HEAD' });
        if (response.ok) {
            fileSize = response.headers.get('Content-Length');
            if (fileSize) {
                fileSize = `${(fileSize / 1024).toFixed(2)} KB`; // Convert to KB
            } else {
                fileSize = "not available";
            }
        } else {
            console.warn(`Unable to fetch file size for: ${src}`);
        }
    } catch (error) {
        console.error(`Error fetching file size for ${src}:`, error);
    }

    const script = document.createElement('script');
    script.src = src;
    script.type = type; // Set type to 'module' for ES6 modules
    script.async = async;
    script.defer = defer;
    script.onload = () => {
        loadedScripts.add(src);
        logExecutionTime(src, startTime, fileSize);
        if (callback) callback();
    };
    script.onerror = () => {
        console.error(`Error loading script: ${src}`);
    };

    document.head.appendChild(script);
}

// Wait until a specific DOM element exists
function waitForElement(selector, callback) {
    if (document.querySelector(selector)) {
        callback();
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(selector)) {
                obs.disconnect();
                callback();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}

// Function to load stylesheets
function loadStylesheet(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
        
    const defaultStyle = document.getElementById('default-style');

    defaultStyle.appendChild(link);
}


// Load Main CSS
loadStylesheet("https://contenthub.guru/exports/default.css");

// Load Bootstrap CSS
loadStylesheet("https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css");

// Load FontAwesome CSS
loadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");



function loadPageScripts() {

/*

loadScript('https://reelcareer.co/obituaries/setup/interactions.js', { async: true, type: 'module' }, () => {
    logExecutionTime('interactions', performance.now());
});




loadScript('https://reelcareer.co/obituaries/setup/footer.js', { defer: true }, () => {
    logExecutionTime('footer', performance.now());
});



loadScript('https://reelcareer.co/obituaries/setup/analytics.js', { defer: true, type: 'module' }, () => {
    logExecutionTime('analytics', performance.now());
});
*/

}

// Initialize page scripts after DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadPageScripts);












    const mainPhoto = document.getElementById('mainImage');
    const deviceShareButton = document.getElementById('deviceShareButton');
    const pageTitle = document.getElementById('pageTitle').textContent;
    const pageURL = document.getElementById('pageURL').textContent;
    const pageDescription = document.getElementById('pageDescription').textContent;
    
    if (navigator.share) {
      deviceShareButton.addEventListener('click', async () => {
        try {
          // Fetch the image as a Blob and create a File object
          const imageUrl = mainPhoto.src;
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    
          // Use the File object in the share method
          await navigator.share({
            title: pageTitle,
            text: pageDescription,
            url:  pageURL,
            files: [file], // Share the image file
          });
    
          showToast("info", "Shared successfully!");
        } catch (error) {
          console.error('Error sharing:', error);
        }
      });
    } else {
      deviceShareButton.style.display = 'none'; // Hide the button if the Web Share API is not supported
    }




const pageID = document.getElementById("pageID")?.textContent || "unknown";
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// 🔹 Update page views (total + daily)
async function updatePageViews(unique = false) {
  if (!pageID) return;

  const pageRef = doc(db, "pages", pageID);
  const pageSnap = await getDoc(pageRef);

  if (pageSnap.exists()) {
    const updates = {
      views: increment(1),
      lastVisited: new Date(),
      [`dailyViews.${today}`]: increment(1)
    };
    if (unique) updates.uniqueViews = increment(1); // increment unique views if needed
    await updateDoc(pageRef, updates);
  } else {
    await setDoc(pageRef, {
      views: 1,
      uniqueViews: unique ? 1 : 0,
      createdAt: new Date(),
      lastVisited: new Date(),
      dailyViews: { [today]: 1 }
    });
  }
}

// 🔹 Log visitor info (unique per day)
async function logVisitor(data) {
  const visitorId = `${pageID}_${data.ip}_${today}`;
  const visitorRef = doc(db, "page_visitors", visitorId);
  const visitorSnap = await getDoc(visitorRef);

  const pageTitle = document.title;
  const referrer = document.referrer || "Direct";
  const refDomain = referrer.includes("://") ? new URL(referrer).hostname : referrer;
  const device = /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
  const browser = navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)/i)?.[0] || "Other";

  const timestamp = new Date();
  let isUnique = false;

  if (!visitorSnap.exists()) {
    isUnique = true;
    await setDoc(visitorRef, {
      pageID,
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      device,
      browser,
      firstVisit: timestamp,
      lastVisit: timestamp,
      visits: 1,
      referrers: { [refDomain]: 1 },
      pagesViewed: [{ title: pageTitle, time: timestamp }]
    });
  } else {
    await updateDoc(visitorRef, {
      visits: increment(1),
      lastVisit: timestamp,
      [`referrers.${refDomain}`]: increment(1),
      pagesViewed: arrayUnion({ title: pageTitle, time: timestamp })
    });
  }

  // 🔹 Update aggregate stats in pages/{id}
  await updateDoc(doc(db, "pages", pageID), {
    views: increment(1),
    uniqueViews: isUnique ? increment(1) : increment(0),
    [`devices.${device}`]: increment(1),
    [`browsers.${browser}`]: increment(1)
  });

  // 🔹 Update per-location aggregation
  const locationRef = doc(db, "page_locations", pageID);
  await setDoc(locationRef, {
    countries: { [data.country_name]: increment(1) },
    regions: { [data.region]: increment(1) },
    cities: { [data.city]: increment(1) }
  }, { merge: true });


  // Always increment total views, only increment uniqueViews if first time
  await updatePageViews(isUnique);
}

// 🔹 Get visitor IP & location
async function getVisitorLocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    //console.log("Visitor info:", data);
    await logVisitor(data);
  } catch (err) {
    console.error("Error fetching visitor info:", err);
  }
}

// 🔹 Run on page load
document.addEventListener("DOMContentLoaded", async () => {
  await getVisitorLocation();
});






// 🔹 DOM Elements
const commentName = document.getElementById("commentName");
const commentMessage = document.getElementById("commentMessage");
const anonymousCheckbox = document.getElementById("anonymousCheckbox");
const privateCheckbox = document.getElementById("privateCheckbox");
const submitBtn = document.getElementById("comment-submit-btn");
const commentsList = document.getElementById("commentsList");

// 🔹 Submit Comment
submitBtn.addEventListener("click", async () => {
  const name = anonymousCheckbox.checked ? "Anonymous" : commentName.value.trim();
  const message = commentMessage.value.trim();
  const isPrivate = privateCheckbox.checked;

  // 🔹 Validations
  if (!message || message.length < 5) return alert("Comment must be at least 5 characters.");
  if (!anonymousCheckbox.checked && (!name || name.length < 2)) return alert("Please enter a valid name.");
  if (isPrivate && !auth.currentUser) return alert("Only logged-in users can make private comments.");

  // 🔹 Simple blacklist
  const blacklist = ["spamword1", "spamword2"];
  for (const word of blacklist) {
    if (message.toLowerCase().includes(word)) return alert("Please avoid inappropriate language.");
  }

  // 🔹 Sanitize
  const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  try {
    await addDoc(collection(db, "pages", pageID, "comments"), {
      name,
      message: safeMessage,
      anonymous: anonymousCheckbox.checked,
      private: isPrivate,
      createdAt: serverTimestamp(),
      userId: auth.currentUser ? auth.currentUser.uid : null,
      status: "active" // 🔹 Set status to active
    });

    // reset form
    commentName.value = "";
    commentMessage.value = "";
    anonymousCheckbox.checked = false;
    privateCheckbox.checked = false;

    showToast("info", "Comment posted!");
  } catch (err) {
    console.error("Error adding comment: ", err);
    showToast("error", "Failed to post comment.");
  }
});

// 🔹 Load Comments
const q = query(collection(db, "pages", pageID, "comments"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
  commentsList.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const entry = docSnap.data();

    if (entry.private && (!auth.currentUser || auth.currentUser.uid !== entry.userId) || entry.status == "removed") {
      return; // hide private comments from others
    }

    const div = document.createElement("div");
    div.className = "comment entry";
    div.setAttribute("itemscope", "");
    div.setAttribute("itemtype", "https://schema.org/Comment");

    div.innerHTML = `
      <div class="comment-header">
        <strong itemprop="author">${entry.name}</strong>
        <time itemprop="dateCreated">${entry.createdAt?.toDate().toLocaleDateString() || ""}</time>
        <span hidden class="comment-status">[${entry.status || "active"}]</span>
      </div>
      <div class="comment-body" itemprop="text">${entry.message}</div>
    `;

    // 🔹 Admin / owner controls
    if (auth.currentUser && (auth.currentUser.isAdmin || auth.currentUser.uid === entry.userId)) {
      const controls = document.createElement("div");
      controls.className = "comment-controls";
      controls.innerHTML = `
        <button data-id="${docSnap.id}" class="make-private">Make Private</button>
        <button data-id="${docSnap.id}" class="mark-removed">Mark Removed</button>
      `;
      div.appendChild(controls);
    }

    commentsList.appendChild(div);
  });

  // 🔹 Button handlers
  document.querySelectorAll(".make-private").forEach(btn => {
    btn.addEventListener("click", async () => {
      await updateDoc(doc(db, "pages", pageID, "comments", btn.dataset.id), { private: true });
    });
  });

  document.querySelectorAll(".mark-removed").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (confirm("Mark this comment as removed?")) {
        await updateDoc(doc(db, "pages", pageID, "comments", btn.dataset.id), { 
          status: "removed"
        });
        showToast("info", "Comment Removed");
      }
    });
  });
});

// 🔹 Watch Auth State (to show admin controls)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Mark admins manually
    if (user.uid === "CyfMntp5iucjYC94HQ1FNcOiDa23") {
      user.isAdmin = true;
    }
  }
});



  // 🔹 Page data
  const pageData = {
    id: document.getElementById("pageID").innerText,
    ownerId: document.getElementById("pageOwnerUserID").innerText,
    slug: document.getElementById("pageSlug").innerText,
    title: document.getElementById("pageTitle").innerText,
    description: document.getElementById("pageDescription").innerText,
    url: document.getElementById("pageURL").innerText
  };

  // 🔹 Create Report Popup
  const reportPopup = document.createElement("div");
  reportPopup.id = "reportPopup";
  Object.assign(reportPopup.style, {
    display: "none",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: "9999",
    justifyContent: "center",
    alignItems: "center"
  });

  const popupContent = document.createElement("div");
  Object.assign(popupContent.style, {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "90%",
    position: "relative"
  });

  popupContent.innerHTML = `
    <h2>Report this Page</h2>
    
    <label style="display:block; margin:0.5rem 0;">Reason:</label>
    <select id="reportReason" style="width:100%; padding:0.5rem; margin-bottom:1rem;">
      <option value="">-- Select a reason --</option>
      <option value="spam">Spam or misleading</option>
      <option value="offensive">Offensive or harmful content</option>
      <option value="copyright">Copyright violation</option>
      <option value="inappropriate">Inappropriate material</option>
      <option value="other">Other</option>
    </select>

    <label style="display:block; margin:0.5rem 0;">Additional Details:</label>
    <textarea id="reportMessage" rows="4" style="width:100%;"></textarea>
    
    <div style="margin-top:1rem; display:flex; gap:1rem; justify-content:flex-end;">
      <button id="submitReport">Submit</button>
      <button id="closeReport" style="background:#eee;">Cancel</button>
    </div>
  `;

  reportPopup.appendChild(popupContent);
  document.body.appendChild(reportPopup);

  // 🔹 Show popup
  document.getElementById("reportPageBtn").addEventListener("click", () => {
    reportPopup.style.display = "flex";
  });

  // 🔹 Close popup
  popupContent.querySelector("#closeReport").addEventListener("click", () => {
    reportPopup.style.display = "none";
  });

  // 🔹 Submit report
  popupContent.querySelector("#submitReport").addEventListener("click", async () => {
    const reason = popupContent.querySelector("#reportReason").value;
    const message = popupContent.querySelector("#reportMessage").value.trim();

    if (!reason) return alert("Please select a reason.");
    if (reason === "other" && !message) return alert("Please enter details for 'Other'.");

    try {
      // 🔹 Get user IP
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();

      // 🔹 Create report object
      const report = {
        pageId: pageData.id,
        ownerId: pageData.ownerId,
        slug: pageData.slug,
        title: pageData.title,
        url: pageData.url,
        reason,
        message: message || "",
        reporterIP: ipData.ip,
        createdAt: serverTimestamp()
      };

      // 🔹 Save to Firestore
      await addDoc(collection(db, "reports"), report);

      showToast("info", "Report submitted successfully!");
      popupContent.querySelector("#reportMessage").value = "";
      popupContent.querySelector("#reportReason").value = "";
      reportPopup.style.display = "none";
    } catch (err) {
      console.error("Error submitting report:", err);
      showToast("error", "Failed to submit report.");
    }
  });