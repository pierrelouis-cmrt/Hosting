function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
const ANIMATION_DURATION = 300;

const SIDEBAR_EL = document.getElementById("sidebar");

const SUB_MENU_ELS = document.querySelectorAll(
  ".menu > ul > .menu-item.sub-menu"
);

const FIRST_SUB_MENUS_BTN = document.querySelectorAll(
  ".menu > ul > .menu-item.sub-menu > a"
);

const INNER_SUB_MENUS_BTN = document.querySelectorAll(
  ".menu > ul > .menu-item.sub-menu .menu-item.sub-menu > a"
);

class PopperObject {
  constructor(reference, popperTarget) {
    _defineProperty(this, "instance", null);
    _defineProperty(this, "reference", null);
    _defineProperty(this, "popperTarget", null);
    this.init(reference, popperTarget);
  }

  init(reference, popperTarget) {
    this.reference = reference;
    this.popperTarget = popperTarget;
    this.instance = Popper.createPopper(this.reference, this.popperTarget, {
      placement: "right",
      strategy: "fixed",
      resize: true,
      modifiers: [
        {
          name: "computeStyles",
          options: {
            adaptive: false,
          },
        },

        {
          name: "flip",
          options: {
            fallbackPlacements: ["left", "right"],
          },
        },
      ],
    });

    document.addEventListener(
      "click",
      (e) => this.clicker(e, this.popperTarget, this.reference),
      false
    );

    const ro = new ResizeObserver(() => {
      this.instance.update();
    });

    ro.observe(this.popperTarget);
    ro.observe(this.reference);
  }

  clicker(event, popperTarget, reference) {
    if (
      SIDEBAR_EL.classList.contains("collapsed") &&
      !popperTarget.contains(event.target) &&
      !reference.contains(event.target)
    ) {
      this.hide();
    }
  }

  hide() {
    this.instance.state.elements.popper.style.visibility = "hidden";
  }
}

class Poppers {
  constructor() {
    _defineProperty(this, "subMenuPoppers", []);
    this.init();
  }

  init() {
    SUB_MENU_ELS.forEach((element) => {
      this.subMenuPoppers.push(
        new PopperObject(element, element.lastElementChild)
      );

      this.closePoppers();
    });
  }

  togglePopper(target) {
    if (window.getComputedStyle(target).visibility === "hidden")
      target.style.visibility = "visible";
    else target.style.visibility = "hidden";
  }

  updatePoppers() {
    this.subMenuPoppers.forEach((element) => {
      element.instance.state.elements.popper.style.display = "none";
      element.instance.update();
    });
  }

  closePoppers() {
    this.subMenuPoppers.forEach((element) => {
      element.hide();
    });
  }
}

const slideUp = (target, duration = ANIMATION_DURATION) => {
  const { parentElement } = target;
  parentElement.classList.remove("open");

  target.style.maxHeight = `${target.offsetHeight}px`;

  // Force the browser to recognize the max-height change
  target.offsetHeight; // This causes a reflow, making the browser acknowledge the change

  target.style.transitionProperty = "max-height, margin, padding, opacity";
  target.style.transitionDuration = `${duration}ms`;
  target.style.boxSizing = "border-box";
  target.style.overflow = "hidden";

  target.style.maxHeight = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.style.opacity = 0;

  window.setTimeout(() => {
    target.style.display = "none";
    target.style.removeProperty("max-height");
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
    target.style.removeProperty("opacity");
  }, duration);
};

const slideDown = (target, duration = ANIMATION_DURATION) => {
  const { parentElement } = target;
  parentElement.classList.add("open");
  target.style.removeProperty("display");
  let { display } = window.getComputedStyle(target);
  if (display === "none") display = "block";
  target.style.display = display;
  const height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = "border-box";
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = `${duration}ms`;
  target.style.height = `${height}px`;
  target.style.removeProperty("padding-top");
  target.style.removeProperty("padding-bottom");
  target.style.removeProperty("margin-top");
  target.style.removeProperty("margin-bottom");
  window.setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
  }, duration);
};

const slideToggle = (target, duration = ANIMATION_DURATION) => {
  if (window.getComputedStyle(target).display === "none")
    return slideDown(target, duration);
  return slideUp(target, duration);
};

const PoppersInstance = new Poppers();

/**
 * wait for the current animation to finish and update poppers position
 */
const updatePoppersTimeout = () => {
  setTimeout(() => {
    PoppersInstance.updatePoppers();
  }, ANIMATION_DURATION);
};

/**
 * sidebar collapse handler
 */
document.getElementById("btn-collapse").addEventListener("click", () => {
  SIDEBAR_EL.classList.toggle("collapsed");
  PoppersInstance.closePoppers();
  if (SIDEBAR_EL.classList.contains("collapsed"))
    FIRST_SUB_MENUS_BTN.forEach((element) => {
      element.parentElement.classList.remove("open");
    });

  updatePoppersTimeout();
});

/**
 * sidebar toggle handler (on break point )
 */
document.getElementById("btn-toggle").addEventListener("click", () => {
  SIDEBAR_EL.classList.toggle("toggled");

  updatePoppersTimeout();
});

/**
 * toggle sidebar on overlay click
 */
document.getElementById("overlay").addEventListener("click", () => {
  SIDEBAR_EL.classList.toggle("toggled");
});

const defaultOpenMenus = document.querySelectorAll(".menu-item.sub-menu.open");

defaultOpenMenus.forEach((element) => {
  element.lastElementChild.style.display = "block";
});

/**
 * handle top level submenu click
 */
FIRST_SUB_MENUS_BTN.forEach((element) => {
  element.addEventListener("click", () => {
    if (SIDEBAR_EL.classList.contains("collapsed"))
      PoppersInstance.togglePopper(element.nextElementSibling);
    else {
      const parentMenu = element.closest(".menu.open-current-submenu");
      if (parentMenu)
        parentMenu
          .querySelectorAll(":scope > ul > .menu-item.sub-menu > a")
          .forEach(
            (el) =>
              window.getComputedStyle(el.nextElementSibling).display !==
                "none" && slideUp(el.nextElementSibling)
          );
      slideToggle(element.nextElementSibling);
    }
  });
});

/**
 * handle inner submenu click

INNER_SUB_MENUS_BTN.forEach((element) => {
  element.addEventListener("click", () => {
    slideToggle(element.nextElementSibling);
  });
});
*/

/* ---------------------------------------- */
/* STATUS CARD */

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
