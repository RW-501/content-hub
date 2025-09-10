

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.style.opacity = 0;
    body.style.transition = "opacity 2s ease-in-out";
    body.style.opacity = 1;
    console.log('Loading...');
  });
  



import { doc, getDoc, setDoc, updateDoc, increment, collection, 
    addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, arrayUnion  } 
    from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import { showToast } from "https://contenthub.guru/exports/showToast.js";

// 🔹 Firebase config
import { db, auth, storage } from "https://contenthub.guru/admin/exports/firebaseConfig.js";




// 🔹 Watch Auth State (to show admin controls)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Mark admins manually
    if (user.uid === "5bShzf1KNZV1HmA9jlNc20eqvRm1") {
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



    const mainPhoto = document.getElementById('mainImage');
    const deviceShareButton = document.getElementById('deviceShareButton');
    const pageTitle = document.getElementById('pageTitle').textContent;
    const pageURL = document.getElementById('pageURL').textContent;
    const pageDescription = document.getElementById('pageDescription').textContent;
    const pageID = document.getElementById("pageID")?.textContent || "unknown";



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

  // Skip items that contain HTML tags
  if (item.querySelector('*')) return;

  // Give each item a unique ID if it doesn't have one
  if (!item.id) item.id = `toc-item-${index}`;


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



document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("body");
  if (!main) return;

  // Make main focusable
  main.setAttribute("tabindex", "0");

  // Optionally auto-focus so keydown works immediately
  main.focus();

  // Right-click inside <main> allowed
  main.addEventListener("contextmenu", (event) => {
    event.stopPropagation(); // stop global blockers
  });

  // Detect Ctrl+A inside <main>
  main.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "a") {
      event.preventDefault(); // stop select all
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      console.log("Select All blocked → Selection cleared");
    }
  });

  // Optional: listen on the document as a fallback
  document.addEventListener("keydown", (event) => {
    if (document.activeElement === main &&
        event.ctrlKey && event.key.toLowerCase() === "a") {
      event.preventDefault();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      console.log("Select All blocked → Selection cleared");
    }
  });
});





async function imageToFile(imgElement, filename = "image.jpg") {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    ctx.drawImage(imgElement, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], filename, { type: blob.type }));
      } else {
        reject(new Error("Failed to create blob from canvas"));
      }
    }, "image/jpeg", 0.95);
  });
}

if (navigator.share) {
  deviceShareButton.addEventListener("click", async () => {
    try {
      const file = await imageToFile(mainPhoto, "shared.jpg");

      await navigator.share({
        title: pageTitle,
        text: pageDescription,
        url: pageURL,
        files: [file],
      });

      showToast("info", "Shared successfully!");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  });
} else {
  deviceShareButton.style.display = "none";
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


  

function updateRatingDisplay(helpful, notHelpful) {
  const ratingCount = helpful + notHelpful;
  const averageRating = ratingCount < 1 ? 4.5 : (helpful / ratingCount) * 5;

  // Update stars (full, half, empty)
  const fullStars = Math.floor(averageRating);
  const halfStar = averageRating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const stars = '⭐'.repeat(fullStars) + (halfStar ? '✬' : '') + '☆'.repeat(emptyStars);

  document.getElementById('rating-stars').textContent = stars;
  document.getElementById('rating-value').textContent = averageRating.toFixed(1);
  document.getElementById('rating-count').textContent = ratingCount;

  // Update hidden counts
  document.getElementById('helpfulCount').textContent = helpful;
  document.getElementById('notHelpfulCount').textContent = notHelpful;
}

// Initialize from hidden spans
let helpful = parseInt(document.getElementById('helpfulCount').textContent) || 0;
let notHelpful = parseInt(document.getElementById('notHelpfulCount').textContent) || 0;
updateRatingDisplay(helpful, notHelpful);

// Yes button
document.getElementById("yesBtn").onclick = async () => {
  try {
    await updateDoc(pageRef, { helpfulCount: increment(1) });

    helpful += 1; // increment local
    updateRatingDisplay(helpful, notHelpful);

    document.getElementById("feedbackMsg").textContent = "Thanks for your feedback!";
  } catch (err) {
    console.error("Error updating helpful count:", err);
  }
};

// No button
document.getElementById("noBtn").onclick = async () => {
  try {
    await updateDoc(pageRef, { notHelpfulCount: increment(1) });

    notHelpful += 1; // increment local
    updateRatingDisplay(helpful, notHelpful);

    document.getElementById("feedbackMsg").textContent = "Sorry to hear that. We’ll improve!";
  } catch (err) {
    console.error("Error updating notHelpful count:", err);
  }
};




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
const blacklist = [
  "viagra",
  "cialis",
  "porn",
  "xxx",
  "casino",
  "gambling",
  "loan",
  "credit",
  "debt",
  "bitcoin",
  "crypto",
  "forex",
  "escort",
  "dating",
  "pharmacy",
  "win money",
  "work from home",
  "cheap",
  "free trial",
  "click here",
  "buy now",
  "limited offer",
  "make money fast",
  "weight loss",
  "miracle",
  "investment",
  "betting",
  "adult",
  "nude",
  "hack",
  "scam"
];
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
  const toc = document.getElementById('toc');

  // Get current scroll position
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  // The position on the page where we want to fix the reader
  const triggerPosition = toc ? toc.offsetTop + toc.offsetHeight : 200; // fallback if toc missing

  if (scrollTop >= triggerPosition) {
    // Fix the text reader
    textReader.style.position = 'fixed';
    textReader.style.top = '10px';
    textReader.style.left = '50%';
    textReader.style.zIndex = '1000';
    textReader.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    textReader.style.background = '#fff'; // optional for better visibility
    textReader.style.padding = '8px 16px';
    textReader.style.borderRadius = '6px';
  } else {
    // Reset
    textReader.style.position = 'static';
    textReader.style.top = '';
    textReader.style.left = '';
    textReader.style.zIndex = '';
    textReader.style.boxShadow = '';
    textReader.style.background = '';
    textReader.style.padding = '';
    textReader.style.borderRadius = '';
    textReader.style.display = 'contents';
  }
});



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


  
let isUnique = false;

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
  // First, check localStorage
  const cached = localStorage.getItem("visitorInfo");
  if (cached) {
    return JSON.parse(cached); // ✅ Return cached data
  }

  try {
    // ⚠️ This will fail due to CORS unless you use a proxy or CORS-friendly API
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    
    const data = await res.json();

    logVisitor(data);

    // Save to localStorage for later use
    localStorage.setItem("visitorInfo", JSON.stringify(data));

    return data;
  } catch (err) {
    console.error("Error fetching visitor info:", err);
    return null;
  }
}

/*
async function getVisitorLocation() {
  const cached = localStorage.getItem("visitorInfo");
  if (cached) return JSON.parse(cached);

  try {
    const res = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const text = await res.text();
    const ipMatch = text.match(/ip=(.*)/);
    const ip = ipMatch ? ipMatch[1].trim() : null;

    const data = { ip };
    localStorage.setItem("visitorInfo", JSON.stringify(data));
    return data;
  } catch (err) {
    console.error("Error fetching visitor info:", err);
    return null;
  }
}

*/


// 🔹 Run on page load
document.addEventListener("DOMContentLoaded", async () => {
  await getVisitorLocation();
});


  window.onscroll = function () {
    const btn = document.getElementById("scrollUpBtn");
    btn.style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 300) ? "block" : "none";
  };
document.getElementById('scrollUpBtn').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const tooltip = document.getElementById('link-tooltip');


function showTooltip(el, data) {
  const tooltip = document.getElementById('link-tooltip');

  tooltip.style.pointerEvents = 'auto'; // ✅ allow clicks again

  tooltip.innerHTML = `
    <div class="tooltips" style="max-width:250px;">
      <strong id="tooltip-title" style="cursor:pointer;">${data.title}</strong><br>
      ${data.image ? `<img id="tooltip-img" src="${data.image}" style="max-width:100%;margin-top:5px;cursor:pointer;">` : ''}
      <p style="margin:0;">${data.summary}</p>
        <div class="tooltip-btns">
      <button id="tooltip-go" class="linked-btn" data-url="${data.url}">Go</button>
      <button id="tooltip-close" class="linked-btn-close">Close</button>
      </div>
    </div>
  `;
  tooltip.style.display = 'block';

  const rect = el.getBoundingClientRect();
  tooltip.style.top = `${window.scrollY + rect.bottom + 5}px`;
  tooltip.style.left = `${window.scrollX + rect.left}px`;



  // Bind after injection
  document.getElementById("tooltip-title").onclick = (e) => {
      e.stopPropagation(); // ✅ important
    goToLink(data.url);
  };

  document.getElementById("tooltip-img").onclick = (e) => {
      e.stopPropagation(); // ✅ important
    goToLink(data.url);
  };

document.getElementById("tooltip-go").onclick = (e) => {
  e.stopPropagation(); // ✅ important
  goToLink(e.target.dataset.url);
};

document.getElementById("tooltip-close").onclick = (e) => {
  e.stopPropagation(); // ✅ important
  hideTooltip();
};

}



function attachTooltips() {
  const tooltip = document.getElementById('link-tooltip');

  let tooltipTimeout;
  let isHoveringTooltip = false;

   
  document.querySelectorAll('.linked').forEach(span => {
    span.addEventListener('click', (e) => {
          span.style.cursor = 'pointer';

            e.stopPropagation();

        const data = {
          title: span.dataset.title || span.textContent || "No title",
          summary: span.dataset.summary || "No summary available.",
          image: span.dataset.image || null,
          url: span.dataset.url || "#"
        };
        showTooltip(span, data);

    });

    span.addEventListener('mouseleave', () => {
      clearTimeout(tooltipTimeout);
      setTimeout(() => {
        if (!isHoveringTooltip) console.log("close"); // hideTooltip();
      }, 5000);
    });
  });
}


function hideTooltip() {
  tooltip.style.display = 'none';
  tooltip.style.pointerEvents = 'none'; // ✅ disable when hidden so it doesn’t block stuff
}


function goToLink(url) {
  console.log("open: ", url);
  window.open(url, "_blank");
}

attachTooltips();

  // Hide tooltip when clicking outside
  document.addEventListener('click', () => {
     hideTooltip();
  });
  


function createShareCard(text) {
  const shareContainer = document.getElementById('share-container');
  shareContainer.innerHTML = ''; // clear previous

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');

  // Load background
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = 'https://contenthub.guru/images/share-background.png';

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    wrapText(ctx, text, canvas.width/2, canvas.height/2, canvas.width - 60, 36);

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Build share UI
    shareContainer.innerHTML = `
      <div class="share-card" style="
        background:#222; 
        padding:12px; 
        border-radius:12px; 
        display:flex; 
        flex-direction:column; 
        align-items:center; 
        max-width:320px;">
        <img src="${dataUrl}" style="width:100%; border-radius:8px; margin-bottom:10px;" />
        <div class="share-buttons" style="display:flex; gap:8px;">
          <button id="share-twitter">Twitter</button>
          <button id="share-facebook">Facebook</button>
          <button id="share-copy">Copy Link</button>
        </div>
      </div>
    `;

    // Position near the element clicked
// Center the shareContainer on the screen
shareContainer.style.top = `${window.scrollY + (window.innerHeight - shareContainer.offsetHeight) / 2}px`;
shareContainer.style.left = `${window.scrollX + (window.innerWidth - shareContainer.offsetWidth) / 2}px`;
shareContainer.style.display = 'block';


    // Share actions
    document.getElementById('share-twitter').onclick = () => {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };
    document.getElementById('share-facebook').onclick = () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dataUrl)}`, '_blank');
    };
    document.getElementById('share-copy').onclick = () => {
      navigator.clipboard.writeText(dataUrl);
      alert('Image URL copied!');
    };
  };
}



// Hide on click outside
document.addEventListener('click', () => {
  document.getElementById('share-container').style.display = 'none';
});

// Helper to wrap text nicely on canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  lines.forEach((lineText, i) => {
    ctx.fillText(lineText.trim(), x, y + (i - lines.length/2 + 0.5)*lineHeight);
  });
}

function splitSentencesWithMinLength(text, minLength = 4) {
  let parts = text.match(/[^.!?]+[.!?]/g) || [];
  let sentences = [];

  for (let i = 0; i < parts.length; i++) {
    let current = parts[i].trim();

    if (current.length < minLength && i < parts.length - 1) {
      current += " " + parts[i + 1].trim();
      i++;
    }

    sentences.push(current);
  }

  return sentences;
}

function wrapSentences(parentP) {
  let sentenceIndex = 0;
  let collectedSentences = [];

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const sentences = splitSentencesWithMinLength(node.textContent, 4);
      const frag = document.createDocumentFragment();

      sentences.forEach(s => {
        const span = document.createElement("span");
        span.className = "share";
        span.dataset.sentenceIndex = sentenceIndex++;
        span.style.cursor = "pointer";

        // Use innerHTML so embedded markup survives
        span.innerHTML = s.trim() + " ";

        frag.appendChild(span);
        collectedSentences.push(s.trim());
      });

      return frag;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);

      node.childNodes.forEach(child => {
        clone.appendChild(processNode(child));
      });

      return clone;
    }

    return node.cloneNode(true);
  }

  const newContent = document.createDocumentFragment();
  parentP.childNodes.forEach(node => {
    newContent.appendChild(processNode(node));
  });

  parentP.innerHTML = "";
  parentP.appendChild(newContent);

  parentP._sentences = collectedSentences;

  return collectedSentences;
}

function removeAllActive() {
    const  ContentArea = document.getElementById('main-Content-Area');
ContentArea.querySelectorAll('span.share.active').forEach(span => {
  span.classList.remove('active');
});
}


function attachShareableText() {
  const tooltip = document.getElementById('link-tooltip');
document.querySelectorAll('.share').forEach(el => {
  el.style.cursor = 'pointer';

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    let text = el.innerText; // current sentence
    el.classList.add('active');

    const parentP = el.closest('p');
    if (!parentP){

      console.log("Returned");
      return;
        }

// Make sure sentences are wrapped
let sentences = parentP._sentences || wrapSentences(parentP);

// Find the index of the sentence
let currentIndex = sentences.findIndex(s => s.trim() === text.trim());


// Get the <span> element that contains this sentence
let sentenceElement = null;
if (currentIndex >= 0) {
  sentenceElement = parentP.querySelector(`span.share[data-sentence-index="${currentIndex}"]`);
}

// Get the next sentence text
let nextText = (currentIndex >= 0 && currentIndex < sentences.length - 1) 
  ? sentences[currentIndex + 1].trim() 
  : null;

if (sentenceElement) {
  sentenceElement.classList.add('active');
}else{
  sentenceElement = el;
}

    // Build tooltip
    tooltip.innerHTML = `
      <div class="share-text-el">
        <strong>Share this text:</strong>
        <p id="share-text-p">
          "${text}" 
          ${nextText ? `<span id="add-more-btn">${nextText}</span>` : ""}
        </p>
        <div class="share-btns">
          <button id="share-text-btn">Share as Text</button>
          <button id="share-card-btn">Share as Image</button>
        </div>
      </div>
    `;

    tooltip.style.display = 'block';
    const rect = sentenceElement.getBoundingClientRect();
    tooltip.style.top = `${window.scrollY + rect.bottom + 5}px`;
    tooltip.style.left = `${window.scrollX + rect.left}px`;

    // Plain text share
    document.getElementById('share-text-btn').onclick = () => {
      navigator.clipboard.writeText(text);
      showToast("info","Text copied! Share anywhere.");
removeAllActive();
    };

    // Image card share
    document.getElementById('share-card-btn').onclick = () => {
      createShareCard(text);
removeAllActive();
    };

    // Handle "More" button (if available)
    const addMoreBtn = document.getElementById('add-more-btn');
    if (addMoreBtn) {
      addMoreBtn.onclick = (e) => {
            e.stopPropagation();
        if (currentIndex < sentences.length - 1) {
          currentIndex++;
          text += " " + sentences[currentIndex].trim();

          // Get the <span> element that contains this sentence
let sentenceElement = null;
if (currentIndex >= 0) {
  sentenceElement = parentP.querySelector(`span.share[data-sentence-index="${currentIndex}"]`);
}
          // Compute the following next sentence
// Get the next sentence text
let nextText = (currentIndex >= 0 && currentIndex < sentences.length - 1) 
  ? sentences[currentIndex + 1].trim() 
  : null;

          // Update tooltip
          document.getElementById('share-text-p').innerHTML = `"${text}" ${
            nextText ? `<span id="add-more-btn">${nextText}</span>` : ""
          }`;
sentenceElement.classList.add('active');

          // Re-bind button if more text remains
          if (nextText) {
            document.getElementById('add-more-btn').onclick = addMoreBtn.onclick;
          }
        }
      };
    }

  // Cleanup on mouse leave / scroll
      //document.addEventListener('mouseleave', () => el.classList.remove('active'));
      document.addEventListener('scroll', () => 
      removeAllActive());
     
    });
  // Hide tooltip when clicking outside
  document.addEventListener('click', () => {
    tooltip.style.display = 'none';
   // removeAllActive();
  });

  });




    document.addEventListener('scroll', () => {
    tooltip.style.display = 'none';
  });
}

attachShareableText() 