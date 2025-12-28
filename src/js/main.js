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
});
