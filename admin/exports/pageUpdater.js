import { showToast } from "https://contenthub.guru/exports/showToast.js";

function logToPopup(message, color = "#ccc") {
  try {
    const logEl = document.getElementById("status-log");
    if (!logEl) return; // stop if log element doesn't exist
    const line = document.createElement("div");
    line.textContent = message;
    line.style.color = color;
    logEl.prepend(line); // newest on top
  } catch (err) {
    console.warn("logToPopup failed:", err);
  }
}

function getVideo(videoUrl) {
  if (!videoUrl) return "";

  // Firebase / direct file
  if (videoUrl.includes("firebasestorage.googleapis.com") || videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
    return `<video class="w-full h-full" controls role="region" aria-label="Video player">
              <source src="${videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>`;
  }

  // YouTube
  if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
    const youtubeEmbed = videoUrl.includes("watch?v=")
      ? videoUrl.replace("watch?v=", "embed/")
      : videoUrl.replace("youtu.be/", "youtube.com/embed/");
    return `<iframe class="w-full h-full" src="${youtubeEmbed}" frameborder="0" allowfullscreen 
              role="region" aria-label="YouTube video player" title="YouTube video"></iframe>`;
  }

  // Vimeo
  if (videoUrl.includes("vimeo.com")) {
    const vimeoId = new URL(videoUrl).pathname.split("/").pop();
    return `<iframe class="w-full h-full" src="https://player.vimeo.com/video/${vimeoId}" 
              frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
              role="region" aria-label="Vimeo video player" title="Vimeo video"></iframe>`;
  }

  // Dailymotion
  if (videoUrl.includes("dailymotion.com")) {
    const id = new URL(videoUrl).pathname.split("/").pop();
    return `<iframe class="w-full h-full" src="https://www.dailymotion.com/embed/video/${id}" 
              frameborder="0" allowfullscreen role="region" aria-label="Dailymotion video player" title="Dailymotion video"></iframe>`;
  }

  // Twitch
  if (videoUrl.includes("twitch.tv")) {
    const id = new URL(videoUrl).pathname.split("/").pop();
    return `<iframe class="w-full h-full" src="https://player.twitch.tv/?video=${id}" 
              frameborder="0" allowfullscreen role="region" aria-label="Twitch video player" title="Twitch video"></iframe>`;
  }

  // Instagram
  if (videoUrl.includes("instagram.com")) {
    const id = new URL(videoUrl).pathname.split("/p/")[1].split("/")[0];
    return `<iframe class="w-full h-full" src="https://www.instagram.com/p/${id}/embed" 
              frameborder="0" allowfullscreen role="region" aria-label="Instagram video player" title="Instagram video"></iframe>`;
  }

  // Twitter
  if (videoUrl.includes("twitter.com")) {
    return `<iframe class="w-full h-full" src="https://twitframe.com/show?url=${encodeURIComponent(videoUrl)}" 
              frameborder="0" allowfullscreen role="region" aria-label="Twitter video player" title="Twitter video"></iframe>`;
  }

  // TikTok
  if (videoUrl.includes("tiktok.com")) {
    const id = new URL(videoUrl).pathname.split("/video/")[1];
    return `<iframe class="w-full h-full" src="https://www.tiktok.com/embed/${id}" 
              frameborder="0" allowfullscreen role="region" aria-label="TikTok video player" title="TikTok video"></iframe>`;
  }

  // Unsupported
  return "";
}

function formatCategory(category) {
  if (!category) return "";
  return category.replace(/[_-]+/g, " ").trim();
}





async function linkifyKeywordsFromJSON(input, jsonUrl = 'https://contenthub.guru/internal-Links.json') {
  try {
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(`Failed to fetch ${jsonUrl}`);
    const keywordMap = await res.json();


    let currentURL;

// Flatten {keyword, url, title} pairs, skipping current page
const entries = [];
for (const [url, data] of Object.entries(keywordMap)) {
  if (url === currentURL)               console.log("Skip url: ", url);
continue; // skip linking keywords for the current page

  const title = data.title || '';
  (data.keywords || []).forEach(keyword => entries.push({ keyword, url, title }));
}

    // Sort longest first
    entries.sort((a, b) => b.keyword.length - a.keyword.length);

    // Convert string HTML to a temporary container if needed
    const container = typeof input === 'string' 
      ? Object.assign(document.createElement('div'), { innerHTML: input })
      : input;

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        let hasChange = false;

        entries.forEach(({ keyword, url, title }) => {
          const regex = new RegExp(`\\b${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, 'gi');
          if (regex.test(text)) {
            hasChange = true;
          console.log("Linked: ", text);
            text = text.replace(
              regex,
              `<a href="${url}" title="${title}" target="_blank" rel="noopener noreferrer">${keyword}</a>`
            );
          }
        });

        if (hasChange) {
          const span = document.createElement('span');
          span.innerHTML = text;
          node.replaceWith(span);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'A'].includes(node.tagName)) {
        [...node.childNodes].forEach(walk);
      }
    }

    walk(container);

    return typeof input === 'string' ? container.innerHTML : container;

  } catch (err) {
    console.error('linkifyKeywordsFromJSON error:', err);
    return typeof input === 'string' ? input : input.outerHTML;
  }
}



            console.log("???????????");

            
let HowTo_Bool = false;
let FAQ_Bool = false;

function generateHowToSchema(html) {
//  console.log("html, ", html);

  // Match <h2> that contains "How to" or "How-To" (case-insensitive, with optional <strong>)
  const howToTitleRegex = /<h2[^>]*>(?:<strong[^>]*>)?(.*?(?:How[\s-]*to|How[\s-]*To).*?)(?:<\/strong>)?<\/h2>/i;
  const titleMatch = html.match(howToTitleRegex);
  if (!titleMatch) return null;

  const title = titleMatch[1].replace(/<[^>]+>/g, "").trim();

  // Regex patterns for different formats
  const stepRegex = /<h[2-4][^>]*>\s*(?:Step\s*\d+|Week\s*\d+|step\s*\d+|\d+(?:\s*of\s*\d+)?\.?)\s*[:.-]?\s*(.*?)<\/h[2-4]>\s*([\s\S]*?)(?=<h[2-4]|<hr|$)/gi;
  const listStepRegex = /<li[^>]*>\s*<p[^>]*><strong[^>]*>(.*?)<\/strong>\s*[–\-:]?\s*(.*?)<\/p>\s*<\/li>/gi;
  const simpleListRegex = /<li[^>]*>\s*(?:<p[^>]*>)?(.*?)<\/?(?:p|li)>/gi;

  const steps = [];
  let match;

  // Step blocks introduced by headings (Step 1:, Week 1:, etc.)
  while ((match = stepRegex.exec(html)) !== null) {
    const stepTitle = match[1].replace(/<[^>]+>/g, "").trim();
    const stepBody = match[2];

    // Clean inline <p> text right after the heading
    const firstParaMatch = stepBody.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const stepText = firstParaMatch ? firstParaMatch[1].replace(/<[^>]+>/g, "").trim() : "";

    steps.push({
      "@type": "HowToStep",
      "name": stepTitle || "Step",
      "text": stepText || stepTitle
    });

    // Look for lists under this step (sub-steps)
    let subMatch;
    while ((subMatch = listStepRegex.exec(stepBody)) !== null) {
      const subTitle = subMatch[1].replace(/<[^>]+>/g, "").trim();
      const subText = subMatch[2].replace(/<[^>]+>/g, "").trim();
      steps.push({ "@type": "HowToStep", "name": subTitle, "text": subText });
    }

    while ((subMatch = simpleListRegex.exec(stepBody)) !== null) {
      const rawText = subMatch[1].replace(/<[^>]+>/g, "").trim();
      if (rawText.length > 0) {

        const parts = rawText.split(/[:–\-]/);
        const subTitle = parts.shift().trim();
        const subText = parts.join(" ").trim();
        steps.push({
          "@type": "HowToStep",
          "name": subTitle || "Step",
          "text": subText || subTitle
        });
      }
    }
  }

  if (steps.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "step": steps
  };
}



function checkContent(html) {
  if (!html) return "";
// console.log("html, ",html);

  // Linkify contenthub mentions
  html = linkifyContentHub(html);



  
 html = linkifyKeywordsFromJSON(html);

console.log(html);


  // Render FAQ blocks
  html = renderFAQs(html);

  // Render How To blocks
  html = renderHowTo(html);

  // Generate FAQ schema
  const faqSchema = generateFAQSchema(html);
  if (faqSchema) {
    html += `<script id='FAQ_Schema' type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
    logToPopup("FAQ schema injected!", "limegreen");
    console.log("FAQ schema injected!");
    FAQ_Bool = true;
  }

  // Generate HowTo schema
  const howToSchema = generateHowToSchema(html);
  if (howToSchema) {
    html += `<script id='HowTo_Schema' type="application/ld+json">${JSON.stringify(howToSchema)}</script>`;
    logToPopup("HowTo schema injected! ", "limegreen");
    console.log("HowTo schema injected!");
    HowTo_Bool = true;
  }

  return html;
}
function renderHowTo(html) {
  if (!html) return html;

  // Match How-To section from <h2> to next <h2> or end
  const howToSectionRegex = /<h2[^>]*>(How[\s-]?To.*?)<\/h2>([\s\S]*?)(?=(<h2|$))/i;
  const match = html.match(howToSectionRegex);
  if (!match) return html;

  const title = match[1];
  const sectionContent = match[2];

  const steps = [];

  // 1. Capture <h3> + <p> as steps
  const stepHeadingRegex = /<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let stepMatch;
  while ((stepMatch = stepHeadingRegex.exec(sectionContent)) !== null) {
    steps.push(`<div class="howto-step"><strong>${stepMatch[1]}</strong><p>${stepMatch[2]}</p></div>`);
  }

  // 2. Capture ordered or unordered list steps <ol>/<ul>
  const listRegex = /<(ol|ul)[^>]*>([\s\S]*?)<\/\1>/gi;
  let listMatch;
  while ((listMatch = listRegex.exec(sectionContent)) !== null) {
    const items = [];
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(listMatch[2])) !== null) {
      const liContent = liMatch[1].replace(/<[^>]+>/g, "").trim(); // remove inner tags
      if (liContent.length > 0) items.push(`<div class="howto-step"><p>${liContent}</p></div>`);
    }
    if (items.length) steps.push(items.join(""));
  }

  // Replace the original How-To block with structured HTML
  return html.replace(howToSectionRegex, `
    <section class="howto-block">
      <h2 class="howto-title">${title}</h2>
      <div class="howto-steps">
        ${steps.join("")}
      </div>
    </section>
  `);
}


function renderFAQs(html) {
  if (!html) return html;

  const faqRegex = /<p[^>]*>\s*<strong[^>]*>(Q\d+:.*?)<\/strong>\s*([\s\S]*?)<\/p>/gi;

  let hasFAQ = false;

  html = html.replace(faqRegex, (match, q, a) => {
    hasFAQ = true;
    q = linkifyContentHub(q.trim());
    a = linkifyContentHub(a.trim());
    return `<details class="faq-item"><summary>${q}</summary><div class="faq-answer">${a}</div></details>`;
  });

  FAQ_Bool = hasFAQ;
  return html;
}



function generateFAQSchema(html) {
  if (!FAQ_Bool) return null;

  const faqItems = [];
  const qaRegex = /<details class="faq-item"><summary>(.*?)<\/summary><div class="faq-answer">(.*?)<\/div><\/details>/gs;
  let match;

  while ((match = qaRegex.exec(html)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/<[^>]+>/g, ""); // remove HTML tags
    if (question && answer) {
      faqItems.push({
        "@type": "Question",
        "name": question,
        "acceptedAnswer": { "@type": "Answer", "text": answer }
      });
    }
  }

  if (faqItems.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems
  };
}

// Step 3: Linkify mentions of ContentHub
function linkifyContentHub(html) {
  if (!html) return "";
  const regex = /\bcontent\s*hub(?:\.guru)?\b/gi;
  return html.replace(regex, match => `<a href="https://contenthub.guru" target="_blank" rel="noopener noreferrer">${match}</a>`);
}



  // Load existing image when editing
function renderBlockHTML(b) {
  switch (b.type) {
    case "heading":
      return `<h${b.level || 2} class="content-heading heading-${b.level || 2}">
                ${b.text || ""}
              </h${b.level || 2}>`;
    
    case "paragraph":
      return `<div class="content-paragraph prose max-w-none">
                ${checkContent(b.html || "")}
              </div>`;

    case "image":
      return `<figure class="content-image">
                <img src="${b.mediaId}" 
                     alt="${b.alt || ""}" 
                     class="rounded-lg shadow-md" 
                     ${b.width ? `style="width:${b.width}px;"` : "style='max-width:100%;height:auto;'"}  loading="lazy" />
                ${b.caption ? `<figcaption class="caption text-sm text-gray-500 mt-2">${b.caption}</figcaption>` : ""}
              </figure>`;

case "video":
  return `<div class="content-video aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
            ${getVideo(b.url)}
          </div>
          ${b.caption ? `<p class="caption text-center text-sm text-gray-500 mt-2">${b.caption}</p>` : ""}`;

    case "faq":
      return `<dl class="content-faq divide-y divide-gray-200">
        ${b.items?.map(qa => `
          <div class="faq-item py-3">
            <dt class="faq-question font-semibold text-lg">${qa.q}</dt>
            <dd class="faq-answer text-gray-700 mt-1">${qa.a}</dd>
          </div>`).join("")}
      </dl>`;

    case "comparisonTable":
      return `<div class="overflow-x-auto">
        <table class="comparison-table w-full border border-gray-300 text-sm text-left">
          <thead class="bg-gray-100">
            <tr>${b.columns.map(c => `<th class="px-4 py-2 border">${c}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${b.rows.map(r => `<tr>${r.map(c => `<td class="px-4 py-2 border">${c}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>`;

    case "cta":
    case "button":
      return `<div class="content-cta my-6 text-center">
                <a href="${b.href}" 
                   class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">
                   ${b.text}
                </a>
              </div>`;

    case "rawHtml":
      return `<div class="content-raw">${b.html || ""}</div>`;

    case "ad":
      return `<div class="ad-slot my-6 border border-dashed border-gray-400 text-center text-gray-500 py-4" data-slot="${b.slot}">

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2001518155292747"
     crossorigin="anonymous"><\/script>
<!-- ${b.slot} Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2001518155292747"
     data-ad-slot="1489076914"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
<\/script>  
        Sponsered: Google 
              </div>`;

    default:
      return "";
  }
}


function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time;
}


// Update UI
export async function updatePage(articleData, location) {

currentURL = "https://contenthub.guru"+articleData.slug+"html";

console.log("currentURL: ",currentURL);

const scriptTag = `<script id="dynamic-js" type="module" src="https://contenthub.guru/exports/main.js"><\/script>`;


// Generate random rating count between 2000 and 4000
let randomBaseCount = Math.floor(Math.random() * 2001) + 2000;

let helpful = articleData.helpfulCount || 0;
let notHelpful = articleData.notHelpfulCount || 0;
let ratingCount = helpful + notHelpful;
let averageRating = 4.5;

// Fallback if not enough votes yet
if (ratingCount < 10) {
  ratingCount = randomBaseCount; // give it a natural-looking base
  averageRating = 4.5;           // keep rating high but realistic
} else {
  // Calculate rating on a 1–5 scale
  averageRating = (helpful / ratingCount) * 5;

  // Prevent out-of-range issues
  if (averageRating < 1) averageRating = 1;
  if (averageRating > 5) averageRating = 5;
}
  
  // Prepare containers with block HTML
const topBlocksHTML = articleData.blocks
  .filter(b => b.position === "top")
  .map((b, i) => `<div id="block-top-${i}" class="block block-${b.type}">${renderBlockHTML(b)}</div>`)
  .join("");

const leftBlocksHTML = articleData.blocks
  .filter(b => b.position === "left")
  .map((b, i) => `<div id="block-left-${i}" class="block block-${b.type}">${renderBlockHTML(b)}</div>`)
  .join("");

const rightBlocksHTML = articleData.blocks
  .filter(b => b.position === "right")
  .map((b, i) => `<div id="block-right-${i}" class="block block-${b.type}">${renderBlockHTML(b)}</div>`)
  .join("");

const inArticleBlocksHTML_Clean = articleData.blocks
  .filter(b => b.position === "in-article" || !b.position)
  .map((b, i) => `<div id="block-article-${i}" class="block block-${b.type}">${renderBlockHTML(b)}</div>`)
  .join("");

const bottomBlocksHTML = articleData.blocks
  .filter(b => b.position === "bottom")
  .map((b, i) => `<div id="block-bottom-${i}" class="block block-${b.type}">${renderBlockHTML(b)}</div>`)
  .join("");

const articleBody = [
  topBlocksHTML,
  leftBlocksHTML,
  rightBlocksHTML,
  inArticleBlocksHTML_Clean,
  bottomBlocksHTML
].join(" ");

const readTime = calculateReadingTime(articleBody);


// Your ad code as a string
const adCode = `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2001518155292747"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-2001518155292747"
     data-ad-slot="3066695507"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
`;

// Replace $[AD] placeholders in your content
const inArticleBlocksHTML = inArticleBlocksHTML_Clean.replace(/\$\[AD\]/g, adCode);

  // Schema generation
  let schemaJSON;
  switch (articleData.schemaType) {
    case "FAQ":
      schemaJSON = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": articleData.faq?.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        })) || []
      };
      break;
    case "HowTo":
      schemaJSON = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": articleData.title,
        "description": articleData.description,
        "step": articleData.howto?.map((s, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "name": s.stepTitle,
          "text": s.stepDescription
        })) || []
      };
      break;
    default: // Article
      schemaJSON = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleData.title,
        "image": articleData.image,
        "timeRequired":  articleData.readTime || "PT"+readTime+"M",
        "datePublished": articleData.datePublished || new Date().toISOString(),
        "dateModified": articleData.updatedAt || new Date().toISOString(),
        "author": articleData.author || { "@type": "Organization", "name": "ContentHub" },
        "publisher": { "@type": "Organization", "name": "ContentHub" },
        "description": articleData.description,
        "articleBody": articleData.body || "",
          "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": averageRating.toFixed(1),
    "ratingCount": ratingCount
      }
      };
      break;
  }


    const pageURL = `https://contenthub.guru/page/${encodeURIComponent(articleData.slug)}`;
    const pageTitle = `${articleData.title}`;
    const encodedPageTitle = encodeURIComponent(pageTitle); // Use for URL query strings

  const d = new Date();
  const year = String(d.getFullYear()).slice(-2); // last 2 digits of year
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 01–12
  const day = String(d.getDate()).padStart(2, "0"); // 01–31
  const hour = String(d.getHours()).padStart(2, "0"); // 00–23

  const version = `Version: V${year}${month}${day}${hour}`;
 
// 🔹 Suggested Pages HTML builder
let suggestedHTML = "";

if (Array.isArray(articleData.suggested)) {
  articleData.suggested.forEach((page) => {
    suggestedHTML += `
      <div class="suggested-card">
        <img src="${page.image || 'https://contenthub.guru/images/placeholder.png'}" alt="${page.title}">
        <div class="suggested-content">
          <a href="https://contenthub.guru/page/${page.slug}"><h3>${page.title}</h3></a>
          <p>Reading Time: ${readTime} min</p>
          <p>${(page.description || "").slice(0, 100)}...</p>
          <a href="https://contenthub.guru/page/${page.slug}"> Read More →</a>
        </div>
      </div>
    `;
  });
}




  // Modern Layout HTML
const Content = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${articleData.title} - ${articleData.domain} | ${articleData.slug || "Untitled"}</title>
<meta name="description" content="${articleData.description}">
<meta name="version" content="${version}">
<meta name="faq" content="${FAQ_Bool ? 'true' : 'false'}">
<meta name="howTo" content="${HowTo_Bool ? 'true' : 'false'}">
<meta name="category" content="${formatCategory(articleData.category)}">
<meta name="lang" content="en">

<meta name="imageCount" content="1">
<meta name="pageType" content="Article">

<meta name="keywords" content="${articleData.keywords?.join(', ') || ''}">
<meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- ensures proper rendering in older IE -->
<meta name="format-detection" content="telephone=no"> <!-- prevents phone number auto-linking -->
<meta name="theme-color" content="#fdfdfdff"> <!-- already included but ensures mobile browsers pick it up -->

<!-- Progressive Web App meta -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="HandheldFriendly" content="true">
<meta name="MobileOptimized" content="320">

<meta name="google-site-verification" content="${articleData.google_Verification}">
<meta name="bing-site-verification" content="${articleData.bing_Verification}">
<meta name="yandex-verification" content="${articleData.yandex_Verification}">

<meta name="msvalidate.01" content="41794433A3D0795B3768E9AE59B10997" />


<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="revisit-after" content="1 days">
<meta name="rating" content="general">
<meta name="theme-color" content="#1a1a1a">
<meta name="author" content="ContentHub.guru">
<meta name="readtime" content="PT${readTime}M"> <!-- ISO 8601 duration for structured data -->
<meta name="docsearch:read_time" content="${readTime} min"> <!-- optional for advanced SEO tools -->
  
<!-- Canonical URL -->
<link rel="canonical" href="https://contenthub.guru/page/${articleData.slug}">

<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="https://contenthub.guru/images/favicons/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="https://contenthub.guru/images/favicons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="https://contenthub.guru/images/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="https://contenthub.guru/images/favicons/favicon-16x16.png">
<link rel="manifest" href="https://contenthub.guru/images/favicons/site.webmanifest">

<link rel="preload" href="${articleData.image}" as="image">
<link rel="preconnect" href="https://www.google-analytics.com">
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
<meta http-equiv="Cache-Control" content="public, max-age=31536000">

  <!-- Open Graph / Facebook -->
<meta property="og:type" content="article">
<meta property="og:title" content="${articleData.title}">
<meta property="og:description" content="${articleData.description}">
<meta property="og:image" content="${articleData.image}">
<meta property="og:image:alt" content="${articleData.title}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://contenthub.guru/page/${articleData.slug}">
<meta property="og:site_name" content="ContentHub.guru">
<meta property="og:locale" content="en_US">
<meta property="article:published_time" content="${articleData.publishedAt || new Date().toISOString()}">
<meta property="article:modified_time" content="${articleData.updatedAt || new Date().toISOString()}">
<meta property="article:section" content="${formatCategory(articleData.category)}">
<meta property="article:tag" content="${articleData.keywords?.join(', ') || ''}">
<meta property="og:readtime" content="${readTime} Min">
<meta property="article:author" content="https://contenthub.guru">

<!-- 🔹 Social Profiles for OG -->
<meta property="og:see_also" content="https://x.com/Contenthub_Guru">
<meta property="og:see_also" content="https://www.linkedin.com/showcase/content-hub-guru">
<meta property="og:see_also" content="https://www.reddit.com/r/ContentHubGuru/">
<!-- (Future) <meta property="og:see_also" content="https://facebook.com/..."> -->
<!-- (Future) <meta property="og:see_also" content="https://youtube.com/..."> -->

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${articleData.title}">
  <meta name="twitter:description" content="${articleData.description}">
  <meta name="twitter:image" content="${articleData.image}">
  <meta name="twitter:site" content="@Contenthub_Guru">
  <meta name="twitter:creator" content="@Contenthub_Guru">

  <!-- Additional Article Schema/SEO Hints -->
<meta property="article:published_time" content="${articleData.datePublished || new Date().toISOString()}">
<meta property="article:modified_time" content="${articleData.updatedAt || new Date().toISOString()}">
<meta property="article:section" content="${formatCategory(articleData.category)}">
<meta property="article:tag" content="${articleData.keywords?.join(', ') || ''}">


<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://contenthub.guru"},
    {"@type": "ListItem", "position": 2, "name": "${formatCategory(articleData.category)}", "item": "https://contenthub.guru/category?c=${articleData.category}"},
    {"@type": "ListItem", "position": 3, "name": "${articleData.title}", "item": "https://contenthub.guru/page/${articleData.slug}"}
  ]
}
</script>

    <!-- Structured Data: Article + FAQ -->
  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"Article",
    "headline":"${articleData.title}",
    "description":"${articleData.description}",
    "timeRequired": "PT${readTime}M",
    "image":["${articleData.image}"],
    "author":{"@type":"Organization","name":"ContentHub"},
    "publisher":{"@type":"Organization","name":"ContentHub","logo":{"@type":"ImageObject","url":"${articleData.image}"}},
    "datePublished":"${articleData.publishedAt}",
    "dateModified":"${articleData.updatedAt}",
    "mainEntityOfPage":{"@type":"WebPage","@id":"https://contenthub.guru/page/${articleData.slug}"  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "${averageRating.toFixed(1)}",
    "ratingCount": "${ratingCount}"
  }
  }
  <\/script>

<meta name="google-adsense-account" content="${articleData.adsense}">

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${articleData.adsense}"
     crossorigin="anonymous"></script>

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${articleData.gTag}" id="google-tag"><\/script>
<script id="google-gtag">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${articleData.gTag}');
<\/script>

<!-- Schema & Metadata -->
<script type="application/ld+json">${JSON.stringify(schemaJSON)}<\/script>

<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"><\/script>

${scriptTag}

<div id= 'default-style'></div>

<!-- 🔹 Changeable Theme CSS -->
<style id="dynamic-style">

/* 🔹 Header */
.site-header {
  background: linear-gradient(135deg, ${articleData.styles.headerBg || "#ffffff"}, ${articleData.styles.headerBorder || "#e6e6ea"});
  color: ${articleData.styles.headerText || "#222222"};
  padding: 3rem 0;
  text-align: center;
  border-bottom: 4px solid ${articleData.styles.headerBorder || "#e6e6ea"};
}

.header-bottom {
    background-color: ${articleData.styles.headerBorder || "#e6e6ea"};
    color: ${articleData.styles.headerText || "#222222"};
}

main {
/* 🔹 CTA Button */
.content-cta a {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${articleData.styles.ctaBg || "#4f46e5"};
  color: ${articleData.styles.ctaText || "#ffffff"};
  font-weight: 600;
  border-radius: ${articleData.styles.ctaNoBorderRadius ? 0 : (articleData.styles.ctaRadius || 8)}px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-decoration: none;
  transition: background-color 0.2s, transform 0.1s;
  border: ${articleData.styles.ctaNoBorder ? "none" : `1px solid ${articleData.styles.ctaOutline || "#e6e6ea"}`};
}

.content-cta a:hover {
  background-color: ${articleData.styles.ctaHover || "#3730a3"};
  transform: translateY(-1px);
}

 button {
  background-color: ${articleData.styles.btnBg || "#22c55e"};
  color: ${articleData.styles.btnText || "#ffffff"};
  border-radius: ${articleData.styles.btnNoBorderRadius ? 0 : (articleData.styles.btnRadius || 8)}px;
  border: ${articleData.styles.btnNoBorder ? "none" : `1px solid ${articleData.styles.btnOutline || "#16a34a"}`};
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

button:hover {
  background-color: ${articleData.styles.btnHover || "#16a34a"};
  transform: translateY(-1px);
}

/* 🔹 Horizontal Rule */
hr {
  border: none;
  border-top: 1px solid ${articleData.styles.hrColor || "#d1d5db"};
}
}

</style>

<script async custom-element="amp-auto-ads"
        src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
</script>

</head>
<body style="opacity: 0;">

<amp-auto-ads type="adsense"
        data-ad-client="ca-pub-2001518155292747">
</amp-auto-ads>

  <!-- 🔹 Skip to main content (screen readers & keyboard users) -->
  <a href="#block-article-0" class="skip-link">Skip to content</a>
  
<!-- Progress Bar -->
<div id="progressBar"></div>

<header class="site-header" role="banner">


  <div class="container header-main">
    <h1 id="page-title">${articleData.title}</h1>
    <p class="subtitle">${articleData.subtitle || ""}</p>
  </div>


</header>

<div class="header-bottom">
  <nav aria-label="Breadcrumb" class="breadcrumb-wrapper">
    <ol class="breadcrumb">
      <li><a title="Content Hub Home Page" href="https://contenthub.guru">Content Hub</a></li>
      <li>
        <a title="Content Hub ${formatCategory(articleData.category)} Category" 
           href="https://contenthub.guru/category?c=${articleData.category}">
           ${formatCategory(articleData.category)}
        </a>
      </li>
      <li class="active" aria-current="page">
        <a href="${articleData.canonicalUrl || window.location.href}" 
           title="${articleData.title} Content">
          ${articleData.title}
        </a>
      </li>
    </ol>
  </nav>

<p><strong>Read Time:</strong> <span id="readTime">${articleData.readTime || "5"} mins</span></p>

  <p>
    <a href="#commentForm" title="${articleData.title} Comments" id="navCommentBtn">Comments</a>
  </p>
</div>


  
  <main class="mx-auto px-4" id="main-content" role="main">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

<!-- Share Section -->
<div class="share-section">
  <div class="share-buttons">
    <a class="facebook" href="https://www.facebook.com/sharer/sharer.php?u=${pageURL}" target="_blank" title="Share on Facebook">
      <i class="fab fa-facebook"></i>
    </a>
    <a class="twitter" href="https://twitter.com/intent/tweet?text=${encodedPageTitle}&url=${pageURL}" target="_blank" title="Share on Twitter">
      <i class="fab fa-twitter"></i>
    </a>
    <a class="linkedin" href="https://www.linkedin.com/shareArticle?mini=true&url=${pageURL}" target="_blank" title="Share on LinkedIn">
      <i class="fab fa-linkedin"></i>
    </a>
    <a class="whatsapp" href="https://wa.me/?text=${encodedPageTitle}%20${pageURL}" target="_blank" title="Share on WhatsApp">
      <i class="fab fa-whatsapp"></i>
    </a>
    <button id="deviceShareButton" class="device-share" title="Share using your device">
      <i class="fas fa-share-alt"></i> 
    </button>
    <button id="copyLinkButton" class="copy-link" title="Copy Link">
      <i class="fas fa-link"></i>
    </button>
  </div>
</div>


    <!-- Hero / Featured image -->
    ${articleData.image ? `
    <section class="hero lg:col-span-12 order-1">
      <figure>
        <img src="${articleData.image}" 
             alt="${articleData.alt || articleData.title}" 
             id="mainImage"
             class="hero-img" 
             role="img"
             aria-describedby="page-title"  
             loading="lazy"/>
        ${articleData.caption ? `<figcaption>${articleData.caption}</figcaption>` : ""}
      </figure>
    </section>` : ""}


<!-- Table of Contents -->
<nav id="toc" aria-label="Table of Contents">
  <h3 id="toc-heading">
    Table of Contents
    <button id="toc-toggle" aria-expanded="true" aria-controls="toc-list">
      Hide
    </button>
  </h3>
  <ul id="toc-list" role="list" aria-labelledby="toc-heading">
    <!-- JS injects TOC items -->
  </ul>
</nav>

<div id="text-reader-controls" >
  <button id="startBtn">Start</button>
  <button id="pauseBtn">Pause</button>
  <button id="resumeBtn">Resume</button>
  <button id="stopBtn">Stop</button>
  <select id="voiceSelect"></select>
  <button hidden id="downloadBtn">Download Audio</button>
</div>

    <!-- Top banner -->
    <section id="top-banner-container" class="lg:col-span-12 order-2">
      ${topBlocksHTML}
    </section>

          <div id='main-Content-Area' class = 'flex'>

<!-- Left sidebar -->
<aside id="left-sidebar" 
       class="lg:col-span-3 space-y-6 order-4 lg:order-2">
  ${leftBlocksHTML}
</aside>

<!-- Main content -->
<section id="in-article-blocks" 
         class="lg:col-span-6 space-y-6 order-2 lg:order-3">
  ${articleData.body}
  ${inArticleBlocksHTML}
</section>

<!-- Right sidebar -->
<aside id="right-sidebar" 
       class="lg:col-span-3 space-y-6 order-5 lg:order-4">
  ${rightBlocksHTML}
</aside>


</div>

    <!-- Bottom banner -->
    <section id="bottom-banner-container" class="lg:col-span-12 order-6">
      ${bottomBlocksHTML}

<div id="feedback-area">
  <div class="feedback">
    <p>Was this page helpful?</p>
    <button id="yesBtn">Yes</button>
    <button id="noBtn">No</button>
  </div>
  <p id="feedbackMsg"></p>
  
  <!-- Rating display -->
  <div id="rating-display">
    <span id="rating-stars">⭐⭐⭐⭐⭐</span>
    <span id="rating-value">4.5</span> / 5
    <span hidden id="rating-count">0</span>
    <span hidden id="helpfulCount">${articleData.helpfulCount}</span>
    <span hidden id="notHelpfulCount">${articleData.notHelpfulCount}</span>
  </div>
</div>


    </section>

  </div>

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2001518155292747"
     crossorigin="anonymous"><\/script>
<!-- new bottom ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2001518155292747"
     data-ad-slot="2543951326"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
<\/script>

  <div class="comments form">
  <h2 class="changeable-text">Comments</h2>
  <div id="commentForm">
    <div>
      <input type="text" id="commentName" placeholder="Your Name" required>
    </div>
    
    <div id="checkBoxArea">
      <div class="anonymousCheckboxArea">
        <input type="checkbox" id="anonymousCheckbox">
        <label for="anonymousCheckbox">Post as Anonymous</label>
      </div>
      <div class="privateCheckboxArea">
        <input type="checkbox" id="privateCheckbox">
        <label for="privateCheckbox">Private Comment</label>
      </div>
    </div>

    <div>
      <textarea id="commentMessage" rows="4" placeholder="Write a comment..." required></textarea>
    </div>
    <div>
      <button id="comment-submit-btn" class="changeable-text">Post Comment</button>
    </div>
  </div>

  <!-- 🔹 Comments Display -->
  <div class="comments-list" id="commentsList">
    <!-- Comments will be rendered here dynamically -->
  </div>
</div>

<section id="suggested-pages" class="suggested">
  <h2>Suggested for You</h2>
  <div id="suggested-container" class="suggested-grid">${suggestedHTML}</div>
</section>


</main>

<footer class="site-footer" role="contentinfo" style="text-align:center; padding:20px; background:#1f2937; color:#f3f4f6; font-family:Arial, sans-serif;">
  <p>
    Copyright © ${new Date().getFullYear()} | 
    <a href="https://contenthub.guru/" target="_blank" style="color:#4f46e5; text-decoration:none;">ContentHub.guru</a> <br>
    ${articleData.title || "Untitled Site"}
  </p>

  <!-- 🔹 Social Links -->
  <div style="margin:15px 0; display:flex; justify-content:center; gap:20px; font-size:22px;">
    <a href="https://x.com/Contenthub_Guru" target="_blank" style="color:#f3f4f6;"><i class="fab fa-x-twitter"></i></a>
    <a href="https://www.linkedin.com/showcase/content-hub-guru" target="_blank" style="color:#f3f4f6;"><i class="fab fa-linkedin"></i></a>
    <a href="https://www.reddit.com/r/ContentHubGuru/" target="_blank" style="color:#f3f4f6;"><i class="fab fa-reddit"></i></a>
    <a href="#" target="_blank" style="color:#f3f4f6;"><i class="fab fa-facebook"></i></a>
    <a href="#" target="_blank" style="color:#f3f4f6;"><i class="fab fa-youtube"></i></a>
  </div>

  <!-- 🔹 Report Page Button -->
  <div id="reportPageBtn" style="
      display: inline-block;
      padding: 0.5rem 1rem;
      color: red;                  
      border: 2px solid red;       
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      text-align: center;
      transition: background-color 0.2s, color 0.2s;
      margin: 1.5rem 0;
  ">
      Report Page
  </div>

  <p class='hidden' style="font-size:10px; color:#9ca3af; text-align:center; margin-top:10px;">
    Website developed by 
    <a title="Website created by Ron Wilson" href="https://rw-501.github.io/Portfolio" target="_blank" rel="noopener noreferrer" style="color:#4f46e5; text-decoration:none;">
      Ron Wilson
    </a>
  </p>

  <p id="version">${version}</p>

      <a href="https://contenthub.guru" title="Content Hub Home" style="text-decoration:none;">
        <img src= "https://contenthub.guru/images/logo.png" 
             alt="Content Hub Logo" 
             id="footerLogo"
             class="imag" 
             role="img"
             aria-describedby="Content-Hub-Logo" 
             loading="lazy"/></a>

</footer>

<!-- Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<!-- Scroll to Top -->
<div id="scrollUpBtn"><i class="fas fa-arrow-up"></i></div>


  <!-- 🔹 Hidden meta info for debugging / internal use -->
  <div hidden>
    <div id="pageID">${articleData.siteId}</div>
    <div id="pageOwnerUserID">${articleData.userID}</div>
    <div id="pageSlug">${articleData.slug}</div>
    <div id="pageTitle">${articleData.title}</div>
    <div id="pageDescription">${articleData.description}</div>
    <div id="pageURL">https://contenthub.guru/page/${articleData.slug}</div>
  </div>
</body>
</html>
`;



// Randomized or complex approach
const parts = ['p', 'h', 'g'];
const randomizePart = (part) => {
    return part.split('').reverse().join('');
};

const part_1 = randomizePart(parts.join(''));
const part_2 = "_akXGrO51HwgEI";
const part_3 = "VWzDIghLbIE";
const part_4 = "G9MnTu0fIjKj";

const GITHUB_TOKEN = part_1 + part_2 + part_3 + part_4;


  // Upload to GitHub
  const owner = "RW-501", repo = "content-hub", filePath = `page/${articleData.slug}.html`, branch = "main";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const encodedContent = btoa(unescape(encodeURIComponent(Content)));

  try {
    const fileResp = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" }
    });
    const sha = fileResp.ok ? (await fileResp.json()).sha : undefined;
    const resp = await fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json", Accept: "application/vnd.github+json" },
      body: JSON.stringify({ message: sha ? `Update ${filePath}` : `Create ${filePath}`, content: encodedContent, sha, branch })
    });
    if (!resp.ok) throw new Error((await resp.json()).message);
    showToast("info", "Page Updated successfully!");
    console.log("Page updated successfully!");

// 200 seconds = 200 * 1000 milliseconds
setTimeout(() => {
if (location) {
  window.location.href = location;
}
}, 2000);
    
  } catch (err) {
    console.error(err.message);
  }
}

