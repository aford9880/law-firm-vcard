(function () {
  'use strict';

  var form = document.getElementById('consultForm');
  var nameInput = document.getElementById('formName');
  var phoneInput = document.getElementById('formPhone');
  var serviceInput = document.getElementById('formService');
  var nameError = document.getElementById('nameError');
  var phoneError = document.getElementById('phoneError');
  var serviceError = document.getElementById('serviceError');
  var modal = document.getElementById('successModal');
  var modalClose = document.getElementById('modalClose');

  function validateName(value) {
    return value.trim().length >= 2;
  }

  function validatePhone(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  }

  function validateService(value) {
    return !!(value && value !== '');
  }

  function formatPhone(value) {
    var digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits[0] === '7' || digits[0] === '8') {
      digits = digits.substring(1);
    }
    var result = '+7';
    if (digits.length > 0) result += ' (' + digits.substring(0, 3);
    if (digits.length > 3) result += ') ' + digits.substring(3, 6);
    if (digits.length > 6) result += '-' + digits.substring(6, 8);
    if (digits.length > 8) result += '-' + digits.substring(8, 10);
    return result;
  }

  function setError(input, errorEl, message) {
    input.classList.add('error');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.textContent = '';
  }

  function validateField(input, errorEl, validator, message) {
    if (!validator(input.value)) {
      setError(input, errorEl, message);
      return false;
    }
    clearError(input, errorEl);
    return true;
  }

  function validateForm() {
    var isValid = true;

    if (!validateField(nameInput, nameError, validateName, 'Имя должно содержать минимум 2 символа')) {
      isValid = false;
    }

    if (!validateField(phoneInput, phoneError, validatePhone, 'Введите корректный номер телефона')) {
      isValid = false;
    }

    if (!validateField(serviceInput, serviceError, validateService, 'Выберите услугу из списка')) {
      isValid = false;
    }

    return isValid;
  }

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function submitForm(data) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        console.log('Form submitted:', data);
        resolve({ success: true });
      }, 500);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    var submitBtn = form.querySelector('.form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    var formData = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      service: serviceInput.value,
      comment: document.getElementById('formComment').value.trim()
    };

    submitForm(formData).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
      form.reset();
      [nameInput, phoneInput, serviceInput].forEach(function (el) {
        el.classList.remove('error');
      });
      [nameError, phoneError, serviceError].forEach(function (el) {
        el.textContent = '';
      });
      openModal();
    });
  }

  function init() {
    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    nameInput.addEventListener('blur', function () {
      validateField(nameInput, nameError, validateName, 'Имя должно содержать минимум 2 символа');
    });

    phoneInput.addEventListener('input', function () {
      var cursorPos = this.selectionStart;
      var rawLen = this.value.replace(/\D/g, '').length;
      this.value = formatPhone(this.value);
      clearError(this, phoneError);
      if (this.value.replace(/\D/g, '').length >= 10) {
        validateField(this, phoneError, validatePhone, 'Введите корректный номер телефона');
      }
      var newLen = this.value.replace(/\D/g, '').length;
      if (rawLen !== newLen) {
        cursorPos = this.value.length;
      }
      this.setSelectionRange(cursorPos, cursorPos);
    });

    phoneInput.addEventListener('blur', function () {
      validateField(this, phoneError, validatePhone, 'Введите корректный номер телефона');
    });

    serviceInput.addEventListener('change', function () {
      if (this.value) {
        clearError(this, serviceError);
      }
    });

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('modal__overlay')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.__formTest = {
    validateName: validateName,
    validatePhone: validatePhone,
    validateService: validateService,
    formatPhone: formatPhone
  };
})();
