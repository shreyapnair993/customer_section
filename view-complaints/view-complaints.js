// Sample complaint data with notes
// Each complaint has description and notes as required
var sampleComplaints = [
  {
    id: "CMP-100001",
    type: "Billing Issue",
    category: "Incorrect Bill Amount",
    description: "My electricity bill for March 2026 is much higher than usual without any change in usage.",
    date: "05 Mar 2026",
    status: "In Progress",
    contactMethod: "Email",
    contactVal: "rajesh.kumar@email.com",
    notes: [
      { by: "Admin", date: "07 Mar 2026", text: "Complaint received and assigned to billing team for review." },
      { by: "Billing Team", date: "09 Mar 2026", text: "Investigating meter readings for Feb-March. Will update in 48 hours." }
    ]
  },
  {
    id: "CMP-100002",
    type: "Power Outage",
    category: "Complete Power Outage",
    description: "No power supply in Sector 12, Indore for the past 6 hours. Affecting multiple households.",
    date: "10 Feb 2026",
    status: "Resolved",
    contactMethod: "Phone",
    contactVal: "+91 9876543210",
    notes: [
      { by: "SME - Field Engineer", date: "10 Feb 2026", text: "Fault found in distribution transformer. Repair in progress." },
      { by: "SME - Field Engineer", date: "10 Feb 2026", text: "Power restored at 6:30 PM. Transformer replaced. Issue resolved." }
    ]
  },
  {
    id: "CMP-100003",
    type: "Meter Reading Issue",
    category: "Faulty Meter",
    description: "Meter shows fluctuating readings even when all appliances are switched off.",
    date: "20 Jan 2026",
    status: "Closed",
    contactMethod: "Email",
    contactVal: "rajesh.kumar@email.com",
    notes: [
      { by: "SME - Meter Technician", date: "22 Jan 2026", text: "Meter inspection done. Confirmed faulty. Replacement scheduled." },
      { by: "SME - Meter Technician", date: "25 Jan 2026", text: "New meter installed. Complaint closed after customer confirmation." }
    ]
  },
  {
    id: "CMP-100004",
    type: "Service Request",
    category: "Load Enhancement",
    description: "Requesting load enhancement from 2KW to 5KW for commercial property at MG Road, Indore.",
    date: "28 Feb 2026",
    status: "Pending",
    contactMethod: "Phone",
    contactVal: "+91 9876543210",
    notes: []
  }
];

// Store all complaints
var allComplaints = [];

//Load on page start
window.onload = function() {
  // Get any complaints saved from the register complaint page
  var stored = JSON.parse(localStorage.getItem("complaints") || "[]");

  // Add empty notes array to stored complaints if missing
  stored.forEach(function(c) {
    if (!c.notes) c.notes = [];
  });

  // Combine sample + stored
  allComplaints = sampleComplaints.concat(stored);

  // Display all complaints in table
  renderTable(allComplaints);
};

//Filter complaints by selected status
function filterComplaints() {
  var filterVal = document.getElementById("filter-status").value;

  var filtered = filterVal
    ? allComplaints.filter(function(c) { return c.status === filterVal; })
    : allComplaints;

  renderTable(filtered);

  // Close detail panel when filter changes
  closeDetail();
}

// Render complaints into the table
// Shows Complaint ID, type, date, status for all complaints
function renderTable(list) {
  var tbody   = document.getElementById("complaints-tbody");
  var emptyEl = document.getElementById("empty-msg");
  var tableEl = document.getElementById("complaints-table");

  tbody.innerHTML = "";

  if (list.length === 0) {
    tableEl.style.display = "none";
    emptyEl.style.display = "block";
    return;
  }

  tableEl.style.display = "table";
  emptyEl.style.display = "none";

  list.forEach(function(c) {
    var row = document.createElement("tr");
    row.innerHTML =
      "<td><strong>" + c.id + "</strong></td>" +
      "<td>" + c.type + "</td>" +
      "<td>" + c.category + "</td>" +
      "<td>" + c.date + "</td>" +
      "<td>" + getStatusBadge(c.status) + "</td>" +
      "<td><button class='view-btn' onclick=\"showDetail('" + c.id + "')\"><i class='fa fa-eye'></i> View Details</button></td>";
    tbody.appendChild(row);
  });
}

//Return status badge HTML
function getStatusBadge(status) {
  if (status === "Pending")     return '<span class="status-pending">Pending</span>';
  if (status === "In Progress") return '<span class="status-inprogress">In Progress</span>';
  if (status === "Resolved")    return '<span class="status-resolved">Resolved</span>';
  if (status === "Closed")      return '<span class="status-closed">Closed</span>';
  return status;
}

// Show detailed info for a complaint 
// Shows description and any notes as required
function showDetail(id) {
  // Find the complaint
  var c = null;
  for (var i = 0; i < allComplaints.length; i++) {
    if (allComplaints[i].id === id) { c = allComplaints[i]; break; }
  }
  if (!c) return;

  // Fill detail table
  document.getElementById("detail-table").innerHTML =
    "<tr><td class='detail-label'>Complaint ID</td><td><strong>" + c.id + "</strong></td></tr>" +
    "<tr><td class='detail-label'>Status</td><td>" + getStatusBadge(c.status) + "</td></tr>" +
    "<tr><td class='detail-label'>Complaint Type</td><td>" + c.type + "</td></tr>" +
    "<tr><td class='detail-label'>Category</td><td>" + c.category + "</td></tr>" +
    "<tr><td class='detail-label'>Submission Date</td><td>" + c.date + "</td></tr>" +
    "<tr><td class='detail-label'>Contact Method</td><td>" + c.contactMethod + ": " + c.contactVal + "</td></tr>" +
    "<tr><td class='detail-label'>Description</td><td>" + c.description + "</td></tr>";

  // Fill notes section
  var notesHtml = "<p class='notes-title'><i class='fa fa-sticky-note'></i> Notes & Updates</p>";

  if (c.notes && c.notes.length > 0) {
    c.notes.forEach(function(note) {
      notesHtml +=
        "<div class='note-item'>" +
          "<div class='note-meta'><i class='fa fa-user'></i> " + note.by + " &nbsp;|&nbsp; <i class='fa fa-calendar'></i> " + note.date + "</div>" +
          "<div>" + note.text + "</div>" +
        "</div>";
    });
  } else {
    notesHtml += "<p class='no-notes'>No notes added yet for this complaint.</p>";
  }

  document.getElementById("notes-area").innerHTML = notesHtml;

  // Show the detail panel and scroll to it
  document.getElementById("detail-panel").style.display = "block";
  document.getElementById("detail-panel").scrollIntoView({ behavior: "smooth" });
}

//Close detail panel
function closeDetail() {
  document.getElementById("detail-panel").style.display = "none";
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
