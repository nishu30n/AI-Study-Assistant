// ============================================================
// AI QUIZ - COMPLETE QUIZ.JS
// ============================================================

// =========================
// GET HTML ELEMENTS
// =========================

const quizTopic = document.getElementById("quizTopic");
const quizDifficulty = document.getElementById("quizDifficulty");
const quizQuestionCount = document.getElementById("quizQuestionCount");
const clearTopicButton = document.getElementById("clearTopicButton");
const generateQuizButton = document.getElementById("generateQuizButton");
const quizLoading = document.getElementById("quizLoading");
const quizContainer = document.getElementById("quizContainer");

const quizResult = document.getElementById("quizResult");
const scoreText = document.getElementById("scoreText");
const retryButton = document.getElementById("retryButton");
const practiceWeakTopicButton =
    document.getElementById("practiceWeakTopicButton");

const clearQuizHistoryButton =
    document.getElementById("clearQuizHistoryButton");

const quizHistoryList =
    document.getElementById("quizHistoryList");


// =========================
// CURRENT QUIZ
// =========================

let currentQuiz = [];
let weakTopic = null;
let lowestAccuracy = 101;


// =========================
// QUIZ HISTORY
// =========================

let quizHistory = [];

try {
    quizHistory =
        JSON.parse(
            localStorage.getItem("quizHistory")
        ) || [];

    if (!Array.isArray(quizHistory)) {
        quizHistory = [];
    }

} catch (error) {
    console.error(
        "Error loading quiz history:",
        error
    );

    quizHistory = [];
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// SAVE QUIZ HISTORY
// ============================================================

function saveQuizHistory(
    score,
    total,
    percentage,
    questionReviews
) {

    const historyItem = {

        topic:
            quizTopic.value.trim(),

        level:
            quizDifficulty.value,

        score:
            score,

        total:
            total,

        percentage:
            percentage,

        date:
            new Date().toLocaleString(),

        questions:
            questionReviews
    };


    quizHistory.unshift(historyItem);


    localStorage.setItem(
        "quizHistory",
        JSON.stringify(quizHistory)
    );


    displayQuizHistory();
}


// ============================================================
// DISPLAY QUIZ HISTORY
// ============================================================

function displayQuizHistory() {

    if (!quizHistoryList) {
        return;
    }


    if (quizHistory.length === 0) {

        quizHistoryList.innerHTML = `
            <p>
                No quizzes completed yet.
            </p>
        `;

        return;
    }


    quizHistoryList.innerHTML =
        quizHistory
            .map(
                (quiz, quizIndex) => {

                    let performance = "";
                    let performanceClass = "";


                    // -------------------------
                    // PERFORMANCE
                    // -------------------------

                    const percentage =
                        Number(
                            quiz.percentage
                        ) || 0;


                    if (percentage >= 80) {

                        performance =
                            "🏆 Excellent";

                        performanceClass =
                            "excellent";

                    } else if (percentage >= 50) {

                        performance =
                            "👍 Good";

                        performanceClass =
                            "good";

                    } else {

                        performance =
                            "📖 Needs Practice";

                        performanceClass =
                            "needs-practice";
                    }


                    // -------------------------
                    // VIEW DETAILS
                    // -------------------------

                    const viewButton =
                        Array.isArray(
                            quiz.questions
                        )
                            ? `
                                <button
                                    type="button"
                                    class="view-history-button"
                                    onclick="viewQuizDetails(${quizIndex})"
                                >
                                    👁️ View Details
                                </button>
                            `
                            : `
                                <p class="old-history-note">
                                    Details not available for this quiz.
                                </p>
                            `;


                    // -------------------------
                    // HISTORY CARD
                    // -------------------------

                    return `
                        <div class="history-item">

                            <h3>
                                ${escapeHTML(
                                    quiz.topic ||
                                    "Unknown Topic"
                                )}
                            </h3>


                            <p>
                                Level:
                                <strong>
                                    ${escapeHTML(
                                        quiz.level ||
                                        "Medium"
                                    )}
                                </strong>
                            </p>


                            <p>
                                Score:
                                <strong>
                                    ${quiz.score}/${quiz.total}
                                </strong>
                            </p>


                            <p>
                                Percentage:
                                <strong>
                                    ${quiz.percentage}%
                                </strong>
                            </p>


                            <p>
                                Date:
                                ${escapeHTML(
                                    quiz.date || ""
                                )}
                            </p>


                            <div
                                class="performance-badge ${performanceClass}"
                            >
                                ${performance}
                            </div>


                            <div class="history-buttons">

                                ${viewButton}


                               
                            </div>


                            <div
                                id="history-details-${quizIndex}"
                                class="history-details hidden"
                            >
                            </div>

                        </div>
                    `;
                }
            )
            .join("");
}


// ============================================================
// DELETE ONE QUIZ - CUSTOM CONFIRMATION
// ============================================================

function deleteQuiz(quizIndex) {

    if (
        quizIndex < 0 ||
        quizIndex >= quizHistory.length
    ) {
        return;
    }

    const quiz =
        quizHistory[quizIndex];

    const topic =
        quiz.topic ||
        "this quiz";

    openQuizConfirmModal(
        "delete-one",
        quizIndex,
        `Are you sure you want to delete "${topic}" from quiz history?`
    );
}

// ============================================================
// CLEAR ALL QUIZ HISTORY
// ============================================================

// ============================================================
// CLEAR ALL QUIZ HISTORY
// ============================================================

if (clearQuizHistoryButton) {

    clearQuizHistoryButton.addEventListener(
        "click",
        function () {

            if (quizHistory.length === 0) {
                return;
            }

            openQuizConfirmModal(
                "clear-all",
                null,
                "Are you sure you want to clear ALL quiz history?"
            );

        }
    );
}

// ============================================================
// DISPLAY HISTORY ON PAGE LOAD
// ============================================================

displayQuizHistory();


// ============================================================
// GENERATE QUIZ
// ============================================================

async function generateQuiz() {

    const topic =
        quizTopic.value.trim();

    const difficulty =
        quizDifficulty.value;
        const questionCount =
    Number(quizQuestionCount.value);


    if (topic === "") {

        quizContainer.innerHTML = `
            <p>
                Please enter a topic first.
            </p>
        `;

        return;
    }


    quizContainer.innerHTML = "";


    quizResult.classList.add(
        "hidden"
    );


    quizLoading.classList.remove(
        "hidden"
    );


    generateQuizButton.disabled =
        true;


    try {

        const prompt = `
Create a multiple-choice quiz about "${topic}".

Level: ${difficulty}

Create exactly ${questionCount} questions.

Level requirements:

Easy:
- Basic concepts
- Simple definitions
- Straightforward questions

Medium:
- Conceptual understanding
- Application of concepts
- Moderate difficulty

Hard:
- Deeper concepts
- More challenging application
- Requires careful reasoning

For each question provide exactly 4 options.

For each question, also identify the specific subtopic being tested.

Use a short and meaningful subtopic name.

Also provide a short and clear explanation of why the correct answer is correct.

Return ONLY valid JSON in this exact format:

[
  {
    "question": "Question here",
    "subtopic": "Specific subtopic here",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": 0,
    "explanation": "Short explanation of the correct answer."
  }
]

The "answer" must be the number of the correct option:

0 = first option
1 = second option
2 = third option
3 = fourth option

The explanation must explain the correct answer clearly in 1 or 2 sentences.

Do not include markdown.
Do not include any text outside the JSON.
`;


        const response =
            await fetch(
                "http://localhost:5000/api/ask",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        question: prompt
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );
        }


        quizLoading.classList.add(
            "hidden"
        );


        let quizText =
            data.answer.trim();


        // Remove markdown code fences

        quizText =
            quizText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();


        currentQuiz =
            JSON.parse(
                quizText
            );


        // Validate quiz

        if (
            !Array.isArray(
                currentQuiz
            ) ||
            currentQuiz.length === 0
        ) {

            throw new Error(
                "Invalid quiz format."
            );
        }


        displayQuiz();

    } catch (error) {

        console.error(
            "Quiz Error:",
            error
        );


        quizLoading.classList.add(
            "hidden"
        );


        quizContainer.innerHTML = `
            <p>
                Sorry, I couldn't create the quiz.
                Please try again.
            </p>
        `;
    }


    generateQuizButton.disabled =
        false;
}


// ============================================================
// DISPLAY QUIZ
// ============================================================

function displayQuiz() {

    quizContainer.innerHTML = "";


    currentQuiz.forEach(
        (item, questionIndex) => {

            const questionCard =
                document.createElement(
                    "div"
                );


            questionCard.className =
                "quiz-question";


            questionCard.innerHTML = `
                <h3>
                    ${questionIndex + 1}.
                    ${escapeHTML(
                        item.question
                    )}
                </h3>


                <div class="quiz-options">

                    ${item.options
                        .map(
                            (
                                option,
                                optionIndex
                            ) => `
                                <label
                                    class="quiz-option"
                                    data-option="${optionIndex}"
                                >

                                    <input
                                        type="radio"
                                        name="question-${questionIndex}"
                                        value="${optionIndex}"
                                    >

                                    <span>
                                        ${escapeHTML(
                                            option
                                        )}
                                    </span>

                                </label>
                            `
                        )
                        .join("")}

                </div>


                <div
                    class="answer-review hidden"
                    id="review-${questionIndex}"
                >
                </div>
            `;


            quizContainer.appendChild(
                questionCard
            );
        }
    );


    // -------------------------
    // SUBMIT BUTTON
    // -------------------------

    const submitButton =
        document.createElement(
            "button"
        );


    submitButton.id =
        "submitQuizButton";


    submitButton.textContent =
        "Submit Quiz 🎯";


    submitButton.addEventListener(
        "click",
        calculateScore
    );


    quizContainer.appendChild(
        submitButton
    );
}


// ============================================================
// CALCULATE SCORE
// ============================================================

function calculateScore() {

    let score = 0;
    let wrong = 0;
    let unanswered = 0;


    const questionReviews = [];
    const subtopicStats = {};


    currentQuiz.forEach(
        (
            question,
            questionIndex
        ) => {

            const selected =
                document.querySelector(
                    `input[name="question-${questionIndex}"]:checked`
                );


            const options =
                document.querySelectorAll(
                    `input[name="question-${questionIndex}"]`
                );


            const review =
                document.getElementById(
                    `review-${questionIndex}`
                );


            let selectedAnswer = null;


            // -------------------------
            // LOCK OPTIONS
            // -------------------------

            options.forEach(
                (input) => {

                    const label =
                        input.closest(
                            ".quiz-option"
                        );


                    label.classList.remove(
                        "correct-answer",
                        "wrong-answer"
                    );


                    input.disabled =
                        true;
                }
            );


            // -------------------------
            // UNANSWERED
            // -------------------------

            if (!selected) {

                unanswered++;


                const correctInput =
                    document.querySelector(
                        `input[name="question-${questionIndex}"][value="${question.answer}"]`
                    );


                if (correctInput) {

                    const correctLabel =
                        correctInput.closest(
                            ".quiz-option"
                        );


                    correctLabel.classList.add(
                        "correct-answer"
                    );
                }

            }


            // -------------------------
            // ANSWER SELECTED
            // -------------------------

            else {

                selectedAnswer =
                    Number(
                        selected.value
                    );


                // CORRECT

                if (
                    selectedAnswer ===
                    Number(
                        question.answer
                    )
                ) {

                    score++;


                    const selectedLabel =
                        selected.closest(
                            ".quiz-option"
                        );


                    selectedLabel.classList.add(
                        "correct-answer"
                    );

                }


                // WRONG

                else {

                    wrong++;


                    const wrongLabel =
                        selected.closest(
                            ".quiz-option"
                        );


                    wrongLabel.classList.add(
                        "wrong-answer"
                    );


                    // Highlight correct answer

                    const correctInput =
                        document.querySelector(
                            `input[name="question-${questionIndex}"][value="${question.answer}"]`
                        );


                    if (correctInput) {

                        const correctLabel =
                            correctInput.closest(
                                ".quiz-option"
                            );


                        correctLabel.classList.add(
                            "correct-answer"
                        );
                    }
                }
            }


            // -------------------------
            // SAVE QUESTION REVIEW
            // -------------------------

            questionReviews.push({

                question:
                    question.question,

                options:
                    question.options,

                selectedAnswer:
                    selectedAnswer,

                correctAnswer:
                    Number(
                        question.answer
                    ),

                explanation:
                    question.explanation ||
                    ""
            });

            // Track subtopic performance
const subtopic =
    question.subtopic || "General";

if (!subtopicStats[subtopic]) {

    subtopicStats[subtopic] = {
        correct: 0,
        total: 0
    };
}

subtopicStats[subtopic].total++;

if (
    selectedAnswer !== null &&
    selectedAnswer === Number(question.answer)
) {
    subtopicStats[subtopic].correct++;
}


            // -------------------------
            // EXPLANATION
            // -------------------------

            if (review) {

                review.innerHTML = `
                    <div
                        class="answer-explanation"
                    >

                        <strong>
                            🤖 Explanation:
                        </strong>

                        <p>
                            ${escapeHTML(
                                question.explanation ||
                                "The highlighted green option is the correct answer."
                            )}
                        </p>

                    </div>
                `;


                review.classList.remove(
                    "hidden"
                );
            }
        }
    );


    // ========================================================
    // RESULT
    // ========================================================

    const total =
        currentQuiz.length;


    const percentage =
        total > 0
            ? Math.round(
                (score / total) * 100
            )
            : 0;

            // Find the weakest subtopic
 weakTopic = null;
 lowestAccuracy = 101;

Object.keys(subtopicStats).forEach((topic) => {

    const stats = subtopicStats[topic];

    const accuracy =
        stats.total > 0
            ? Math.round(
                (stats.correct / stats.total) * 100
            )
            : 0;

    if (accuracy < lowestAccuracy) {

        lowestAccuracy = accuracy;
        weakTopic = topic;
    }
});

scoreText.innerHTML = `
    <strong>
        You scored
        ${score}
        out of
        ${total}
        (${percentage}%)
    </strong>

    <br><br>

    ✅ Correct:
    ${score}

    <br>

    ❌ Wrong:
    ${wrong}

    <br>

    ⭕ Unanswered:
    ${unanswered}

    ${
        weakTopic
            ? `
                <br><br>

                ⚠️ <strong>Needs More Practice:</strong>
                ${escapeHTML(weakTopic)}

                <br>

                Your accuracy in this area:
                ${lowestAccuracy}%
            `
            : ""
    }
`;


    // ========================================================
    // SAVE HISTORY
    // ========================================================

    saveQuizHistory(
        score,
        total,
        percentage,
        questionReviews
    );


    quizResult.classList.remove(
        "hidden"
    );


    // ========================================================
    // DISABLE SUBMIT BUTTON
    // ========================================================

    const submitButton =
        document.getElementById(
            "submitQuizButton"
        );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Quiz Submitted ✓";
    }


    // ========================================================
    // SCROLL TO RESULT
    // ========================================================

    window.scrollTo({
        top:
            document.body.scrollHeight,
        behavior:
            "smooth"
    });
}


// ============================================================
// VIEW QUIZ DETAILS
// ============================================================

function viewQuizDetails(
    quizIndex
) {

    const quiz =
        quizHistory[quizIndex];


    if (
        !quiz ||
        !Array.isArray(
            quiz.questions
        )
    ) {
        return;
    }


    const detailsContainer =
        document.getElementById(
            `history-details-${quizIndex}`
        );


    if (!detailsContainer) {
        return;
    }


    // -------------------------
    // CLOSE DETAILS
    // -------------------------

    if (
        !detailsContainer.classList.contains(
            "hidden"
        )
    ) {

        detailsContainer.classList.add(
            "hidden"
        );

        detailsContainer.innerHTML =
            "";

        return;
    }


    // -------------------------
    // BUILD DETAILS
    // -------------------------

    detailsContainer.innerHTML = `
        <div class="history-review-box">

            <h3>
                📝 Quiz Review
            </h3>


            ${quiz.questions
                .map(
                    (
                        question,
                        index
                    ) => {

                        const unanswered =
                            question.selectedAnswer ===
                                null ||
                            question.selectedAnswer ===
                                undefined;


                        const isCorrect =
                            !unanswered &&
                            Number(
                                question.selectedAnswer
                            ) ===
                            Number(
                                question.correctAnswer
                            );


                        let statusClass =
                            "review-wrong";


                        if (isCorrect) {

                            statusClass =
                                "review-correct";

                        } else if (unanswered) {

                            statusClass =
                                "review-unanswered";
                        }


                        return `
                            <div
                                class="
                                    history-question-review
                                    ${statusClass}
                                "
                            >

                                <h4>
                                    ${index + 1}.
                                    ${escapeHTML(
                                        question.question
                                    )}
                                </h4>


                                ${
                                    unanswered

                                        ? `
                                            <p>
                                                ⭕
                                                <strong>
                                                    Not Answered
                                                </strong>
                                            </p>
                                        `

                                        : isCorrect

                                            ? `
                                                <p>
                                                    🟢
                                                    <strong>
                                                        Your Answer:
                                                    </strong>

                                                    ${escapeHTML(
                                                        question.options[
                                                            question.selectedAnswer
                                                        ]
                                                    )}

                                                    <strong>
                                                        — Correct ✓
                                                    </strong>
                                                </p>
                                            `

                                            : `
                                                <p>
                                                    🔴
                                                    <strong>
                                                        Your Answer:
                                                    </strong>

                                                    ${escapeHTML(
                                                        question.options[
                                                            question.selectedAnswer
                                                        ]
                                                    )}

                                                    <strong>
                                                        — Wrong
                                                    </strong>
                                                </p>
                                            `
                                }


                                <p>
                                    🟢
                                    <strong>
                                        Correct Answer:
                                    </strong>

                                    ${escapeHTML(
                                        question.options[
                                            question.correctAnswer
                                        ]
                                    )}
                                </p>


                                ${
                                    question.explanation

                                        ? `
                                            <div
                                                class="history-explanation"
                                            >

                                                🤖
                                                <strong>
                                                    Explanation:
                                                </strong>

                                                <p>
                                                    ${escapeHTML(
                                                        question.explanation
                                                    )}
                                                </p>

                                            </div>
                                        `

                                        : ""
                                }

                            </div>
                        `;
                    }
                )
                .join("")}

        </div>
    `;


    detailsContainer.classList.remove(
        "hidden"
    );
}


// ============================================================
// RETRY QUIZ
// ============================================================

if (retryButton) {

    retryButton.addEventListener(
        "click",
        function () {

            quizResult.classList.add(
                "hidden"
            );


            quizContainer.innerHTML =
                "";


            currentQuiz = [];


            quizTopic.focus();
        }
    );
}


// ============================================================
// GENERATE BUTTON
// ============================================================

if (generateQuizButton) {

    generateQuizButton.addEventListener(
        "click",
        generateQuiz
    );
}


// ============================================================
// ENTER KEY SUPPORT
// ============================================================

if (quizTopic) {

    quizTopic.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                generateQuiz();
            }
        }
    );
}


// ============================================================
// CLEAR TOPIC
// ============================================================

if (clearTopicButton) {

    clearTopicButton.addEventListener(
        "click",
        function () {

            quizTopic.value = "";

            quizTopic.focus();
        }
    );
}
// ============================================================
// DELETE SINGLE QUIZ HISTORY
// ============================================================

function clearSingleQuizHistory(index) {

    if (
        index < 0 ||
        index >= quizHistory.length
    ) {
        return;
    }

    const quiz =
        quizHistory[index];

    const topic =
        quiz.topic ||
        "this quiz";

    openQuizConfirmModal(
        "delete-one",
        index,
        `Are you sure you want to delete "${topic}" from quiz history?`
    );
}
// ============================================================
// QUIZ CUSTOM CONFIRMATION MODAL
// ============================================================

const quizConfirmModal =
    document.createElement("div");

quizConfirmModal.id =
    "quizConfirmModal";

quizConfirmModal.innerHTML = `

    <div class="quiz-confirm-box">

        <div class="quiz-confirm-icon">
            🗑️
        </div>

        <h3 id="quizConfirmTitle">
            Clear Quiz History?
        </h3>

        <p id="quizConfirmMessage">
            Are you sure?
        </p>

        <div class="quiz-confirm-buttons">

            <button
                type="button"
                id="quizConfirmCancel"
            >
                Cancel
            </button>

            <button
                type="button"
                id="quizConfirmYes"
            >
                Delete
            </button>

        </div>

    </div>

`;

document.body.appendChild(
    quizConfirmModal
);


const quizConfirmTitle =
    document.getElementById(
        "quizConfirmTitle"
    );

const quizConfirmMessage =
    document.getElementById(
        "quizConfirmMessage"
    );

const quizConfirmCancel =
    document.getElementById(
        "quizConfirmCancel"
    );

const quizConfirmYes =
    document.getElementById(
        "quizConfirmYes"
    );


// ============================================================
// MODAL STATE
// ============================================================

let quizConfirmAction =
    null;

let quizConfirmIndex =
    null;


// ============================================================
// OPEN QUIZ CONFIRMATION
// ============================================================

function openQuizConfirmModal(
    action,
    index,
    message
) {

    quizConfirmAction =
        action;

    quizConfirmIndex =
        index;

    quizConfirmMessage.textContent =
        message;


    if (action === "clear-all") {

        quizConfirmTitle.textContent =
            "Clear All Quiz History?";

        quizConfirmYes.textContent =
            "Clear All";

    } else {

        quizConfirmTitle.textContent =
            "Delete Quiz?";

        quizConfirmYes.textContent =
            "Delete";

    }


    quizConfirmModal.classList.add(
        "show"
    );
}


// ============================================================
// CLOSE MODAL
// ============================================================

function closeQuizConfirmModal() {

    quizConfirmModal.classList.remove(
        "show"
    );

    quizConfirmAction =
        null;

    quizConfirmIndex =
        null;
}


// ============================================================
// CONFIRM ACTION
// ============================================================

quizConfirmYes.addEventListener(
    "click",
    function () {

        // DELETE ONE QUIZ
        if (
            quizConfirmAction ===
            "delete-one"
        ) {

            if (
                quizConfirmIndex !== null &&
                quizHistory[
                    quizConfirmIndex
                ]
            ) {

                quizHistory.splice(
                    quizConfirmIndex,
                    1
                );

            }

        }


        // CLEAR ALL HISTORY
        if (
            quizConfirmAction ===
            "clear-all"
        ) {

            quizHistory = [];

            localStorage.removeItem(
                "quizHistory"
            );

        }


        // Save updated history
        localStorage.setItem(
            "quizHistory",
            JSON.stringify(
                quizHistory
            )
        );


        displayQuizHistory();

        closeQuizConfirmModal();

    }
);


// ============================================================
// CANCEL
// ============================================================

quizConfirmCancel.addEventListener(
    "click",
    function () {

        closeQuizConfirmModal();

    }
);


// ============================================================
// CLICK OUTSIDE
// ============================================================

quizConfirmModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            quizConfirmModal
        ) {

            closeQuizConfirmModal();

        }

    }
);


// ============================================================
// ESC KEY
// ============================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            quizConfirmModal.classList.contains(
                "show"
            )
        ) {

            closeQuizConfirmModal();

        }

    }
);
// =========================
// ADD CLEAR BUTTON TO HISTORY
// =========================

function addClearButtonToHistory() {

    const historyItems =
        document.querySelectorAll(".history-item");

    historyItems.forEach((item, index) => {

        if (
            item.querySelector(".clear-single-quiz")
        ) {
            return;
        }

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "clear-single-quiz";

        button.textContent =
            "🗑️ Clear";

        button.addEventListener(
            "click",
            function () {

                clearSingleQuizHistory(index);

            }
        );

        item.appendChild(button);

    });
}
// =========================
// UPDATE HISTORY BUTTONS
// =========================

const oldDisplayQuizHistory =
    displayQuizHistory;

displayQuizHistory = function () {

    oldDisplayQuizHistory();

    addClearButtonToHistory();

};
// =========================
// REFRESH HISTORY BUTTONS
// =========================

setTimeout(function () {
    addClearButtonToHistory();
}, 100);
// ============================================================
// PRACTICE WEAK TOPIC
// ============================================================

if (practiceWeakTopicButton) {

    practiceWeakTopicButton.addEventListener(
        "click",
        function () {

            if (!weakTopic) {
                return;
            }

            // Put weak topic into the topic box
            quizTopic.value = weakTopic;

            // Hide previous result
            quizResult.classList.add("hidden");

            // Clear old quiz
            quizContainer.innerHTML = "";

            // Generate a new quiz
            generateQuiz();

        }
    );
}