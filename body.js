window.addEventListener("DOMContentLoaded", function () {
  if (!gsap) return;
  console.log(1);

  gsap.registerPlugin(MotionPathPlugin);
  gsap.registerPlugin(ScrollTrigger);

  /* Technologies */
  ScrollTrigger.create({
    trigger: ".tech-matter_container",
    start: "top bottom",
    onEnter: () => {
      initTech();
    },
    once: true,
  });

  /* Process */
  initProcess();

  /* FAQ */
  initFAQ();

  /* Track visibility */
  trackVisibility();

  /* Animate Headings */
  animateHeadings();
});

/* Technologies */
function initTech() {
  const matterContainer = document.querySelector(".tech-matter_container");
  const THICCNESS = 60;
  const width = window.innerWidth;
  const isMobile = width < 767;

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
    },
  });

  [...document.querySelectorAll(".tech-matter_logos img")].forEach(function (
    img
  ) {
    const size = img.attributes.render.value;
    let radius, scale;
    const img2 = document.createElement("svg");
    img2.src = img.src;

    console.log(size, img.src);

    if (size == "big") {
      radius = 77;
      scale = 1.5;
      if (isMobile) {
        radius = 47;
        scale = 0.9;
      }
    } else {
      radius = 67;
      scale = 1.3;
      if (isMobile) {
        radius = 37;
        scale = 0.7;
      }
    }

    let circle = Bodies.circle(
      matterContainer.clientWidth / 2,
      -500,
      radius ? radius : 100,
      {
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
  const textList = wrapper.querySelectorAll(".process_text");
  const imgList = [...wrapper.querySelectorAll(".process_img")];

  textList[0].classList.add("is-active");

  imgList.forEach((img, i) => {
    const textWrap = textList[i];
    console.log(i);

    ScrollTrigger.create({
      trigger: img,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        console.log("enter", i, img);
        textList.forEach((text) => text.classList.remove("is-active"));
        textWrap.classList.add("is-active");
      },
      onEnterBack: () => {
        console.log("enterback", i);
        textList.forEach((text) => text.classList.remove("is-active"));
        textWrap.classList.add("is-active");
      },
    });
  });
}

function initFAQ() {
  const bg = document.querySelector(".faq_bg-gradient");

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

  elements.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      onEnter: () => {
        el.classList.add("is-visible");
      },
    });
  });
}

function animateHeadings() {
  // select targets
  const titleEls = document.querySelectorAll("[data-text-animate]");

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
        duration: 0.7,
        stagger: 0.04,
        ease: "power3.out",
      }
    );

    // attach scrolltrigger
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom center",
      animation: titleTween,
    });
  });
}
