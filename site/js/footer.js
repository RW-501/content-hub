// footer.js
export function loadFooter(targetId = "main-footer") {
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
        <a href="https://contenthub.guru/site/about" style="color:#f3f4f6; text-decoration:none;">About</a>
        <span>|</span>
        <a href="https://contenthub.guru/category" style="color:#f3f4f6; text-decoration:none;">Categories</a>
        <span>|</span>
        <a href="https://contenthub.guru/site/lang/" style="color:#f3f4f6; text-decoration:none;">languages</a>
        <span>|</span>
        <a href="https://contenthub.guru/site/feedback" style="color:#f3f4f6; text-decoration:none;">Feedback</a>
        <span>|</span>        
        <a href="https://contenthub.guru/site/faqs" style="color:#f3f4f6; text-decoration:none;">FAQs</a>
        <span>|</span>
        <a href="https://contenthub.guru/site/support" style="color:#f3f4f6; text-decoration:none;">Support</a>
        <span>|</span>
        <a href="https://contenthub.guru/site/contact-us" style="color:#f3f4f6; text-decoration:none;">Contact Us</a>
        <span>|</span>
        <a href="https://contenthub.guru/site/privacy-policy" style="color:#f3f4f6; text-decoration:none;">Privacy Policy</a>
      </nav>

      <div style="display:flex; gap:15px; font-size:20px; margin-top:10px;">
        <a href="https://x.com/Contenthub_Guru" target="_blank" style="color:#f3f4f6;"><i class="fab fa-x"></i></a>
        <a href="https://www.linkedin.com/showcase/content-hub-guru" target="_blank" style="color:#f3f4f6;"><i class="fab fa-linkedin"></i></a>
        <a href="https://www.reddit.com/r/ContentHubGuru/" target="_blank" style="color:#f3f4f6;"><i class="fab fa-reddit"></i></a>
        <a href="#" target="_blank" style="color:#f3f4f6;"><i class="fab fa-facebook"></i></a>
        <a href="#" target="_blank" style="color:#f3f4f6;"><i class="fab fa-youtube"></i></a>
      </div>

      <p style="margin:0; font-size:12px; color:#9ca3af;">
        Created by <a href="https://contenthub.guru" style="color:#4f46e5; text-decoration:none;">ContentHub Team</a>
      </p>
    </footer>
  `;

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
