const quotes: string[] = [
  "The quieter you become, the more you can hear. - Ram Dass",
  "Beware the barrenness of a busy life. - Socrates",
  "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
  "Progress, not perfection. - Anonymous",
  "Focus is more important than intelligence. - Robin Sharma",
  "Almost everything will work again if you unplug it for a few minutes, including you. - Anne Lamott",
  "The essential is invisible to the eye. - Antoine de Saint-Exupéry",
  "You cannot overestimate the unimportance of practically everything. - Greg McKeown",
  "Small disciplines repeated with consistency every day lead to great achievements. - John Maxwell",
  "The best way to get something done is to begin. - Unknown",
  "Motivation gets you going, but discipline keeps you growing. - John C. Maxwell",
  "Doing nothing is better than being busy doing nothing. - Lao Tzu",
  "It is not enough to be busy. The question is: what are we busy about? - Henry David Thoreau",
  "You will never reach your destination if you stop and throw stones at every dog that barks. - Winston Churchill",
  "Time is what we want most, but what we use worst. - William Penn",
  "Sow a thought, reap an action; sow an action, reap a habit. - Stephen Covey",
  "The time you enjoy wasting is not wasted time. - Bertrand Russell",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. - Will Durant",
  "The successful warrior is the average man, with laser-like focus. - Bruce Lee",
  "Clarity precedes success. - Robin Sharma",
  "You don't rise to the level of your goals. You fall to the level of your systems. - James Clear",
  "What you do every day matters more than what you do once in a while. - Gretchen Rubin",
  "Start where you are. Use what you have. Do what you can. - Arthur Ashe",
  "A man who chases two rabbits catches none. - Confucius",
  "Success is nothing more than a few simple disciplines, practiced every day. - Jim Rohn",
  "Where your attention goes, your time goes. - James Clear",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities. - Stephen Covey",
  "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor. - Thich Nhat Hanh",
  "The present moment is filled with joy and happiness. If you are attentive, you will see it. - Thich Nhat Hanh",
  "Don't mistake activity for achievement. - John Wooden",
];

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
    <h2 id="quote">Pause & Breathe</h2>
    <p>This site is blocked.</p>
    <button id="proceed-btn" disabled>Proceed Anyway</button>
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
  const proceedBtn = document.getElementById(
    "proceed-btn"
  ) as HTMLButtonElement;
  setTimeout(() => {
    console.log("Proceed button enabled after delay");
    proceedBtn.disabled = false;
  }, 5000);

  chrome.storage.local.get("quoteIndex", (result) => {
    const currentIndex =
      typeof result.quoteIndex === "number" ? result.quoteIndex : 0;
    chrome.storage.local.set({
      quoteIndex: (currentIndex + 1) % quotes.length,
    });

    const quoteElement = document.getElementById("quote") as HTMLHeadingElement;
    quoteElement.textContent = quotes[currentIndex];
  });
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
