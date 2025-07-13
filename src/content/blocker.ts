// Immediately inject a blank overlay
const blocker = document.createElement("div");
blocker.id = "hesitate-blocker";
blocker.className = "fixed inset-0 w-full h-full z-[2147483647] bg-black/80";
document.documentElement.appendChild(blocker);

// Now check storage and show UI if needed
chrome.storage.sync.get(["focusMode", "blockedUrls"], (data) => {
  if (!data.focusMode) {
    blocker.remove();
    return;
  }
  const blockedUrls: string[] = data.blockedUrls || [];
  if (blockedUrls.some((url) => window.location.href.includes(url))) {
    showBlockUI();
  } else {
    blocker.remove();
  }
});

function showBlockUI() {
  // Prevent scrolling/interacting with the page
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.pointerEvents = "none";

  const uiElement = document.createElement("div");
  uiElement.className = `
    bg-white rounded-xl shadow-xl px-8 py-7 flex flex-col items-center max-w-xs w-full
  `;

  uiElement.innerHTML = `
    <h2 class="text-xl font-semibold text-neutral-900 mb-2">Pause & Breathe</h2>
    <p class="text-neutral-600 mb-6 text-center">This site is on your focus block list.<br>Take a mindful moment before proceeding.</p>
    <button id="proceed-btn" class="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400">
      Proceed Anyway
    </button>
  `;
  blocker.appendChild(uiElement);

  document.getElementById("proceed-btn")?.addEventListener("click", () => {
    blocker.remove();
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
  });
}
