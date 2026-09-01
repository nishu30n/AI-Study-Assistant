// ============================================================
// STUDY PLANNER
// ============================================================

// Get elements
const subjectInput =
    document.getElementById("subject");

const studyHoursInput =
    document.getElementById("studyHours");

const targetDateInput =
    document.getElementById("targetDate");

const priorityInput =
    document.getElementById("priority");

const addPlanButton =
    document.getElementById("addPlanButton");

const clearPlanButton =
    document.getElementById("clearPlanButton");

const studyPlanList =
    document.getElementById("studyPlanList");


// ============================================================
// CUSTOM CLEAR / DELETE MODAL
// ============================================================

const plannerModal =
    document.createElement("div");

plannerModal.id =
    "plannerConfirmModal";

plannerModal.innerHTML = `

    <div class="planner-confirm-box">

        <div class="planner-confirm-icon">
            🗑️
        </div>

        <h3 id="plannerConfirmTitle">
            Clear Form?
        </h3>

        <p id="plannerConfirmMessage">
            Are you sure you want to clear this form?
        </p>

        <div class="planner-confirm-buttons">

            <button
                type="button"
                id="plannerCancelButton"
            >
                Cancel
            </button>

            <button
                type="button"
                id="plannerConfirmButton"
            >
                Clear
            </button>

        </div>

    </div>

`;

document.body.appendChild(
    plannerModal
);


const plannerConfirmTitle =
    document.getElementById(
        "plannerConfirmTitle"
    );

const plannerConfirmMessage =
    document.getElementById(
        "plannerConfirmMessage"
    );

const plannerCancelButton =
    document.getElementById(
        "plannerCancelButton"
    );

const plannerConfirmButton =
    document.getElementById(
        "plannerConfirmButton"
    );


// ============================================================
// MODAL STATE
// ============================================================

let plannerActionType =
    null;

let plannerDeleteIndex =
    null;


// ============================================================
// OPEN MODAL
// ============================================================

function openPlannerModal(
    type,
    index = null
) {

    plannerActionType =
        type;

    plannerDeleteIndex =
        index;


    if (type === "clear-form") {

        plannerConfirmTitle.textContent =
            "Clear Form?";

        plannerConfirmMessage.textContent =
            "Are you sure you want to clear all the entered study plan details?";

        plannerConfirmButton.textContent =
            "Clear";

    }


    if (type === "delete-plan") {

        const plan =
            studyPlans[index];

        plannerConfirmTitle.textContent =
            "Delete Study Plan?";

        plannerConfirmMessage.textContent =
            `Are you sure you want to delete "${plan.subject}" from your study plans?`;

        plannerConfirmButton.textContent =
            "Delete";

    }


    plannerModal.classList.add(
        "show"
    );
}


// ============================================================
// CLOSE MODAL
// ============================================================

function closePlannerModal() {

    plannerModal.classList.remove(
        "show"
    );

    plannerActionType =
        null;

    plannerDeleteIndex =
        null;
}


// ============================================================
// LOAD SAVED PLANS
// ============================================================

let studyPlans = [];

try {

    studyPlans =
        JSON.parse(
            localStorage.getItem("studyPlans")
        ) || [];

    if (!Array.isArray(studyPlans)) {
        studyPlans = [];
    }

} catch (error) {

    console.error(
        "Error loading study plans:",
        error
    );

    studyPlans = [];
}


// ============================================================
// SAVE PLANS
// ============================================================

function savePlans() {

    localStorage.setItem(
        "studyPlans",
        JSON.stringify(studyPlans)
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
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// GET DATE STATUS
// ============================================================

function getDateStatus(
    date,
    completed
) {

    if (completed) {

        return {
            className: "completed",
            text: "Completed ✅"
        };

    }


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const target =
        new Date(date);

    target.setHours(
        0,
        0,
        0,
        0
    );


    if (target < today) {

        return {
            className: "overdue",
            text: "Overdue ⚠️"
        };

    }


    if (
        target.getTime() ===
        today.getTime()
    ) {

        return {
            className: "today",
            text: "Today 📌"
        };

    }


    return {
        className: "pending",
        text: "Pending ⏳"
    };
}


// ============================================================
// CALCULATE PROGRESS
// ============================================================

function calculateProgress() {

    if (studyPlans.length === 0) {
        return 0;
    }


    const completed =
        studyPlans.filter(
            plan => plan.completed
        ).length;


    return Math.round(
        (completed /
            studyPlans.length) *
        100
    );
}


// ============================================================
// DISPLAY PROGRESS
// ============================================================

function displayProgress() {

    const progress =
        calculateProgress();


    const progressHTML = `

        <div class="planner-progress">

            <div class="planner-progress-header">

                <strong>
                    📊 Study Progress
                </strong>

                <span>
                    ${progress}%
                </span>

            </div>

            <div class="planner-progress-bar">

                <div
                    class="planner-progress-fill"
                    style="width: ${progress}%"
                ></div>

            </div>

            <p>
                ${
                    studyPlans.filter(
                        plan => plan.completed
                    ).length
                }
                of
                ${studyPlans.length}
                plans completed
            </p>

        </div>

    `;


    if (studyPlans.length === 0) {
        return "";
    }


    return progressHTML;
}


// ============================================================
// DISPLAY PLANS
// ============================================================

function displayPlans() {

    studyPlanList.innerHTML =
        "";


    // EMPTY STATE
    if (studyPlans.length === 0) {

        studyPlanList.innerHTML = `

            <p class="no-plan">
                No study plan created yet.
            </p>

        `;

        return;
    }


    // PROGRESS
    studyPlanList.innerHTML =
        displayProgress();


    // PLAN CARDS
    studyPlans.forEach(
        (plan, index) => {

            // Support old saved plans
            if (
                typeof plan.completed !==
                "boolean"
            ) {

                plan.completed =
                    false;

            }


            const status =
                getDateStatus(
                    plan.date,
                    plan.completed
                );


            const planCard =
                document.createElement(
                    "div"
                );


            planCard.className =
                "study-plan-card";


            if (plan.completed) {

                planCard.classList.add(
                    "plan-completed"
                );

            }


            if (
                status.className ===
                "overdue"
            ) {

                planCard.classList.add(
                    "plan-overdue"
                );

            }


            planCard.innerHTML = `

                <div class="plan-info">

                    <div class="plan-title-row">

                        <h3>
                            📚
                            ${escapeHTML(
                                plan.subject
                            )}
                        </h3>

                        <span
                            class="
                                plan-status
                                ${status.className}
                            "
                        >
                            ${status.text}
                        </span>

                    </div>


                    <p>
                        ⏰
                        <strong>
                            Daily Study:
                        </strong>
                        ${escapeHTML(
                            plan.hours
                        )}
                        hour(s)
                    </p>


                    <p>
                        📅
                        <strong>
                            Target Date:
                        </strong>
                        ${escapeHTML(
                            plan.date
                        )}
                    </p>


                    <p>
                        🎯
                        <strong>
                            Priority:
                        </strong>
                        ${escapeHTML(
                            plan.priority
                        )}
                    </p>


                    <div class="plan-actions">

                        <button
                            type="button"
                            class="complete-plan-button"
                            onclick="togglePlanComplete(${index})"
                        >
                            ${
                                plan.completed
                                    ? "↩️ Mark Pending"
                                    : "✅ Mark Complete"
                            }
                        </button>


                        <button
                            type="button"
                            class="delete-plan-button"
                            onclick="deletePlan(${index})"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </div>

            `;


            studyPlanList.appendChild(
                planCard
            );

        }
    );
}


// ============================================================
// ADD PLAN
// ============================================================

if (addPlanButton) {

    addPlanButton.addEventListener(
        "click",
        function () {

            const subject =
                subjectInput.value.trim();

            const hours =
                studyHoursInput.value;

            const date =
                targetDateInput.value;

            const priority =
                priorityInput.value;


            // VALIDATION
            if (subject === "") {

                alert(
                    "Please enter a subject or topic."
                );

                subjectInput.focus();

                return;
            }


            if (hours === "") {

                alert(
                    "Please enter daily study hours."
                );

                studyHoursInput.focus();

                return;
            }


            if (
                Number(hours) <= 0 ||
                Number(hours) > 24
            ) {

                alert(
                    "Study hours must be between 1 and 24."
                );

                studyHoursInput.focus();

                return;
            }


            if (date === "") {

                alert(
                    "Please select a target date."
                );

                targetDateInput.focus();

                return;
            }


            // CREATE PLAN
            const newPlan = {

                subject:
                    subject,

                hours:
                    hours,

                date:
                    date,

                priority:
                    priority,

                completed:
                    false,

                createdAt:
                    new Date().toISOString()

            };


            studyPlans.unshift(
                newPlan
            );


            savePlans();

            displayPlans();

            clearForm();

        }
    );
}


// ============================================================
// CLEAR FORM BUTTON
// ============================================================

if (clearPlanButton) {

    clearPlanButton.addEventListener(
        "click",
        function () {

            // Don't show popup if form is already empty
            const isEmpty =
                subjectInput.value.trim() === "" &&
                studyHoursInput.value === "" &&
                targetDateInput.value === "" &&
                priorityInput.value === "medium";


            if (isEmpty) {
                return;
            }


            openPlannerModal(
                "clear-form"
            );

        }
    );
}


// ============================================================
// CLEAR FORM FUNCTION
// ============================================================

function clearForm() {

    subjectInput.value =
        "";

    studyHoursInput.value =
        "";

    targetDateInput.value =
        "";

    priorityInput.value =
        "medium";

    subjectInput.focus();
}


// ============================================================
// MARK PLAN COMPLETE / PENDING
// ============================================================

function togglePlanComplete(index) {

    const plan =
        studyPlans[index];


    if (!plan) {
        return;
    }


    plan.completed =
        !plan.completed;


    savePlans();

    displayPlans();
}


// ============================================================
// DELETE PLAN
// ============================================================

function deletePlan(index) {

    const plan =
        studyPlans[index];


    if (!plan) {
        return;
    }


    openPlannerModal(
        "delete-plan",
        index
    );
}


// ============================================================
// CONFIRM MODAL ACTION
// ============================================================

plannerConfirmButton.addEventListener(
    "click",
    function () {

        // ------------------------------------------
        // CLEAR FORM
        // ------------------------------------------

        if (
            plannerActionType ===
            "clear-form"
        ) {

            clearForm();

        }


        // ------------------------------------------
        // DELETE PLAN
        // ------------------------------------------

        else if (
            plannerActionType ===
                "delete-plan" &&
            plannerDeleteIndex !== null
        ) {

            studyPlans.splice(
                plannerDeleteIndex,
                1
            );


            savePlans();

            displayPlans();

        }


        closePlannerModal();

    }
);


// ============================================================
// CANCEL BUTTON
// ============================================================

plannerCancelButton.addEventListener(
    "click",
    function () {

        closePlannerModal();

    }
);


// ============================================================
// CLICK OUTSIDE MODAL
// ============================================================

plannerModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            plannerModal
        ) {

            closePlannerModal();

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
            plannerModal.classList.contains(
                "show"
            )
        ) {

            closePlannerModal();

        }

    }
);


// ============================================================
// INITIAL DISPLAY
// ============================================================

displayPlans();


// ============================================================
// UPDATE WHEN PAGE BECOMES ACTIVE
// ============================================================

window.addEventListener(
    "pageshow",
    displayPlans
);


document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            displayPlans();

        }

    }
);