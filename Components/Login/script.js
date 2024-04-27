// Log In - Sign Up switch

document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.querySelector(".form-container");
  var signUpForm = document.querySelector(".form-container.form2");

  var SignUpButton = document.querySelector(".sign-up-link");
  var LoginButton = document.querySelector(".login-link");

  loginForm.style.display = "none";

  // Event listener for "Sign Up" link
  SignUpButton.addEventListener("click", function () {
    loginForm.style.display = "none";
    signUpForm.style.display = "block";
  });

  // Event listener for "Log In" link
  LoginButton.addEventListener("click", function () {
    signUpForm.style.display = "none";
    loginForm.style.display = "block";
  });
});

// Input Validation + Form Submission

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // Adding input event listeners to clear custom messages on user correction
  document.getElementById("loginEmail").addEventListener("input", function () {
    this.setCustomValidity("");
  });
  document
    .getElementById("loginPassword")
    .addEventListener("input", function () {
      this.setCustomValidity("");
    });
  document.getElementById("signupEmail").addEventListener("input", function () {
    this.setCustomValidity("");
  });
  document
    .getElementById("signupPassword")
    .addEventListener("input", function () {
      this.setCustomValidity("");
    });

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    if (validateLoginForm()) {
      this.submit(); // Submit form if validation passes
    }
  });

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    if (validateSignupForm()) {
      this.submit(); // Submit form if validation passes
    }
  });

  function validateLoginForm() {
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    let isValid = true;

    if (!email.value) {
      email.setCustomValidity("Please enter your email address.");
      isValid = false;
    } else if (!validateEmail(email.value)) {
      email.setCustomValidity("Please enter a valid email address.");
      isValid = false;
    } else {
      email.setCustomValidity("");
    }

    if (!password.value) {
      password.setCustomValidity("Please enter your password.");
      isValid = false;
    } else {
      const passwordError = validatePassword(password.value);
      if (passwordError) {
        password.setCustomValidity(passwordError);
        isValid = false;
      } else {
        password.setCustomValidity("");
      }
    }

    email.reportValidity();
    password.reportValidity();

    return isValid;
  }

  function validateSignupForm() {
    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");

    let isValid = true;

    if (!email.value) {
      email.setCustomValidity("Please enter your email address.");
      isValid = false;
    } else if (!validateEmail(email.value)) {
      email.setCustomValidity("Please enter a valid email address.");
      isValid = false;
    } else {
      email.setCustomValidity("");
    }

    if (!password.value) {
      password.setCustomValidity("Please enter your password.");
      isValid = false;
    } else {
      const passwordError = validatePassword(password.value);
      if (passwordError) {
        password.setCustomValidity(passwordError);
        isValid = false;
      } else {
        password.setCustomValidity("");
      }
    }

    email.reportValidity();
    password.reportValidity();

    return isValid;
  }

  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push("Password must contain at least one letter.");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    return errors.length > 0 ? errors.join(" ") : "";
  }
});
