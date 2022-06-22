export function addClassOnClick(itemClick, classToItem, nameOfClass) {
  document.querySelector(itemClick).addEventListener('click', () => {
    document.querySelectorAll(classToItem).forEach((item) => {
      item.classList.toggle(nameOfClass);
    });
  });
}

export function addClassOnScroll(item, topOffset, nameOfClass) {
  window.addEventListener('scroll', function () {
    if (scrollY > topOffset) {
      document.querySelector(item).classList.add(nameOfClass);
    } else {
      document.querySelector(item).classList.remove(nameOfClass);
    }
  });
  if (scrollY > topOffset) {
    document.querySelector(item).classList.add(nameOfClass);
  }
}

export function linksPreventDefault() {
  document.querySelectorAll("a[href='#']").forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}

export function animate({
  timing,
  draw,
  duration
}) {
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    // вычисление текущего состояния анимации
    let progress = timing(timeFraction);
    draw(progress); // отрисовать её
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

function linear(timeFraction) {
  return timeFraction;
}