// General code after DOM load
window.addEventListener("DOMContentLoaded", function () {
  // only desktop
  if (window.innerWidth > 992) {
    // Change images
    changeDevImages();
  }
});

// Init GSAP animations after DOM load
window.addEventListener("DOMContentLoaded", function () {
  if (window.gsap === undefined) return;

  gsap.registerPlugin(ScrollTrigger);

  // Track visibility
  trackVisibility();
});

// Init GSAP animations after window load
window.addEventListener("load", function () {
  if (window.gsap === undefined) return;

  // only desktop
  if (window.innerWidth > 992) {
    // Process
    initProcess();

    // FAQ
    initFAQ();
  }

  // Animate Headings
  animateHeadings();

  // Technologies
  initTech();
});

function initTech() {
  const techContainer = document.querySelector(".tech-matter_container");

  if (!techContainer) return;

  ScrollTrigger.create({
    trigger: techContainer,
    start: "top bottom",
    onEnter: () => {
      renderTech(techContainer);
    },
    once: true,
  });
}

/* Technologies */
function renderTech(matterContainer) {
  if (!matterContainer) return;

  const THICCNESS = 60;
  const width = window.innerWidth;
  const isMobile = width < 600;
  const isTablet = width < 992 && width > 600;

  // module aliases
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events;

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
        radius = 37;
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
        radius = 34;
        scale = 0.65;
      }
    }
    if (size == "small") {
      radius = 56;
      scale = 1.1;
      if (isTablet) {
        radius = 47;
        scale = 0.9;
      }
      if (isMobile) {
        radius = 29;
        scale = 0.55;
      }
    }

    let circle = Bodies.circle(
      matterContainer.clientWidth / 2,
      -500,
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
  }, 1500);
}

function initProcess() {
  const wrapper = document.querySelector(".process_component");

  if (!wrapper) return;

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

function initFAQ() {
  const bg = document.querySelector(".faq_bg-gradient");

  if (!bg) return;

  gsap.to(bg, {
    scrollTrigger: {
      trigger: bg,
      start: "top bottom",
      end: "top -25%",
      scrub: 1,
    },
    width: "100%",
    borderRadius: 0,
  });
}

function trackVisibility() {
  const elements = document.querySelectorAll("[data-track-visibility]");

  if (!elements.length > 0) return;

  elements.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      // markers: true,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        el.classList.add("is-visible");
      },
      onLeave: () => {
        el.classList.remove("is-visible");
      },
      onEnterBack: () => {
        el.classList.add("is-visible");
      },
      onLeaveBack: () => {
        el.classList.remove("is-visible");
      },
    });
  });
}

function animateHeadings() {
  // select targets
  const titleEls = document.querySelectorAll("[data-text-animate]");

  if (!titleEls.length > 0) return;

  // loop through each target
  titleEls.forEach((el) => {
    // split text
    const splittedText = new SplitType(el);

    // tween
    const titleTween = gsap.fromTo(
      splittedText.chars,
      {
        y: 25,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.03,
        ease: "power3.out",
      }
    );

    // attach scrolltrigger
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      animation: titleTween,
      once: true,
      // markers: true,
    });
  });
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
