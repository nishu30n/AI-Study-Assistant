// =========================
// PROFILE ELEMENTS
// =========================

const totalQuizzesElement =
    document.getElementById("profileTotalQuizzes");

const questionsSolvedElement =
    document.getElementById("profileQuestionsSolved");

const accuracyElement =
    document.getElementById("profileAccuracy");

const bestScoreElement =
    document.getElementById("profileBestScore");

const averageScoreElement =
    document.getElementById("profileAverageScore");

const correctAnswersElement =
    document.getElementById("profileCorrectAnswers");

const totalQuestionsElement =
    document.getElementById("profileTotalQuestions");


// =========================
// GET QUIZ HISTORY
// =========================

function getQuizHistory() {

    try {

        const history =
            JSON.parse(
                localStorage.getItem("quizHistory")
            );

        return Array.isArray(history)
            ? history
            : [];

    } catch (error) {

        console.error(
            "Error reading quiz history:",
            error
        );

        return [];
    }
}


// =========================
// SHOW LOGGED-IN USER
// NAME + EMAIL
// =========================

function showProfileUser() {

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const loggedInUser =
        localStorage.getItem("loggedInUser");


    // =========================
    // CHECK LOGIN
    // =========================

    if (!loggedInUser) {

        window.location.href = "login.html";
        return;
    }


    try {

        const user =
            JSON.parse(loggedInUser);


        // =========================
        // SHOW NAME
        // =========================

        if (profileName) {

            const name =
                user.name ||
                user.username ||
                user.email ||
                "Student";

            profileName.textContent =
                `Welcome, ${name}! 👋`;
        }


        // =========================
        // SHOW EMAIL
        // =========================

        if (profileEmail) {

            const email =
                user.email ||
                "Email not available";

            profileEmail.innerHTML = `
                ✉️ ${email}
                <br>
                <span>
                    Track your learning journey and
                    quiz performance.
                </span>
            `;
        }

    } catch (error) {

        console.error(
            "Error reading logged-in user:",
            error
        );
    }
}


// =========================
// UPDATE PROFILE STATS
// =========================

function updateProfile() {

    const quizHistory =
        getQuizHistory();


    // =========================
    // BASIC DATA
    // =========================

    const totalQuizzes =
        quizHistory.length;

    let totalQuestions = 0;

    let totalCorrect = 0;

    let totalPercentage = 0;


    quizHistory.forEach((quiz) => {

        totalQuestions +=
            Number(quiz.total) || 0;

        totalCorrect +=
            Number(quiz.score) || 0;

        totalPercentage +=
            Number(quiz.percentage) || 0;

    });


    // =========================
    // ACCURACY
    // =========================

    let accuracy = 0;

    if (totalQuestions > 0) {

        accuracy =
            Math.round(
                (totalCorrect /
                    totalQuestions) * 100
            );
    }


    // =========================
    // AVERAGE SCORE
    // =========================

    let averageScore = 0;

    if (totalQuizzes > 0) {

        averageScore =
            Math.round(
                totalPercentage /
                totalQuizzes
            );
    }


    // =========================
    // BEST SCORE
    // =========================

    let bestScore = 0;

    if (quizHistory.length > 0) {

        bestScore =
            Math.max(
                ...quizHistory.map(
                    quiz =>
                        Number(
                            quiz.percentage
                        ) || 0
                )
            );
    }


    // =========================
    // DISPLAY DATA
    // =========================

    if (totalQuizzesElement) {

        totalQuizzesElement.textContent =
            totalQuizzes;
    }


    if (questionsSolvedElement) {

        questionsSolvedElement.textContent =
            totalQuestions;
    }


    if (accuracyElement) {

        accuracyElement.textContent =
            accuracy + "%";
    }


    if (bestScoreElement) {

        bestScoreElement.textContent =
            bestScore + "%";
    }


    if (averageScoreElement) {

        averageScoreElement.textContent =
            averageScore + "%";
    }


    if (correctAnswersElement) {

        correctAnswersElement.textContent =
            totalCorrect;
    }


    if (totalQuestionsElement) {

        totalQuestionsElement.textContent =
            totalQuestions;
    }

}


// =========================
// INITIAL LOAD
// =========================

showProfileUser();

updateProfile();


// =========================
// UPDATE WHEN PAGE RETURNS
// =========================

window.addEventListener(
    "pageshow",
    function () {

        showProfileUser();

        updateProfile();

    }
);


// =========================
// UPDATE WHEN STORAGE CHANGES
// =========================

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "quizHistory" ||
            event.key === "loggedInUser"
        ) {

            showProfileUser();

            updateProfile();
        }

    }
);