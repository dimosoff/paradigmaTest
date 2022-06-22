import * as myFunctions from './functions.mjs';

myFunctions.linksPreventDefault();
// myFunctions.addClassOnScroll('.header', 35, '_scrolled');
myFunctions.addClassOnClick('.burger', '.header', '_menu-opened');

const popupOverlay = document.querySelector('.popup-overlay');
const callMePopopup = document.querySelector('.call-me-popup');
const callMeButton = document.querySelector("button[name='call-me']");
const featuresButton = document.querySelector('button[name=features-button]');
const featuresElement = document.querySelector('.b-features');
const popupCloseButton = document.querySelector("button[name='call-me-close']");
const popupPhoneElement = document.querySelector("[name='call-me-phone']");

const form = document.querySelector("form[name='call-me-form']");
const formRequiredElements = document.querySelectorAll('[data-required]');

const popupOverlayClassActive = `${popupOverlay.className}_active`;
const callMePopopupClassActive = `${callMePopopup.className}_active`;
const featuresClassActive = 'b-features_active';

const inputMessageClass = 'call-me-popup__error-message';
const inputMessageClassActive = `${inputMessageClass}_active`;

const inputClass = 'f-item__input';
const inputClassError = `${inputClass}_error`;
const inputClassValid = `${inputClass}_valid`;

const errorMessages = {
  emptyPhone: 'Введите телефон',
  wrongPhone: 'Неверный телефон',
  uncheckedPolicy: 'Подтвердите соглашение конфиденциальности'
};

callMeButton.addEventListener('click', async () => {
  popupOverlay.classList.toggle(popupOverlayClassActive);
  callMePopopup.classList.toggle(callMePopopupClassActive);
  await popupPhoneElement.focus();
});

popupCloseButton.addEventListener('click', () => {
  popupOverlay.classList.remove(popupOverlayClassActive);
  callMePopopup.classList.remove(callMePopopupClassActive);
});

featuresButton.addEventListener('click', () => {
  popupOverlay.classList.toggle(popupOverlayClassActive);
  featuresElement.classList.toggle(featuresClassActive);
});

popupOverlay.addEventListener('click', () => {
  popupOverlay.classList.remove(popupOverlayClassActive);
  callMePopopup.classList.remove(callMePopopupClassActive);
  featuresElement.classList.remove(featuresClassActive);
});

popupPhoneElement.addEventListener('input', (e) => {
  let x = e.target.value.replace(/((?!\+)\D+)+/g, '').match(/^(\+7{0,2})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
  let phoneArray = '';

  if (x === null || !x[1]) {
    phoneArray = '';
  } else if (x[1] && !x[2]) {
    phoneArray = `${x[1]}`;
  } else if (x[1] && x[2] && !x[3]) {
    phoneArray = `${x[1]} (${x[2]}`;
  } else if (x[1] && x[2] && x[3] && !x[4]) {
    phoneArray = `${x[1]} (${x[2]}) ${x[3]}`;
  } else if (x[1] && x[2] && x[3] && x[4] && !x[5]) {
    phoneArray = `${x[1]} (${x[2]}) ${x[3]}-${x[4]}`;
  } else {
    phoneArray = `${x[1]} (${x[2]}) ${x[3]}-${x[4]}-${x[5]}`;
  }
  e.target.value = phoneArray;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  formRequiredElements.forEach(e => {
    let currentElement = e,
      currentElementSiblings = getSiblings(e);

    if (!currentElement.value) {
      setValidationClasses(currentElement, currentElementSiblings, inputClassValid, inputClassError, 'empty');
    } else {
      switch (currentElement.id) {
        case 'call-me-phone':
          if (!currentElement.value.replace(/((?!\+)\D+)+/g, '').match(/^(\+7{0,2}\d{10})/)) {
            setValidationClasses(currentElement, currentElementSiblings, inputClassValid, inputClassError, 'wrong');
          } else {
            setValidationClasses(currentElement, currentElementSiblings, inputClassError, inputClassValid);
          }
          break;
        case 'call-me-policy':
          if (!currentElement.checked) {
            setValidationClasses(currentElement, currentElementSiblings, inputClassValid, inputClassError, 'empty');
          } else {
            setValidationClasses(currentElement, currentElementSiblings, inputClassError, inputClassValid);
          }
          break;
      }
    }
  })

  if (!document.querySelectorAll('[data-required].f-item__input_error').length) {
    const data = new FormData(form);
    let dataArray = [];
    for (const [name, value] of data) {
      dataArray.push([name, value])
    }
    alert(dataArray);
  }
})

function getChildren(n, skipMe) {
  var r = [];
  for (; n; n = n.nextSibling)
    if (n.nodeType == 1 && n != skipMe)
      r.push(n);
  return r;
};

function getSiblings(n) {
  return getChildren(n.parentNode.firstChild, n);
}

function setErrorMessage(curElLabel, curEl, errorType) {
  if (curElLabel.classList.contains(inputMessageClassActive) &&
    curEl.classList.contains(inputClassValid) && !errorType) {
    curElLabel.classList.remove(inputMessageClassActive);
    curElLabel.textContent = '';
    return;
  }
  if (curElLabel.classList.contains(inputMessageClass) && errorType == 'empty') {
    curElLabel.classList.add(inputMessageClassActive);
    switch (curEl.id) {
      case "call-me-phone":
        curElLabel.textContent = errorMessages.emptyPhone;
        curEl.focus();
        break;
      case "call-me-policy":
        curElLabel.textContent = errorMessages.uncheckedPolicy;
        curEl.focus();
        break;
    }
    return;
  }
  if (curElLabel.classList.contains(inputMessageClass) && errorType == 'wrong') {
    curElLabel.classList.add(inputMessageClassActive);
    switch (curEl.id) {
      case "call-me-phone":
        curElLabel.textContent = errorMessages.wrongPhone;
        curEl.focus();
        break;
    }
    return;
  }
}

function setValidationClasses(curEl, curElSibl, msgRemove, msgAdd, errorType = '') {
  if (curEl.classList.contains(msgRemove)) curEl.classList.remove(msgRemove);
  if (!curEl.classList.contains(msgAdd)) curEl.classList.add(msgAdd);

  curElSibl.forEach(e => {
    setErrorMessage(e, curEl, errorType);
  })
}