window.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth > 992) {
    // For homepage hero section
    changeDevImages();
  }

  trackVisibility();

  trackLoginBtn();

  initTech();

  // GSAP based code next
  if (window.gsap !== undefined) {
    ScrollTrigger.config({
      normalizeScroll: true,
    });

    if (window.innerWidth > 992) {
      initProcess();

      initFAQ();
    }
  }
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
  }, 2000);
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

// Track login button
function trackLoginBtn() {
  const loginBtn = document.querySelector("#login-btn");

  if (!loginBtn || !loginBtn.href.includes("login")) return;

  if (location.href.includes("engineer")) return;

  // Pass UTM data to the signup link
  const { utm } = customTrackData;

  let first_page, last_page;

  if (customTrackData.first_page) {
    first_page = document.createElement("a");
    first_page.href = customTrackData.first_page;
    first_page = first_page.pathname;
  }

  if (customTrackData.last_page) {
    last_page = document.createElement("a");
    last_page.href = customTrackData.last_page;
    last_page = last_page.pathname;
  }

  const liveDomain = "www.client.micro1.ai";
  const stagingDomain = "dev.d1y3udqq47tapp.amplifyapp.com";

  let gptVetting = false;

  if (location.href.includes("gpt") || first_page.includes("gpt"))
    gptVetting = true;

  const signupLink = `https://${
    location.href.includes("staging") ? stagingDomain : liveDomain
  }/login?utm_campaign=${utm.utm_campaign ? utm.utm_campaign : ""}&utm_medium=${
    utm.utm_medium ? utm.utm_medium : ""
  }&utm_source=${utm.utm_source ? utm.utm_source : ""}&utm_content=${
    utm.utm_content ? utm.utm_content : ""
  }&first_page=${first_page ? first_page : ""}&last_page=${
    last_page ? last_page : ""
  }&source=${gptVetting ? "gpt-vetting" : "search-talent"}`;

  loginBtn.href = signupLink;
}
