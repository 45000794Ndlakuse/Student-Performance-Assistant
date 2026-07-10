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

        renderAssessmentTable();

        assessmentCategory.selectedIndex = 0;
        assessmentQuantity.value = "";
        assessmentWeight.value = "";
        quantityContainer.style.display = "none";

    });

}

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