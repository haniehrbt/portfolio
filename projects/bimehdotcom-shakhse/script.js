window.addEventListener('load', function () {
  let wheelTween = null;
  const masterTl = gsap.timeline({
    onComplete: startRandomMode
  });

  masterTl.call(startWheelSpin);
  masterTl.fromTo(".carContainer", { right: "-200px" }, { duration: 2, right: "1.5%", ease: "power3.out", onComplete: stopWheelSpin });
  masterTl.fromTo(".bar", { opacity: 0, y: 10 }, { duration: 1, opacity: 1, y: 0, ease: "power2.out" }, 1.8);
  masterTl.fromTo(".stats-box", { opacity: 0, y: 8, scale: 0.9 }, { duration: 0.9, opacity: 1, y: 0, scale: 1, ease: "back.out(1.6)" }, 2.2);
  masterTl.fromTo(".logo", { opacity: 0, left: "-150px" }, { duration: 1.8, opacity: 1, left: "0px", ease: "power3.out" }, 1);
  masterTl.call(() => updateStats(0));

  masterTl.call(startWheelSpin, null, "+=0.5");
  masterTl.to(".carContainer", { right: "30.5%", duration: 2.6, ease: "power2.inOut", onComplete: stopWheelSpin }, "<");
  masterTl.to(".gradient-fill", { width: "50%", duration: 2.6, ease: "power2.inOut" }, "<");
  masterTl.call(() => updateStats(6), null, "-=0.5");

  masterTl.call(startWheelSpin, null, "+=0.5");
  masterTl.to(".carContainer", { right: "63.5%", duration: 2.6, ease: "power2.inOut", onComplete: stopWheelSpin }, "<");
  masterTl.to(".gradient-fill", { width: "100%", duration: 2.6, ease: "power2.inOut" }, "<");
  masterTl.call(() => updateStats(12), null, "-=0.5");

  masterTl.call(startWheelSpin, null, "+=0.5");
  masterTl.to(".carContainer", { right: "1.5%", duration: 2.6, ease: "power2.inOut", onComplete: stopWheelSpin }, "<");
  masterTl.to(".gradient-fill", { width: "0%", duration: 2.6, ease: "power2.inOut" }, "<");
  masterTl.call(() => updateStats(0), null, "-=0.5");

  masterTl.addLabel("shrinkStart", "+=0.5");

  masterTl.to(".logo", { duration: 1, left: "-200px", opacity: 0, ease: "power2.in" }, "shrinkStart");
  masterTl.to(".bar", { duration: 1.2, top: "73.5%", width: "70%", ease: "power3.inOut" }, "shrinkStart");
  masterTl.to(".stats-box", { duration: 1.2, top: "62px", scale: 0.92, ease: "power3.inOut" }, "shrinkStart");
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
    { right: "1.5%", width: "0%", value: 0 },
    { right: "30.5%", width: "50%", value: 6 },
    { right: "63.5%", width: "100%", value: 12 }
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
    moveTl.call(startWheelSpin);
    moveTl.to(".carContainer", { right: target.right, duration: 2.2, ease: "power2.inOut", onComplete: stopWheelSpin });
    moveTl.to(".gradient-fill", { width: target.width, duration: 2.2, ease: "power2.inOut" }, "<");
    moveTl.call(() => updateStats(target.value), null, "-=0.5");
  }

  function updateStats(value) {
    const numberEl = document.querySelector(".stats-number");
    if (numberEl) numberEl.textContent = value;
  }

  function startWheelSpin() {
    if (wheelTween) {
      wheelTween.kill();
    }
    wheelTween = gsap.to(".wheel", {
      rotation: "+=360",
      duration: 0.35,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%"
    });
  }

  function stopWheelSpin() {
    if (wheelTween) {
      wheelTween.kill();
      wheelTween = null;
    }
    gsap.set(".wheel", { rotation: 0 });
  }
});