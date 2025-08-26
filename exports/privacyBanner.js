// privacyBanner.js
(function() {
  const bannerId = 'privacy-banner';

  // Check if user has already consented or declined
  if (localStorage.getItem('privacyConsent') === 'true') {
    enableTracking(); // Enable scripts immediately if consent exists
    return;
  } else if (localStorage.getItem('privacyConsent') === 'false') {
    return; // User already declined, do nothing
  }

  // Create banner container
  const banner = document.createElement('div');
  banner.id = bannerId;
  banner.style.position = 'fixed';
  banner.style.bottom = '0';
  banner.style.left = '0';
  banner.style.width = '100%';
  banner.style.background = '#1f2937';
  banner.style.color = '#fff';
  banner.style.padding = '15px 20px';
  banner.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.2)';
  banner.style.fontFamily = 'Arial, sans-serif';
  banner.style.fontSize = '14px';
  banner.style.display = 'flex';
  banner.style.justifyContent = 'space-between';
  banner.style.alignItems = 'center';
  banner.style.zIndex = '9999';

  // Banner message
  const message = document.createElement('span');
  message.innerHTML = `
    We use cookies, Google AdSense, and Firebase Analytics to improve your experience.
    By clicking "Accept", you consent to our <a href="/privacy-policy.html" style="color:#4f46e5;text-decoration:underline;">Privacy Policy</a>.
  `;

  // Accept button
  const acceptBtn = document.createElement('button');
  acceptBtn.textContent = 'Accept';
  acceptBtn.style.background = '#4f46e5';
  acceptBtn.style.color = '#fff';
  acceptBtn.style.border = 'none';
  acceptBtn.style.padding = '8px 15px';
  acceptBtn.style.borderRadius = '6px';
  acceptBtn.style.cursor = 'pointer';
  acceptBtn.style.fontWeight = 'bold';
  acceptBtn.style.marginLeft = '15px';

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('privacyConsent', 'true');
    document.body.removeChild(banner);
    enableTracking();
  });

  // Decline button
  const declineBtn = document.createElement('button');
  declineBtn.textContent = 'Decline';
  declineBtn.style.background = '#6b7280';
  declineBtn.style.color = '#fff';
  declineBtn.style.border = 'none';
  declineBtn.style.padding = '8px 15px';
  declineBtn.style.borderRadius = '6px';
  declineBtn.style.cursor = 'pointer';
  declineBtn.style.fontWeight = 'bold';
  declineBtn.style.marginLeft = '10px';

  declineBtn.addEventListener('click', () => {
    localStorage.setItem('privacyConsent', 'false');
    document.body.removeChild(banner);
    // Do not load analytics or ads
  });

  // Append elements
  const btnWrapper = document.createElement('div');
  btnWrapper.appendChild(acceptBtn);
  btnWrapper.appendChild(declineBtn);

  banner.appendChild(message);
  banner.appendChild(btnWrapper);
  document.body.appendChild(banner);

  // Function to enable analytics & ads after consent
  function enableTracking() {
    // Load Google Analytics gtag
    const gaScript = document.createElement('script');
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ZPWGF7YMPE";
    gaScript.async = true;
    document.head.appendChild(gaScript);

    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-ZPWGF7YMPE');
      gtag('consent', 'update', { 'analytics_storage': 'granted' });
    };

    // Load Google AdSense
    const adsScript = document.createElement('script');
    adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    adsScript.async = true;
    adsScript.setAttribute("data-ad-client", "ca-pub-2001518155292747");
    document.head.appendChild(adsScript);

    // Firebase Analytics initialization
    if (window.firebase && firebase.analytics) {
      firebase.analytics();
    }
  }
})();
