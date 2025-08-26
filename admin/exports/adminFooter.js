// footer.js
export function loadFooter(targetId = "admin-footer") {
  const footerContainer = document.getElementById(targetId);
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer class="site-footer" style="
      background:#1f2937;
      color:#f3f4f6;
      padding:25px 20px;
      font-family: Arial, sans-serif;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:10px;
      border-top:1px solid #374151;
    ">
      <p style="margin:0; font-size:14px;">
        &copy; <span id="currentYear"></span> 
        <a href="https://contenthub.guru" target="_blank" style="color:#4f46e5; text-decoration:none;">ContentHub.guru</a> 
        | All rights reserved
      </p>

      <nav style="
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        gap:10px;
        font-size:14px;
      ">
        <a href="https://contenthub.guru" style="color:#f3f4f6; text-decoration:none;">Home</a>
        <span>|</span>
        <a href="https://contenthub.guru/admin" id="mainAdminBtn" style="color:#f3f4f6; text-decoration:none;">Dashboard</a>
        <span>|</span>
        <a href="https://contenthub.guru/about" style="color:#f3f4f6; text-decoration:none;">About</a>
        <span>|</span>
        <a href="https://contenthub.guru/contact-us" style="color:#f3f4f6; text-decoration:none;">Contact Us</a>
        <span>|</span>
        <a href="https://contenthub.guru/privacy-policy" style="color:#f3f4f6; text-decoration:none;">Privacy Policy</a>
      </nav>

      <p style="margin:0; font-size:12px; color:#9ca3af;">
        Created by <a href="https://contenthub.guru" style="color:#4f46e5; text-decoration:none;">ContentHub Team</a>
      </p>
    </footer>
  `;
//  <div><a href="#">Help & Documentation</a></div>

  // Set current year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Admin button click handler
  const adminBtn = document.getElementById("mainAdminBtn");
  if (adminBtn) {
    adminBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "https://contenthub.guru/admin/index.html";
    });
  }
}
