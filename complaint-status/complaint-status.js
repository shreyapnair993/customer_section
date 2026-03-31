//Sample complaint data
var sampleComplaints = [
  {
    id: "CMP-100001",
    type: "Billing Issue",
    category: "Incorrect Bill Amount",
    description: "My electricity bill for March 2026 is much higher than usual without any change in usage.",
    date: "05 Mar 2026",
    status: "In Progress",
    contactMethod: "Email",
    contactVal: "rajesh.kumar@email.com"
  },
  {
    id: "CMP-100002",
    type: "Power Outage",
    category: "Complete Power Outage",
    description: "No power supply in Sector 12, Indore for the past 6 hours. Affecting multiple households.",
    date: "10 Feb 2026",
    status: "Resolved",
    contactMethod: "Phone",
    contactVal: "+91 9876543210"
  },
  {
    id: "CMP-100003",
    type: "Meter Reading Issue",
    category: "Faulty Meter",
    description: "Meter shows fluctuating readings even when all appliances are switched off.",
    date: "20 Jan 2026",
    status: "Closed",
    contactMethod: "Email",
    contactVal: "rajesh.kumar@email.com"
  },
  {
    id: "CMP-100004",
    type: "Service Request",
    category: "Load Enhancement",
    description: "Requesting load enhancement from 2KW to 5KW for commercial property.",
    date: "28 Feb 2026",
    status: "Pending",
    contactMethod: "Phone",
    contactVal: "+91 9876543210"
  }
];

//Combine sample data with any user-submitted complaints
function getAllComplaints() {
  var stored = JSON.parse(localStorage.getItem("complaints") || "[]");
  return sampleComplaints.concat(stored);
}

// Return status badge HTML for a given status
function getStatusBadge(status) {
  if (status === "Pending")     return '<span class="status-pending">Pending</span>';
  if (status === "In Progress") return '<span class="status-inprogress">In Progress</span>';
  if (status === "Resolved")    return '<span class="status-resolved">Resolved</span>';
  if (status === "Closed")      return '<span class="status-closed">Closed</span>';
  return status;
}

//Search complaints
//Searches by complaint ID OR status dropdown
function searchComplaint() {
  var searchId     = document.getElementById("search-id").value.trim().toUpperCase();
  var searchStatus = document.getElementById("search-status").value;
  var errEl        = document.getElementById("search-err");

  //Hide any previous error
  errEl.style.display = "none";
  document.getElementById("detail-box").style.display = "none";

  //At least one field must be filled
  if (!searchId && !searchStatus) {
    errEl.textContent = "Please enter a Complaint ID or select a status to search.";
    errEl.style.display = "block";
    return;
  }

  var all = getAllComplaints();
  var results = all;

  //Filter by complaint ID if entered
  if (searchId) {
    results = results.filter(function(c) {
      return c.id.toUpperCase().indexOf(searchId) !== -1;
    });
  }

  //Further filter by status if selected
  if (searchStatus) {
    results = results.filter(function(c) {
      return c.status === searchStatus;
    });
  }

  //Show results area
  document.getElementById("results-area").style.display = "block";

  if (results.length === 0) {
    document.getElementById("no-results").style.display = "block";
    document.getElementById("results-box").style.display = "none";
  } else {
    document.getElementById("no-results").style.display = "none";
    document.getElementById("results-box").style.display = "block";
    renderTable(results);
  }

  // Scroll down to see results
  document.getElementById("results-area").scrollIntoView({ behavior: "smooth" });
}

//Render results into the table
function renderTable(results) {
  var tbody = document.getElementById("results-tbody");
  tbody.innerHTML = "";

  results.forEach(function(c) {
    var row = document.createElement("tr");
    row.innerHTML =
      "<td><strong>" + c.id + "</strong></td>" +
      "<td>" + c.type + "</td>" +
      "<td>" + c.category + "</td>" +
      "<td>" + c.date + "</td>" +
      "<td>" + getStatusBadge(c.status) + "</td>" +
      "<td><button class='view-detail-btn' onclick=\"showDetail('" + c.id + "')\"><i class='fa fa-eye'></i> View Details</button></td>";
    tbody.appendChild(row);
  });
}

//Show full detail of a complaint
//Displays Complaint ID, submission date, type, and status
function showDetail(id) {
  var all = getAllComplaints();
  var c   = null;
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) { c = all[i]; break; }
  }
  if (!c) return;

  document.getElementById("detail-content").innerHTML =
    "<table class='detail-table'>" +
      "<tr><td class='detail-label'>Complaint ID</td><td><strong>" + c.id + "</strong></td></tr>" +
      "<tr><td class='detail-label'>Status</td><td>" + getStatusBadge(c.status) + "</td></tr>" +
      "<tr><td class='detail-label'>Complaint Type</td><td>" + c.type + "</td></tr>" +
      "<tr><td class='detail-label'>Category</td><td>" + c.category + "</td></tr>" +
      "<tr><td class='detail-label'>Submission Date</td><td>" + c.date + "</td></tr>" +
      "<tr><td class='detail-label'>Preferred Contact</td><td>" + c.contactMethod + ": " + c.contactVal + "</td></tr>" +
      "<tr><td class='detail-label'>Description</td><td>" + c.description + "</td></tr>" +
    "</table>";

  document.getElementById("detail-box").style.display = "block";
  document.getElementById("detail-box").scrollIntoView({ behavior: "smooth" });
}

// LOGOUT
function handleLogout() {
  document.getElementById("confirm_m").style.display = "flex";
}

function cancel_lg() {
  document.getElementById("confirm_m").style.display = "none";
}

function c_logout() {
  // Redirect to login page
  window.location.href = "login.html";
}
