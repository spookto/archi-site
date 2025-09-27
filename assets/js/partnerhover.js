let clickShow = false;
const move = document.getElementById("move");

document.addEventListener("pointerdown", (event) => {
  console.log(event.target);
  if (!event.target.closest(".partnerBox")) {
    move.style.setProperty('visibility', 'hidden');
  }
  else {
    clickShow = true;
    setInformation(event.target);
    move.style.setProperty('visibility', 'visible');
    showMove(event.clientX, event.clientY, 0);
  }
})

document.body.onpointermove = (event) => {
  const { clientX, clientY } = event;

  const closestElement = document.elementFromPoint(clientX, clientY);

  if (!closestElement.closest(".partnerBox")) {
    move.style.setProperty('visibility', 'hidden');
  }
  else {
    setInformation(closestElement);
    move.style.setProperty('visibility', 'visible');
    showMove(clientX, clientY, 0);
  }
}

document.onscroll = (event) => {
  if (clickShow) {
    clickShow = false;
    move.style.setProperty('visibility', 'hidden');
  }
}

function setInformation(element) {
  move.getElementsByClassName("content-en")[0].textContent = element.name.split("|")[0];
  move.getElementsByClassName("content-ar")[0].textContent = element.name.split("|")[1];
}

function showMove(x, y, dur) {
  x = Math.min(x, document.body.clientWidth - move.clientWidth - 32);

  move.animate({
    left: `${x + 16}px`,
    top: `${y}px`,

  }, {duration: dur, fill: "forwards"})
}