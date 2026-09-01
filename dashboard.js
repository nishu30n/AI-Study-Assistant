// =========================
// GET DASHBOARD ELEMENTS
// =========================

const totalQuizzesElement =
    document.getElementById("totalQuizzes");

const questionsSolvedElement =
    document.getElementById("questionsSolved");

const quizAccuracyElement =
    document.getElementById("quizAccuracy");

const averageScoreElement =
    document.getElementById("averageScore");

const quizProgressChart =
    document.getElementById("quizProgressChart");

const bestScoreElement =
    document.getElementById("bestScore");


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
            "Error reading quizHistory:",
            error
        );

        return [];
    }
}


// =========================
// UPDATE DASHBOARD STATS
// =========================

function updateDashboardStats() {

    const quizHistory =
        getQuizHistory();

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
                (totalCorrect / totalQuestions) * 100
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
    // DISPLAY
    // =========================

    if (totalQuizzesElement) {

        totalQuizzesElement.textContent =
            totalQuizzes;
    }

    if (questionsSolvedElement) {

        questionsSolvedElement.textContent =
            totalQuestions;
    }

    if (quizAccuracyElement) {

        quizAccuracyElement.textContent =
            accuracy + "%";
    }

    if (averageScoreElement) {

        averageScoreElement.textContent =
            averageScore + "%";
    }
}


// =========================
// BEST SCORE
// =========================

function updateBestScore() {

    const quizHistory =
        getQuizHistory();


    if (!bestScoreElement) {
        return;
    }


    if (quizHistory.length === 0) {

        bestScoreElement.innerHTML =
            "0%";

        return;
    }


    const bestScore =
        Math.max(
            ...quizHistory.map(
                quiz =>
                    Number(quiz.percentage) || 0
            )
        );


    const bestTopics = [];


    quizHistory.forEach((quiz) => {

        const percentage =
            Number(quiz.percentage) || 0;


        const topic =
            quiz.topic &&
            String(quiz.topic).trim()
                ? String(quiz.topic).trim()
                : "Unknown Topic";


        if (
            percentage === bestScore &&
            !bestTopics.includes(topic)
        ) {

            bestTopics.push(topic);
        }

    });


    bestScoreElement.innerHTML = `
        <strong>
            ${bestScore}%
        </strong>

        <div class="best-score-topics">
            ${bestTopics.join(" • ")}
        </div>
    `;
}


// =========================
// RECENT 5 QUIZZES
// =========================

function updateRecentQuizzes() {

    const quizHistory =
        getQuizHistory();


    const recentQuizContainer =
        document.getElementById(
            "recentQuizList"
        );


    if (!recentQuizContainer) {
        return;
    }


    recentQuizContainer.innerHTML =
        "";


    if (quizHistory.length === 0) {

        recentQuizContainer.innerHTML = `
            <p class="no-recent-quizzes">
                No quizzes completed yet.
            </p>
        `;

        return;
    }


    const recentQuizzes =
        quizHistory.slice(0, 5);


    recentQuizzes.forEach((quiz) => {

        const topic =
            quiz.topic &&
            String(quiz.topic).trim()
                ? String(quiz.topic).trim()
                : "Unknown Topic";


        const percentage =
            Number(quiz.percentage) || 0;


        const score =
            Number(quiz.score) || 0;


        const total =
            Number(quiz.total) || 0;


        const quizItem =
            document.createElement("div");


        quizItem.className =
            "recent-quiz-item";


        quizItem.innerHTML = `
            <div class="recent-quiz-info">

                <h4>
                    ${topic}
                </h4>

                <p>
                    Score:
                    ${score}/${total}
                </p>

            </div>

            <div class="recent-quiz-score">

                ${percentage}%

            </div>
        `;


        recentQuizContainer.appendChild(
            quizItem
        );

    });
}


// =========================
// ACHIEVEMENTS
// =========================

function updateAchievements() {

    const achievementContainer =
        document.getElementById(
            "achievementsList"
        );


    if (!achievementContainer) {
        return;
    }


    const quizHistory =
        getQuizHistory();


    const totalQuizzes =
        quizHistory.length;


    const hasPerfectScore =
        quizHistory.some(
            quiz =>
                Number(quiz.percentage) === 100
        );


    const hasHighScore =
        quizHistory.some(
            quiz =>
                Number(quiz.percentage) >= 90
        );


    const achievements = [

        {
            icon: "🎯",
            title: "First Quiz",
            description: "Complete your first quiz",
            unlocked: totalQuizzes >= 1
        },

        {
            icon: "🔥",
            title: "Quiz Master",
            description: "Complete 5 quizzes",
            unlocked: totalQuizzes >= 5
        },

        {
            icon: "💯",
            title: "Perfect Score",
            description: "Get 100% in any quiz",
            unlocked: hasPerfectScore
        },

        {
            icon: "🏆",
            title: "High Scorer",
            description: "Score 90% or above",
            unlocked: hasHighScore
        },

        {
            icon: "📚",
            title: "Knowledge Seeker",
            description: "Complete 10 quizzes",
            unlocked: totalQuizzes >= 10
        }

    ];


    achievementContainer.innerHTML =
        "";


    achievements.forEach(
        (achievement) => {

            const card =
                document.createElement("div");


            card.className =
                "achievement-card";


            if (!achievement.unlocked) {

                card.classList.add(
                    "locked"
                );
            }


            card.innerHTML = `

                <div class="achievement-icon">
                    ${achievement.icon}
                </div>

                <div class="achievement-info">

                    <h3>
                        ${achievement.title}
                    </h3>

                    <p>
                        ${achievement.description}
                    </p>

                </div>

                <div class="achievement-status">

                    ${
                        achievement.unlocked
                            ? "✓"
                            : "🔒"
                    }

                </div>

            `;


            achievementContainer.appendChild(
                card
            );

        }
    );
}


// =========================
// DRAW PROGRESS CHART
// =========================

// =========================
// DRAW PROGRESS CHART
// =========================

function drawProgressChart() {

    const quizHistory = getQuizHistory();

    if (!quizProgressChart) {
        return;
    }

    const canvas = quizProgressChart;
    const ctx = canvas.getContext("2d");

    const container = canvas.parentElement;

    if (!container) {
        return;
    }

    // Clear previous chart
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // =========================
    // NO QUIZ
    // =========================

    if (quizHistory.length === 0) {

        const width = Math.max(
            container.clientWidth,
            300
        );

        const height = 280;

        canvas.width = width;
        canvas.height = height;

        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#555";

        ctx.fillText(
            "Complete a quiz to see your progress 📈",
            width / 2,
            height / 2
        );

        return;
    }


    // =========================
    // ALL QUIZZES
    // =========================

    const quizzes = quizHistory
        .slice()
        .reverse();

    const percentages = quizzes.map(
        quiz => Number(quiz.percentage) || 0
    );


    // =========================
    // CHART SIZE
    // =========================

    const containerWidth =
        container.clientWidth || 300;

    // Each quiz gets enough space
    const requiredWidth =
        percentages.length * 75 + 80;

    const width =
        Math.max(
            containerWidth,
            requiredWidth
        );

    const height =
        window.innerWidth <= 650
            ? 280
            : 320;


    canvas.width = width;
    canvas.height = height;


    // =========================
    // PADDING
    // =========================

    const leftPadding = 48;
    const rightPadding = 30;
    const topPadding = 35;
    const bottomPadding = 45;

    const chartWidth =
        width -
        leftPadding -
        rightPadding;

    const chartHeight =
        height -
        topPadding -
        bottomPadding;


    // =========================
    // GRID LINES
    // =========================

    ctx.lineWidth = 1;

    for (
        let value = 0;
        value <= 100;
        value += 20
    ) {

        const y =
            topPadding +
            chartHeight -
            (value / 100) *
            chartHeight;


        ctx.beginPath();

        ctx.moveTo(
            leftPadding,
            y
        );

        ctx.lineTo(
            width - rightPadding,
            y
        );

        ctx.strokeStyle =
            "rgba(150,150,150,0.18)";

        ctx.stroke();


        // Percentage labels

        ctx.font =
            "12px Arial";

        ctx.textAlign =
            "right";

        ctx.fillStyle =
            "#555";

        ctx.fillText(
            value + "%",
            leftPadding - 8,
            y + 4
        );
    }


    // =========================
    // CREATE POINTS
    // =========================

    const points = [];


    percentages.forEach(
        (percentage, index) => {

            let x;

            if (percentages.length === 1) {

                x =
                    leftPadding +
                    chartWidth / 2;

            } else {

                x =
                    leftPadding +
                    (
                        index /
                        (percentages.length - 1)
                    ) *
                    chartWidth;
            }


            const y =
                topPadding +
                chartHeight -
                (
                    percentage / 100
                ) *
                chartHeight;


            points.push({
                x,
                y,
                percentage
            });

        }
    );


    // =========================
    // PERFORMANCE COLOR
    // =========================

    function getPerformanceColor(
        percentage
    ) {

        if (percentage >= 80) {
            return "#22c55e";
        }

        if (percentage >= 50) {
            return "#f59e0b";
        }

        return "#ef4444";
    }


    // =========================
    // DRAW LINES
    // =========================

    if (points.length > 1) {

        for (
            let i = 0;
            i < points.length - 1;
            i++
        ) {

            const start = points[i];
            const end = points[i + 1];

            ctx.beginPath();

            ctx.moveTo(
                start.x,
                start.y
            );

            ctx.lineTo(
                end.x,
                end.y
            );

            ctx.strokeStyle =
                getPerformanceColor(
                    end.percentage
                );

            ctx.lineWidth = 4;
            ctx.lineCap = "round";

            ctx.stroke();
        }
    }


    // =========================
    // DRAW POINTS
    // =========================

    points.forEach(
        (point, index) => {

            const color =
                getPerformanceColor(
                    point.percentage
                );


            // Outer circle

            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                10,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                color + "30";

            ctx.fill();


            // Main circle

            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                6,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                color;

            ctx.fill();


            // White center

            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                2.5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#ffffff";

            ctx.fill();


            // Percentage

            ctx.font =
                "bold 12px Arial";

            ctx.textAlign =
                "center";

            ctx.fillStyle =
                color;

            ctx.fillText(
                point.percentage + "%",
                point.x,
                point.y - 16
            );


            // Quiz number

            ctx.font =
                "12px Arial";

            ctx.fillStyle =
                "#555";

            ctx.fillText(
                "Quiz " + (index + 1),
                point.x,
                height - 15
            );

        }
    );
}
// =========================
// UPDATE EVERYTHING
// =========================

function updateDashboard() {

    updateDashboardStats();

    updateBestScore();

    updateRecentQuizzes();

    updateAchievements();

    drawProgressChart();
}


// =========================
// INITIAL LOAD
// =========================

updateDashboard();


// =========================
// REDRAW ON RESIZE
// =========================

window.addEventListener(
    "resize",
    drawProgressChart
);


// =========================
// UPDATE WHEN PAGE BECOMES ACTIVE
// =========================

window.addEventListener(
    "pageshow",
    updateDashboard
);


document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            updateDashboard();
        }
    }
);


// =========================
// UPDATE WHEN LOCAL STORAGE CHANGES
// =========================

window.addEventListener(
    "storage",
    (event) => {

        if (
            event.key ===
            "quizHistory"
        ) {

            updateDashboard();
        }
    }
);
// =========================
// SHOW LOGGED-IN USER
// =========================


// =========================
// SHOW LOGGED-IN USER
// =========================

function showLoggedInUser() {

    const welcomeElement =
        document.getElementById("dashboardWelcome");

    if (!welcomeElement) {
        return;
    }

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (loggedInUser) {

        try {

            const user =
                JSON.parse(loggedInUser);

            if (user.name) {

                welcomeElement.textContent =
                    `Welcome back, ${user.name}! 👋`;

            }

        } catch (error) {

            console.error(
                "Error loading logged-in user:",
                error
            );

        }

    }
}

showLoggedInUser();