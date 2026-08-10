console.log("Student Performance Assistant Loaded.");

// ==========================================
// Journey Introduction Model
// ==========================================

//const journeyModalElement = document.getElementById("journeyModal");

//if (journeyModalElement) {
//
//    const journeyModal = new bootstrap.Modal(journeyModalElement);

//    journeyModal.show();

//}

document.addEventListener("DOMContentLoaded", () => {

    const category = document.getElementById("assessmentCategory");
    const quantityContainer = document.getElementById("quantityContainer");

    if (!category) return;

    category.addEventListener("change", function () {

        const multipleCategories = [
            "Class Test",
            "Assignment",
            "Practical Assignment",
            "Attendance"
        ];

        if (multipleCategories.includes(this.value)) {

            quantityContainer.style.display = "block";

        } else {

            quantityContainer.style.display = "none";

        }

    });

});

// ==========================================
// Assessment Builder
// ==========================================

const addButton = document.getElementById("addAssessment");
const tableBody = document.getElementById("assessmentTableBody");

const assessmentCategory = document.getElementById("assessmentCategory");
const assessmentQuantity = document.getElementById("assessmentQuantity");
const assessmentWeight = document.getElementById("assessmentWeight");

let assessments = [];

if (addButton) {

    addButton.addEventListener("click", () => {

        const category = assessmentCategory.value;
        const quantity = assessmentQuantity.value || 1;
        const weight = assessmentWeight.value;

        if (!category) {

            alert("Please select an assessment category.");

            return;

        }

        if (!weight) {

            alert("Please enter the weighting.");

            return;

        }

        if (assessments.some(item => item.category === category)) {

            alert("This assessment category has already been added.");

            return;

        }

        assessments.push({

            category,
            quantity,
            weight

        });

        // Remove selected category from the dropdown

        const selectedOption =
            assessmentCategory.querySelector(
                `option[value="${category}"]`
            );

        if (selectedOption) {

            selectedOption.remove();

        }

        renderAssessmentTable();

        assessmentCategory.selectedIndex = 0;
        assessmentQuantity.value = "";
        assessmentWeight.value = "";
        quantityContainer.style.display = "none";

    });

}

//const selectedOption =
//assessmentCategory.querySelector(
//    `option[value="${category}"]`
//);

//if (selectedOption) {
//
//    selectedOption.remove();

//}

function renderAssessmentTable() {

    tableBody.innerHTML = "";

    assessments.forEach((assessment, index) => {

        tableBody.innerHTML += `

        <tr>

            <td>${assessment.category}</td>

            <td>${assessment.quantity}</td>

            <td>${assessment.weight}%</td>

            <td>

                <button
                    class="btn btn-sm btn-warning edit-btn"
                    data-index="${index}">

                    Edit

                </button>

                <button
                    class="btn btn-sm btn-danger delete-btn"
                    data-index="${index}">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

    attachButtonEvents();

}

function attachButtonEvents() {

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.onclick = function () {

            const index = this.dataset.index;

            const removedAssessment = assessments[index];

            const option = document.createElement("option");

            option.value = removedAssessment.category;

            option.textContent = removedAssessment.category;

            assessmentCategory.appendChild(option);

            assessments.splice(index, 1);

            if (assessments.length === 0) {

                tableBody.innerHTML = `

                <tr>

                    <td colspan="4" class="text-center text-muted">

                        No assessments have been added yet.

                    </td>

                </tr>

                `;

                return;

            }

            renderAssessmentTable();

        };

    });

}

// ==========================================
// Continue To Phase 2
// ==========================================

const continueButton =
    document.getElementById("continuePhase2");

if (continueButton) {

    continueButton.addEventListener("click", () => {

        validatePhaseOne();

    });

}

function validatePhaseOne() {

    const firstName =
        document.getElementById("firstName").value.trim();

    const surname =
        document.getElementById("surname").value.trim();

    const studentNumber =
        document.getElementById("studentNumber").value.trim();

    const module =
        document.getElementById("module").value.trim();

    if (
        !firstName ||
        !surname ||
        !studentNumber ||
        !module
    ) {

        alert(
            "Please complete all student information before continuing."
        );

        return;
    }

    if (assessments.length === 0) {

        alert(
            "Please add at least one assessment before continuing."
        );

        return;
    }

    const totalWeight =
        assessments.reduce(
            (sum, item) =>
                sum + Number(item.weight),
            0
        );

    if (totalWeight !== 100) {

        alert(
            `Total weighting is currently ${totalWeight}%.\n\nThe assessment plan must equal exactly 100%.`
        );

        return;
    }

    showConfirmationModal();

}

function showConfirmationModal() {

    const content =
        document.getElementById(
            "confirmationContent"
        );

    const firstName =
        document.getElementById("firstName").value;

    const surname =
        document.getElementById("surname").value;

    const studentNumber =
        document.getElementById("studentNumber").value;

    const module =
        document.getElementById("module").value;

    let tableRows = "";

    assessments.forEach(item => {

        tableRows += `

    <tr>

        <td>${item.category}</td>

        <td>${item.quantity}</td>

        <td>${item.weight}%</td>

    </tr>

    `;

    });

    // ==========================================
    // Save Model Before Entering Phase 2
    // ==========================================

    const confirmContinue =
        document.getElementById("confirmContinue");

    if (confirmContinue) {

        confirmContinue.addEventListener("click", () => {

            const studentModel = {

                firstName:
                    document.getElementById("firstName").value,

                surname:
                    document.getElementById("surname").value,

                studentNumber:
                    document.getElementById("studentNumber").value,

                module:
                    document.getElementById("module").value,

                assessments

            };

            localStorage.setItem(
                "studentModel",
                JSON.stringify(studentModel)
            );

            window.location.href = "/phase2";

        });

    }

    content.innerHTML = `

        <h5>Student Information</h5>

        <p>

        <strong>Name:</strong>
        ${firstName} ${surname}

        <br>

        <strong>Student Number:</strong>
        ${studentNumber}

        <br>

        <strong>Module:</strong>
        ${module}

        </p>

        <hr>

        <h5>Assessment Plan</h5>

        <table class="table">

            <thead>

                <tr>

                    <th>Assessment</th>

                    <th>Quantity</th>

                    <th>Weight</th>

                </tr>

            </thead>

            <tbody>

                ${tableRows}

            </tbody>

        </table>

        <p>

        Please verify that this assessment plan matches the assessment plan provided by your lecturer.

        </p>

    `;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "confirmModelModal"
            )
        );

    modal.show();

}

// ==========================================
// Phase 2 - Load Student Model
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const storedModel =
        localStorage.getItem("studentModel");

    if (!storedModel) {

        return;

    }

    const studentModel = JSON.parse(storedModel);

    // -----------------------------
    // Populate Student Information
    // -----------------------------

    const firstName =
        document.getElementById("phase2FirstName");

    const surname =
        document.getElementById("phase2Surname");

    const studentNumber =
        document.getElementById("phase2StudentNumber");

    const module =
        document.getElementById("phase2Module");

    if (firstName) {

        firstName.value = studentModel.firstName;
        surname.value = studentModel.surname;
        studentNumber.value = studentModel.studentNumber;
        module.value = studentModel.module;

    }

    // -----------------------------
    // Build Marks Table
    // -----------------------------

    const tableBody =
        document.getElementById("marksTableBody");

    if (!tableBody) {

        return;

    }

    tableBody.innerHTML = "";

    studentModel.assessments.forEach(item => {

        for (let i = 1; i <= item.quantity; i++) {

            tableBody.innerHTML += `

            <tr>

                <td>

                    ${item.category}
                    ${item.quantity > 1 ? i : ""}

                </td>

                <td>

                    ${i === 1 ? item.weight + "%" : ""}

                </td>

                <td>

                    <input
                        type="number"
                        class="form-control mark-input"
                        data-weight="${item.weight / item.quantity}"
                        min="0"
                        max="100"
                        placeholder="0 - 100">

                </td>

            </tr>

            `;

        }

    });

});

// ==========================================
// Phase 2 - Generate Academic Profile
// ==========================================

const generateButton =
    document.getElementById("generateModel");

if (generateButton) {

    generateButton.addEventListener("click", generateAcademicProfile);

}

function generateAcademicProfile() {

    const studentModel =
        JSON.parse(localStorage.getItem("studentModel"));

    const markInputs =
        document.querySelectorAll(".mark-input");

    let totalParticipation = 0;

    let completed = 0;

    let remaining = 0;

    let inputIndex = 0;

    let remainingWeight = 0;

    const remainingAssessmentCounts = {};

    const remainingAssessmentDetails = [];

    studentModel.assessments.forEach(item => {

        const weightPerAssessment =
            Number(item.weight) / item.quantity;

        let remainingForCategory = 0;

        for (let i = 0; i < item.quantity; i++) {

            const value =
                markInputs[inputIndex].value;

            if (value !== "") {

                completed++;

                totalParticipation +=
                    (Number(value) / 100) *
                    weightPerAssessment;

            }

            else {

                remaining++;

                remainingWeight += weightPerAssessment;

                remainingForCategory++;

            }

            inputIndex++;

        }

        remainingAssessmentCounts[item.category] =
            remainingForCategory;

        remainingAssessmentDetails.push({

            category: item.category,

            quantity: item.quantity,

            remaining: remainingForCategory,

            weight: Number(item.weight),

            weightPerAssessment: weightPerAssessment

        });

    });
    let standing = "";

    if (totalParticipation >= 75) {

        standing = "Excellent";

    }

    else if (totalParticipation >= 60) {

        standing = "Good";

    }

    else if (totalParticipation >= 50) {

        standing = "Satisfactory";

    }

    else {

        standing = "At Risk";

    }

    // ==========================================
    // Save Academic Profile
    // ==========================================

    const academicProfile = {

        participationMark: totalParticipation,

        academicStanding: standing,

        completedAssessments: completed,

        remainingAssessments: remaining,

        remainingWeight: remainingWeight

    };

    localStorage.setItem(

        "academicProfile",

        JSON.stringify(academicProfile)

    );

    localStorage.setItem(

        "remainingAssessments",

        JSON.stringify(
            remainingAssessmentCounts
        )

    );

    localStorage.setItem(

        "remainingAssessmentDetails",

        JSON.stringify(
            remainingAssessmentDetails
        )

    );

    // ==========================================
    // Build Individual Remaining Assessment Sessions
    // ==========================================

    const remainingAssessmentSessions = [];

    remainingAssessmentDetails.forEach(item => {

        for (let i = 1; i <= item.remaining; i++) {

            remainingAssessmentSessions.push({

                category:
                    item.category,

                assessmentNumber:
                    i,

                weightPerAssessment:
                    item.weightPerAssessment

            });

        }

    });

    localStorage.setItem(

        "remainingAssessmentSessions",

        JSON.stringify(
            remainingAssessmentSessions
        )

    );

    document.getElementById("modelResults").innerHTML = `

        <div class="alert alert-success">

            <h4>Academic Profile</h4>

            <hr>

            <p>
                <strong>Current Participation Mark:</strong>
                ${totalParticipation.toFixed(2)}%
            </p>

            <p>
                <strong>Academic Standing:</strong>
                ${standing}
            </p>

            <p>
                <strong>Completed Assessments:</strong>
                ${completed}
            </p>

            <p>
                <strong>Remaining Assessments:</strong>
                ${remaining}
            </p>

        </div>

    `;

    // ==========================================
    // Generate Improvement Scenarios
    // ==========================================

    // ==========================================
    // Algorithm 2
    // Build Participation Scenario Matrix (q)
    // ==========================================

    const participationScenarioMatrix = [

        {

            totalRemainingAssessments: remaining,

            remainingWeight: remainingWeight,

            assessments: remainingAssessmentDetails

                .filter(item => item.remaining > 0)

                .map(item => ({

                    category: item.category,

                    remaining: item.remaining,

                    weightPerAssessment:
                        item.weightPerAssessment

                }))

        }

    ];

    localStorage.setItem(

        "participationScenarioMatrix",

        JSON.stringify(
            participationScenarioMatrix
        )

    );

    // ==========================================
    // Algorithm 2
    // Generate 2^s Participation Scenarios
    // ==========================================

    const improvementScenarios = [];

    const s =
        remainingAssessmentSessions.length;

    const totalScenarios =
        Math.pow(2, s);

    for (
        let scenarioNumber = 0;
        scenarioNumber < totalScenarios;
        scenarioNumber++
    ) {

        const participationScenario = [];

        for (let i = 0; i < s; i++) {

            const participated =
                (scenarioNumber & (1 << i)) !== 0;

            participationScenario.push({

                category:
                    remainingAssessmentSessions[i].category,

                assessmentNumber:
                    remainingAssessmentSessions[i]
                        .assessmentNumber,

                weightPerAssessment:
                    remainingAssessmentSessions[i]
                        .weightPerAssessment,

                participated:
                    participated

            });

        }

        improvementScenarios.push({

            scenario:
                scenarioNumber + 1,

            participation:
                participationScenario

        });

    }


    // ==========================================
    // Algorithm 2
    // Evaluate Participation Scenarios
    // ==========================================

    const evaluatedScenarios = [];

    improvementScenarios.forEach(scenario => {

        let scenarioWeight = 0;

        scenario.participation.forEach(assessment => {

            if (assessment.participated) {

                scenarioWeight +=
                    Number(
                        assessment.weightPerAssessment
                    );

            }

        });

        const improvement =
            scenarioWeight;

        const targetParticipation =
            totalParticipation + improvement;

        evaluatedScenarios.push({

            scenario:
                scenario.scenario,

            participation:
                scenario.participation,

            scenarioWeight:
                Number(
                    scenarioWeight.toFixed(2)
                ),

            improvement:
                Number(
                    improvement.toFixed(2)
                ),

            targetParticipation:
                Number(
                    targetParticipation.toFixed(2)
                )

        });

    });


    // ==========================================
    // Save Algorithm 2 Results
    // ==========================================

    localStorage.setItem(

        "improvementScenarios",

        JSON.stringify(
            evaluatedScenarios
        )

    );

    // ==========================================
// Algorithm 2
// Remove Duplicate Scenario Outcomes
// ==========================================

const uniqueScenarios = [];

const scenarioKeys = new Set();

evaluatedScenarios.forEach(scenario => {

    const key =
        scenario.scenarioWeight.toFixed(2);

    if (!scenarioKeys.has(key)) {

        scenarioKeys.add(key);

        uniqueScenarios.push(scenario);

    }

});

localStorage.setItem(

    "uniqueImprovementScenarios",

    JSON.stringify(
        uniqueScenarios
    )

);

// ==========================================
// Algorithm 2
// Calculate Required Marks for Scenarios
// ==========================================

const scenariosWithRequiredMarks = [];

uniqueScenarios.forEach(scenario => {

    // Scenario with no participating
    // remaining assessments
    if (scenario.scenarioWeight === 0) {

        scenariosWithRequiredMarks.push({

            ...scenario,

            requiredMark: null

        });

        return;

    }

    const requiredMark =

        (
            scenario.improvement /
            scenario.scenarioWeight
        ) * 100;

    scenariosWithRequiredMarks.push({

        ...scenario,

        requiredMark:
            Number(
                requiredMark.toFixed(2)
            )

    });

});

localStorage.setItem(

    "scenariosWithRequiredMarks",

    JSON.stringify(
        scenariosWithRequiredMarks
    )

);


    // ==========================================
    // Show Improvement Options
    // ==========================================

    document
        .getElementById("viewImprovementOptions")
        .style.display = "inline-block";

    //localStorage.setItem(

    //    "improvementScenarios",

    //    JSON.stringify(
    //        improvementScenarios
    //    )

    //);


}





// ==========================================
// Phase 3 - Load Academic Profile
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const storedStudent =
        localStorage.getItem("studentModel");

    const storedProfile =
        localStorage.getItem("academicProfile");



    //const recommendationTable =
    //    document.getElementById(
    //        "recommendationTable"
    //    );

    //const targets = [

    //    50,

    //    60,

    //    75

    //];

    const remaining =
        JSON.parse(
            localStorage.getItem("remainingAssessments")
        );

    const summary =
        document.getElementById(
            "remainingAssessmentsSummary"
        );

    if (remaining && summary) {

        summary.innerHTML = "";

        Object.entries(remaining).forEach(([category, count]) => {

            summary.innerHTML += `

            <p>

                <strong>${category}:</strong>
                ${count}

            </p>

        `;

        });

    }
    if (!storedStudent || !storedProfile) {

        return;

    }

    const student =
        JSON.parse(storedStudent);

    const profile =
        JSON.parse(storedProfile);

    // --------------------------------------
    // Check that we are on Phase 3
    // --------------------------------------

    const phase3FirstName =
        document.getElementById("phase3FirstName");

    if (!phase3FirstName) {

        return;

    }



    // --------------------------------------
    // Populate Student Summary
    // --------------------------------------

    phase3FirstName.value =
        student.firstName;

    document.getElementById("phase3Surname").value =
        student.surname;

    document.getElementById("phase3StudentNumber").value =
        student.studentNumber;

    document.getElementById("phase3Module").value =
        student.module;

    // --------------------------------------
    // Populate Academic Profile
    // --------------------------------------

    document.getElementById("currentParticipation").innerHTML =

        profile.participationMark.toFixed(2) + "%";

    // --------------------------------------
    // Academic Standing Badge
    // --------------------------------------

    const standingBadge =
        document.getElementById("academicStanding");

    standingBadge.innerHTML =
        profile.academicStanding;



    // --------------------------------------
    // Progress Bar
    // --------------------------------------

    const progressBar =
        document.getElementById("participationProgress");

    progressBar.style.width =
        profile.participationMark + "%";

    progressBar.innerHTML =
        profile.participationMark.toFixed(1) + "%";

    progressBar.className = "progress-bar";

    if (profile.participationMark >= 75) {

        progressBar.classList.add("bg-success");

    }
    else if (profile.participationMark >= 50) {

        progressBar.classList.add("bg-warning");

    }
    else {

        progressBar.classList.add("bg-danger");

    }

    //document.getElementById("minimumImprovement").innerHTML = "0%";

    //document.getElementById("maximumImprovement").innerHTML =
    //   profile.remainingWeight.toFixed(2) + "%";

    const scenarios =
        JSON.parse(
            localStorage.getItem("improvementScenarios")
        );

    console.log(scenarios);

    document.getElementById("minimumImprovement").innerHTML =
        scenarios[0].improvement.toFixed(2) + "%";

    document.getElementById("maximumImprovement").innerHTML =
        scenarios[scenarios.length - 1].improvement.toFixed(2) + "%";



});

// ==========================================
// Show Improvement Options
// ==========================================

const showOptions =
    document.getElementById("showOptions");

if (showOptions) {

    showOptions.addEventListener("click", () => {

        generateImprovementOptions();

    });

}

function generateImprovementOptions() {

    //const scenarios =

    //    JSON.parse(localStorage.getItem(
    //        "improvementScenarios"
    //    )

    //);

    //const plansContainer =

    //    document.getElementById(
    //        "improvementPlans"
    //    );

    //if (!scenarios || !plansContainer) {

    //    return;

    //}
    JSON.parse(localStorage.getItem("studentModel"))



    console.log(scenarios);

}
