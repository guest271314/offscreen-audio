// Side panel document
addEventListener("load", () => {
  const bc = new BroadcastChannel("offscreen");
  const controls = document.querySelectorAll("#start,#suspend,#resume,#reload");
  for (const control of controls) {
    control.addEventListener("click", (e) => {
      bc.postMessage(control.id);
      if (e.target.id === "reload") {
        location.reload();
      }
    });
  }
});
