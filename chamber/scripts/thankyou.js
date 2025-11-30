// scripts/thankyou.js
// Read query string values from the URL and display them on the thank you page

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const fieldMap = {
    first: "out-first",
    last: "out-last",
    email: "out-email",
    phone: "out-phone",
    organization: "out-organization",
    timestamp: "out-timestamp",
  };

  Object.entries(fieldMap).forEach(([fieldName, elementId]) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    let value = params.get(fieldName);

    // Provide a fallback if something is missing
    if (!value) {
      el.textContent = "—";
      return;
    }

    // Optional: make timestamp a bit more readable if it's an ISO string
    if (fieldName === "timestamp") {
      try {
        const dateObj = new Date(value);
        if (!isNaN(dateObj.getTime())) {
          value = dateObj.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      } catch (e) {
        // if parsing fails, just use raw string
      }
    }

    el.textContent = value;
  });
});
