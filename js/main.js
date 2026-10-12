// Language Selector Toggle
document.addEventListener('DOMContentLoaded', function() {
  const langToggle = document.getElementById('langToggle');
  const langMenu = document.getElementById('langMenu');

  if (langToggle && langMenu) {
    langToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      langMenu.classList.toggle('show');
      langToggle.classList.toggle('active');
    });

    // Store language preference when user clicks a language option
    const langOptions = langMenu.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      option.addEventListener('click', function(e) {
        // Extract language code from the href (e.g., /en/ or /af/)
        const href = this.getAttribute('href');
        const langCode = href.split('/').filter(Boolean)[0]; // Gets 'en' or 'af'

        // Store the preference
        localStorage.setItem('preferredLanguage', langCode);
      });
    });

    // Close language menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!langMenu.contains(e.target) && !langToggle.contains(e.target)) {
        langMenu.classList.remove('show');
        langToggle.classList.remove('active');
      }
    });
  }

  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileDrawer.classList.toggle('open');
      mobileMenuToggle.classList.toggle('active');
    });

    // Close drawer when clicking a link
    const drawerLinks = mobileDrawer.querySelectorAll('.drawer-link');
    drawerLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileDrawer.classList.remove('open');
        mobileMenuToggle.classList.remove('active');
      });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileDrawer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileMenuToggle.classList.remove('active');
      }
    });
  }

  // Dialogs: a [data-dialog-open="id"] button opens the <dialog id="id"> as a modal
  document.querySelectorAll('[data-dialog-open]').forEach(function(opener) {
    const dialog = document.getElementById(opener.dataset.dialogOpen);
    if (!dialog || typeof dialog.showModal !== 'function') return;

    opener.addEventListener('click', function() { dialog.showModal(); });
    dialog.querySelectorAll('[data-dialog-close]').forEach(function(button) {
      button.addEventListener('click', function() { dialog.close(); });
    });
    // A click on the backdrop lands on the dialog element itself
    dialog.addEventListener('click', function(e) {
      if (e.target === dialog) dialog.close();
    });
  });

  // Highlights carousel (coverflow): the centred slide is full size, neighbours shrink and fade.
  // Adds arrows and dots to a plain scroll-snap strip.
  document.querySelectorAll('[data-carousel]').forEach(function(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    if (slides.length < 2) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduceMotion ? 'auto' : 'smooth';
    const SCALE_DROP = 0.15;    // scale lost per slide away from the centre
    const OPACITY_DROP = 0.325; // opacity lost per slide away from the centre
    const MAX_STEPS = 2;        // slides beyond this look the same as this one

    function makeButton(className, label, text) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.setAttribute('aria-label', label);
      if (text) button.textContent = text;
      return button;
    }

    function centreOf(slide) {
      return slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2;
    }

    function goTo(index) {
      track.scrollTo({ left: centreOf(slides[index]), behavior: behavior });
    }

    const prev = makeButton('carousel-btn carousel-prev', carousel.dataset.labelPrev, '‹');
    const next = makeButton('carousel-btn carousel-next', carousel.dataset.labelNext, '›');
    const dotsBar = document.createElement('div');
    dotsBar.className = 'carousel-dots';
    const dots = slides.map(function(slide, i) {
      const dot = makeButton('carousel-dot', carousel.dataset.labelGoto + ' ' + (i + 1));
      dot.addEventListener('click', function() { goTo(i); });
      dotsBar.appendChild(dot);
      slide.addEventListener('click', function() { goTo(i); });
      return dot;
    });

    carousel.appendChild(prev);
    carousel.appendChild(next);
    carousel.appendChild(dotsBar);
    carousel.classList.add('is-enhanced');

    let active = 0;

    function update() {
      const step = slides[1].offsetLeft - slides[0].offsetLeft;
      const trackCentre = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let nearestDistance = Infinity;

      slides.forEach(function(slide, i) {
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - trackCentre) / step;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = i;
        }
        if (!reduceMotion) {
          const steps = Math.min(distance, MAX_STEPS);
          slide.style.transform = 'scale(' + (1 - SCALE_DROP * steps) + ')';
          slide.style.opacity = 1 - OPACITY_DROP * steps;
        }
      });

      active = nearest;
      dots.forEach(function(dot, i) { dot.classList.toggle('active', i === active); });
      prev.disabled = active === 0;
      next.disabled = active === slides.length - 1;
    }

    prev.addEventListener('click', function() { goTo(Math.max(active - 1, 0)); });
    next.addEventListener('click', function() { goTo(Math.min(active + 1, slides.length - 1)); });
    track.addEventListener('scroll', function() { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  });
});
