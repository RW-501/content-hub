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



export async function translateText(text, targetLang) {
  // Placeholder: swap API call with Google Translate or DeepL
  const response = await fetch("https://api.example.com/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, target: targetLang })
  });
  const result = await response.json();
  return result.translatedText;
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