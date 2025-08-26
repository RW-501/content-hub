// header.js
(function() {
  const headerContainer = document.getElementById('main-header');
  if (!headerContainer) return;

  const currentHost = window.location.hostname;
  const currentPath = window.location.pathname;

  // --- HEADER ---
  const header = document.createElement('header');
  header.style.display = 'flex';
  header.style.flexDirection = 'column';
  header.style.background = '#1f2937';
  header.style.color = '#fff';
  header.style.fontFamily = 'Arial, sans-serif';
  header.style.padding = '15px 25px';
  header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  // --- TOP ROW: TITLE + NAV + BUTTONS ---
  const topRow = document.createElement('div');
  topRow.style.display = 'flex';
  topRow.style.justifyContent = 'space-between';
  topRow.style.alignItems = 'center';
  topRow.style.flexWrap = 'wrap';
  topRow.style.gap = '10px';

  // Title
  const h1 = document.createElement('h1');
  h1.textContent = 'Content Hub';
  h1.style.margin = '0';
  h1.style.fontSize = '1.8rem';
  h1.style.fontWeight = 'bold';
  h1.style.color = '#f3f4f6';
  topRow.appendChild(h1);

  // Nav links
  const nav = document.createElement('nav');
  nav.style.display = 'flex';
  nav.style.gap = '15px';
  nav.style.alignItems = 'center';
  nav.style.flexWrap = 'wrap';

  const links = [
    { text: 'Home', href: '/' },
    { text: 'Dashboard', href: 'https://contenthub.guru/admin', show: currentHost === 'contenthub.guru' || currentPath === '/' },
    { text: 'About', href: '/about' },
    { text: 'Contact Us', href: '/contact-us' }
  ];

  links.forEach((link, i) => {
    if (link.show === false) return;
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.text;
    a.style.color = '#f3f4f6';
    a.style.textDecoration = 'none';
    a.style.fontWeight = '500';
    a.style.transition = 'color 0.2s';
    a.onmouseover = () => a.style.color = '#4f46e5';
    a.onmouseout = () => a.style.color = '#f3f4f6';
    nav.appendChild(a);

    // Separator if not last
if (i < links.length - 1) {
  const sep = document.createElement('span');
  sep.textContent = ' | ';
  sep.style.color = '#9ca3af';
  nav.appendChild(sep);
}

  });
  topRow.appendChild(nav);

  // Buttons
  const btnContainer = document.createElement('div');
  btnContainer.style.display = 'flex';
  btnContainer.style.gap = '10px';

  const loginBtn = document.createElement('button');
  loginBtn.id ="loginBtn";
  loginBtn.textContent = 'Login';
  loginBtn.style.background = '#4f46e5';
  loginBtn.style.color = '#fff';
  loginBtn.style.border = 'none';
  loginBtn.style.padding = '6px 15px';
  loginBtn.style.borderRadius = '5px';
  loginBtn.style.cursor = 'pointer';
  loginBtn.style.fontWeight = 'bold';
  loginBtn.onmouseover = () => loginBtn.style.opacity = '0.85';
  loginBtn.onmouseout = () => loginBtn.style.opacity = '1';
//  loginBtn.addEventListener('click', () => window.location.href = '/login');
  btnContainer.appendChild(loginBtn);

  if (currentHost === 'contenthub.guru' || currentPath === '/') {
    const adminBtn = document.createElement('button');
    adminBtn.id = "adminBtn";
    adminBtn.textContent = 'Admin Page';
    adminBtn.style.background = '#10b981';
    adminBtn.style.color = '#fff';
    adminBtn.style.border = 'none';
    adminBtn.style.padding = '6px 15px';
    adminBtn.style.borderRadius = '5px';
    adminBtn.style.cursor = 'pointer';
    adminBtn.style.fontWeight = 'bold';
    adminBtn.onmouseover = () => adminBtn.style.opacity = '0.85';
    adminBtn.onmouseout = () => adminBtn.style.opacity = '1';
   // adminBtn.addEventListener('click', () => window.location.href = 'https://contenthub.guru/admin');
    btnContainer.appendChild(adminBtn);
  }
  topRow.appendChild(btnContainer);

  header.appendChild(topRow);

  // --- BREADCRUMB ---
  if (currentPath !== '/' && currentPath !== '') {
    const breadcrumb = document.createElement('div');
    breadcrumb.style.marginTop = '10px';
    breadcrumb.style.fontSize = '0.9rem';
    breadcrumb.style.color = '#9ca3af';

    const pathParts = currentPath.split('/').filter(Boolean);
    let fullPath = '';
    pathParts.forEach((part, idx) => {
      fullPath += `/${part}`;
      const span = document.createElement('span');
      span.textContent = part.charAt(0).toUpperCase() + part.slice(1);
      span.style.cursor = 'default';
      breadcrumb.appendChild(span);

      if (idx < pathParts.length - 1) {
        const sep = document.createTextNode(' > ');
        breadcrumb.appendChild(sep);
      }
    });
    header.appendChild(breadcrumb);
  }

  // Attach header
  headerContainer.appendChild(header);
})();
