import { Student } from "../model/student.js";
import { studentsAPI } from "../services/databaseURL.js";
import { isArrayOfObject } from "../util/utilities.js";

// ----- Global variables  -----

const tableRow = document.querySelector(".table tbody");
const searchBar = document.querySelector("#searchBar");

// ----- Modal - Adding new student -----
const imageField = document.querySelector("#input-image-url");
const nameField = document.querySelector("#input-name");
const dobField = document.querySelector("#input-dob");
const pobField = document.querySelector("#input-place-of-birth");
const genderRadios = document.getElementsByName("input-radio");
const religionField = document.querySelector("#religionSelect");
const ethnicityField = document.querySelector("#ethnicitySelect");
const nationalityField = document.querySelector("#nationalitySelect");
const emailField = document.querySelector("#input-email");
const phoneField = document.querySelector("#input-phone");
const addressField = document.querySelector("#input-address");
const addBtn = document.querySelector("#model-add-btn");

// ----- Other variables  -----
let activeIndex = 0; // Keeping track of the current selected row
let studentList;
let count = 0; // counting the rows when rendering the table
let placeHolderImage =
  "https://sns-journal.ru/site/templates/images/avatar-placeholder.gif";

// ----- Initialization -----
document.addEventListener("DOMContentLoaded", start);

// ----- Event Listeners -----

tableRow.addEventListener("click", (e) => {
  let row = e.target.closest("tr");
  let studentId = row.id;

  if (e.target.matches("#deleteBtn")) {
    handleDeleteStudent(e, studentId);
  } else if (row) {
    // Highlight the selected row
    tableRow.children[activeIndex].classList.remove("table-active");
    activeIndex = [...tableRow.children].indexOf(row);
    row.classList.add("table-active");

    // Render the student's info in selected row
    let filteredList = studentList.filter((e) => studentId * 1 === e.id);

    renderStudentInfo(filteredList[0]);
  }
});

searchBar.addEventListener("input", (e) => {
  let userSearch = e.target.value.toLowerCase();
  let filteredList = studentList.filter((e) => {
    return (
      e["name"].toLowerCase().includes(userSearch) ||
      e["gender"].toLowerCase().includes(userSearch) ||
      e["email"].toLowerCase().includes(userSearch) ||
      e.ethnicity.toLowerCase().includes(userSearch)
    );
  });
  renderStudentTable(filteredList);
});

// Event handler for adding new student to the table
addBtn.addEventListener("click", (e) => {
  let isGenderSelected = false;
  let genderValue;

  let student = new Student();

  // Getting user inputs
  const inputImageURL = imageField.value.trim();
  const inputName = nameField.value.trim();
  const inputDob = dobField.value.trim(); // get date of birth from user
  const inputPob = pobField.value.trim(); // get place of birth from user
  const inputReligion = religionField.value.trim();
  const inputEthnicity = ethnicityField.value.trim();
  const inputNationality = nationalityField.value.trim();
  const inputEmail = emailField.value.trim();
  const inputPhone = phoneField.value.trim();
  const inputAddress = addressField.value.trim();

  e.preventDefault();

  // Getting radio input
  for (const radio of genderRadios) {
    if (radio.checked) {
      isGenderSelected = true;
      genderValue = radio.value;
      break;
    }
  }

  // Validate user inputs

  let validatedName = isNameValid(inputName);
  let validatedDob = isDobValid(inputDob);
  let validatedGender = isGenderValid(genderValue);
  let validatedEmail = isEmailValid(inputEmail);
  let validatedPhone = isPhoneValid(inputPhone);
  let validatedAddress = isAddressValid(inputAddress);

  // Handle required inputs
  if (
    validatedName == true &&
    validatedGender == true &&
    validatedDob == true &&
    validatedEmail == true &&
    validatedPhone == true &&
    validatedAddress == true
  ) {
    student.image = inputImageURL;
    student.name = inputName;
    student.dateOfBirth = inputDob;
    student.placeOfBirth = inputPob;
    student.gender = genderValue;
    student.religion = inputReligion;
    student.email = inputEmail;
    student.address = inputAddress;
    student.ethnicity = inputEthnicity;
    student.nationality = inputNationality;
    student.phoneNumber = inputPhone;
    handleCreateStudent(student);
    resetModalForm();
  }
});

// ----- Helper Functions -----

//  Validation Functions
function isNameValid(value) {
  let namePattern = /^[A-Za-z\s\-éÉ]{2,}$/;
  let alert = document.querySelector(
    '[data-title="modal-name-field"] #validation-feedback'
  );

  if (namePattern.test(value)) {
    alert.style.display = "none";
    alert.innerText = "";
    nameField.classList.remove("error");
    return true;
  } else if (value == "") {
    alert.style.display = "block";
    alert.innerText = "Please enter a name";
    nameField.classList.add("error");
  } else if (value.length == 1) {
    alert.style.display = "block";
    alert.innerText = "Name should be at least 2 characters long";
    nameField.classList.add("error");
  } else {
    alert.style.display = "block";
    alert.innerText = "Invalid Name";
    nameField.classList.add("error");
  }

  return false;
}

function isGenderValid(value) {
  let alert = document.querySelector(
    '[data-title="modal-gender-field"] #validation-feedback'
  );

  if (value == undefined) {
    alert.style.display = "block";
    alert.innerText = "Please choose a gender";
  }

  return true;
}

function isDobValid(value) {
  let alert = document.querySelector(
    '[data-title="modal-dob-field"] #validation-feedback'
  );

  if (value == "") {
    alert.style.display = "block";
    alert.innerText = "Please enter a date";
    dobField.classList.add("error");
    return false;
  }

  return true;
}

function isEmailValid(value) {
  let emailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  let alert = document.querySelector(
    '[data-title="modal-email-field"] #validation-feedback'
  );

  if (emailPattern.test(value)) {
    alert.style.display = "none";
    alert.innerText = "";
    emailField.classList.remove("error");
    return true;
  } else if (value == "") {
    alert.style.display = "block";
    alert.innerText = "Please enter an email ";
    emailField.classList.add("error");
  } else {
    alert.style.display = "block";
    alert.innerText = "Invalid Email";
    emailField.classList.add("error");
  }

  return false;
}

function isPhoneValid(value) {
  let phonePattern = /^[0-9]{10}$/;
  let alert = document.querySelector(
    '[data-title="modal-phone-field"] #validation-feedback'
  );

  if (phonePattern.test(value)) {
    alert.style.display = "none";
    alert.innerText = "";
    phoneField.classList.remove("error");
    return true;
  } else if (value == "") {
    alert.style.display = "block";
    alert.innerText = "Please enter a phone ";
    phoneField.classList.add("error");
  } else {
    alert.style.display = "block";
    alert.innerText = "Invalid phone number";
    phoneField.classList.add("error");
  }

  return false;
}

function isAddressValid(value) {
  let alert = document.querySelector(
    '[data-title="modal-address-field"] #validation-feedback'
  );
  let houseNumber = value.substring(0, value.indexOf(" "));
  let arrayAddress = value.substring(value.indexOf(" ")).split(",");
  arrayAddress.unshift(houseNumber);

  if (value == "") {
    alert.style.display = "block";
    alert.innerText = "Please enter a saigon address";
    alert.style.color = "red";
    addressField.classList.add("error");
    return false;
  } else if (arrayAddress.length < 5) {
    alert.style.display = "block";
    alert.innerText = "Invalid address";
    alert.style.color = "red";
    addressField.classList.add("error");
    return false;
  }

  return true;
}

function resetModalForm() {
  document.querySelector("#input-image-url").value = "";
  document.querySelector("#input-name").value = "";
  document.querySelector("#input-dob").value = ""; // get date of birth
  document.querySelector("#input-place-of-birth").value = ""; // get place of birth
  document.querySelector("#radio-male").checked = false;
  document.querySelector("#radio-female").checked = false;
  document.querySelector("#religionSelect").value = "";
  document.querySelector("#ethnicitySelect").value = "";
  document.querySelector("#nationalitySelect").value = "";
  document.querySelector("#input-email").value = "";
  document.querySelector("#input-phone").value = "";
  document.querySelector("#input-address").value = "";
}

//  Functions for CRUD

async function getStudents() {
  const response = await fetch(studentsAPI);
  const data = await response.json();
  return data;
}

async function handleDeleteStudent(event, id) {
  event.preventDefault();
  let url = studentsAPI + "/" + id;
  let options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(url, options);
  let deleteRow = document.querySelector(`tbody #${id}`);
  deleteRow.remove();
}

async function handleCreateStudent(data) {
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let response = await fetch(studentsAPI, options);
  let students = await response.json();
  renderStudentTable(students);
}

//  Functions for Rendering

function renderStudentTable(data) {
  const studentTable = document.querySelector(".student-list tbody");
  if (data !== undefined) {
    const table = data.map(function (student) {
      count++;
      return `
            <tr id="${student["id"]}">
              <th scope="row">${count}</th>
              <td>${student.name}</td>
              <td>${student.gender}</td>
              <td>${student.email}</td>
              <td>${student.ethnicity}</td>
              <td><i class="fas fa-minus-circle" id="deleteBtn" "></i></td>
              <td><i class="fas fa-pen"></i></td>
            </tr>
            `;
    });
    count = 0;
    studentTable.innerHTML = table.join("");
  } else {
    console.log("renderStudentTable ~ data: ", data);
  }
}

function renderStudentInfo(data) {
  const studentInfo = document.querySelector(".student-info");

  // Replace values that are "" or undefined to N/A
  if (isArrayOfObject(data)) {
    data.forEach((object) => {
      object = formatObjectValue(object);
    });
  } else {
    data = formatObjectValue(data);
  }

  //Covert obj to html then render the data
  let info = `
      <div class="avatar">
          <figure>
            <img src="${data.image}"/>
          </figure>
          <h2>${data.name}</h2>
      </div>
      <div class="personal-info">
          <div><strong>Gender: </strong>${data.gender}</div>
          <div><strong>Date Of Birth:  </strong>${data.dateOfBirth}</div>
          <div><strong>Place of birth:  </strong>${data.placeOfBirth}</div>
            <div><strong>Religion:  </strong>${data.religion}</div>
            <div><strong>Email: </strong>${data.email}</div>
            <div><strong>Phone: </strong>${data.phoneNumber}</div>
          <div><strong>Address: </strong>${data.address}</div>
          <div><strong>Ethnicity: </strong>${data.ethnicity}</div>
          <div><strong>Nationality: </strong>${data.nationality}</div>
        </div>
      `;

  studentInfo.innerHTML = info;
}

//  Functions for Sorting

function handleSortingA_Z() {
  let sortedList = studentList.slice().sort((a, b) => {
    let nameA = a["Hero name"];
    let nameB = b["Hero name"];
    return nameA.localeCompare(nameB);
  });
  renderStudentTable(sortedList);
}

function handleSortingZ_A() {
  let sortedList = studentList.slice().sort((a, b) => {
    let nameA = a["Hero name"];
    let nameB = b["Hero name"];
    return nameB.localeCompare(nameA);
  });
  renderStudentTable(sortedList);
}

// Function for formatting object's values

function formatObjectValue(object) {
  Object.keys(object).forEach((key) => {
    if (object[key] === undefined || object[key] === "") {
      object[key] == "N/A";
    }

    if (object["image"] === undefined || object["image"] === "") {
      object["image"] = placeHolderImage;
    }
  });

  return object;
}

//  Main Function

async function start() {
  studentList = await getStudents();
  renderStudentTable(studentList);
  renderStudentInfo(studentList[0]);
  console.table(studentList);
}
