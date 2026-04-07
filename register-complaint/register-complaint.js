function validateConsumer() {
  var consumer = document.getElementById("consumer-no").value.trim();
  var err = document.getElementById("err-consumer");

  if (!consumer) {
    err.textContent = "Consumer number is required.";
    return false;
  } else {
    err.textContent = "";
    return true;
  }
}

//Category options for each complaint type
var categories = {
  billing: ["Incorrect Bill Amount", "Duplicate Bill", "Bill Not Received", "Overcharged", "Late Fee Dispute"],
  power:   ["Complete Power Outage", "Frequent Power Cuts", "Low Voltage", "Voltage Fluctuation"],
  meter:   ["Faulty Meter", "Wrong Meter Reading", "Meter Replacement Request", "Meter Tampering"],
  service: ["New Connection Request", "Load Enhancement", "Connection Transfer", "Name Change"],
  wiring:  ["Sparking / Exposed Wires", "Cable Fault", "Transformer Issue", "Pole Fault"],
  other:   ["General Enquiry", "Feedback", "Other Issue"]
};

//Load categories based on selected complaint type
function loadCategories() {
  var typeVal = document.getElementById("complaint-type").value;
  var catSelect = document.getElementById("category");

  // Clear old options
  catSelect.innerHTML = '<option value="">-- Select Category --</option>';

  if (typeVal && categories[typeVal]) {
    // Enable and fill category dropdown
    catSelect.disabled = false;
    categories[typeVal].forEach(function(cat) {
      var opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    });
  } else {
    catSelect.disabled = true;
  }

  // Clear type error when user makes a selection
  document.getElementById("err-type").textContent = "";
}

//Update character count for description
function countChars() {
  var len = document.getElementById("description").value.length;
  document.getElementById("char-count").textContent = len + " / 500 characters";
}

//Validate email format 
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

//Validate phone number (10 digits)
function isValidPhone(phone) {
  var cleaned = phone.replace(/[\s\-+]/g, "").replace(/^91/, "");
  return /^\d{10}$/.test(cleaned);
}

//  Generate unique Complaint ID
function makeComplaintId() {
  var num = Math.floor(100000 + Math.random() * 900000);
  return "CMP-" + num;
}

//Get estimated resolution time by type
function getResolutionTime(type) {
  var times = {
    billing: "3-5 Business Days",
    power:   "24-48 Hours",
    meter:   "5-7 Business Days",
    service: "7-10 Business Days",
    wiring:  "24-72 Hours",
    other:   "3-5 Business Days"
  };
  return times[type] || "3-5 Business Days";
}

//Validate the form
function validateForm() {
  var valid = true;

  // Clear all previous error messages first
  document.getElementById("err-type").textContent = "";
  document.getElementById("err-category").textContent = "";
  document.getElementById("err-description").textContent = "";
  document.getElementById("err-contact").textContent = "";
  document.getElementById("err-email").textContent = "";
  document.getElementById("err-phone").textContent = "";

  // Check complaint type
  if (!document.getElementById("complaint-type").value) {
    document.getElementById("err-type").textContent = "Please select a complaint type.";
    valid = false;
  }

  // Check category
  if (!document.getElementById("category").value) {
    document.getElementById("err-category").textContent = "Please select a category.";
    valid = false;
  }

  // // Check description - minimum 20 characters
  // var desc = document.getElementById("description").value.trim();
  // if (!desc) {
  //   document.getElementById("err-description").textContent = "Description is required.";
  //   valid = false;
  // } else if (desc.length < 20) {
  //   document.getElementById("err-description").textContent = "Description must be at least 20 characters.";
  //   valid = false;
  // }

  //DESCRIPTION
  var desc = document.getElementById("description").value.trim();

if (!desc) {
  document.getElementById("err-description").textContent = "Description is required (enter details or 'NA').";
  valid = false;
}

  // Check contact method radio
  var contactSelected = document.querySelector('input[name="contact-method"]:checked');
  if (!contactSelected) {
    document.getElementById("err-contact").textContent = "Please select a preferred contact method.";
    valid = false;
  } else {
    // Check contact detail fields based on selected method
    if (contactSelected.value === "email") {
      var email = document.getElementById("email-val").value.trim();
      if (!email) {
        document.getElementById("err-email").textContent = "Email address is required.";
        valid = false;
      } else if (!isValidEmail(email)) {
        document.getElementById("err-email").textContent = "Incorrect email format.";
        valid = false;
      }
    } else {
      var phone = document.getElementById("phone-val").value.trim();
      if (!phone) {
        document.getElementById("err-phone").textContent = "Phone number is required.";
        valid = false;
      } else if (!isValidPhone(phone)) {
        document.getElementById("err-phone").textContent = "Mobile number is invalid.";
        valid = false;
      }
    }
  }

  return valid;
}

//Submit form
function submitForm() {
  // Stop if validation fails
  if (!validateForm()) return;

  // Gather values
  var consumer = document.getElementById("consumer-no").value.trim();
  var typeEl   = document.getElementById("complaint-type");
  var typeText = typeEl.options[typeEl.selectedIndex].text;
  var category = document.getElementById("category").value;
  var desc     = document.getElementById("description").value.trim();
  var method   = document.querySelector('input[name="contact-method"]:checked').value;
  var contact  = method === "email"
    ? document.getElementById("email-val").value.trim()
    : document.getElementById("phone-val").value.trim();

  var cmpId      = makeComplaintId();
  var submitDate = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  var resolution = getResolutionTime(typeEl.value);

  // Show success box with complaint details
  document.getElementById("success-details").innerHTML =
  '<div class="detail-row"><span class="detail-key">Consumer Number:</span> ' + consumer + '</div>' +
    '<div class="detail-row"><span class="detail-key">Complaint ID:</span> <span class="cmp-id">' + cmpId + '</span></div>' +
    '<div class="detail-row"><span class="detail-key">Submission Date:</span> ' + submitDate + '</div>' +
    '<div class="detail-row"><span class="detail-key">Complaint Type:</span> ' + typeText + '</div>' +
    '<div class="detail-row"><span class="detail-key">Category:</span> ' + category + '</div>' +
    '<div class="detail-row"><span class="detail-key">Description:</span> ' + desc + '</div>' +
    '<div class="detail-row"><span class="detail-key">Estimated Resolution:</span> <strong>' + resolution + '</strong></div>' +
    '<div class="detail-row"><span class="detail-key">Contact Via:</span> ' + method + ' - ' + contact + '</div>';

  // Save to localStorage so status and history pages can read it
  var complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
  complaints.push({
    id: cmpId,
    consumerNo: consumer,
    type: typeText,
    category: category,
    description: desc,
    date: submitDate,
    status: "Pending",
    contactMethod: method,
    contactVal: contact,
    notes: []
  });
  localStorage.setItem("complaints", JSON.stringify(complaints));

  // Hide form, show success
  document.getElementById("form-box").style.display = "none";
  document.getElementById("success-box").style.display = "block";
  window.scrollTo(0, 0);

  var valid = true;

// Consumer number validation
if (!validateConsumer()) {
  valid = false;
}
}

//Reset form
function resetForm() {
  document.getElementById("complaint-type").value = "";
  document.getElementById("category").innerHTML = '<option value="">-- Select Category --</option>';
  document.getElementById("category").disabled = true;
  document.getElementById("description").value = "";
  document.getElementById("char-count").textContent = "0 / 500 characters";
  document.getElementById("email-val").value = "rajesh.kumar@email.com";
  document.getElementById("phone-val").value = "+91 9876543210";

  // Uncheck radio buttons
  var radios = document.querySelectorAll('input[name="contact-method"]');
  radios.forEach(function(r) { r.checked = false; });

  // Clear all errors
  var errorIds = ["err-type","err-category","err-description","err-contact","err-email","err-phone"];
  errorIds.forEach(function(id) {
    document.getElementById(id).textContent = "";
  });
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
