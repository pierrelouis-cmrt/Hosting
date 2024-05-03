document.getElementById("serverSwitch").addEventListener("change", function () {
  const statusDot = document.querySelector(".status-dot");
  const statusText = document.getElementById("serverStatusText");
  const cpuUsage = document.getElementById("cpuUsage");
  const ramUsage = document.getElementById("ramUsage");
  const cpuProgress = document.getElementById("cpuProgress");
  const ramProgress = document.getElementById("ramProgress");

  if (this.checked) {
    statusDot.className = "status-dot launching";
    statusText.textContent = "Démarrage en cours... 2s";
    let countdown = 2;
    let cpuCount = 0;
    let ramCount = 0;
    const interval = setInterval(() => {
      countdown--;
      cpuCount += 25; // Increment CPU usage by 25% each second
      ramCount += 250; // Increment RAM usage by 500Mo each second
      statusText.textContent = "Démarrage en cours... " + countdown + "s";
      cpuUsage.textContent = cpuCount + "%";
      ramUsage.textContent = ramCount + "Mo / 2000Mo";
      cpuProgress.style.width = cpuCount + "%";
      ramProgress.style.width = (ramCount / 2000) * 100 + "%";

      if (countdown <= 0) {
        clearInterval(interval);
        statusDot.classList.remove("launching");
        statusDot.classList.add("online");
        statusText.textContent = "En ligne";
      }
    }, 1000);
  } else {
    // When turning off the server
    if (!confirm("Are you sure you want to shutdown the server?")) {
      // If the user cancels, prevent the switch from toggling
      event.preventDefault();
      this.checked = true;
    } else {
      statusDot.classList.remove("online");
      statusDot.classList.add("offline");
      statusText.textContent = "Hors ligne";
      cpuUsage.textContent = "0%";
      ramUsage.textContent = "0Mo / 2000Mo";
      cpuProgress.style.width = "0%";
      ramProgress.style.width = "0%";
    }
  }
});
