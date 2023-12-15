console.log("hi");

gsap.registerPlugin("ScrollTrigger");

const loopTl = gsap.timeline({ paused: true, yoyo: true, repeat: -1 });
loopTl.to(".hero-image", { y: "-1rem", ease: "power2.inOut", duration: 1 });

const loadTl = gsap.timeline();
loadTl.from(".title-wrap", { y: "5rem", opacity: 0 });
loadTl.from(".thumbnail-image", {
  borderRadius: "1rem",
  opacity: 0,
  scale: 0.8,
  stagger: {
    amount: 0.5,
    from: "random",
  },
  duration: 1,
});
loadTl.from(
  ".hero-image",
  {
    scale: 0.8,
    opacity: 0,
    onComplete: function () {
      loopTl.play();
    },
  },
  "<0.5"
);

const sections = document.querySelectorAll(".about-section");

/*
sections.forEach(function (section) {
  const imgTween = gsap.from(section.querySelectorAll(".about-image"), {
    opacity: 0,
    scale: 0.8,
    stagger: { each: 0.5 },
  });

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "top 70%",
    animation: imgTween,
    toggleActions: "none play none reset",
    markers: true,
  });
});
*/

// Scroll base - scrub, 1st way
/*
sections.forEach(function (section) {
  const imgTween = gsap.from(section.querySelectorAll(".about-image"), {
    opacity: 0,
    scale: 0.5,
    // stagger: 0.5,
  });

  ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    end: "bottom bottom",
    animation: imgTween,
    // toggleActions: "none play none reset",
    markers: true,
    scrub: 1,
  });
});
*/
/*
// Scroll base - scrub, 2nd way
sections.forEach(function (section) {
  gsap.from(section.querySelectorAll(".about-image"), {
    opacity: 0,
    scale: 0.5,
    stagger: 0.5,
    // stagger: 0.5,
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      end: "bottom bottom",
      // toggleActions: "none play none reset",
      markers: true,
      scrub: 1,
    },
  });
});
*/

// Scroll base - scrub + pin
sections.forEach(function (section) {
  gsap.from(section.querySelectorAll(".about-image"), {
    opacity: 0,
    scale: 0.5,
    stagger: 0.5,
    // stagger: 0.5,
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=3000px",
      // toggleActions: "none play none reset",
      markers: true,
      scrub: 1,
      pin: true,
    },
  });
});
