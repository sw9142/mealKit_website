window.onload = function () {
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
  const mealList = document.querySelectorAll(".meal-list");

  function slideRightEvent(e) {
    for (let i = 0; i < mealList.length; i++) {
      let slideNext = e.target;
      let position = mealList[i].getAttribute("data-position");

      if (position < 0) {
        position = Number(position) + 310;
        slidePrev.style.color = "rgb(47, 48, 89)";
        slidePrev.classList.add("slidePrev-hoverEffect");
        slidePrev.addEventListener("click", slideLeftEvent);
        if (position === 0) {
          slideNext.style.color = "#cfd8dc";
          slideNext.classList.remove("slideNext-hoverEffect");
          slideNext.removeEventListener("click", slideRightEvent);
        }
      }

      mealList[i].style.transition = "transform 0.5s";
      mealList[i].style.transform = "translateX(" + String(position) + "px)";
      mealList[i].setAttribute("data-position", position);
    }
  }

  function slideLeftEvent() {
    for (let i = 0; i < mealList.length; i++) {
      const liList = mealList[i].getElementsByTagName("li");
      let position = mealList[i].getAttribute("data-position");

      if (mealList[i].clientWidth < liList.length * 310 + Number(position)) {
        position = Number(position) - 310;

        if (mealList[i].clientWidth > liList.length * 310 + Number(position)) {
          slidePrev.style.color = "#cfd8dc";
          slidePrev.classList.remove("slidePrev-hoverEffect");
          slidePrev.removeEventListener("click", slideLeftEvent);
        }
        slideNext.style.color = "rgb(47, 48, 89)";
        slideNext.classList.add("slideNext-hoverEffect");
        slideNext.addEventListener("click", slideRightEvent);
      }
      mealList[i].style.transition = "transform 0.5s";
      mealList[i].style.transform = "translateX(" + String(position) + "px)";
      mealList[i].setAttribute("data-position", position);
    }
  }

  slidePrev.addEventListener("click", slideLeftEvent);

  /*----------------------------------------------------- */

  let dinnerBtn = document.querySelector(".mealtype-dinner");
  let lunchBtn = document.querySelector(".mealtype-lunch");
  let dinnerList = document.querySelector("#dinner");
  let lunchList = document.querySelector("#lunch");

  dinnerBtn.addEventListener("click", () => {
    lunchBtn.style.backgroundColor = "rgb(245, 245, 245)";
    lunchBtn.style.color = "rgb(97 102 59)";
    dinnerBtn.style.backgroundColor = "rgb(97 102 59)";
    dinnerBtn.style.color = "rgb(245, 245, 245)";
    dinnerList.classList.remove("hidden");
    lunchList.classList.add("hidden");
  });

  lunchBtn.addEventListener("click", () => {
    dinnerBtn.style.backgroundColor = "rgb(245, 245, 245)";
    dinnerBtn.style.color = "rgb(97 102 59)";
    lunchBtn.style.backgroundColor = "rgb(97 102 59)";
    lunchBtn.style.color = "rgb(245, 245, 245)";
    lunchList.classList.remove("hidden");
    dinnerList.classList.add("hidden");
  });

  /*----------------------------------------------------- */
};
