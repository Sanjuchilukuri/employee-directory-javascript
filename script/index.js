(function intilizer() {
  generateAlphabets();  //To generate alphabets dynamically
  intilizeOptions(); //to fetch options from json
  employeeRecords.allEmployees = fetchAllEmployeesFromDB(); // To fetch employees From DB
  displayEmployees(employeeRecords.allEmployees); // to display intial table with all employee records
  updateOptionObject();
})();

// To display employee details
function displayEmployees(employeesData) {
  employeesData = applyFilters(employeesData);
  employeeRecords.filteredEmployees = employeesData;
  const tableBody = document.getElementById("tableBody") || "";
  if (employeesData.length ) {
    tableBody.innerHTML = "";
    employeesData.forEach((employee) => {
      tableBody.innerHTML += `
          <tr>
              <td><input type="checkbox" id="${employee.empno}" onchange="toggleEmployeeChecked('${employee.empno}')" ${searchFilters["selectAll"]}/></td>
              <td>
                  <div class="user">
                      <img src="${employee.img}">
                      <div class="user-details">
                          <p class="name">${employee.firstname} ${employee.lastname}</p>
                          <p class="mail">${employee.mail}</p>
                      </div>
                  </div>
              </td>
              <td>${employee.location}</td>
              <td>${employee.department}</td>
              <td>${employee.jobTitle}</td>
              <td id="empNo">${employee.empno}</td>
              <td class="apperance"><p>Active</p></td>
              <td>${employee.joining}</td>
              <td >
                <button class="ellipsis transparent-btn"  onclick="showAdditionalOptions(this)">...</button>
                <div class="last-element">
                  <button class="additional-options transparent-btn" onclick="viewEmployee('${employee.empno}')" >View</button>
                  <button class="additional-options transparent-btn" onclick="editEmployee('${employee.empno}')" >Edit</button>
                  <button class="additional-options transparent-btn" onclick="deleteEmployeeRecord('${employee.empno}')">Delete</button>
                </div>
              </td>
          </tr>`;
    });
  }
  else {
    tableBody.innerHTML = `<tr><td colspan="9" align="center">No Data Found</td></tr>`; 
  }
}

// To toggle b/w employee checked or not
function toggleEmployeeChecked(empid) {
  let flag = false;
  employeeRecords.allEmployees.map(employee => {
    if (employee.empno == empid) employee.isChecked = !employee.isChecked;
    if (employee.isChecked) flag = true;
  })
  enableDeleteBtn(flag);
}

// To show extra options when click on ellipsis
let previousPopUp;
function showAdditionalOptions(node) {
  if (previousPopUp && previousPopUp == node) {
    previousPopUp.classList.toggle("show");
    return;
  }
  if (previousPopUp && previousPopUp.classList.contains("show")) 
    previousPopUp.classList.remove("show");
  node.classList.add("show");
  previousPopUp = node;
}

// To hide Adiitional Options
function hideAdditionalOptions() {
  if (previousPopUp && previousPopUp.classList.contains("show"))
    previousPopUp.classList.toggle("show");
}

// Event listener for to call hideAdditionalOptions when user click on anywhere
document.addEventListener("click", (event) => {
  if (previousPopUp) {
    const isAdditionalOption = event.target.classList.contains("additional-options");
    const isEllipsis = event.target.classList.contains("ellipsis");
    if (!isAdditionalOption && !isEllipsis)
      hideAdditionalOptions();
  }
});

//To apply filter on EmployeesData
function applyFilters(employeesData) {
  let selectedEmployees = employeesData.filter(
    (employee) =>
      (Object.values(employee).some(value =>
        !searchFilters["searchBar"] || value.toString().toLowerCase() === searchFilters["searchBar"].toLowerCase()
      ))&&
      (!searchFilters["alaphabet"] || employee.firstname.charAt(0).toUpperCase() === searchFilters["alaphabet"] ) &&
      (!searchFilters["active"] || searchFilters["active"] === employee.active) &&
      (!searchFilters["location"] || searchFilters["location"] === employee.location) &&
      (!searchFilters["department"] || searchFilters["department"] === employee.department)
  );
  return selectedEmployees;
}

//sidebar toogle functionality
function SidebarVisibility() {
  const sideBar = document.getElementById("aside");
  const mainSection = document.getElementById("main");
  const isNotCollapsed = !sideBar.classList.contains("siderbar-collapse");
  sideBar.classList.toggle("siderbar-collapse");
  document.getElementById("companyLogo").src = isNotCollapsed? "../assets/tezologo-minimize.svg" : "../assets/tezoLogo.svg";
  mainSection.style.width = isNotCollapsed ? "calc(100% - 3.0625rem - 1.6rem)" : "";
  document.getElementById("sideNavRoleText").innerHTML = isNotCollapsed ? "ROLE" : "ROLE/USER MANAGEMENT";
  document.getElementById("sidebarIcon").style.rotate = isNotCollapsed ? "180deg" : "0deg";
  
}

//dynamic alphabets creation
function generateAlphabets() {
  const alphabets = document.getElementById("alphabetsWrapper") || "";
  for (let i = 0; i < 26; i++) {
    alphabets.innerHTML+=`<li onclick="activeAlphabet(this)" id="${String.fromCharCode(65 + i)}">${String.fromCharCode(65 + i)}</li>`
  }
}

// To make alphabet active when user clicks on
let previousAlphabet;
function activeAlphabet(alphabet) {
  if (previousAlphabet) previousAlphabet.classList.remove("alphabet-active");
  previousAlphabet = alphabet;
  alphabet.classList.add("alphabet-active");
  searchFilters["alaphabet"] = alphabet.id;
  document.getElementById("alphabetsFilter").classList.add("img-filter-active");
  displayEmployees(employeeRecords.allEmployees);
}

// To turn off alphabet filters when user click on filter Image
function turnOffAlphabetFilter(imgFilter) {
  imgFilter.classList.remove("img-filter-active");
  if (previousAlphabet) previousAlphabet.classList.remove("alphabet-active");
  searchFilters["alaphabet"] = "";
  displayEmployees(employeeRecords.allEmployees);
}

//export displaying data to csv
function exportDataToExcel() {
  let csv = "EmpNo, FirstName, LastName, DateofBirth, Mail, Phno, JoinDt, Location, Role, Department, AssignManager, AssignProject, Status, \n";
  employeeRecords.filteredEmployees.forEach((employee) => {
    let seperator = "";
    for (let field in employee) {
      console.log(field);
      if (field != "img" && field != "ischecked" && field != "isChekedInRole") {
        csv += seperator + employee[field];
        seperator = ",";
      }
    }
    csv += "\n";
  });
  let exportLink = document.createElement("a");
  exportLink.setAttribute("href","data:text/csv;charset=utf-8," + encodeURI(csv));
  exportLink.setAttribute("download", "employeeInformation.csv");
  exportLink.click();
}

//toogle all checkboxes based on select all checkbox
function toggleAllCheckboxes(selectAllCheckBox) {
  if (selectAllCheckBox.checked) {
    employeeRecords.allEmployees.forEach(employee => employee.isChecked = true);
    searchFilters["selectAll"] = "checked";
  }
  else {
    searchFilters["selectAll"] = "unchecked";
    employeeRecords.allEmployees.forEach(employee => employee.isChecked = false);
  }
  enableDeleteBtn(selectAllCheckBox.checked);
  displayEmployees(employeeRecords.allEmployees);
}

//table sorting
const clicksMap = {
  user: 0,
  locations: 0,
  departments: 0,
  role: 0,
  empNo: 0,
  status: 0,
  joinDt: 0,
};

function sortingFieldException(sortingField) {
  for (let clicks in clicksMap)
    if (clicks !== sortingField) {
      clicksMap[clicks] = 0;
    }
}

function sortingByOrder(sortingField, order, data) {
  const sortOrder = order === "ASC" ? 1 : -1;
  switch (sortingField) {
    case "user":
      data.sort((a, b) => {
        const nameA = (a.firstname + a.lastname).toUpperCase();
        const nameB = (b.firstname + b.lastname).toUpperCase();
        return sortOrder * nameA.localeCompare(nameB);
      });
      break;
    case "locations":
      data.sort((a, b) => sortOrder * a.location.localeCompare(b.location));
      break;
    case "departments":
      data.sort((a, b) => sortOrder * a.department.localeCompare(b.department));
      break;
    case "role":
      data.sort((a, b) => sortOrder * a.jobTitle.localeCompare(b.jobTitle));
      break;
    case "empNo":
      data.sort((a, b) => sortOrder * a.empno.localeCompare(b.empno));
      break;
    case "status":
      data.sort((a, b) => sortOrder * a.active.localeCompare(b.active));
      break;
    case "joinDt":
      data.sort((a, b) => sortOrder * a.joining.localeCompare(b.joining));
      break;
    default:
      break;
  }
  displayEmployees(data);
}

function tableSorting(heading) {
  const sortingField = heading.id;
  sortingByOrder(sortingField, clicksMap[sortingField] == 0 ? "ASC" : "DES", employeeRecords.filteredEmployees);
  if (!clicksMap[sortingField]) sortingFieldException(sortingField);
  clicksMap[sortingField] = (clicksMap[sortingField] + 1) % 2;
}

//To reset all select values
function resetAllFilters() {
  const filterSection = document.getElementById("filter");
  const allFilterOptions = Array.from(filterSection.getElementsByTagName("select"));
  allFilterOptions.forEach((filter) => {
    filter.value = "";
    toggleSelectTagState(filter);
  });
  updateSelectFilters();
  updateButtonState();
}

// To update select based filters
function updateSelectFilters() {
  searchFilters["active"] = document.getElementById("status").value;
  searchFilters["location"] = document.getElementById("Location").value;
  searchFilters["department"] = document.getElementById("Department").value;
  console.log(searchFilters);
  displayEmployees(employeeRecords.allEmployees);
}

//toggle reset & apply buttons state
function updateButtonState() {
  const applyFilterButton = document.getElementById("applyBtn") || "";
  const resetFilterButton = document.getElementById("resetBtn") || "";
  const filterSection = document.getElementById("filter");
  const allFilterOptions = Array.from(filterSection.getElementsByTagName("select"));
  const flag = Array.from(allFilterOptions).some( element => element.value !== "");
  applyFilterButton.disabled = resetFilterButton.disabled = !flag;
  applyFilterButton.style.cursor = resetFilterButton.style.cursor = flag ? "pointer": "";
  applyFilterButton.style.backgroundColor = flag ? "#F44848" : "";
}

//delete selected Records
function deleteSelectedEmployeeRecords() {
  employeeRecords.allEmployees.forEach(employee => {
    if(employee.isChecked) deleteEmployeeRecord(employee.empno)
  })
  showNotification("Employee Deleted", "red");
}

//delete employee record
function deleteEmployeeRecord(empno) {
  employeeRecords.allEmployees = employeeRecords.allEmployees.filter(employee => employee["empno"] != empno);
  saveEmployeeRecordsInDB(employeeRecords.allEmployees);
  displayEmployees(employeeRecords.allEmployees);
  enableDeleteBtn(false);
}

//toggle delete button state
function enableDeleteBtn(flag) {
  let isallselected = false;
  let deleteBtn = document.getElementById("deleteBtn");
  if (employeeRecords.filteredEmployees.length === employeeRecords.filteredEmployees.filter(x => x.isChecked).length) {
    isallselected = true;
  }
  deleteBtn.disabled = !flag;
  deleteBtn.style.cursor = flag ? "pointer" : "";
  deleteBtn.style.backgroundColor = flag ? "#F44848" : "";
  document.getElementById("selectAll").checked = isallselected;
}

//function to fetch options from json file
function intilizeOptions() {
  let jsonObj = fetchOptionsFromDB();
  assignOptions(jsonObj);
}

//Function to assign options to select tag from json
function assignOptions(obj) {
  for (let key in obj) {
    let selectTag = document.getElementsByName(key);
    selectTag.forEach((name) => addOption(name, obj));
  }
}

//function to create and add options to select
function addOption(selectTag, obj) {
  for (let field of obj[selectTag.name]) {
    let option = document.createElement("option");
    option.value=field;
    option.text=field?field:selectTag.name;
    selectTag.add(option);
  }
}

//function to update searchBar string in searchFilter
function updateSearchFilter(event) {
  searchFilters["searchBar"] = event?.target.value;
  displayEmployees(employeeRecords.allEmployees);
}

// function to toogle select tag active state
function toggleSelectTagState(selectElement) {
  selectElement.classList.toggle("active-element",selectElement.value != "");
}

