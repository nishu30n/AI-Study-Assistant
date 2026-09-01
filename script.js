// ============================================================
// DOUBT SOLVER - ELEMENTS
// ============================================================

const questionInput =
    document.getElementById("question");

const askButton =
    document.getElementById("askButton");

const clearButton =
    document.getElementById("clearButton");

const answer =
    document.getElementById("answer");

const loading =
    document.getElementById("loading");

const historyList =
    document.getElementById("historyList");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");


// New buttons
const copyAnswerButton =
    document.getElementById("copyAnswerButton");

const simpleAnswerButton =
    document.getElementById("simpleAnswerButton");

const hintButton =
    document.getElementById("hintButton");

const regenerateButton =
    document.getElementById("regenerateButton");


// ============================================================
// CUSTOM CLEAR CONFIRMATION MODAL
// ============================================================

// Modal HTML automatically create hoga.
// HTML file mein manually kuch add karne ki zarurat nahi.

const clearModal =
    document.createElement("div");

clearModal.id =
    "doubtClearModal";

clearModal.innerHTML = `

    <div class="doubt-clear-modal-box">

        <div class="doubt-clear-modal-icon">
            🗑️
        </div>

        <h3 id="doubtClearModalTitle">
            Clear Question?
        </h3>

        <p id="doubtClearModalMessage">
            Are you sure you want to clear this question?
        </p>

        <div class="doubt-clear-modal-buttons">

            <button
                type="button"
                id="cancelDoubtClearButton"
            >
                Cancel
            </button>

            <button
                type="button"
                id="confirmDoubtClearButton"
            >
                Clear
            </button>

        </div>

    </div>

`;

document.body.appendChild(
    clearModal
);


// Modal buttons
const cancelDoubtClearButton =
    document.getElementById(
        "cancelDoubtClearButton"
    );

const confirmDoubtClearButton =
    document.getElementById(
        "confirmDoubtClearButton"
    );

const doubtClearModalMessage =
    document.getElementById(
        "doubtClearModalMessage"
    );


// ============================================================
// CLEAR MODAL STATE
// ============================================================

let clearActionType =
    null;

let clearHistoryIndex =
    null;


// ============================================================
// QUESTION HISTORY
// ============================================================

let questionHistory = [];

try {

    questionHistory =
        JSON.parse(
            localStorage.getItem(
                "questionHistory"
            )
        ) || [];

    if (
        !Array.isArray(questionHistory)
    ) {

        questionHistory = [];

    }

} catch (error) {

    console.error(
        "Error loading question history:",
        error
    );

    questionHistory = [];

}


// ============================================================
// LAST QUESTION / ANSWER
// ============================================================

let lastQuestion =
    "";

let lastAnswer =
    "";


// ============================================================
// OPEN CUSTOM CLEAR MODAL
// ============================================================

function openClearModal(
    type,
    index = null
) {

    clearActionType =
        type;

    clearHistoryIndex =
        index;


    if (type === "current") {

        doubtClearModalMessage.textContent =
            "Are you sure you want to clear this question?";

    }


    if (type === "single") {

        doubtClearModalMessage.textContent =
            "Are you sure you want to clear this question from history?";

    }


    if (type === "all") {

        doubtClearModalMessage.textContent =
            "Are you sure you want to clear your entire question history?";

    }


    clearModal.classList.add(
        "show"
    );
}


// ============================================================
// CLOSE CUSTOM CLEAR MODAL
// ============================================================

function closeClearModal() {

    clearModal.classList.remove(
        "show"
    );

    clearActionType =
        null;

    clearHistoryIndex =
        null;
}


// ============================================================
// ASK AI
// ============================================================

async function askAI(
    customQuestion = null,
    saveHistory = true
) {

    const question =
        customQuestion ||
        questionInput.value.trim();


    if (
        question === ""
    ) {

        answer.textContent =
            "Please enter a question first.";

        return;
    }


    lastQuestion =
        question;


    // Show loading
    answer.textContent =
        "";

    loading.classList.remove(
        "hidden"
    );


    askButton.disabled =
        true;

    simpleAnswerButton.disabled =
        true;

    hintButton.disabled =
        true;

    regenerateButton.disabled =
        true;


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/ask",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            question:
                                question

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


        // Hide loading
        loading.classList.add(
            "hidden"
        );


        lastAnswer =
            data.answer;


        // Show answer
        answer.innerHTML =
            formatAnswer(
                data.answer
            );


        // Save history
        if (saveHistory) {

            saveToHistory(
                question,
                data.answer
            );

            displayHistory();

        }


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        loading.classList.add(
            "hidden"
        );


        answer.textContent =
            "Sorry, I couldn't connect to the AI server. Please make sure the server is running.";

    }


    askButton.disabled =
        false;

    simpleAnswerButton.disabled =
        false;

    hintButton.disabled =
        false;

    regenerateButton.disabled =
        false;
}


// ============================================================
// FORMAT ANSWER
// ============================================================

function formatAnswer(text) {

    if (!text) {
        return "";
    }


    return text
        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )
        .replace(
            /\n/g,
            "<br>"
        );
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
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ============================================================
// SAVE HISTORY
// ============================================================

function saveToHistory(
    question,
    answerText
) {

    const newQuestion = {

        question:
            question,

        answer:
            answerText,

        date:
            new Date().toLocaleString()

    };


    questionHistory.unshift(
        newQuestion
    );


    // Keep latest 10
    questionHistory =
        questionHistory.slice(
            0,
            10
        );


    localStorage.setItem(
        "questionHistory",
        JSON.stringify(
            questionHistory
        )
    );
}


// ============================================================
// DISPLAY HISTORY
// ============================================================

function displayHistory() {

    if (
        questionHistory.length === 0
    ) {

        historyList.innerHTML =
            "<p>No questions asked yet.</p>";

        return;
    }


    historyList.innerHTML =
        "";


    questionHistory.forEach(
        (
            item,
            index
        ) => {

            const historyItem =
                document.createElement(
                    "div"
                );


            historyItem.className =
                "history-item";


            historyItem.innerHTML = `

                <div class="history-question">

                    <strong>
                        ${index + 1}.
                        ${escapeHTML(
                            item.question
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            item.date
                        )}
                    </small>

                </div>


                <div class="history-actions">

                    <button
                        type="button"
                        onclick="showHistoryAnswer(${index})"
                    >
                        👁️ View Answer
                    </button>


                    <button
                        type="button"
                        onclick="deleteHistoryItem(${index})"
                    >
                        🗑️ Clear
                    </button>

                </div>

            `;


            historyList.appendChild(
                historyItem
            );

        }
    );
}


// ============================================================
// SHOW OLD ANSWER
// ============================================================

function showHistoryAnswer(
    index
) {

    const item =
        questionHistory[index];


    if (!item) {
        return;
    }


    questionInput.value =
        item.question;


    lastQuestion =
        item.question;


    lastAnswer =
        item.answer;


    answer.innerHTML =
        formatAnswer(
            item.answer
        );


    window.scrollTo({

        top:
            document.body.scrollHeight,

        behavior:
            "smooth"

    });
}


// ============================================================
// DELETE INDIVIDUAL HISTORY ITEM
// ============================================================

function deleteHistoryItem(
    index
) {

    if (
        !questionHistory[index]
    ) {

        return;

    }


    openClearModal(
        "single",
        index
    );
}


// ============================================================
// COPY ANSWER
// ============================================================

copyAnswerButton.addEventListener(
    "click",
    async function () {

        if (!lastAnswer) {

            alert(
                "There is no answer to copy yet."
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(
                lastAnswer
            );


            copyAnswerButton.textContent =
                "✅ Copied!";


            setTimeout(
                () => {

                    copyAnswerButton.textContent =
                        "📋 Copy Answer";

                },
                1500
            );


        } catch (error) {

            console.error(
                error
            );


            alert(
                "Unable to copy the answer."
            );

        }

    }
);


// ============================================================
// EXPLAIN SIMPLY
// ============================================================

simpleAnswerButton.addEventListener(
    "click",
    function () {

        if (!lastQuestion) {

            alert(
                "Ask a question first."
            );

            return;
        }


        const simplePrompt = `

Explain this study question in VERY SIMPLE language.

Question:
${lastQuestion}

Rules:
- Explain like you are teaching a beginner.
- Use simple words.
- Use a small real-life example.
- Break the explanation into short points.
- Avoid unnecessary difficult terminology.

`;


        askAI(
            simplePrompt,
            false
        );

    }
);


// ============================================================
// GIVE ME A HINT
// ============================================================

hintButton.addEventListener(
    "click",
    function () {

        if (!lastQuestion) {

            alert(
                "Ask a question first."
            );

            return;
        }


        const hintPrompt = `

I am a student trying to solve this question.

Question:
${lastQuestion}

Give me ONLY a useful hint.

Do NOT give me the complete answer.

Help me think about the solution myself.

`;


        askAI(
            hintPrompt,
            false
        );

    }
);


// ============================================================
// REGENERATE ANSWER
// ============================================================

regenerateButton.addEventListener(
    "click",
    function () {

        if (!lastQuestion) {

            alert(
                "Ask a question first."
            );

            return;
        }


        const regeneratePrompt = `

Give me a NEW explanation for this study question.

Question:
${lastQuestion}

Give a different explanation from the previous one.

Use:
- Clear structure
- Simple language
- Examples where useful
- Step-by-step explanation

`;


        askAI(
            regeneratePrompt,
            false
        );

    }
);


// ============================================================
// CLEAR CURRENT QUESTION
// ============================================================

clearButton.addEventListener(
    "click",
    function () {

        // Don't show popup if nothing is entered
        if (
            questionInput.value.trim() === "" &&
            lastAnswer === ""
        ) {

            return;

        }


        openClearModal(
            "current"
        );

    }
);


// ============================================================
// CLEAR ALL HISTORY
// ============================================================

clearHistoryButton.addEventListener(
    "click",
    function () {

        if (
            questionHistory.length === 0
        ) {

            return;

        }


        openClearModal(
            "all"
        );

    }
);


// ============================================================
// CONFIRM CLEAR
// ============================================================

confirmDoubtClearButton.addEventListener(
    "click",
    function () {


        // ================================================
        // CLEAR CURRENT QUESTION
        // ================================================

        if (
            clearActionType === "current"
        ) {

            questionInput.value =
                "";

            answer.textContent =
                "Your AI explanation will appear here.";

            lastQuestion =
                "";

            lastAnswer =
                "";

        }


        // ================================================
        // DELETE SINGLE HISTORY ITEM
        // ================================================

        else if (
            clearActionType === "single" &&
            clearHistoryIndex !== null
        ) {

            questionHistory.splice(
                clearHistoryIndex,
                1
            );


            localStorage.setItem(
                "questionHistory",
                JSON.stringify(
                    questionHistory
                )
            );


            displayHistory();

        }


        // ================================================
        // CLEAR ALL HISTORY
        // ================================================

        else if (
            clearActionType === "all"
        ) {

            questionHistory =
                [];


            localStorage.removeItem(
                "questionHistory"
            );


            displayHistory();

        }


        // Close popup
        closeClearModal();

    }
);


// ============================================================
// CANCEL CLEAR
// ============================================================

cancelDoubtClearButton.addEventListener(
    "click",
    function () {

        closeClearModal();

    }
);


// ============================================================
// CLICK OUTSIDE POPUP
// ============================================================

clearModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === clearModal
        ) {

            closeClearModal();

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
            clearModal.classList.contains(
                "show"
            )
        ) {

            closeClearModal();

        }

    }
);


// ============================================================
// ASK BUTTON
// ============================================================

askButton.addEventListener(
    "click",
    askAI
);


// ============================================================
// ENTER KEY
// ============================================================

questionInput.addEventListener(
    "keydown",
    function (event) {

        // Enter = Ask
        // Shift + Enter = New line

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            askAI();

        }

    }
);


// ============================================================
// PAGE LOAD
// ============================================================

displayHistory();