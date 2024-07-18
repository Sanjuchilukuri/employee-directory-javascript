let options = {};

const searchFilters = {
  searchBar: "",
  active: "",
  location: "",
  department: "",
  alaphabet: "",
  selectAll: "unchecked",
};

const employeeRecords = {
  allEmployees: [],
  filteredEmployees: [],
  filteredEmployeesInRoles: [],
};

//updtae options object
function updateOptionObject() {
  options = fetchOptionsFromDB();
}

//To fetch all Employees from DB
function fetchAllEmployeesFromDB() {
  return JSON.parse(localStorage.getItem("data")) || [];
}

//To save all employee details to DB
function saveEmployeeRecordsInDB(allEmployeeRecords) {
  localStorage.setItem("data", JSON.stringify(allEmployeeRecords));
}

//To save options to DB
function saveOptionsInDB() {
  localStorage.setItem("options", JSON.stringify(options));
}

// To fetch options from DB
function fetchOptionsFromDB() {
  let data = JSON.parse(localStorage.getItem("options"));
  if (Object.keys(data).length == 0) fetchOptionsFromJson();
  return data;
}

async function fetchOptionsFromJson() {
  let jsonOptions;
  await fetch("../options.json")
    .then(response => response.json())
    .then(data => jsonOptions = data);
  options = jsonOptions;
  saveOptionsInDB();
  fetchOptionsFromDB();
  window.location.reload();
}

async function fetchCardDataFromJson() {
  let cardData;
  await fetch("../cardsData.json")
    .then(response => response.json())
    .then(data => cardData = data);
  dynamicCardFromJson(cardData);
}