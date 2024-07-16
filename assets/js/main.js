$(document).ready(function () {
  $("#toggleDrawer, #overlay").click(function () {
    $("#drawer").toggleClass("drawer-open");
    $("#overlay").toggleClass("overlay-open");
  });
});
