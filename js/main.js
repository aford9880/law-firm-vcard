(function () {
  'use strict';

  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var navLinks = document.querySelectorAll('.header__nav-link');

  function toggleMenu() {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  }

  function closeMenu() {
    burger.classList.remove('active');
    nav.classList.remove('open');
  }

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  function handleNavClick(e) {
    e.preventDefault();
    var targetId = this.getAttribute('href').substring(1);
    var target = document.getElementById(targetId);
    if (target) {
      var offset = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
    closeMenu();
  }

  if (burger && nav) {
    burger.addEventListener('click', toggleMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', handleNavClick);
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  document.addEventListener('click', function (e) {
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });
})();
