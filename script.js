"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnOpenModal = document.querySelectorAll(".btn--show-modal");
const closeModal = document.querySelector(".btn--close-modal");
const allSections = document.querySelectorAll(".section");
const allButtons = document.getElementsByTagName("button");
const header = document.querySelector(".header");
const learnMore = document.querySelector(".btn--scroll-to");
const section = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabsContainer = document.querySelector(".operations__tab-container"); //Parent for all button
const tabs = document.querySelectorAll(".operations__tab"); // All Buttons
const tabContent = document.querySelectorAll(".operations__content"); //The body of all the tab component

const showModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const hideModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenModal.forEach((openModalBtn) =>
  openModalBtn.addEventListener("click", showModal)
);

closeModal.addEventListener("click", hideModal);
overlay.addEventListener("click", hideModal);

document.addEventListener("keyup", (e) =>
  e.key === "Escape" ? hideModal() : false
);

// Selecting in Document Object Model
console.log(document);
console.log(document.head);
console.log(document.body);
console.log(allSections);
console.log(document.getElementById("section--1"));
console.log(allButtons);
console.log(document.getElementsByClassName("btn"));

// Creating and Inserting elements in DOM
// .insertAdjacentHTML is one of the methods to insert elements in HTML
const message = document.createElement("div");
message.classList.add("cookie-message");

message.innerHTML = `We use cookies for imporoved funcionality and analytics. <button class="btn btn--close-cookie">Got it!</button>"`;
message.style.width = "120%";
document.documentElement.style.overflowX = "hidden";

message.style.height = "80px";

console.log(message.getBoundingClientRect(message));

header.append(message);

// Removing from DOM
const closeCookie = document.querySelector(".btn--close-cookie");
closeCookie.addEventListener("click", () => message.remove());

/*
Event or e in event handler of a addEventListener method represents all of the menus
or property of our selected element (element that has the addEventListener)
*/

learnMore.addEventListener("click", (e) => {
  const sectionCoordinates = section.getBoundingClientRect();

  console.log(sectionCoordinates);

  console.log(e.target.getBoundingClientRect());

  console.log(window.scrollY);

  console.log(
    `Height of the viweport it ${document.documentElement.clientHeight} / Width of the viewport is ${document.documentElement.clientWidth}`
  );

  // Scolling
  section.scrollIntoView({ behavior: "smooth" });
});

/*

/////////////////////////////////////[Smooth scrolling old ways and inneficient]
const navSections = document.querySelectorAll(".nav__link");
navSections.forEach((navLink) => {
  navLink.addEventListener("click", function (e) {
    e.preventDefault();
    const sectionHref = this.getAttribute("href");
    const desiredSection = document.querySelector(sectionHref);
    desiredSection.scrollIntoView({ behavior: "smooth" });
  });
});
*/

/*

/////////////////////////////////////[Smooth scroll logic using event delegation]

LOGIC: 
1. First we select the parent of our nav items and attach event listener to it
2. Then, by using the e(paramater of event handler) we can call the e.target property
   so we can know, which element are clicked or trigger the event
3. After selecting it, we do the matching (see below)
4. Get the href attribute of the clicked element
5. And by using document.querySelector() and putting it to a variable, we basically
   got the section that we want.
6. Finally we just have to use the scrollIntoView method on it, and set the object
   behavior property within the method to smooth

*/

const navContainer = document.querySelector(".nav__links");
navContainer.addEventListener("click", function (e) {
  console.log(e.target);

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    console.log(e.currentTarget);
    e.preventDefault();
    const href = e.target.getAttribute("href");
    const desiredSection = document.querySelector(href);
    desiredSection && desiredSection.scrollIntoView({ behavior: "smooth" });
  }
});

/*
/////////////////////////////////////[Tabbed Component]

LOGIC:
1. First we select the parent of all buttons which is 'tabsContainer'

2. Then we add an event listener with the event of click in it

3. Here we uses the guard clause, which will immediately return the
   function if the value of click is falsy

4. After ensuring we will only click the button, we remove every button
   with the class of operations__tab--active using forEach to apply the logic
   on every button.

5. Immediately after that we add the class for it to active to the button we click
   which is represented by the 'click' variable

5, After that we do the same thing on the tabContent, a variable which contains
   all the content of tabbed component, removing the class for the tab content
   to active.

6. Finally, we active the tabbed componenet which has the same content number as
   our clicked button, we're able to do this because we're using the, value of
   dataset.tab of the our clicked button, and then add the class for it to active
*/

tabsContainer.addEventListener("click", (e) => {
  const click = e.target.closest(".operations__tab");
  console.log(click);

  if (!click) return;

  //Active tab button
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  click.classList.add("operations__tab--active");

  // Removing all the active class from tab content
  tabContent.forEach((tab) =>
    tab.classList.remove("operations__content--active")
  );

  // Activate content area
  document
    .querySelector(`.operations__content--${click.dataset.tab}`)
    .classList.add("operations__content--active");
});

/////////////////////////////////////[Fade Navlink When We Hover Specified One]
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((navLink) => {
      if (navLink !== link) {
        navLink.style.opacity = this;
      }
    });

    logo.style.opacity = this;
  }
};

// nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

/////////////////////////////////////[Intersection Observer API]
const navHeight = nav.getBoundingClientRect().height;

const navObserverCallback = function (entries) {
  const [entry] = entries;
  entry.isIntersecting
    ? nav.classList.remove("sticky")
    : nav.classList.add("sticky");
};

const navObserverOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const navObserver = new IntersectionObserver(
  navObserverCallback,
  navObserverOption
);
navObserver.observe(header);

/////////////////////////////////////[Reveal Sections]
const sectionObserverCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserverOptions = {
  root: null,
  threshold: 0.2,
};

const sectionObserver = new IntersectionObserver(
  sectionObserverCallback,
  sectionObserverOptions
);
allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

/////////////////////////////////////[TESTING INTERSECTION OBSERVER API]
const headerImg = document.querySelector(".header--img");
const headerText = document.querySelector(".header--text");

const headerImgObserverCallback = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    headerImg.classList.add("header--img-show");
    headerText.classList.add("header--text-show");
  } else {
    headerImg.classList.remove("header--img-show");
    headerText.classList.remove("header--text-show");
  }
};

const headerImgObserverOptions = {
  root: null,
  threshold: 0.2,
};

const headerImgObserver = new IntersectionObserver(
  headerImgObserverCallback,
  headerImgObserverOptions
);

headerImgObserver.observe(header);

/////////////////////////////////////[Lazy Loading Images]
const imgTargets = document.querySelectorAll("img[data-src]");
const loading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0.8,
  rootMargin: "-200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

/////////////////////////////////////[Footer Link]
const footer = document.querySelector(".footer__nav");
footer.addEventListener("click", (e) => {
  console.log(e.target);
  e.preventDefault();
  if (e.target.classList.contains("footer__link")) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

/*
/////////////////////////////////////[Slider]

 const goToSlide = function (curSlide) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
    });
  };

LOGIC Part 1 : 
1. First we select the important element for this to work
2. Next we select all the slide components (stuff that we're going to slide)
   a). First we select all of the slide components and use 'forEach' method on it
   b). How this work is mainly because of the 'transform' properties in css
       of course that we select and manipulate with JavaScript.
   c). We also have to make an additional variable with declaration 'let' so we can
       alter the value, and help our slider
   d). Then, we manipulate the value translateX in the transform properties,
       since it will completely gone with 100%, use 100 times (the current index
       minus the current slide number), but why?.
   e). imagine the current index is now 1 (we got 1 after we increment the default).
       then, when we click the next slide btn, the next index which is index 1, is 
       going to be deducted by the current index value which is 1, resulting in 0.
       Now remember the formula 100 * (index - currentIndex) => 100 * (0 * 0);
       and by doing so, transform = translateX(0%) will bring the next slide to our
       current view.

       The same concept also applies when we wanna go back to the previous content of the
       slider, but the difference is only we decrease the currentIndex value by 1 and deducting
       the index by current index value. example

       index = 1;
       current index since it's decrement resulting in 0
       when we go back to the formula, 100 * (1 - 0) = 1
       so, transform = translateX(100%) resulting the current slide goes to the right

*/

/*
/////////////////////////////////////[Actvate Dot & Creating the Dot]

createDots Function:

1. The createDots function is responsible for generating dot indicators for each slide
   in a slider.

2. It iterates over the slides array using forEach, and for each slide, it inserts HTML
   for a dot button into the dots element.

3. Each dot button is given a data-slide attribute with the corresponding index of the
   slide.

activateDot Function:

1. The activateDot function is used to highlight the currently active slide's
   dot indicator.

2. It starts by selecting all dot elements with the class "dots__dot" and removes the
   "dots__dot--active" class from all of them to deactivate any previously active dots.

3. It then selects the dot corresponding to the currently active slide by using
   the data-slide attribute, and adds the "dots__dot--active" class to highlight it.
*/

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const rightBtn = document.querySelector(".slider__btn--right");
const leftBtn = document.querySelector(".slider__btn--left");
const dots = document.querySelector(".dots");

// Functions
const mainSlider = function () {
  //
  const goToSlide = function (curSlide) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
    });
  };

  const createDots = function () {
    slides.forEach((_, index) => {
      dots.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    const allDot = document.querySelectorAll(".dots__dot");
    allDot.forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  let currentSlide = 0;

  const nextSlide = function () {
    if (currentSlide >= slides.length - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const previousSlide = function () {
    currentSlide--;
    if (currentSlide <= 0) {
      currentSlide = 0;
    } else {
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  //Initialization
  const initialization = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };

  initialization();

  // Event Handler
  rightBtn.addEventListener("click", nextSlide);
  leftBtn.addEventListener("click", previousSlide);

  document.addEventListener("keydown", (e) => {
    console.log(e.key);
    e.key === "ArrowLeft" && previousSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dots.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

mainSlider();
document.addEventListener("DOMContentLoaded", (e) => {
  console.log("HTML Parsed and DOM Tree Built", e);
});

window.addEventListener("load", (e) =>
  console.log("HTML & CSS is fully loaded", e)
);

window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
  console.log(e);
  e.returnValue = "";
});

/*
EXPERIMENT

/////////////////////////////////////[Mouse Event]

const onceAlert = (e) => {
  alert("You're hovering the h1");
  h1.removeEventListener("mouseleave", onceAlert);
};

h1.addEventListener("mouseleave", onceAlert);

/////////////////////////////////////[Bubbling & Capturing in DOM event propagation]

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector(".nav__link").addEventListener("click", function (e) {
  console.log(e.target, e.currentTarget);
  e.currentTarget.style.backgroundColor = randomColor();
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  console.log(e.target, e.currentTarget);
  e.currentTarget.style.backgroundColor = randomColor();
});

document.querySelector(".nav").addEventListener("click", function (e) {
  console.log(e.target, e.currentTarget);
  e.currentTarget.style.backgroundColor = randomColor();
});

/////////////////////////////////////[DOM Traversing]

const h1 = document.querySelector("h1");

// Going downwards: Child
console.log(h1.querySelectorAll(".highlight"));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = "blue";
h1.lastElementChild.style.color = "red";

// Going upwards: Parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(".header").style.background = "var(--gradient-secondary)";
h1.closest("h1").style.background = "var(--gradient-primary)";

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
const h1Sibling = [...h1.parentElement.children];
h1Sibling.forEach((elem) => {
  if (elem !== h1) {
    elem.style.transform = "scale(0.5)";
  }
});

const fullName = function (hometown) {
  return `Hai, i'm ${this.firstName} ${this.lastName} from ${hometown}`;
};

const hasan = {
  firstName: "Hasan",
  lastName: "Basri",
};

console.log(fullName.call(hasan, "Banjarmasin"));

const alun = {
  firstName: "Syarifah",
  lastName: "Fadlun",
};

console.log(fullName.call(alun, "Samarinda"));
*/
