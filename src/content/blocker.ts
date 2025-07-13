const blockUI = document.createElement("div");
blockUI.style.position = "fixed";
blockUI.style.width = "100%";
blockUI.style.height = "100%";
blockUI.style.backgroundColor = "white";
blockUI.style.display = "flex";
blockUI.style.justifyContent = "center";
blockUI.style.alignItems = "center";
blockUI.innerHTML = `
  <div class="content-center text-center p-8">
    <h2>Pause & Breathe</h2>
    <p>This site is blocked.</p>
    <button id="proceed-btn">Proceed Anyway</button>
  </div>
`;

function checkAndToggleBlockUI(focusMode: boolean, blockedUrls: string[]) {
  const isBlocked = blockedUrls.some((url) =>
    window.location.href.includes(url)
  );
  if (focusMode && isBlocked) {
    showBlockUI();
  } else {
    if (document.body) {
      document.body.style.display = "";
    }
    blockUI.remove();
  }
}

function showBlockUI() {
  if (document.body) {
    document.body.style.display = "none";
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.body) {
        document.body.style.display = "none";
      }
    });
  }
  document.documentElement.appendChild(blockUI);
}

chrome.storage.sync.get(["focusMode", "blockedUrls"], (data) => {
  checkAndToggleBlockUI(!!data.focusMode, data.blockedUrls || []);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && (changes.focusMode || changes.blockedUrls)) {
    chrome.storage.sync.get(["focusMode", "blockedUrls"], (data) => {
      checkAndToggleBlockUI(!!data.focusMode, data.blockedUrls || []);
    });
  }
});
