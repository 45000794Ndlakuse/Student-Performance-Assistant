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