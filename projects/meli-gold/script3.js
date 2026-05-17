window.onload = () => {
  const tl = gsap.timeline();

  tl.fromTo(
    ".hand",
    { y: 100 },
    { duration: 1, y: -50, ease: "power2.out" }
  );

  tl.to(
    ".hand",
    {
      duration: 0.8,
      x: "-33vw",
      ease: "power2.out",
    },
    "+=0.8"
  );


  tl.fromTo(
    ".notifBox",
    { y: 100, opacity: 0 },
    { duration: 1, y: 0, opacity: 1, ease: "power2.out" },
    "-=0.3"
  );

  tl.fromTo(
    ".overline1",
    { y: -70, opacity: 0 },
    { duration: 1, y: 0, opacity: 1, ease: "power2.out" },
    "-=0.7"
  );

  tl.to(
    ".notifBox",
    {
      duration: 0.8,
      scale: 1.08,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    },
    "+=0"
  );


  tl.to(
    ".overline1",
    {
      duration: 1,
      scale: 1.03,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    },
    "<"
  );


  tl.to({}, { duration: 1.8 });

  tl.to(".hand", {
    duration: 1,
    x: "-100vw",
    ease: "power2.in",
  });


  tl.to(
    ".notifBox",
    {
      duration: 1,
      x: "100vw",
      ease: "power2.in",
    },
    "<"
  );


  tl.to(
    ".overline1",
    {
      duration: 1,
      x: "100vw",
      ease: "power2.in",
    },
    "<"
  );

 
  tl.fromTo(
    ".box",
    { y: 50, scaleX: 0 },
    { duration: 1, y: 0, scaleX: 1, ease: "power2.out" }
  );

  tl.fromTo(
    ".hands",
    { y: 50, scaleX: 0 },
    { duration: 1, y: 0, scaleX: 1, ease: "power2.out" }
  );

tl.fromTo(
  ".logo",
  { y: 50, opacity: 0 },
  { duration: 1, y: 0, opacity: 1, ease: "power2.out" }
);


tl.fromTo(
  ".overline2",
  { y: 50, opacity: 0 },
  { duration: 1, y: 0, opacity: 1, ease: "power2.out" },
  "<" 
);


tl.to(".overline2", {
  duration: 0.8,
  scale: 0.8,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut",
});


tl.to(
  ".righHand1",
  { duration: 0.5, opacity: 0, ease: "power2.out" },
  "+=1"
);

tl.to(
  ".righ-hand-open",
  { 
    duration: 0.5, 
    opacity: 1, 
    ease: "power2.out" 
  },
  "<" 
);

  tl.to(
    ".gold",
    { 
      duration: 0.5, 
      opacity: 1, 
      scale: 1, 
      ease: "power2.out" 
    },
    "<")
    tl.to(
      ".gold",
      {
        duration: 0.5,
        opacity: 1,
        scale: 0.5,
        x: "15vw",
        y: 15, 
        ease: "power2.in"
      },
      "+=2"
    );
    tl.to(
      [".righ-hand-open", ".gold"],
      {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out"
      },
      "+=0.2"
    );
    
    tl.to(
      ".right-hand-half-open",
      {
        duration: 0.5,
        opacity: 1,
        ease: "power2.out"
      },
      "<" 
    );
    tl.to(
      ".right-hand-half-open",
      {
        duration: 0.4,
        opacity: 0,
        ease: "power2.out"
      },
      "+=0.1"
    );
    
    tl.to(
      ".righHand1",
      {
        duration: 0.4,
        opacity: 1,
        ease: "power2.out"
      },
      "<" 
    );

    function handMovement() {
      return gsap.timeline()
        .to(".leftHand1", { 
          duration: 0.3, 
          x: "+=20", 
          rotation: 20,    
          transformOrigin: "center center", 
          ease: "power2.out" 
        })
        .to(".righHand1", { 
          duration: 0.3, 
          x: "-=20", 
          rotation: -20,   
          transformOrigin: "center center",
          ease: "power2.out" 
        }, "<")
        .to(".leftHand1", {
          duration: 0.3,
          x: "+=5",
          y: "+=3",
          rotation: 22,
          ease: "rough({strength: 2, points: 20, template: linear, taper: none, randomize: true, clamp: false})",
          repeat: 3,
          yoyo: true,
        }, "+=0")
        .to(".righHand1", {
          duration: 0.3,
          x: "-=5",
          y: "-=3",
          rotation: -22,
          ease: "rough({strength: 2, points: 20, template: linear, taper: none, randomize: true, clamp: false})",
          repeat: 3,
          yoyo: true,
        }, "<")
        .to([".leftHand1", ".righHand1"], {
          duration: 0.5,
          rotation: "+=15",  
          transformOrigin: "center center",
          ease: "power2.inOut",
        })
        .to([".leftHand1", ".righHand1"], {
          duration: 0.15,
          x: "+=5",
          y: "+=3",
          rotation: "+=2",
          repeat: 3,
          yoyo: true,
          ease: "power1.inOut",
        })
        .to(".leftHand1", { 
          duration: 0.6, 
          x: "0", 
          y: "0",
          rotation: 0, 
          ease: "power2.inOut" 
        }, "+=0.5")
        .to(".righHand1", { 
          duration: 0.6, 
          x: "0", 
          y: "0",
          rotation: 0, 
          ease: "power2.inOut" 
        }, "<");
    }
    tl.add(handMovement());

    tl.to(".leftHand1", { 
      duration: 0.6, 
      x: "0", 
      y: "0",
      rotation: 0, 
      ease: "power2.inOut" 
    }, "+=0.5");
    tl.to(".righHand1", { 
      duration: 0.6, 
      x: "0", 
      y: "0",
      rotation: 0, 
      ease: "power2.inOut" 
    }, "<");  
    tl.add(handMovement());

    tl.fromTo(
      ".btnContainer",
      { y: 50, opacity: 0 },
      { duration: 1, y: -5, opacity: 1, ease: "power2.out" },
      "<+1"
    )
};
setTimeout(() => {
  window.location.reload();
}, 40000);


const rightBtn = document.querySelector(".rightBtn");
const leftBtn = document.querySelector(".leftBtn");

rightBtn.addEventListener("click", () => {
  fire_tag(ACTIONS.CLICK_RIGHTBTN);
  window.open('https://meligold.ir', '_blank');
});

leftBtn.addEventListener("click", () => {
  fire_tag(ACTIONS.CLICK_LEFTBTN);
  window.open('https://meligold.ir', '_blank');
});
