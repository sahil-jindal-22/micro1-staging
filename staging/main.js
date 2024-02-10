document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth > 992) {
    // For homepage hero section
    changeDevImages();
  }

  trackVisibility();

  window.addEventListener("load", () =>
    document.body.classList.add("page-loaded")
  );
});

window.addEventListener("load", function () {
  setTimeout(function () {
    initTech();

    // GSAP based code next
    if (
      window.innerWidth > 992 &&
      document.querySelector(".process_component")
    ) {
      initProcess();
    }
  }, 100);
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

        console.log("done");
      }
    });
  }, options);

  observer.observe(techContainer);
}

function renderTech(matterContainer) {
  if (!matterContainer) return;

  const THICCNESS = 60;
  const width = window.innerWidth;
  const isMobile = width < 600;
  const isTablet = width < 992 && width > 600;
  const circleY = isMobile ? -200 : -550;

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
    const size = img.attributes.render.value;
    let radius, scale;
    const img2 = document.createElement("svg");
    img2.src = img.src;

    if (size == "big") {
      radius = 77;
      scale = 1.5;
      if (isTablet) {
        radius = 62;
        scale = 1.2;
      }
      if (isMobile) {
        radius = 36;
        scale = 0.7;
      }
    }
    if (size == "medium") {
      radius = 62;
      scale = 1.2;
      if (isTablet) {
        radius = 52;
        scale = 1;
      }
      if (isMobile) {
        radius = 29;
        scale = 0.57;
      }
    }
    if (size == "small") {
      radius = 51;
      scale = 1;
      if (isTablet) {
        radius = 47;
        scale = 0.9;
      }
      if (isMobile) {
        radius = 26;
        scale = 0.5;
      }
    }

    let circle = Bodies.circle(
      matterContainer.clientWidth / 2,
      circleY,
      radius ? radius : 100,
      {
        friction: 0.3,
        restitution: 0.2,
        render: {
          sprite: {
            texture: img.src,
            yScale: scale ? scale : 2,
            xScale: scale ? scale : 2,
          },
        },
      }
    );
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

  if (!imgWrappers.length > 0) return;

  imgWrappers.forEach((_, i) => {
    const images = imgWrappers[i].querySelectorAll("img");

    let target = 1;

    setInterval(() => {
      images.forEach((img) => img.classList.remove("is-visible"));
      images[target].classList.add("is-visible");

      if (target == 2) target = 0;
      else target++;
    }, 5000);
  });
}

// Swiper.js
(() => {
  window.addEventListener("load", function () {
    setTimeout(swiper, 100);

    async function swiper() {
      const sliderWrapperEls = document.querySelectorAll(".swiper-component");

      if (!sliderWrapperEls.length) return;

      if (
        sliderWrapperEls[0].closest(".hide-desktop") &&
        window.innerWidth > 991
      )
        return;

      await loadScript(
        "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js"
      );

      const sliders = initSlider();

      if (window.location.pathname.includes("/project/"))
        projectSlider(sliders);
    }
  });

  function initSlider() {
    // Initialize swiper sliders
    const sliders = [];

    const sliderWrapperEls = Array.from(
      document.querySelectorAll(".swiper-component")
    );

    sliderWrapperEls.forEach((wrapperEl) => {
      const swiper = wrapperEl.querySelector(".swiper");

      const slidesPerView = wrapperEl.dataset.slidesPerView
        ? +wrapperEl.dataset.slidesPerView
        : 1;

      const desktopAutoHeight = wrapperEl.dataset.desktopAutoHeight;

      const fadeEffect = wrapperEl.dataset.effectFade ? true : false;

      const arrows = wrapperEl.querySelectorAll(
        ".swiper-arrow-v2, .swiper-arrow-v3, .swiper-arrow-v4"
      );

      const slider = new Swiper(swiper, {
        loop: true,
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

    sliders[0].slideTo(curProjectIndex + 1);
  }
})();
