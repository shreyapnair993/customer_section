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
