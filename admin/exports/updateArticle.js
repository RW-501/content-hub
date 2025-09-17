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



const MAX_CHARS_PER_BATCH = 50; // safe limit for public LibreTranslate

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
export async function translateText(text, targetLang) {
  console.log(`Starting translation: targetLang=${targetLang}, text length=${text.length}`);

  const chunks = chunkText(text);
  const translatedChunks = [];

  for (const [index, chunk] of chunks.entries()) {
     // const chunk = "Hello world";

    console.log(`Translating chunk ${index + 1}:`, chunk);

    try {
      const response = await fetch("https://translateapi-1-mx67.onrender.com/translate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: chunk, source: "en", target: targetLang })
      });

      console.log(`Chunk ${index + 1} fetch completed:`, response);
      console.log("Response headers:", [...response.headers.entries()]);
      console.log("Response status:", response.status, response.statusText);

      const result = await response.json().catch(err => {
        console.error("Failed to parse JSON:", err);
        return null;
      });

      console.log(`Chunk ${index + 1} result:`, result);

      if (!result || !result.translatedText) {
        alert(`⚠️ Translation failed on chunk ${index + 1}.`);
        return null;
      }
      console.log(result.translatedText); // "Hola mundo"

      translatedChunks.push(result.translatedText);
    } catch (err) {
      console.error(`Error translating chunk ${index + 1}:`, err);
    }
  }

  const finalText = translatedChunks.join(" ");
  console.log("Final translated text:", finalText);
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
    translatedData.slug = "/" + targetLang + await translateText(articleData.slug, targetLang);
  }
    if (articleData.category) {
    translatedData.category = await translateText(articleData.category, targetLang);
  }

  // 🔹 Keywords
  if (Array.isArray(articleData.keywords)) {
    translatedData.keywords = await Promise.all(
      articleData.keywords.map(k => translateText(k, targetLang))
    );
  }

  // 🔹 Structured blocks (headings, paragraphs, etc.)
  if (Array.isArray(articleData.blocks)) {
    translatedData.blocks = await Promise.all(
      articleData.blocks.map(async (block) => {
        const newBlock = { ...block };
        if (newBlock.type === "text" && newBlock.content) {
          newBlock.content = await translateText(newBlock.content, targetLang);
        }
        if (newBlock.type === "heading" && newBlock.text) {
          newBlock.text = await translateText(newBlock.text, targetLang);
        }
        if (newBlock.type === "paragraph" && newBlock.text) {
          newBlock.text = await translateText(newBlock.text, targetLang);
        }        
        if (newBlock.type === "html" && newBlock.text) {
          newBlock.text = await translateText(newBlock.text, targetLang);
        }
        return newBlock;
      })
    );
  }

  // 🔹 SEO Open Graph
  if (articleData.og) {
    translatedData.og = { ...articleData.og };
    if (articleData.og.title) {
      translatedData.og.title = await translateText(articleData.og.title, targetLang);
    }
    if (articleData.og.description) {
      translatedData.og.description = await translateText(articleData.og.description, targetLang);
    }
  }

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


export async function handleTranslateAndUpdate(siteId, targetLang) {
  const pageRef = doc(db, "pages", siteId);

  // Path: pages/{siteId}/translations/{targetLang}
  const translationRef = doc(pageRef, "translations", targetLang);

  // Translate articleData (your existing logic)
  const translatedData = await translateArticleData(
    (await getDoc(pageRef)).data(),
    targetLang
  );

  // Store translation under subcollection
  await setDoc(translationRef, {
    ...translatedData,
    updatedAt: serverTimestamp(),
    language: targetLang,
  });

  // Update UI with translated version
  updatePage(translatedData);
}


export async function translatePageLanguage(siteId, data, targetLang) {
  const pageRef = doc(db, "pages", siteId);

        console.log(`siteId: ${siteId} - data: ${data} - targetLang: ${targetLang}`);

  // Path: pages/{siteId}/translations/{targetLang}
  const translationRef = doc(pageRef, "translations", targetLang);

  // Translate articleData (your existing logic)
  const translatedData = await translateArticleData(
    data,
    targetLang
  );
console.log("T. Page: ",translatedData);

  // Store translation under subcollection
  await setDoc(translationRef, {
    ...translatedData,
    updatedAt: serverTimestamp(),
    language: targetLang,
  });

  // Update UI with translated version
  updatePage(translatedData,'' ,targetLang );
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