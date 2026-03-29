// home.js

// Logout - asks for confirmation then redirects (US002 - req 5)
function handleLogout() {
  var confirmed = confirm("Are you sure you want to logout?");
  if (confirmed) {
    localStorage.clear();
    window.location.href = "../login/login.html";
  }
}