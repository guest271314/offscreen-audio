// ServiceWorkerGlobalScope
addEventListener("install", async (e) => {
  console.log(e.type);
  e.waitUntil(self.skipWaiting());
});

addEventListener("activate", async (e) => {
  console.log(e.type);
  e.waitUntil(self.clients.claim());
});

addEventListener("fetch", async (e) => {
  console.log(e.request.url, e.request.destination);
});

addEventListener("message", async (e) => {
  console.log(e.data);
});

const bc = new BroadcastChannel("offscreen");

bc.addEventListener("message", async (e) => {
  console.log(e.data);
  if (e.data === "start") {
    if (await chrome.offscreen.hasDocument()) {
      await chrome.offscreen.closeDocument();
    }
    return await chrome.offscreen.createDocument({
      url: "index.html",
      reasons: ["TESTING"],
      justification: "",
    });
  }
  if (e.data === "reload") {
    if (await chrome.offscreen.hasDocument()) {
      await chrome.offscreen.closeDocument();
    }
  }
  bc.postMessage(e.data);
});

chrome.runtime.onInstalled.addListener(async (reason) => {
  await chrome.sidePanel.setOptions({ path: "controller.html", enabled: true });
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
});
