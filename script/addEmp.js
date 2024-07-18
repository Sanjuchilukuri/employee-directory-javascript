//This function switches to Add Employee Form
function displayAddEmployeeForm() {
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("employeeModel").style.display = "block";
}

//This function for update form image
function updatFormImage(event) {
  const inputImage = document.getElementById("img");
  const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      inputImage.src = reader.result;
  };
}

//This function works onSubmit Employee details
function onSubmitEmployee(event) {
  event.preventDefault();
  let employeeData = Object.fromEntries(
    new FormData(document.getElementById("form"))
  );
  if (isvalidForm(employeeData)) {
    if (isEmpNoExistsInDB(employeeData["empno"])) {
      document.getElementById("empno").classList.add("show");
      document.getElementById("empnoError").innerText = `${employeeData["empno"]} is already existed`;
    } else {
      let newEmployee = generateEmployeeFromForm(employeeData);
      saveEmployee(newEmployee);
      showNotification("Employee Added", "green");
    }
  }
}

// This Function for form validation
function isvalidForm(employeeData) {
  let isValid = true;
  Array.from(document.getElementsByClassName("error")).forEach(
    (error) => (error.style.display = "none"));
  Array.from(document.getElementsByClassName("input-error")).forEach(
    (error) => (error.classList.remove("input-error")));
  for (let field in employeeData) {
    if (!employeeData[field].trim() && isRequiredField(field)) {
      isValid = false;
      document.getElementById(field).classList.add("input-error");
      document.getElementById(field).classList.add("show");
    }
  }
  return isValid;
}

// This Function for to check is required field or not on validation
function isRequiredField(field) {
  const nonRequiredFields = [
    "dob",
    "phno",
    "location",
    "jobTitle",
    "department",
    "manager",
    "project",
  ];
  return !nonRequiredFields.includes(field);
}

// To check the empno is alredy in DB or not
function isEmpNoExistsInDB(empno) {
  return employeeRecords.allEmployees.some((employee) => employee["empno"] == empno);
}

// To generate employee from form
function generateEmployeeFromForm(newEmployee) {
  newEmployee.img = document.getElementById("img").src;
  newEmployee.active = "Active";
  newEmployee.ischecked = false;
  newEmployee.isChekedInRole = false;
  // newEmployee.isChekedInRole = false;
  return newEmployee;
}

// To update the employee in DB
function saveEmployee(newEmployee) {
  employeeRecords.allEmployees.push(newEmployee);
  localStorage.setItem("data", JSON.stringify(employeeRecords.allEmployees));
}

// This function for redirect the window to homepage
function redirectWindow() {
  window.location.href = "../pages/index.html";
}

//To show notification
function showNotification(toasterText, bgColor) {
  let p = document.createElement("p");
  p.innerHTML = toasterText;
  p.classList.add("active-employee-toggle");
  p.style.backgroundColor = bgColor;
  document.getElementById("container").appendChild(p);
  setTimeout(function () {
    p.remove();
    window.location.href = "../pages/index.html";
  }, 1300);
}

// To edit already existed employee
function editEmployee(empid) {
  fillEmployeeDataTOForm(empid);
  document.getElementById("empno").disabled = true;
  let formSubmitBtn = document.getElementById("formSubmitBtn");
  formSubmitBtn.onclick = () => {
    deleteEmployeeRecord(empid);
    document.getElementById("empno").disabled = false
  };
}

// to view all employee details
function viewEmployee(empid) {
  fillEmployeeDataTOForm(empid);
  for (let field in employeeRecords.allEmployees.find(e => e.empno == empid)) {
    let element = document.getElementById(field);
    if (element) element.disabled = true;
  }
  document.getElementById("formSubmitBtn").style.display = "none";
}

// To fill employee form by using empid 
function fillEmployeeDataTOForm(empid) {
  displayAddEmployeeForm();
  let employee = employeeRecords.allEmployees.find(e => e.empno == empid);
  for (let field in employee) {
    let element = document.getElementById(field);
    if (element) {
      if (field == 'img') element.src = employee[field];
      else element.value = employee[field];
    }
  }
}