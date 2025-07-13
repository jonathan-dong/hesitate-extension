// Handles UI for toggling focus mode and managing blocked URLs

const focusToggle = document.getElementById(
  "focus-toggle"
) as HTMLButtonElement;
const urlInput = document.getElementById("url-input") as HTMLInputElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
const urlList = document.getElementById("url-list") as HTMLUListElement;
const knob = focusToggle.querySelector("span:not(.sr-only)") as HTMLSpanElement;

let enabled = false;

function updateToggleUI(state: boolean) {
  focusToggle.setAttribute("aria-pressed", state ? "true" : "false");
  focusToggle.classList.toggle("bg-blue-600", state);
  focusToggle.classList.toggle("bg-neutral-300", !state);
  knob.classList.toggle("translate-x-6", state);
  knob.classList.toggle("translate-x-0", !state);
}

focusToggle.addEventListener("click", () => {
  enabled = !enabled;
  updateToggleUI(enabled);
  chrome.storage.sync.set({ focusMode: enabled });
});

chrome.storage.sync.get(["focusMode", "blockedUrls"], (data) => {
  enabled = !!data.focusMode;
  updateToggleUI(enabled);
  (data.blockedUrls || []).forEach((url: string) => addUrlToList(url));
});

addBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  if (url) {
    chrome.storage.sync.get(["blockedUrls"], (data) => {
      const urls = data.blockedUrls || [];
      if (!urls.includes(url)) {
        urls.push(url);
        chrome.storage.sync.set({ blockedUrls: urls }, () => addUrlToList(url));
      }
    });
    urlInput.value = "";
  }
});

function addUrlToList(url: string) {
  const li = document.createElement("li");
  li.textContent = url;
  urlList.appendChild(li);
}
