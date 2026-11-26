(function () {
  var stage = document.querySelector(".stage");
  var items = Array.prototype.slice.call(stage.querySelectorAll(".item"));
  var home = items.map(function (el) {
    return { el: el, x: el.style.getPropertyValue("--x"), y: el.style.getPropertyValue("--y") };
  });
  var top = 10;
  var drag = null;
  var suppressClick = false;

  // Pixels per design unit; mirrors the left/top formulas in css/pile.css.
  function scales() {
    var w = stage.clientWidth;
    var h = stage.clientHeight;
    var my = parseFloat(getComputedStyle(stage).getPropertyValue("--my"));
    return { sx: (w / 2 - Math.min(150, 0.22 * w)) / 520, sy: (h / 2 - my) / 330 };
  }

  stage.addEventListener("pointerdown", function (e) {
    var el = e.target.closest(".item");
    if (!el || (e.pointerType === "mouse" && e.button !== 0)) return;
    el.style.zIndex = ++top;
    var s = scales();
    drag = {
      el: el,
      id: e.pointerId,
      px: e.clientX,
      py: e.clientY,
      x: parseFloat(el.style.getPropertyValue("--x")),
      y: parseFloat(el.style.getPropertyValue("--y")),
      sx: s.sx,
      sy: s.sy,
      moved: false,
    };
  });

  stage.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.px;
    var dy = e.clientY - drag.py;
    if (!drag.moved) {
      if (Math.abs(dx) + Math.abs(dy) <= 4) return;
      drag.moved = true;
      drag.el.setPointerCapture(drag.id);
      drag.el.classList.add("is-held");
    }
    drag.el.style.setProperty("--x", drag.x + dx / drag.sx);
    drag.el.style.setProperty("--y", drag.y + dy / drag.sy);
  });

  function drop(e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.el.classList.remove("is-held");
    if (drag.moved) {
      suppressClick = true;
      setTimeout(function () {
        suppressClick = false;
      }, 0);
    }
    drag = null;
  }
  stage.addEventListener("pointerup", drop);
  stage.addEventListener("pointercancel", drop);

  stage.addEventListener(
    "click",
    function (e) {
      if (suppressClick) e.preventDefault();
    },
    true
  );

  var reset = document.createElement("button");
  reset.type = "button";
  reset.className = "corner reset";
  reset.textContent = "pile it back up";
  reset.addEventListener("click", function () {
    home.forEach(function (h) {
      h.el.style.setProperty("--x", h.x);
      h.el.style.setProperty("--y", h.y);
      h.el.style.zIndex = "";
    });
    top = 10;
  });
  stage.appendChild(reset);
})();
