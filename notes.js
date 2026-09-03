// ============================================================
// AI NOTES - ELEMENTS
// ============================================================

const topicInput =
    document.getElementById("topic");

const notesLength =
    document.getElementById("notesLength");

const generateButton =
    document.getElementById("generateButton");

const clearNotesButton =
    document.getElementById("clearNotesButton");

const notesAnswer =
    document.getElementById("notesAnswer");

const notesLoading =
    document.getElementById("notesLoading");

const notesActions =
    document.getElementById("notesActions");

const copyNotesButton =
    document.getElementById("copyNotesButton");

const saveNotesButton =
    document.getElementById("saveNotesButton");

const notesHistoryList =
    document.getElementById("notesHistoryList");

const clearNotesHistoryButton =
    document.getElementById(
        "clearNotesHistoryButton"
    );


// ============================================================
// CUSTOM DELETE MODAL ELEMENTS
// ============================================================

const deleteModal =
    document.getElementById("deleteModal");

const deleteModalMessage =
    document.getElementById("deleteModalMessage");

const cancelDeleteButton =
    document.getElementById("cancelDeleteButton");

const confirmDeleteButton =
    document.getElementById("confirmDeleteButton");


// ============================================================
// DELETE MODAL STATE
// ============================================================

let deleteNoteIndex = null;

let deleteAllNotes = false;


// ============================================================
// NOTES HISTORY
// ============================================================

let notesHistory = [];

try {

    notesHistory =
        JSON.parse(
            localStorage.getItem("notesHistory")
        ) || [];

    if (!Array.isArray(notesHistory)) {
        notesHistory = [];
    }

} catch (error) {

    console.error(
        "Error loading notes history:",
        error
    );

    notesHistory = [];
}


// ============================================================
// CURRENT NOTES
// ============================================================

let currentGeneratedNotes = "";

let currentTopic = "";


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
// FORMAT NOTES
// ============================================================

function formatNotes(text) {

    if (!text) {
        return "";
    }

    let formatted =
        escapeHTML(text);


    // Bold text
    formatted =
        formatted.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    // Markdown headings
    formatted =
        formatted.replace(
            /^#{1,3}\s+(.+)$/gm,
            "<h3>$1</h3>"
        );


    // Numbered headings
    formatted =
        formatted.replace(
            /^(\d+\.\s+)(.+)$/gm,
            "<h3>$1$2</h3>"
        );


    // Bullet points
    formatted =
        formatted.replace(
            /^[•*-]\s+(.+)$/gm,
            "<li>$1</li>"
        );


    // Convert consecutive list items into UL
    formatted =
        formatted.replace(
            /(<li>.*?<\/li>(?:\s*<br>)?)+/gs,
            function (match) {

                return (
                    "<ul>" +
                    match
                        .replace(/<br>/g, "")
                    +
                    "</ul>"
                );

            }
        );


    // New lines
    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;
}


// ============================================================
// SAVE NOTES TO HISTORY
// ============================================================

function saveNotesToHistory(
    topic,
    notes,
    length
) {

    const newNote = {

        topic:
            topic,

        notes:
            notes,

        length:
            length,

        date:
            new Date().toLocaleString()

    };


    notesHistory.unshift(
        newNote
    );


    // Keep latest 10 notes
    notesHistory =
        notesHistory.slice(
            0,
            10
        );


    localStorage.setItem(
        "notesHistory",
        JSON.stringify(
            notesHistory
        )
    );
}


// ============================================================
// DISPLAY NOTES HISTORY
// ============================================================

function displayNotesHistory() {

    if (!notesHistoryList) {
        return;
    }


    if (
        notesHistory.length === 0
    ) {

        notesHistoryList.innerHTML = `
            <p>
                No notes generated yet.
            </p>
        `;

        return;
    }


    notesHistoryList.innerHTML = "";


    notesHistory.forEach(
        (
            item,
            index
        ) => {

            const historyItem =
                document.createElement(
                    "div"
                );


            historyItem.className =
                "notes-history-item";


            historyItem.innerHTML = `

                <div class="notes-history-info">

                    <strong>
                        ${index + 1}.
                        ${escapeHTML(
                            item.topic
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            item.date
                        )}
                    </small>

                </div>


                <div class="notes-history-actions">

                    <button
                        type="button"
                        class="view-notes-button"
                        onclick="showOldNotes(${index})"
                    >
                        👁️ View Notes
                    </button>


                    <button
                        type="button"
                        class="clear-single-note"
                        onclick="deleteSingleNote(${index})"
                    >
                        🗑️ Clear
                    </button>

                </div>

            `;


            notesHistoryList.appendChild(
                historyItem
            );

        }
    );
}


// ============================================================
// OPEN DELETE MODAL
// ============================================================

function openDeleteModal(
    message,
    index = null,
    deleteAll = false
) {

    if (!deleteModal) {
        return;
    }


    deleteNoteIndex =
        index;

    deleteAllNotes =
        deleteAll;


    if (deleteModalMessage) {

        deleteModalMessage.textContent =
            message;

    }


    deleteModal.classList.add(
        "show"
    );
}


// ============================================================
// CLOSE DELETE MODAL
// ============================================================

function closeDeleteModal() {

    if (deleteModal) {

        deleteModal.classList.remove(
            "show"
        );

    }


    deleteNoteIndex =
        null;

    deleteAllNotes =
        false;
}


// ============================================================
// VIEW OLD NOTES
// ============================================================

function showOldNotes(index) {

    const item =
        notesHistory[index];


    if (!item) {
        return;
    }


    topicInput.value =
        item.topic;


    // Restore selected length
    if (
        notesLength &&
        item.length
    ) {

        notesLength.value =
            item.length;

    }


    currentGeneratedNotes =
        item.notes;

    currentTopic =
        item.topic;


    notesAnswer.innerHTML =
        formatNotes(
            item.notes
        );


    // Show action buttons
    if (notesActions) {

        notesActions.style.display =
            "flex";

    }


    window.scrollTo({

        top:
            document.querySelector(
                ".notes-result"
            )?.offsetTop || 0,

        behavior:
            "smooth"

    });
}


// ============================================================
// DELETE SINGLE NOTE
// ============================================================

function deleteSingleNote(index) {

    const item =
        notesHistory[index];


    if (!item) {
        return;
    }


    openDeleteModal(

        `Are you sure you want to delete "${item.topic}" from notes history?`,

        index,

        false

    );
}


// ============================================================
// CLEAR CURRENT NOTES
// ============================================================

if (clearNotesButton) {

    clearNotesButton.addEventListener(
        "click",
        function () {

            topicInput.value = "";

            currentGeneratedNotes = "";

            currentTopic = "";

            notesAnswer.textContent =
                "Your AI-generated notes will appear here.";


            if (notesActions) {

                notesActions.style.display =
                    "none";

            }


            topicInput.focus();

        }
    );
}


// ============================================================
// CLEAR ALL NOTES HISTORY
// ============================================================

if (
    clearNotesHistoryButton
) {

    clearNotesHistoryButton.addEventListener(
        "click",
        function () {

            if (
                notesHistory.length === 0
            ) {
                return;
            }


            openDeleteModal(

                "Are you sure you want to clear all notes history?",

                null,

                true

            );

        }
    );
}


// ============================================================
// CONFIRM DELETE
// ============================================================

if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener(
        "click",
        function () {


            // ================================================
            // DELETE ALL HISTORY
            // ================================================

            if (deleteAllNotes) {

                notesHistory = [];


                localStorage.removeItem(
                    "notesHistory"
                );


                displayNotesHistory();

            }


            // ================================================
            // DELETE SINGLE NOTE
            // ================================================

            else if (
                deleteNoteIndex !== null
            ) {

                notesHistory.splice(
                    deleteNoteIndex,
                    1
                );


                localStorage.setItem(
                    "notesHistory",
                    JSON.stringify(
                        notesHistory
                    )
                );


                displayNotesHistory();

            }


            // Close modal
            closeDeleteModal();

        }
    );
}


// ============================================================
// CANCEL DELETE
// ============================================================

if (cancelDeleteButton) {

    cancelDeleteButton.addEventListener(
        "click",
        function () {

            closeDeleteModal();

        }
    );
}


// ============================================================
// CLICK OUTSIDE MODAL TO CLOSE
// ============================================================

if (deleteModal) {

    deleteModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === deleteModal
            ) {

                closeDeleteModal();

            }

        }
    );
}


// ============================================================
// ESC KEY TO CLOSE MODAL
// ============================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            deleteModal &&
            deleteModal.classList.contains("show")
        ) {

            closeDeleteModal();

        }

    }
);


// ============================================================
// GET NOTES LENGTH INSTRUCTION
// ============================================================

function getLengthInstruction(length) {

    if (length === "short") {

        return `
Keep the notes short and concise.

Use only the most important information.

Aim for quick revision.

Avoid unnecessary explanations.
`;

    }


    if (length === "detailed") {

        return `
Create detailed and comprehensive notes.

Explain important concepts properly.

Include useful examples and exam-oriented information.

Cover the topic thoroughly while keeping the language simple.

Do not make the notes unnecessarily repetitive.
`;

    }


    // Medium
    return `
Create medium-length notes.

Give enough explanation to understand the topic clearly.

Include important points and useful examples.

Keep the notes balanced between short revision and detailed explanation.
`;

}


// ============================================================
// GENERATE NOTES
// ============================================================

async function generateNotes() {

    const topic =
        topicInput.value.trim();


    if (topic === "") {

        notesAnswer.textContent =
            "Please enter a topic first.";

        topicInput.focus();

        return;
    }


    const selectedLength =
        notesLength
            ? notesLength.value
            : "medium";


    const lengthInstruction =
        getLengthInstruction(
            selectedLength
        );


    notesAnswer.textContent =
        "";


    if (notesActions) {

        notesActions.style.display =
            "none";

    }


    notesLoading.classList.remove(
        "hidden"
    );


    generateButton.disabled =
        true;


    try {

        const prompt = `

Create high-quality study notes about:

"${topic}"

The notes are for a student preparing for exams.

IMPORTANT:

${lengthInstruction}

Structure the notes clearly using these sections:

1. Definition
2. Important Points
3. Key Concepts
4. Examples
5. Key Takeaways

Requirements:

- Use clear headings.
- Use bullet points where useful.
- Clearly explain important definitions.
- Give simple and student-friendly explanations.
- Include examples wherever appropriate.
- Highlight important exam points.
- End with a short Key Takeaways section.
- Avoid unnecessary long paragraphs.
- Do not repeat the same information.
- Keep the information accurate.
- Use simple language that is easy to revise.

Make the notes well-organized and visually easy to study.

`;


        const response =
            await fetch(
                 "https://ai-study-assistant-n7nm.onrender.com/api/ask",
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
                                prompt

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


        const generatedNotes =
            data.answer || "";


        currentGeneratedNotes =
            generatedNotes;

        currentTopic =
            topic;


        notesLoading.classList.add(
            "hidden"
        );


        notesAnswer.innerHTML =
            formatNotes(
                generatedNotes
            );


        // Show Copy + Save
        if (notesActions) {

            notesActions.style.display =
                "flex";

        }


        // Save to history automatically
        saveNotesToHistory(
            topic,
            generatedNotes,
            selectedLength
        );


        displayNotesHistory();


    } catch (error) {

        console.error(
            "Notes Error:",
            error
        );


        notesLoading.classList.add(
            "hidden"
        );


        notesAnswer.innerHTML = `
            <p>
                Sorry, I couldn't generate notes.
                Please make sure the AI server is running.
            </p>
        `;

    }


    generateButton.disabled =
        false;
}


// ============================================================
// COPY NOTES
// ============================================================

if (copyNotesButton) {

    copyNotesButton.addEventListener(
        "click",
        async function () {

            if (
                !currentGeneratedNotes
            ) {

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    currentGeneratedNotes
                );


                const originalText =
                    copyNotesButton.textContent;


                copyNotesButton.textContent =
                    "✅ Copied!";


                copyNotesButton.classList.add(
                    "copied"
                );


                setTimeout(
                    function () {

                        copyNotesButton.textContent =
                            originalText;

                        copyNotesButton.classList.remove(
                            "copied"
                        );

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Copy Error:",
                    error
                );


                alert(
                    "Unable to copy notes. Please try again."
                );

            }

        }
    );
}


// ============================================================
// SAVE NOTES
// ============================================================

if (saveNotesButton) {

    saveNotesButton.addEventListener(
        "click",
        function () {

            if (
                !currentGeneratedNotes
            ) {

                return;

            }


            const savedNote = {

                topic:
                    currentTopic ||
                    topicInput.value.trim(),

                notes:
                    currentGeneratedNotes,

                length:
                    notesLength
                        ? notesLength.value
                        : "medium",

                date:
                    new Date().toLocaleString(),

                saved:
                    true

            };


            let savedNotes = [];


            try {

                savedNotes =
                    JSON.parse(
                        localStorage.getItem(
                            "savedNotes"
                        )
                    ) || [];


                if (!Array.isArray(savedNotes)) {

                    savedNotes = [];

                }

            } catch (error) {

                savedNotes = [];

            }


            savedNotes.unshift(
                savedNote
            );


            // Keep latest 20 saved notes
            savedNotes =
            savedNotes.slice(
                    0,
                    20
                );


            localStorage.setItem(
                "savedNotes",
                JSON.stringify(
                    savedNotes
                )
            );


            const originalText =
                saveNotesButton.textContent;


            saveNotesButton.textContent =
                "✅ Saved!";


            saveNotesButton.classList.add(
                "saved"
            );


            setTimeout(
                function () {

                    saveNotesButton.textContent =
                        originalText;

                    saveNotesButton.classList.remove(
                        "saved"
                    );

                },
                1500
            );

        }
    );
}


// ============================================================
// GENERATE BUTTON
// ============================================================

if (generateButton) {

    generateButton.addEventListener(
        "click",
        generateNotes
    );
}


// ============================================================
// ENTER KEY SUPPORT
// ============================================================

if (topicInput) {

    topicInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                generateNotes();

            }

        }
    );
}


// ============================================================
// SHOW HISTORY ON PAGE LOAD
// ============================================================

displayNotesHistory();