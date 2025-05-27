import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

import Lenis from "lenis";

export class ScrollManager {
  scrollContainer: HTMLElement; //contains all the scenes, the horizontal scrolling is in it
  frameContainers: NodeListOf<HTMLElement>; //the individual scenes containers
  scrollElements: { [index: number]: NodeListOf<HTMLElement> } = {}; //the individual scenes containers and the element within
  sceneWidth: number;

  scrollTimeline: GSAPTimeline; //the timeline that plays with the scroll

  constructor() {
    // get HTMLElements
    this.scrollContainer = document.querySelector(
      "#main-container"
    ) as HTMLElement;
    this.frameContainers = document.querySelectorAll(
      ".scene-container"
    ) as NodeListOf<HTMLElement>;
    this.frameContainers.forEach((frameContainer, idx) => {
      this.scrollElements[idx] = frameContainer.querySelectorAll(
        ".scene-element"
      ) as NodeListOf<HTMLElement>;
    });
    this.sceneWidth = (document.querySelector(".scene") as HTMLElement).clientWidth

    // init scrollTrigger & its timeline
    this.scrollTimeline = gsap.timeline();
    this.initScroll();

    this.initLenis();
  }

  //************************ *********************** ************************\\
  //************************ Scroll Trigger & timeline ************************\\
  //************************** *********************** **************************\\

  // Reference for the scrollTrigger:
  // https://gsap.com/community/forums/topic/34273-horizontal-scroll-with-nesteed-animations/ -> timeline on scrollTrigger w/ trigger container & tween -xPercent until pinned section then pinned section anim then -xPercent again

  // Other way to do what we want with scrollTrigger if there's an issue with the technique we're using now:
  // https://gsap.com/community/forums/topic/34434-pinning-inside-of-horizontal-scrolling/ -> the pinned slider goes against the horizontal scrolling animation (with a positive xPercent)

  // Duration of the animations: duration of tweens is proportion within the global scrollTrigger
  // https://gsap.com/community/forums/topic/24482-change-speed-of-scrolltrigger-animations-on-timeline/
  // Duration of the global timeline depends on end parameter of ScrollTrigeer

  /**
   * Makes the link between scroll and the animation timeline & feeds the timeline its animations between each scenes and within each scenes
   */
  initScroll() {
    ScrollTrigger.create({

      trigger: this.scrollContainer,
      animation: this.scrollTimeline,
      pin: true,
      scrub: true,
      end: window.innerWidth * this.frameContainers.length, // this affects the speed of the scroll
    });

    this.frameContainers.forEach((_, idx) => {
      this.scrollWithin(idx);

      if (idx === this.frameContainers.length - 1) return; //don't get to the next scene for the last scene
      //get to the next scene
      this.scrollTimeline.to(this.scrollContainer, {
        x: "-=100vw",
      });
    });
  }

  /**
   * adds to the timeline the animation for a given scene
   * @param i the index of the scene
   */
  scrollWithin(i: number) {
    //add to scrollTrigger timeline anims for each scenes
    switch (i) {
      case 0:
        this.scrollWithinFrameOne();
        break;
      case 1:
        this.scrollWithinFrameTwo();
        break;
      case 2:
        this.scrollWithinFrameThree();
        break;
      case 3:
        this.scrollWithinFrameFour();
        break;
      default:
        break;
    }
  }

  /**
   * adds to the scrollTrigger timeline all the animation happening during the focus on the first scene
   */
  scrollWithinFrameOne() {
    //au scroll le texte se lance + son
    const sceneText = this.frameContainers[0].querySelector('.animated-text') as HTMLElement
    this.scrollTimeline.add(this.createSplitTextAnim(sceneText));

    //zoom au tout debut
    this.scrollTimeline.to(".zoom-in", {
      scale: 1.5,
      stager: 1,
      duration: 0.1
    })

    //texte qui part vers le bas
    this.scrollTimeline.to(".text-1", {
      y: 1000,
      duration: 2
    })
    //texte qui apparait
    const sceneText2 = this.frameContainers[0].querySelector('.text-2') as HTMLElement
    this.scrollTimeline.add(this.createSplitTextAnim(sceneText2));

    //texte qui part vers le bas
    this.scrollTimeline.to(".text-2", {
      y: 1000,
      duration: 5
    })
    //fée qui apparait
    this.scrollTimeline.to(".fee-scene-1", {
      x: 400,
      duration: 3
    })
    //text qui apparait
    const sceneText3 = this.frameContainers[0].querySelector('.text-3') as HTMLElement
    this.scrollTimeline.add(this.createSplitTextAnim(sceneText3), "<");
    //texte qui part vers le bas
    this.scrollTimeline.to(".text-3", {
      y: 1000,
      duration: 5
    })
    //text qui apparait
    const sceneText4 = this.frameContainers[0].querySelector('.text-4') as HTMLElement
    this.scrollTimeline.add(this.createSplitTextAnim(sceneText4));
    //texte qui part vers le bas
    this.scrollTimeline.to(".text-4", {
      y: 1000,
      duration: 5
    })


  }

  /**
   * adds to the scrollTrigger timeline all the animation happening during the focus on the second scene
   */
  scrollWithinFrameTwo() {
    const sceneText = this.frameContainers[1].querySelector('.animated-text') as HTMLElement
    this.scrollTimeline.add(this.createSplitTextAnim(sceneText));
    this.scrollTimeline.to(this.scrollElements[1][0], {
      x: -this.scrollElements[1][0].clientWidth + this.sceneWidth,
    });
    this.scrollTimeline.to(
      this.scrollElements[1][1],
      {
        x: -this.scrollElements[1][1].clientWidth + this.sceneWidth,
      },
      "<"
    );
    this.scrollTimeline.to(
      this.scrollElements[1][2],
      {
        x: -this.scrollElements[1][2].clientWidth + this.sceneWidth,
      },
      "<"
    );
  }

  /**
   * adds to the scrollTrigger timeline all the animation happening during the focus on the third scene
   */
  scrollWithinFrameThree() {
    const sunElement = this.frameContainers[2].querySelector('.sun');
    const scene3Foregreounds = this.frameContainers[2].querySelectorAll('.scene-3-foreground');
    const fadeOutElement = this.frameContainers[2].querySelector('.fade-out') as HTMLElement;
    scene3Foregreounds.forEach((img, index) => {
      this.scrollTimeline.set(sunElement, {
        rotateZ: '-20deg'
      })
      if (index > 0) {
        this.scrollTimeline.to(fadeOutElement, {
          background: 'rgba(0, 0, 0, 0)',
          onComplete: () => {
            fadeOutElement.style.background = "none"
          }
        })
      };
      this.scrollTimeline.to(sunElement, {
        rotateZ: '-60deg'
      })
        .to(fadeOutElement, {
          background: '#000',
          onComplete: () => {
            img.classList.add('hidden');
            if (scene3Foregreounds.length >= index + 1) {
              scene3Foregreounds[index + 1].classList.remove('hidden')
            }
          }
        });
    })
    this.scrollTimeline.to(this.scrollElements[2][0], {
      x: 300,
    });
    this.scrollTimeline.to(
      this.scrollElements[2][1],
      {
        x: 500,
      },
      "<"
    );
    this.scrollTimeline.to(
      this.scrollElements[2][2],
      {
        x: 800,
      },
      "<"
    );
  }

  /**
   * adds to the scrollTrigger timeline all the animation happening during the focus on the fourth scene
   */
  scrollWithinFrameFour() { }

  //**************************** **************** ***************************\\
  //**************************** Animations Factory ***************************\\
  //****************************** **************** *****************************\\

  /**
   * Generates a split text animation for a given HTML element
   * @param element the HTMLElement to animate, should be a paragraph, or heading, or another element containing only text
   * @returns the animation to be added to a timeline or played
   */
  createSplitTextAnim(element: HTMLElement) {
    gsap.set(element, {
      opacity: 1
    })
    const split = SplitText.create(element, {
      type: "words",
    });
    const tween = gsap.from(split.words, {
      x: -1,
      autoAlpha: 0,
      stagger: 0.1,
    });

    return tween;
  }

  //*************************** ***************** ***************************\\
  //*************************** Lenis smooth scroll ***************************\\
  //***************************** ***************** *****************************\\

  /**
   * sets up Lenis's smooth scroll feature to be used with gsap's scrollTrigger
   */
  initLenis() {
    // Initialize a new Lenis instance for smooth scrolling
    const lenis = new Lenis();

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);
  }
}
