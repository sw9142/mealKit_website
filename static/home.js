const backToTop = document.querySelector("#backtotop");

function scrollEvent() {
  let scroll = window.pageYOffset;
  if (scroll !== 0) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}

function backToTopEvent() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

window.addEventListener("scroll", scrollEvent);
backToTop.addEventListener("click", backToTopEvent);

const menu = document.querySelector(".navbar_menu");
const login = document.querySelector(".navbar_login");
const icons = document.querySelector(".menubtn");

icons.addEventListener("click", () => {
  menu.classList.toggle("active");
  login.classList.toggle("active");
});

/*----------------------------------------------------- */

let slidePrev = document.querySelector(".slide-prev");
let slideNext = document.querySelector(".slide-next");
slidePrev.classList.add("slidePrev-hoverEffect");
function slideEvent() {
  const mealList =
    slidePrev.parentElement.parentElement.parentElement.nextElementSibling;
  const liList = mealList.getElementsByTagName("li");
  let position = mealList.getAttribute("data-position");

  if (mealList.clientWidth < liList.length * 310 + Number(position)) {
    position = Number(position) - 310;

    if (mealList.clientWidth > liList.length * 310 + Number(position)) {
      slidePrev.style.color = "#cfd8dc";
      slidePrev.classList.remove("slidePrev-hoverEffect");
    }
    slideNext.style.color = "rgb(47, 48, 89)";
    slideNext.classList.add("slideNext-hoverEffect");
  }
  mealList.style.transition = "transform 0.5s";
  mealList.style.transform = "translateX(" + String(position) + "px)";
  mealList.setAttribute("data-position", position);
}

slidePrev.addEventListener("click", slideEvent);
