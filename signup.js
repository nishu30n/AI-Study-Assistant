// =========================
// SIGNUP ELEMENTS
// =========================

const signupForm =
    document.getElementById("signupForm");

const signupName =
    document.getElementById("signupName");

const signupEmail =
    document.getElementById("signupEmail");

const signupPassword =
    document.getElementById("signupPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

const signupMessage =
    document.getElementById("signupMessage");


// =========================
// CREATE ACCOUNT
// =========================

signupForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            signupName.value.trim();

        const email =
            signupEmail.value.trim();

        const password =
            signupPassword.value;

        const confirm =
            confirmPassword.value;


        // =========================
        // VALIDATION
        // =========================

        if (
            name === "" ||
            email === "" ||
            password === "" ||
            confirm === ""
        ) {

            signupMessage.textContent =
                "Please fill in all fields.";

            return;
        }


        if (password.length < 6) {

            signupMessage.textContent =
                "Password must be at least 6 characters.";

            return;
        }


        if (password !== confirm) {

            signupMessage.textContent =
                "Passwords do not match.";

            return;
        }


        // =========================
        // CHECK EXISTING ACCOUNT
        // =========================

        const existingUser =
            JSON.parse(
                localStorage.getItem("studyUser")
            );


        if (existingUser) {

            signupMessage.textContent =
                "An account already exists. Please login.";

            return;
        }


        // =========================
        // CREATE USER
        // =========================

        const user = {

            name: name,

            email: email,

            password: password

        };


        localStorage.setItem(
            "studyUser",
            JSON.stringify(user)
        );


        // =========================
        // SUCCESS
        // =========================

        signupMessage.textContent =
            "Account created successfully! Redirecting...";


        setTimeout(
            function () {

                window.location.href =
                    "login.html";

            },
            1000
        );

    }
);