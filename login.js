// =========================
// LOGIN ELEMENTS
// =========================

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");

const togglePassword =
    document.getElementById("togglePassword");


// =========================
// SHOW / HIDE PASSWORD
// =========================

togglePassword.addEventListener(
    "click",
    function () {

        if (loginPassword.type === "password") {

            loginPassword.type = "text";

            togglePassword.textContent = "🙈";

        } else {

            loginPassword.type = "password";

            togglePassword.textContent = "👁️";

        }

    }
);


// =========================
// LOGIN
// =========================

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        // =========================
        // VALIDATION
        // =========================

        if (
            email === "" ||
            password === ""
        ) {

            loginMessage.textContent =
                "Please enter your email and password.";

            return;
        }


        // =========================
        // GET SAVED USER
        // =========================

        let savedUser = null;

        try {

            savedUser =
                JSON.parse(
                    localStorage.getItem("studyUser")
                );

        } catch (error) {

            console.error(
                "Error reading user:",
                error
            );

            savedUser = null;
        }


        // =========================
        // NO ACCOUNT
        // =========================

        if (!savedUser) {

            loginMessage.textContent =
                "No account found. Please create an account first.";

            return;
        }


        // =========================
        // CHECK LOGIN
        // =========================

        if (
            email.toLowerCase() ===
                String(savedUser.email).toLowerCase()
            &&
            password === savedUser.password
        ) {


            // Save logged-in user

localStorage.setItem(
    "loggedInUser",
    JSON.stringify(savedUser)
);

            // IMPORTANT:
            // Dashboard currently checks this key.

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(savedUser)
            );


            // =========================
            // GO TO DASHBOARD
            // =========================
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(savedUser)
            )

            window.location.href =
                "dashboard.html";

        } else {

            loginMessage.textContent =
                "Incorrect email or password.";

        }

    }
);