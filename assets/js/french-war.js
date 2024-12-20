function scrollToIntro() {
  document.getElementById("intro").scrollIntoView({ behavior: "smooth" });
}

function scrollToEvent(eventId) {
  document.getElementById(eventId).scrollIntoView({ behavior: "smooth" });
}
