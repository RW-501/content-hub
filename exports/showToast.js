// toast.js
export function showToast(type, message, duration = 3000) {
  // Create toast container if it doesn't exist
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);

    // Style the container
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      height: "0",
    });
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `toast toast-${type}`;

  // Style the toast
  Object.assign(toast.style, {
    padding: "10px 20px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "sans-serif",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    opacity: "0",
    transform: "translateY(-10px)",
    transition: "all 0.3s ease",

  });

  // Colors based on type
  if (type === "success") toast.style.background = "#4caf50";
  else if (type === "info") toast.style.background = "#5f3fc7ff";
  else if (type === "error") toast.style.background = "#f44336";
  else if (type === "warning") toast.style.background = "#ff9800";
  else toast.style.background = "#2196f3"; // info

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  // Remove toast after duration
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
