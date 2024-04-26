document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth > 992) {
    // For homepage hero section
    changeDevImages();
  }

  trackVisibility();
});

window.addEventListener("load", function () {
  document.body.classList.add("page-loaded");

  setTimeout(() => this.document.body.classList.add("delay-complete"), 3000);

  initTech();

  if (
    window.innerWidth >= 992 &&
    document.querySelector(".process_component")
  ) {
    initProcess();
  }

  pageResize();
});

async function initTech() {
  const techContainer = document.querySelector(".tech-matter_container");

  if (!techContainer) return;

  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"
  );

  const options = {};
  const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        renderTech(techContainer);

        observer.unobserve(entry.target);
      }
    });
  }, options);

  observer.observe(techContainer);
}

function renderTech(matterContainer) {
  if (!matterContainer) return;

  const THICCNESS = 60;
  const width = window.innerWidth;
  const isMobile = width <= 767;
  const isTablet = width < 992 && width > 767;
  const circleY = isMobile ? -200 : -300;

  // module aliases
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

  // create an engine
  var engine = Engine.create();

  // create a renderer
  var render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
      width: matterContainer.clientWidth,
      height: matterContainer.clientHeight,
      background: "transparent",
      wireframes: false,
      showAngleIndicator: false,
      pixelRatio: "auto",
    },
  });

  [...document.querySelectorAll(".tech-matter_logos img")].forEach(function (
    img
  ) {
    let radius = 62;
    let scale = 1.2;
    if (isTablet) {
      radius = 52;
      scale = 1;
    }
    if (isMobile) {
      radius = 29;
      scale = 0.57;
    }

    const circleX = Math.floor(Math.random() * matterContainer.clientWidth);

    let circle = Bodies.circle(circleX, circleY, radius ? radius : 100, {
      friction: 0.3,
      restitution: 0.2,
      render: {
        sprite: {
          texture: img.src,
          yScale: scale ? scale : 2,
          xScale: scale ? scale : 2,
        },
      },
    });
    Composite.add(engine.world, circle);
  });

  var ground = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    matterContainer.clientHeight + THICCNESS / 2,
    1500,
    THICCNESS,
    { isStatic: true, opacity: 0 }
  );

  let leftWall = Bodies.rectangle(
    0 - THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight * 5,
    {
      isStatic: true,
    }
  );

  let rightWall = Bodies.rectangle(
    matterContainer.clientWidth + THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight * 5,
    { isStatic: true }
  );

  let topWall = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    0,
    1500,
    THICCNESS,
    {
      isStatic: true,
    }
  );

  ground.render.opacity = 0;
  leftWall.render.opacity = 0;
  rightWall.render.opacity = 0;
  topWall.render.opacity = 0;

  // add all of the bodies to the world
  Composite.add(engine.world, [ground, leftWall, rightWall]);

  let mouse = Matter.Mouse.create(render.canvas);
  let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  Composite.add(engine.world, mouseConstraint);

  // allow scroll through the canvas
  mouseConstraint.mouse.element.removeEventListener(
    "mousewheel",
    mouseConstraint.mouse.mousewheel
  );
  mouseConstraint.mouse.element.removeEventListener(
    "DOMMouseScroll",
    mouseConstraint.mouse.mousewheel
  );

  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  setTimeout(function () {
    Composite.add(engine.world, [topWall]);
  }, 2000);
}

async function initProcess() {
  // Load GSAP
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js"
  );
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js"
  );

  ScrollTrigger.config({
    normalizeScroll: true,
  });

  const wrapper = document.querySelector(".process_component");

  const textList = wrapper.querySelectorAll(".process_text");
  const imgList = [
    ...wrapper.querySelectorAll(".process_img, .how-slide-wrap.is-v11"),
  ];

  textList[0].classList.add("is-active");

  imgList.forEach((img, i) => {
    const textWrap = textList[i];

    ScrollTrigger.create({
      trigger: img,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        textList.forEach((text) => text.classList.remove("is-active"));
        textWrap.classList.add("is-active");
      },
      onEnterBack: () => {
        textList.forEach((text) => text.classList.remove("is-active"));
        textWrap.classList.add("is-active");
      },
    });
  });
}

function trackVisibility() {
  const elements = document.querySelectorAll("[data-track-visibility]");

  if (!elements.length) return;

  const options = {};
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  }, options);

  elements.forEach((el) => observer.observe(el));
}

function changeDevImages() {
  const imgWrappers = document.querySelectorAll(".talent_bg_dev-images");
  const allImages = document.querySelectorAll(".talent_bg_dev-images img");

  if (!imgWrappers.length > 0) return;

  let target = 1;
  let count = 0;

  const interval = setInterval(function () {
    allImages.forEach((img) => img.classList.remove("is-visible"));

    imgWrappers.forEach((wrapper) => {
      const images = wrapper.querySelectorAll("img");

      images[target].classList.add("is-visible");
    });

    if (target == 2) target = 0;
    else target++;

    if (count == 5) clearInterval(interval);
    else count++;
  }, 5000);
}

// Swiper.js
(() => {
  window.addEventListener("load", async function () {
    const sliderWrapperEls = Array.from(
      document.querySelectorAll(".swiper-component")
    );

    console.log(sliderWrapperEls);

    if (!sliderWrapperEls.length) return;

    if (sliderWrapperEls[0].closest(".hide-desktop") && window.innerWidth > 991)
      return;

    if (sliderWrapperEls[0].dataset.mobileOnly && window.innerWidth > 991)
      return;

    await loadScript(
      "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js"
    );

    const sliders = initSlider(sliderWrapperEls);

    console.log(sliders);

    if (window.location.pathname.includes("/project/")) projectSlider(sliders);

    if (window.innerWidth <= 478) addReadMore(sliders);
  });

  function initSlider(sliderWrapperEls) {
    // Initialize swiper sliders
    const sliders = [];

    sliderWrapperEls.forEach((wrapperEl) => {
      const swiper = wrapperEl.querySelector(".swiper");

      const slidesPerView = wrapperEl.dataset.slidesPerView
        ? +wrapperEl.dataset.slidesPerView
        : 1;

      const desktopAutoHeight = wrapperEl.dataset.desktopAutoHeight;

      const fadeEffect = wrapperEl.dataset.effectFade ? true : false;

      const loop = wrapperEl.dataset.disableLoop ? false : true;

      const arrows = wrapperEl.querySelectorAll(
        ".swiper-arrow-v2, .swiper-arrow-v3, .swiper-arrow-v4"
      );

      const slider = new Swiper(swiper, {
        loop: loop,
        loopAdditionalSlides: 1,
        slidesPerView: slidesPerView,
        spaceBetween: 24,
        speed: 600,
        pagination: {
          el: wrapperEl.querySelector(".swiper-pagination"),
          clickable: true,
          dynamicBullets: true,
        },
        ...(arrows && {
          navigation: {
            prevEl: arrows[0],
            nextEl: arrows[1],
          },
        }),
        breakpoints: {
          0: {
            autoHeight: true,
            slidesPerView: 1,
          },
          992: {
            autoHeight: desktopAutoHeight ? true : false,
            slidesPerView: slidesPerView,
          },
        },
        ...(fadeEffect && {
          effect: "fade",
          fadeEffect: {
            crossFade: true,
          },
        }),
      });

      sliders.push(slider);

      sliders.forEach((slider) => {
        slider.on("slideChange", function () {
          if (window.gsap !== undefined) ScrollTrigger.refresh();
        });
      });
    });

    return sliders;
  }

  // Load next project
  function projectSlider(sliders) {
    const curProjectTitle = document.querySelector("h1").textContent;

    const projects = Array.from(
      document.querySelectorAll(".project-card_title")
    );

    const curProjectIndex = projects.findIndex(
      (project) => project.textContent === curProjectTitle
    );

    sliders[0].slideTo(curProjectIndex + 2);
  }

  // Add read more to reviews
  function addReadMore(sliders) {
    const reviewEls = document.querySelectorAll(".review_text");

    if (!reviewEls.length) return;

    const createReadMoreEl = function (reviewEl) {
      const readMoreEl = document.createElement("div");
      readMoreEl.classList.add("review_read-more");
      readMoreEl.textContent = "Read more";
      readMoreEl.addEventListener("click", function () {
        reviewEl.classList.remove("is-long");
        readMoreEl.remove();
        sliders.forEach((slider) => slider.update());
      });

      return readMoreEl;
    };

    reviewEls.forEach((reviewEl) => {
      if (reviewEl.clientHeight >= 145) {
        reviewEl.classList.add("is-long");
        reviewEl.insertAdjacentElement("afterend", createReadMoreEl(reviewEl));
      }
    });
  }
})();

function pageResize() {
  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  };

  const initialWidth = window.innerWidth;

  const desktop = initialWidth >= 992;
  const tablet = initialWidth < 992 && initialWidth > 767;
  const mobilePotrait = initialWidth <= 767 && initialWidth > 478;
  const mobile = initialWidth <= 478;

  const handleresize = debounce((ev) => {
    const curWidth = window.innerWidth;

    if (desktop && curWidth < 992) {
      location.reload();
    }
    if (tablet && (curWidth >= 992 || curWidth <= 767)) {
      location.reload();
    }
    if (mobilePotrait && (curWidth > 767 || curWidth <= 478)) {
      location.reload();
    }
    if (mobile && curWidth > 478) {
      location.reload();
    }
  }, 250);

  window.addEventListener("resize", handleresize);
}
