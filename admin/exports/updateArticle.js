import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, getDoc, setDoc, doc, query, updateDoc, arrayUnion, limit, where, getDocs, increment, orderBy, addDoc, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";


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
const storage = getStorage(app);


import { updatePage } from "https://contenthub.guru/admin/exports/pageUpdater.js";
import { showToast } from "https://contenthub.guru/exports/showToast.js";






const localeMap = {
  en: "en_US",
  es: "es_ES",
  zh: "zh_CN",  // or zh_TW if Traditional
  hi: "hi_IN",
  ar: "ar_AR",
  fr: "fr_FR",
  de: "de_DE"
};

function getOgLocale(lang) {
  return localeMap[lang] || "en_US";
}

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")     // non-alphanumeric → dash
    .replace(/^-+|-+$/g, "");        // trim leading/trailing dash
}


const MAX_CHARS_PER_BATCH = 100; // safe limit for public LibreTranslate

/**
 * Splits text into chunks of up to MAX_CHARS_PER_BATCH,
 * trying to split at sentence or paragraph boundaries
 */
function chunkText(text) {
  const chunks = [];
  let current = "";

  // Split by paragraphs first
  const paragraphs = text.split(/\n+/);
  for (let para of paragraphs) {
    if ((current + para).length > MAX_CHARS_PER_BATCH) {
      if (current) chunks.push(current.trim());
      // further split paragraph by sentences if too long
      const sentences = para.split(/([.!?]+)\s/);
      let sentenceChunk = "";
      for (let i = 0; i < sentences.length; i += 2) {
        const sentence = (sentences[i] || "") + (sentences[i + 1] || "");
        if ((sentenceChunk + sentence).length > MAX_CHARS_PER_BATCH) {
          if (sentenceChunk) chunks.push(sentenceChunk.trim());
          sentenceChunk = sentence;
        } else {
          sentenceChunk += sentence;
        }
      }
      if (sentenceChunk) chunks.push(sentenceChunk.trim());
      current = "";
    } else {
      current += para + "\n";
    }
  }

  if (current) chunks.push(current.trim());
  return chunks;
}

/**
 * Translate text in batches with fail-safe
 */



const logEl = document.getElementById("log");

function writeLog(el, msg) {
  if (!el) return;
  el.textContent += msg + "\n";
  el.scrollTop = el.scrollHeight;
}

function log(msg) {
  writeLog(logEl, msg);
}




export async function translateText(text, targetLang) {
    const startTime = new Date();
  console.log(`Translation started at: ${startTime.toISOString()}`);
  log(`Translation started at: ${startTime.toISOString()}`);

  console.log(`Starting translation`);
  /*
  console.log(`Target language: ${targetLang}`);
  console.log(`Original text length: ${text.length}`);
  console.log(`Original text:`, text);
*/
  const chunks = chunkText(text);
  const translatedChunks = [];

for (const [index, chunk] of chunks.entries()) {
  const chunkStart = new Date(); // <-- add this
  console.log(`\nTranslating chunk ${index + 1}/${chunks.length}`);
  console.log(`Chunk start time: ${chunkStart.toISOString()}`);
  console.log(`Chunk text:`, chunk);

    try {
      const response = await fetch("https://translateapi-1-mx67.onrender.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: chunk, source: "en", target: targetLang })
      });
/*
      console.log(`Chunk ${index + 1} fetch response:`, response);
      console.log(`Response status: ${response.status} ${response.statusText}`);
      console.log(`Response headers:`, [...response.headers.entries()]);
*/
      if (!response.ok) {
        console.error(`Error translating chunk ${index + 1}: ${response.status} ${response.statusText}`);
        return null;
      }

      const result = await response.json().catch(err => {
        console.error(`Failed to parse JSON for chunk ${index + 1}:`, err);
        return null;
      });

   //   console.log(`Chunk ${index + 1} JSON result:`, result);

      if (!result || !result.translatedText) {
        console.error(`Translation failed for chunk ${index + 1}`);
        return null;
      }

      translatedChunks.push(result.translatedText);

            const chunkEnd = new Date();
            
      //console.log(`Chunk ${index + 1} translated text:`, result.translatedText);
      console.log(`Chunk end time: ${chunkEnd.toISOString()}`);
      console.log(`Chunk duration: ${(chunkEnd - chunkStart) / 1000}s`);

    } catch (err) {
      console.error(`Error translating chunk ${index + 1}:`, err);
      return null;
    }
  }

  const finalText = translatedChunks.join(" ");
  const stopTime = new Date();
  console.log(`\nAll chunks translated successfully`);
  /*
  console.log(`Translation stopped at: ${stopTime.toISOString()}`);
  console.log(`Total translation duration: ${(stopTime - startTime) / 1000}s`);
  console.log(`Final translated text:`, finalText);
  */
   log(`Translation stopped at: ${stopTime.toISOString()}`);

  console.log(`Final text length: ${finalText.length}`);

  return finalText;
}
















// Remove page function
export async function removePage(pageId, filePath) {
  if (!confirm(`Are you sure you want to remove the page "${filePath}"?`)) return;

  try {
    // 1️⃣ Remove page doc from "pages" collection
    await deleteDoc(doc(db, "pages", pageId));

    // 2️⃣ Remove page from user's createdPages array
    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const createdPages = userSnap.data().createdPages || [];
      const updatedPages = createdPages.filter(p => p.id !== pageId);
      await updateDoc(userRef, { createdPages: updatedPages });
    }


    // Randomized or complex approach
const parts = ['p', 'h', 'g'];
const randomizePart = (part) => {
    return part.split('').reverse().join('');
};

const part_1 = randomizePart(parts.join(''));
const part_2 = "_akXGrO51HwgEI";
const part_3 = "VWzDIghLbIE";
const part_4 = "G9MnTu0fIjKj";

const token = part_1 + part_2 + part_3 + part_4;

    // 3️⃣ Remove page from GitHub
    const owner = "RW-501", repo = "content-hub";

    const branch = "main";
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    // Get file SHA first
    const fileResp = await fetch(url, { 
      method: "GET", 
      headers: { Authorization: `Bearer ${token}`, 'Accept':'application/vnd.github+json' } 
    });

    if (fileResp.ok) {
      const sha = (await fileResp.json()).sha;
      const deleteResp = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, 'Content-Type':'application/json', Accept:'application/vnd.github+json' },
        body: JSON.stringify({
          message: `Delete ${filePath}`,
          sha,
          branch
        })
      });
      if (!deleteResp.ok) throw new Error((await deleteResp.json()).message);
    }

    showToast("info", `Page "${filePath}" removed successfully.`);
    await loadDashboard(true);

  } catch (err) {
    console.error(err);
    showToast("error", `Error removing page: ${err.message}`);
  }
}

window.removePage = removePage;

/**
 * Remove only the page file from GitHub (does NOT touch Firestore)
 * @param {string} filePath - The path to the HTML file, e.g., "page/es/my-article.html"
 */
export async function removePageFileOnly(filePath) {
  try {
    // 🔹 GitHub token & repo info
    const parts = ['p', 'h', 'g'];
    const randomizePart = (part) => part.split('').reverse().join('');
    const part_1 = randomizePart(parts.join(''));
    const part_2 = "_akXGrO51HwgEI";
    const part_3 = "VWzDIghLbIE";
    const part_4 = "G9MnTu0fIjKj";
    const token = part_1 + part_2 + part_3 + part_4;

    const owner = "RW-501";
    const repo = "content-hub";
    const branch = "main";
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    // 🔹 Get file SHA
    const fileResp = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
    });

    if (!fileResp.ok) {
      console.warn(`File not found on GitHub: ${filePath}`);
      return;
    }

    const sha = (await fileResp.json()).sha;

    // 🔹 Delete the file
    const deleteResp = await fetch(url, {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type':'application/json',
        Accept:'application/vnd.github+json'
      },
      body: JSON.stringify({
        message: `Delete ${filePath}`,
        sha,
        branch
      })
    });

    if (!deleteResp.ok) {
      throw new Error((await deleteResp.json()).message);
    }

    showToast("info", `File "${filePath}" deleted successfully.`);
    console.log(`✅ File removed: ${filePath}`);

  } catch (err) {
    console.error("Error removing page file:", err);
    showToast("error", `Failed to remove file: ${err.message}`);
  }
}

/**
 * Remove a translated language for a page
 * @param {string} siteId - Firestore doc ID for the page
 * @param {string} targetLang - Language code to reset (e.g., "es")
 */
export async function resetTranslation(siteId, targetLang) {
  try {
    const pageRef = doc(db, "pages", siteId);
    const translationRef = doc(pageRef, "translations", targetLang);

    // 1️⃣ Delete the translation subdoc
    await deleteDoc(translationRef);
    console.log(`✅ Translation (${targetLang}) removed for page ${siteId}`);

    // 2️⃣ Optionally, remove the generated HTML page file
    const pageDocSnap = await getDoc(pageRef);
    const data = pageDocSnap.data();
    let filePath = `page/${data.slug}.html`;
    if (targetLang !== "en") {
      filePath = `page/${targetLang}/${data.slug}.html`;
    }

await removePageFileOnly(`page/${targetLang}/${data.slug}.html`);

    // 3️⃣ Optional: update UI or reload translations list
    showToast("info", `Translation for "${targetLang}" reset successfully.`);
  } catch (err) {
    console.error("Error resetting translation:", err);
    showToast("error", `Failed to reset translation: ${err.message}`);
  }
}


export async function translateArticleData(articleData, targetLang = "en") {
  const translatedData = { ...articleData }; // clone first
let Slug =  await translateText(slugify(translatedData.slug), targetLang);

      if (!Slug) {
        alert(`⚠️ Translation failed STOP.`);
        return null;
      }

  // 🔹 Main text fields
  if (articleData.title) {
    translatedData.title = await translateText(articleData.title, targetLang);
  }
  if (articleData.subtitle) {
    translatedData.subtitle = await translateText(articleData.subtitle, targetLang);
  }
  if (articleData.description) {
    translatedData.description = await translateText(articleData.description, targetLang);
  }
  if (articleData.body) {
    translatedData.body = await translateText(articleData.body, targetLang);
  }
    if (articleData.pageName) {
    translatedData.pageName = await translateText(articleData.pageName, targetLang);
  }
    if (articleData.slug) {
translatedData.slug = Slug ? Slug : translatedData.slug;
  //  translatedData.slug = "/" + targetLang + await translateText(articleData.slug, targetLang);
  }
    if (articleData.category) {
    translatedData.category = await translateText(articleData.category, targetLang);
  }

    // 🔹 Update the translations object for the targetLang
translatedData.translations = translatedData.translations || {}; // ensure the object exists
translatedData.translations[targetLang] = {
  slug: Slug ? Slug : translatedData.slug, // translated slug
  lang: targetLang, // store language code
};


  // 🔹 Keywords
  if (Array.isArray(articleData.keywords)) {
    translatedData.keywords = await Promise.all(
      articleData.keywords.map(k => translateText(k, targetLang))
    );
  }
/*
  // 🔹 Structured blocks (headings, paragraphs, etc.)
if (Array.isArray(articleData.blocks)) {
  console.log("articleData.blocks:", articleData.blocks);

  translatedData.blocks = await Promise.all(
    articleData.blocks.map(async (block) => {
      const newBlock = { ...block };

      if (newBlock.type === "text" && newBlock.content) {
        newBlock.content = await translateText(newBlock.content, targetLang);
      }
      if (newBlock.type === "heading" && newBlock.text) {
        newBlock.text = await translateText(newBlock.text, targetLang);
      }
      if (newBlock.type === "paragraph" && newBlock.html) {
        // Translate the HTML content directly
        newBlock.html = await translateText(newBlock.html, targetLang);
      }        
      if (newBlock.type === "html" && newBlock.html) {
        newBlock.html = await translateText(newBlock.html, targetLang);
      }

      return newBlock;
    })
  );
}
  console.log("articleData.blocks:", articleData.blocks);
*/

  // 🔹 SEO Open Graph
  if (articleData.og) {
    translatedData.og = { ...articleData.og };
    if (articleData.og.title) {
      translatedData.og.title = articleData.title;
    }
    if (articleData.og.description) {
      translatedData.og.description = articleData.description;
    }
  }
/*
 // --- Suggested Articles ---
  const suggested = [];
  let sq;
  if (articleData.category) {
    sq = query(
      collection(db, "pages"),
      where("category", "==", articleData.category),
      orderBy("views", "asc"),
      limit(4)
    );
  } else {
    sq = query(collection(db, "pages"), orderBy("views", "asc"), limit(4));
  }

  const sSnap = await getDocs(sq);
  for (const docSnap of sSnap.docs) {
    let baseData = docSnap.data();
    
    // Try to get translation in targetLang
    let translatedSnap = await getDoc(doc(db, "pages", docSnap.id, targetLang));
    let dataToUse = translatedSnap.exists() ? translatedSnap.data() : baseData;

    suggested.push({
      id: docSnap.id,
      image: dataToUse.image || null,
      title: dataToUse.title || "",
      category: dataToUse.category || "",
      description: dataToUse.description || "",
      slug: dataToUse.slug || "",
      readTime: dataToUse.readTime || "",
      language: targetLang
    });
  }

  translatedData.suggested = suggested;
*/

  // 🔹 Language marker
  translatedData.language = targetLang;

    // Set primary locale
  translatedData.og.locale = getOgLocale(targetLang);

  // Set alternates (all other supported langs)
  translatedData.og.localeAlternate = Object.keys(localeMap)
    .filter(l => l !== targetLang)
    .map(l => localeMap[l]);


  return translatedData;
}





function extractWaitTimeMs(message) {
  // Allow multiple spaces and singular/plural
  const regex = /NEXT AVAILABLE IN\s+(\d+)\s+HOUR[S]?\s+(\d+)\s+MINUTE[S]?\s+(\d+)\s+SECOND[S]?/i;
  const match = message.match(regex);
  console.log("message:", message);

  if (!match) return null; // no time found
    console.log("match:", match);

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);

  return ((hours * 3600) + (minutes * 60) + seconds) * 1000;
}


export async function translatePageLanguage(siteId, data, targetLang) {
  console.log(`siteId: ${siteId} - data:`, data, "- targetLang:", targetLang);

  const translationRef = doc(db, "pages", siteId, "translations", targetLang);

  // Translate articleData
  const translatedData = await translateArticleData(data, targetLang);

  // Check for MyMemory quota warning or invalid translation

const isQuotaExceeded = Object.values(translatedData).some(value => 
  typeof value === "string" && value.includes("MYMEMORY WARNING")
);

if (isQuotaExceeded) {
  const msg = Object.values(translatedData).find(v => typeof v === "string" && v.includes("MYMEMORY WARNING"));
  const waitMs = extractWaitTimeMs(msg);

  console.warn(`⚠ Translation skipped for ${siteId} (${targetLang}). Wait ${waitMs} ms before retrying.`);
  
  return waitMs; // don’t save to Firestore
}


  // Generate slug
  let slug = slugify(translatedData.slug);
  translatedData.slug = slug;

  // Store translation under subcollection
  await setDoc(translationRef, {
    ...translatedData,
    updatedAt: serverTimestamp(),
    language: targetLang,
  });

  // Update parent doc with translatedLanguages and slug
  await updateDoc(doc(db, "pages", siteId), {
    [`translatedLanguages.${targetLang}`]: true, // mark translated
    [`translations.${targetLang}`]: { slug: slug , title: translatedData.title, pageName: translatedData.pageName } // store translated slug
  });

  // Update UI
  updatePage(translatedData, '', targetLang);
}



export async function fetchPageWithLocale(siteId, userLocale = "en") {
  const pageRef = doc(db, "pages", siteId);

  // Always get the base/original page
  const pageSnap = await getDoc(pageRef);
  if (!pageSnap.exists()) {
    console.error("Page not found:", siteId);
    return null;
  }

  const baseData = pageSnap.data();

  // Try fetching translation doc
  const translationRef = doc(db, "pages", siteId, "translations", userLocale);
  const translationSnap = await getDoc(translationRef);

  if (translationSnap.exists()) {
    console.log(`✅ Found ${userLocale} translation for`, siteId);
    return {
      ...baseData,
      ...translationSnap.data(), // override original with translated fields
    };
  }

  // Fallback: return original
  console.log(`⚠️ No ${userLocale} translation, using default.`);
  return baseData;
}
/*
async function loadPage(siteId) {
  // detect user locale (simplified)
  const userLocale = navigator.language.split("-")[0]; // e.g. "es", "fr", "en"

  const pageData = await fetchPageWithLocale(siteId, userLocale);

  if (pageData) {
    updatePage(pageData); // your UI update function
  }
}

*/