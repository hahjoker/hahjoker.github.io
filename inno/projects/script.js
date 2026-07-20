const carousel = document.querySelector(".carousel");
const cards = [...document.querySelectorAll(".card")];
const filterButtons = [...document.querySelectorAll(".filter")];
const prevBtn = document.querySelector(".nav-arrow--prev");
const nextBtn = document.querySelector(".nav-arrow--next");

function applyFilter(category) {
  cards.forEach((card) => {
    const match = category === "all" || card.dataset.cat === category;
    card.classList.toggle("is-hidden", !match);
  });
  carousel.scrollTo({ left: 0, behavior: "smooth" });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const wasActive = btn.classList.contains("active");
    filterButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });

    if (wasActive) {
      applyFilter("all");
    } else {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      applyFilter(btn.dataset.filter);
    }
  });
});

function visibleCardWidth() {
  const card = cards.find((c) => !c.classList.contains("is-hidden"));
  return card ? card.getBoundingClientRect().width + 28 : 320;
}

function scrollByCard(direction) {
  carousel.scrollBy({ left: direction * visibleCardWidth(), behavior: "smooth" });
}

prevBtn.addEventListener("click", () => scrollByCard(-1));
nextBtn.addEventListener("click", () => scrollByCard(1));

carousel.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    scrollByCard(1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    scrollByCard(-1);
  }
});

carousel.addEventListener(
  "wheel",
  (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      carousel.scrollLeft += e.deltaY;
    }
  },
  { passive: false }
);

let isDown = false;
let dragMoved = false;
let startX = 0;
let startScroll = 0;

carousel.addEventListener("pointerdown", (e) => {
  isDown = true;
  dragMoved = false;
  startX = e.clientX;
  startScroll = carousel.scrollLeft;
  carousel.classList.add("is-dragging");
});

window.addEventListener("pointermove", (e) => {
  if (!isDown) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 5) dragMoved = true;
  carousel.scrollLeft = startScroll - dx;
});

window.addEventListener("pointerup", () => {
  isDown = false;
  carousel.classList.remove("is-dragging");
});

carousel.addEventListener(
  "click",
  (e) => {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  },
  true
);
