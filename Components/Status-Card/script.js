document
  .getElementById("serverSwitch")
  .addEventListener("click", handleButtonClick);
document
  .getElementById("serverSwitch")
  .addEventListener("touchstart", applyTouchEffects);
document
  .getElementById("serverSwitch")
  .addEventListener("touchend", removeTouchEffects);
document
  .getElementById("serverSwitch")
  .addEventListener("mouseenter", applyHoverEffects);
document
  .getElementById("serverSwitch")
  .addEventListener("mouseleave", removeHoverEffects);

function handleButtonClick() {
  const statusDot = document.querySelector(".status-dot");
  const statusText = document.getElementById("serverStatusText");
  const cpuUsage = document.getElementById("cpuUsage");
  const ramUsage = document.getElementById("ramUsage");
  const cpuProgress = document.getElementById("cpuProgress");
  const ramProgress = document.getElementById("ramProgress");
  const buttonText = document.getElementById("buttonText");
  const button = this;

  button.dataset.state = button.dataset.state || "off"; // Initialize server status
  clearInterval(window.serverLaunchInterval); // Clear any existing intervals

  if (button.dataset.state === "off") {
    buttonActivationRoutine(
      button,
      statusDot,
      statusText,
      cpuUsage,
      ramUsage,
      cpuProgress,
      ramProgress,
      buttonText
    );
  } else {
    buttonDeactivationRoutine(
      button,
      statusDot,
      statusText,
      cpuUsage,
      ramUsage,
      cpuProgress,
      ramProgress,
      buttonText
    );
  }
}

function applyTouchEffects() {
  const button = this;
  const svgIcon = document.querySelector(".svgIcon");
  button.style.filter = "saturate(1.5)";
  svgIcon.style.transform = "rotate(90deg)";
}

function removeTouchEffects() {
  const button = this;
  const svgIcon = document.querySelector(".svgIcon");
  setTimeout(() => {
    button.style.filter = "none";
    svgIcon.style.transform = "none";
  }, 500);
}

function applyHoverEffects() {
  // Check if the device supports hover (assumes no hover on touch devices)
  if (window.matchMedia("(hover: hover)").matches) {
    const button = this;
    const svgIcon = document.querySelector(".svgIcon");
    button.style.filter = "saturate(1.5)";
    svgIcon.style.transform = "rotate(90deg)";
  }
}

function removeHoverEffects() {
  if (window.matchMedia("(hover: hover)").matches) {
    const button = this;
    const svgIcon = document.querySelector(".svgIcon");
    button.style.filter = "none";
    svgIcon.style.transform = "none";
  }
}

function buttonActivationRoutine(
  button,
  statusDot,
  statusText,
  cpuUsage,
  ramUsage,
  cpuProgress,
  ramProgress,
  buttonText
) {
  button.dataset.state = "on";
  statusDot.className = "status-dot launching";
  statusText.textContent = "Démarrage en cours... 2s";
  buttonText.textContent = "Éteindre";
  button.classList.remove("off");
  button.classList.add("on");
  let countdown = 2;
  let cpuCount = 0;
  let ramCount = 0;
  window.serverLaunchInterval = setInterval(() => {
    if (countdown <= 0) {
      clearInterval(window.serverLaunchInterval);
      statusDot.classList.remove("launching");
      statusDot.classList.add("online");
      statusText.textContent = "En ligne";
      return;
    }
    countdown--;
    cpuCount += 25;
    ramCount += 250;
    statusText.textContent = "Démarrage en cours... " + countdown + "s";
    cpuUsage.textContent = cpuCount + "%";
    ramUsage.textContent = ramCount + "Mo / 2000Mo";
    cpuProgress.style.width = cpuCount + "%";
    ramProgress.style.width = (ramCount / 2000) * 100 + "%";
  }, 1000);
}

function buttonDeactivationRoutine(
  button,
  statusDot,
  statusText,
  cpuUsage,
  ramUsage,
  cpuProgress,
  ramProgress,
  buttonText
) {
  if (confirm("Êtes-vous sûr de vouloir éteindre le serveur ?")) {
    statusDot.classList.remove("launching", "online");
    statusDot.classList.add("offline");
    statusText.textContent = "Hors ligne";
    buttonText.textContent = "Démarrer";
    button.classList.remove("on");
    button.classList.add("off");
    cpuUsage.textContent = "0%";
    ramUsage.textContent = "0Mo / 2000Mo";
    cpuProgress.style.width = "0%";
    ramProgress.style.width = "0%";
    button.dataset.state = "off";
  } else {
    event.preventDefault(); // Stop the shutdown if user cancels
  }
}
