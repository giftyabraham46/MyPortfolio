/**
* Template Name: Lonely
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-lonely/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Switch between the photo-only project gallery and category project details.
   */
  document.querySelectorAll('.project-showcase').forEach(function(showcase) {
    const filters = showcase.querySelectorAll('.project-filters button');
    const gallery = showcase.querySelector('.project-gallery-all');
    const details = showcase.querySelector('.project-detail-list');

    if (!gallery || !details || filters.length === 0) return;

    let galleryWidth = 0;
    function layoutProjectGallery(forceLayout) {
      const currentWidth = gallery.clientWidth;
      if (!currentWidth || (!forceLayout && currentWidth === galleryWidth)) return;
      galleryWidth = currentWidth;

      const styles = getComputedStyle(gallery);
      const rowHeight = parseFloat(styles.gridAutoRows);
      const rowGap = parseFloat(styles.rowGap);

      gallery.querySelectorAll('.project-gallery-tile').forEach(function(tile) {
        const image = tile.querySelector('img');
        if (!image || !image.naturalWidth || !image.clientWidth) return;

        const imageHeight = image.clientWidth * image.naturalHeight / image.naturalWidth;
        const borderHeight = 2 * parseFloat(getComputedStyle(tile).borderTopWidth || '0');
        const span = Math.ceil((imageHeight + borderHeight + rowGap) / (rowHeight + rowGap));
        tile.style.gridRowEnd = 'span ' + span;
      });
    }

    gallery.querySelectorAll('.project-gallery-tile img').forEach(function(image) {
      image.addEventListener('load', function() {
        layoutProjectGallery(true);
      });
    });
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(layoutProjectGallery).observe(gallery);
    } else {
      window.addEventListener('resize', layoutProjectGallery);
    }
    window.addEventListener('load', function() {
      layoutProjectGallery(true);
    });
    layoutProjectGallery(true);

    filters.forEach(function(button) {
      button.addEventListener('click', function() {
        const selectedFilter = button.getAttribute('data-filter');
        const showAllGallery = selectedFilter === 'all';

        gallery.hidden = !showAllGallery;
        details.hidden = showAllGallery;
        details.querySelectorAll('video').forEach(function(video) {
          video.pause();
        });
        details.querySelectorAll('[data-project-category]').forEach(function(project) {
          project.hidden = !showAllGallery && project.getAttribute('data-project-category') !== selectedFilter;
        });

        filters.forEach(function(filterButton) {
          const isActive = filterButton === button;
          filterButton.classList.toggle('filter-active', isActive);
          filterButton.setAttribute('aria-pressed', String(isActive));
        });
      });
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Typed.js hero text animation
   */
  function initTyped() {
    const typedOutput = document.getElementById('typed-output');
    if (!typedOutput || typeof Typed === 'undefined') return;

    new Typed('#typed-output', {
      strings: [
        'AI/ML Engineer',
        'Deep Learning & CV Developer',
        'Data Science Enthusiast',
        'Problem Solver & Builder'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 400,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }
  window.addEventListener('load', initTyped);

})();