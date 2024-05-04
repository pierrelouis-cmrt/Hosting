document.getElementById("serverSwitch").addEventListener("click", function () {
  const statusDot = document.querySelector(".status-dot");
  const statusText = document.getElementById("serverStatusText");
  const cpuUsage = document.getElementById("cpuUsage");
  const ramUsage = document.getElementById("ramUsage");
  const cpuProgress = document.getElementById("cpuProgress");
  const ramProgress = document.getElementById("ramProgress");
  const buttonText = document.getElementById("buttonText");
  const button = this;

  // Initialize server status if it's not set
  button.dataset.state = button.dataset.state || "off";

  // Clear any existing intervals when toggling the switch
  clearInterval(window.serverLaunchInterval);

  if (button.dataset.state === "off") {
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
      countdown--;
      cpuCount += 25;
      ramCount += 250;
      statusText.textContent = "Démarrage en cours... " + countdown + "s";
      cpuUsage.textContent = cpuCount + "%";
      ramUsage.textContent = ramCount + "Mo / 2000Mo";
      cpuProgress.style.width = cpuCount + "%";
      ramProgress.style.width = (ramCount / 2000) * 100 + "%";

      if (countdown <= 0) {
        clearInterval(window.serverLaunchInterval);
        statusDot.classList.remove("launching");
        statusDot.classList.add("online");
        statusText.textContent = "En ligne";
      }
    }, 1000);
  } else {
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
});
