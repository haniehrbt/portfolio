window.addEventListener('load', function () {
  const masterTl = gsap.timeline({
    onComplete: startRandomMode
  });

  masterTl.fromTo(".carContainer", { right: "-200px" }, { duration: 2, right: "1.5%", ease: "power3.out" });
  masterTl.fromTo(".bar", { opacity: 0, y: 10 }, { duration: 1, opacity: 1, y: 0, ease: "power2.out" }, 1.8);
  masterTl.fromTo(".dots", { opacity: 0, scale: 0.5, y: 20 }, { duration: 1.2, opacity: 1, scale: 1, y: 0, ease: "back.out(1.7)" }, 1.8);
  masterTl.fromTo(".shadow", { opacity: 0, filter: "blur(10px)", scale: 0.8 }, { duration: 1.5, opacity: 0.8, filter: "blur(0px)", scale: 1, ease: "power2.out" }, 2.5);
  masterTl.fromTo(".logo", { opacity: 0, left: "-150px" }, { duration: 1.8, opacity: 1, left: "0px", ease: "power3.out" }, 1);
  masterTl.set(".dot--start", { className: "dot dot--start active" });

  masterTl.to(".carContainer", { right: "30.5%", duration: 2.6, ease: "power2.inOut" }, "+=0.5");
  masterTl.to(".gradient-fill", { width: "50%", duration: 2.6, ease: "power2.inOut" }, "<");
  masterTl.call(() => updateDots(".dot--center"), null, "-=0.5");

  masterTl.to(".carContainer", { right: "63.5%", duration: 2.6, ease: "power2.inOut" }, "+=0.5");
  masterTl.to(".gradient-fill", { width: "100%", duration: 2.6, ease: "power2.inOut" }, "<");
  masterTl.call(() => updateDots(".dot--end"), null, "-=0.5");

  masterTl.to(".carContainer", { right: "1.5%", duration: 2.6, ease: "power2.inOut" }, "+=0.5");
  masterTl.to(".gradient-fill", { width: "0%", duration: 2.6, ease: "power2.inOut" }, "<");
  masterTl.call(() => updateDots(".dot--start"), null, "-=0.5");

  masterTl.addLabel("shrinkStart", "+=0.5");

  masterTl.to(".logo", { duration: 1, left: "-200px", opacity: 0, ease: "power2.in" }, "shrinkStart");
  masterTl.to(".bar", { duration: 1.2, top: "73.5%", width: "70%", ease: "power3.inOut" }, "shrinkStart");
  masterTl.to(".dots", { duration: 1.2, top: "83%", scale: 0.9, ease: "power3.inOut" }, "shrinkStart");
  masterTl.to(".carContainer", { duration: 1.2, top: "75%", scale: 0.62, ease: "power3.inOut" }, "shrinkStart");

  masterTl.addLabel("bgEnter", "shrinkStart+=0.5");

  masterTl.to(".bg-overlay", {
    duration: 1.2,
    opacity: 1,
    translateY: "0%",
    scaleX: 1,
    ease: "power2.out"
  }, "bgEnter");

  masterTl.to([".logo2", ".overline", ".cta"], {
    duration: 0.8,
    opacity: 1,
    stagger: 0.2,
    ease: "back.out(1.7)",
    onComplete: startCtaPulse
  }, "bgEnter+=0.4");

  function startCtaPulse() {
    gsap.to(".cta", {
      scale: 1.08,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }

  const locations = [
    { right: "1.5%", width: "0%", dot: ".dot--start" },
    { right: "30.5%", width: "50%", dot: ".dot--center" },
    { right: "63.5%", width: "100%", dot: ".dot--end" }
  ];
  let lastIndex = 0;

  function startRandomMode() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * locations.length);
    } while (nextIndex === lastIndex);

    const target = locations[nextIndex];
    lastIndex = nextIndex;

    const moveTl = gsap.timeline({ delay: 0.8, onComplete: startRandomMode });
    moveTl.to(".carContainer", { right: target.right, duration: 2.2, ease: "power2.inOut" });
    moveTl.to(".gradient-fill", { width: target.width, duration: 2.2, ease: "power2.inOut" }, "<");
    moveTl.call(() => updateDots(target.dot), null, "-=0.5");
  }

  function updateDots(activeClass) {
    document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"));
    const el = document.querySelector(activeClass);
    if (el) el.classList.add("active");
  }
});