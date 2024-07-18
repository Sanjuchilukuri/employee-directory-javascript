(function intilizerInRoles() {
  fetchCardDataFromJson();
}());

//This function switches to Add Employee Form
function displayAddRoleForm() {
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("addRoleSection").style.display = "block";
}

// To display filtered employees 
function displaySeletedRoleEmployees(selectedData) {
  let Wrapper = document.getElementById("AddRoleFormWrapper");
  Wrapper.innerHTML = "";
  selectedData.forEach((employee) => {
    Wrapper.innerHTML += `<div class="employee-row">
      <div>
        <img src = ${employee.img} />
        <p>${employee.firstname} ${employee.lastname}</p>
      </div>
      <input type=checkbox onchange=toggleCheckedPropertyInRoles('${employee.empno}')>
    </div>`;
  });
}

// Event Listener on department
function filterEmployeesOnDept(event) {
  let selectedDepartmentEmployees = employeeRecords.allEmployees.filter((employee) => {
    return employee.department == event.target.value;
  });
  employeeRecords.filteredEmployeesInRoles = selectedDepartmentEmployees;
  displaySeletedRoleEmployees(selectedDepartmentEmployees);
}

// Event Listener for search Employees
function searchEmployee(employeeSearchBar) {
  let enteredString = employeeSearchBar.value.toUpperCase();
  let filteredData = employeeRecords.filteredEmployeesInRoles.filter((ele) => {
    return ele.firstname.toUpperCase().includes(enteredString);
  });
  displaySeletedRoleEmployees(filteredData);
}

function addRole() {
  let role = document.getElementById("roleName");
  if (role.value) {
    employeeRecords.allEmployees.forEach(employee => {
      if (employee.isChekedInRole) {
        employee.jobTitle = role.value;
        employee.isChekedInRole = false;
        saveEmployeeRecordsInDB(employeeRecords.allEmployees);
      }
    });
    if (!options.jobTitle.some(title => title == role.value)) {
      options.jobTitle.push(role.value);
      saveOptionsInDB();
      intilizeOptions();
    }
  }
}

function toggleCheckedPropertyInRoles(empid) {
  employeeRecords.allEmployees.forEach(employee => {
    if (employee.empno == empid) employee.isChekedInRole = !employee.isChekedInRole;
  });
}

function dynamicCardFromJson(cardsData) {
  const cardsWrapper = document.getElementById("cardsWrapper");
  cardsData.forEach(card => {
    cardsWrapper.innerHTML += `<div class="card">
      <div class="text-icon">
        <p>${card.Role}</p>
        <img src="../assets/edit.svg" alt="edit icon" />
      </div>
      <div class="about">
        <div class="department">
          <div class="department-text">
            <img src="../assets/employee.svg" alt="department icon" />
            <p>Department</p>
          </div>
          <p>${card.Department}</p>
        </div>
        <div class="location">
          <div class="location-text">
            <img src="../assets/location.svg" alt="location icon" />
            <p>Location</p>
          </div>
          <p>${card.Location}</p>
        </div>
        <div class="total-employees">
          <p>Total Employees</p>
          <div class="img-container">
            <img src="../assets/profiles/image-eight.webp" alt="employee icon"/>
            <img src="../assets/profiles/image-eleven.webp" alt="employee icon"/>
            <img src="../assets/profiles/image-five.webp" alt="employee icon"/>
            <img src="../assets/profiles/image-four.webp" alt="employee icon"/>
            <p>+43</p>
        </div>
      </div>
      </div>
      <div class="employee-view">
        <a href="./empInf.html"><p>view all Employees</p></a>
        <img src="../assets/right-arrow.svg" alt="arrow icon" />
      </div>
    </div>`;
  });
}