

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.style.opacity = 0;
    body.style.transition = "opacity 2s ease-in-out";
    body.style.opacity = 1;
    console.log('Loading...');
  });
  



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



let readingTime = document.getElementById("readTime").textContent;

const words = document.body.innerText.split(/\s+/).length;
const wpm = 200; // average words per minute
const minutes = Math.ceil(words / wpm);
if (readingTime === ''){
readingTime = `Reading Time: ${minutes} min`;
}


document.getElementById("toc-toggle").addEventListener("click", function () {
  const list = document.getElementById("toc-list");
  const expanded = this.getAttribute("aria-expanded") === "true";

  // Toggle visibility
  list.hidden = expanded;
  this.setAttribute("aria-expanded", String(!expanded));

  // Update button text
  this.textContent = expanded ? "Show" : "Hide";
});

const tocList = document.getElementById('toc-list');

const contentItems = document.querySelectorAll('section h2, section h3, section h4, section p[data-start], section ul');

contentItems.forEach((item, index) => {
  // Skip empty paragraphs
  if ((item.tagName.toLowerCase() === 'p') && item.textContent.trim().length < 20) return;

  // Give each item a unique ID if it doesn't have one
  if (!item.id) {
    item.id = `toc-item-${index}`;
  }

  // Define bullet options
const bulletStyles = {
  h2: '•',
  h3: '–',
  h4: '▸',
  p: '•',
  ul: '–'
};

  const li = document.createElement('li');
  li.setAttribute('role', 'listitem');

  
  const a = document.createElement('a');
  a.href = `#${item.id}`;
  a.style.textDecoration = 'none';

  let tocHeaders = '';
  let tocText = '';
  let tocLI = '';
  const tag = item.tagName.toLowerCase();

  if (tag === 'h2' || tag === 'h3' || tag === 'h4' ||
     tag === 'H2' || tag === 'H3' || tag === 'H4') {
    tocHeaders = item.textContent;
  }
 if (tag === 'strong') {
    tocText = item.textContent.substring(0, 90) + '…';
  }
  /* else if (tag === 'p') {
    tocText = item.textContent.substring(0, 60) + '…';
  } */
  if (tag === 'ul' || tag === 'UL') {
    const firstItem = item.querySelector('li');
    tocLI = firstItem ? firstItem.textContent.substring(0, 40) + '…' : 'List…';
  }

    if (tag === 'h3') li.style.marginLeft = '15px';
    if (tag === 'h4') li.style.marginLeft = '30px';
    if (tag === 'p' || tag === 'ul') li.style.marginLeft = '45px';

  // Only add bullet and link if there’s text
    if (tocHeaders) {
    const bullet = document.createElement('span');
    bullet.textContent = (bulletStyles[tag] || '• ') + ' '; // default bullet
    li.appendChild(bullet);

    a.textContent = tocHeaders;
    li.appendChild(a);
    
    tocList.appendChild(li);
  }

  if (tocText) {
    const bullet = document.createElement('span');
    bullet.textContent = (bulletStyles[tag] || '• ') + ' '; // default bullet
    li.appendChild(bullet);

    a.textContent = tocText;
    li.appendChild(a);

    tocList.appendChild(li);
  }

    if (tocLI) {
    const bullet = document.createElement('span');
    bullet.textContent = (bulletStyles[tag] || '- ') + ' '; // default bullet
    li.appendChild(bullet);

    a.textContent = tocLI;
    li.appendChild(a);

    tocList.appendChild(li);
  }



});




  // === Add Comments link ===
const commentsLi = document.createElement("li");
const commentsA = document.createElement("a");

commentsA.innerHTML = "<span>Comments</span>";
commentsA.href = "#commentForm"; // your comment form div id

commentsLi.appendChild(commentsA);
tocList.appendChild(commentsLi);

  const progressBar = document.getElementById("progressBar");

  let confettiFired = false; // Prevent multiple triggers

  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;

    progressBar.style.width = scrolled + "%";

    // Optional glow for >50%
    if (scrolled > 50) {
      progressBar.classList.add("glow");
    } else {
      progressBar.classList.remove("glow");
    }

    // Fire confetti at 100%
    if (scrolled >= 98 && !confettiFired) {
      confettiFired = true;
      confetti({
        particleCount: 300,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4caf50', '#00bfa5', '#ffeb3b', '#ff5722', '#2196f3']
      });
    }
  });



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


  document.getElementById("copyLinkButton").addEventListener("click", async () => {
    try {
      //const pageURL = window.location.href; // Get current page URL
      await navigator.clipboard.writeText(pageURL);
      showToast("info", "Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link: ", err);
      showToast("info", "Unable to copy link, please try manually.");
    }
  });


const pageID = document.getElementById("pageID")?.textContent || "unknown";
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

const pageRef = doc(db, "pages", pageID);

// 🔹 Update page views (total + daily)
async function updatePageViews(unique = false) {
  if (!pageID) return;

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

  let isUnique = false;


  // Feedback buttons
document.getElementById("yesBtn").onclick = async () => {
  try {
    await updateDoc(pageRef, {
      helpfulCount: increment(1)
    });
    document.getElementById("feedbackMsg").textContent = "Thanks for your feedback!";
  } catch (err) {
    console.error("Error updating helpful count:", err);
  }
};

document.getElementById("noBtn").onclick = async () => {
  try {
    await updateDoc(pageRef, {
      notHelpfulCount: increment(1)
    });
    document.getElementById("feedbackMsg").textContent = "Sorry to hear that. We’ll improve!";
  } catch (err) {
    console.error("Error updating notHelpful count:", err);
  }
};


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
  //let isUnique = false;

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


  
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item summary").forEach(summary => {
    summary.addEventListener("click", function() {
      const details = this.parentElement;
      const answer = this.nextElementSibling;

      details.classList.toggle("open");

      if (details.classList.contains("open")) {
        // Expand
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        // Collapse
        answer.style.maxHeight = "0";
      }
    });
  });
});








const article = document.getElementById("in-article-blocks");
let synth = window.speechSynthesis;
let voices = [];
let utterance;
let currentIndex = 0;
let paragraphs = [];
let isPaused = false;

// Load voices
function populateVoices() {
  voices = synth.getVoices();
  const voiceSelect = document.getElementById("voiceSelect");
  voiceSelect.innerHTML = "";
  voices.forEach((v, i) => {
    const option = document.createElement("option");
    option.value = i;
    let gender = /female/i.test(v.name) ? "Female" : /male/i.test(v.name) ? "Male" : "Neutral";
    option.text = `${v.name} (${v.lang}, ${gender})`;
    voiceSelect.appendChild(option);
  });
}
populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

// Clean text
function cleanText(text) {
  return text.replace(/https?:\/\/\S+/gi, "")
             .replace(/[\[\]\(\)\{\}<>]/g, "")
             .replace(/\s+/g, " ")
             .trim();
}

// Scroll text
function scrollToParagraph(idx) {
  const p = paragraphs[idx];
  if (p) {
    const rect = p.getBoundingClientRect();
    window.scrollBy({
      top: rect.top - window.innerHeight / 2 + rect.height / 2,
      behavior: "smooth"
    });
  }
}

// Read next paragraph
function readNext() {
  if (currentIndex >= paragraphs.length) return;
  const p = paragraphs[currentIndex];
  const text = cleanText(p.innerText);
  if (!text) { 
    currentIndex++;
    readNext();
    return;
  }

  utterance = new SpeechSynthesisUtterance(text);
  const voiceSelect = document.getElementById("voiceSelect");
  const voiceIndex = voiceSelect.value || 0;
  utterance.voice = voices[voiceIndex];
  utterance.rate = 1;

  utterance.onend = () => {
    if (!isPaused) {
      currentIndex++;
      readNext();
    }
  };

  scrollToParagraph(currentIndex);
  synth.speak(utterance);
}





// Controls
document.getElementById("startBtn").addEventListener("click", () => {
  if (!paragraphs.length) paragraphs = Array.from(article.querySelectorAll("p"));
  currentIndex = 0;
  isPaused = false;
  synth.cancel();
  readNext();
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  if (synth.speaking && !synth.paused) {
    synth.pause();
    isPaused = true;
  }
});

document.getElementById("resumeBtn").addEventListener("click", () => {
  if (synth.paused) {
    synth.resume();
    isPaused = false;
  }
});

document.getElementById("stopBtn").addEventListener("click", () => {
  synth.cancel();
  isPaused = false;
  currentIndex = 0;
});

// Download audio via Google TTS chunks
document.getElementById("downloadBtn").addEventListener("click", async () => {
  let textToConvert = Array.from(article.querySelectorAll("p"))
                           .map(p => cleanText(p.innerText))
                           .join(" ");
  if (!textToConvert) return;

  const chunkSize = 200; // Google TTS per-request limit
  let chunks = [];
  for (let i = 0; i < textToConvert.length; i += chunkSize) {
    chunks.push(textToConvert.slice(i, i + chunkSize));
  }

  // Fetch all chunks concurrently
  const fetchPromises = chunks.map(chunk => {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=en&client=tw-ob`;
    return fetch(ttsUrl, { headers: { "User-Agent": "Mozilla/5.0" }})
           .then(res => res.arrayBuffer());
  });
  const audioBuffers = await Promise.all(fetchPromises);

  // Decode and merge
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const decodedBuffers = await Promise.all(audioBuffers.map(buf => context.decodeAudioData(buf)));
  const totalLength = decodedBuffers.reduce((sum, b) => sum + b.length, 0);
  const mergedBuffer = context.createBuffer(decodedBuffers[0].numberOfChannels, totalLength, decodedBuffers[0].sampleRate);

  let offset = 0;
  for (const buffer of decodedBuffers) {
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      mergedBuffer.getChannelData(ch).set(buffer.getChannelData(ch), offset);
    }
    offset += buffer.length;
  }

  // Convert to WAV
  function bufferToWav(abuffer) {
    const numOfChan = abuffer.numberOfChannels,
          length = abuffer.length * numOfChan * 2 + 44,
          buffer = new ArrayBuffer(length),
          view = new DataView(buffer),
          channels = [];
    let sample, offset = 0, pos = 0;

    function setUint16(data){ view.setUint16(pos,data,true); pos+=2; }
    function setUint32(data){ view.setUint32(pos,data,true); pos+=4; }

    setUint32(0x46464952); // "RIFF"
    setUint32(length-8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate*2*numOfChan);
    setUint16(numOfChan*2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length-pos-4);

    for(let i=0;i<numOfChan;i++) channels.push(abuffer.getChannelData(i));

    while(offset<abuffer.length){
      for(let i=0;i<numOfChan;i++){
        sample = Math.max(-1,Math.min(1,channels[i][offset]));
        view.setInt16(pos,sample<0?sample*0x8000:sample*0x7FFF,true);
        pos+=2;
      }
      offset++;
    }

    return new Blob([buffer], {type:"audio/wav"});
  }

  const pageURL = document.getElementById('pageURL').textContent;

  const wavBlob = bufferToWav(mergedBuffer);
  const url = URL.createObjectURL(wavBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${pageURL}-audio.wav`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});


  window.addEventListener("scroll", () => {
      const textReader = document.getElementById('text-reader-controls');

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;

    console.log("textReader.scrollHeight  ",textReader.scrollHeight);
    console.log("textReader.clientHeight  ",textReader.clientHeight);
    console.log("scrolled  ",scrolled);


    const textReaderScrollHeight = textReader.scrollHeight - textReader.clientHeight;

    // Optional glow for >50%
    if (scrolled > textReaderScrollHeight) {
      textReader.style.position = 'fixed';
      textReader.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      textReader.style.transform = 'translateX(-50%)';
    } else {
      textReader.style.position = 'unset';
      textReader.style.boxShadow = 'unset';
      textReader.style.transform = 'none';
    }


  })

