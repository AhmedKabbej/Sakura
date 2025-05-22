import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

import Lenis from "lenis";

export class ScrollManager {
  scrollContainer: HTMLElement; //contains all the scenes, the horizontal scrolling is in it
  frameContainers: NodeListOf<HTMLElement>; //the individual scenes containers
  scrollElements: { [index: number]: NodeListOf<HTMLElement> } = {}; //the individual scenes containers and the element within

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

  /**
   * Makes the link between scroll and the animation timeline & feeds the timeline its animations between each scenes and within each scenes
   */
  initScroll() {
    ScrollTrigger.create({
      trigger: this.scrollContainer,
      animation: this.scrollTimeline,
      pin: true,
      scrub: true,
      end: window.innerWidth * this.frameContainers.length, // this affets the speed of the scroll
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
    //temporary code for testing
    this.scrollElements[0].forEach((scrollEl) => {
      this.scrollTimeline.to(scrollEl, {
        x: 100,
      });
    });
  }

  /**
   * adds to the scrollTrigger timeline all the animation happening during the focus on the second scene
   */
  scrollWithinFrameTwo() {
    //temporary code but also an example of getting objects out of screen (mostly thanks to overflow hidden on .scene in the css)
    this.scrollElements[1].forEach((scrollEl) => {
      this.scrollTimeline.to(scrollEl, {
        x: -100,
      });
    });
  }

  /**
   * adds to the scrollTrigger timeline all the animation happening during the focus on the third scene
   */
  scrollWithinFrameThree() {
    //temporary code but also an example of how to play tweens simaltaenously
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
  scrollWithinFrameFour() {}

    //**************************** **************** ***************************\\
   //**************************** Animations Factory ***************************\\
  //****************************** **************** *****************************\\

  /**
   * Generates a split text animation for a given HTML element
   * @param element the HTMLElement to animate, should be a paragraph, or heading, or another element containing only text
   * @returns the animation to be added to a timeline or played
   */
  createSplitTextAnim(element: HTMLElement) {
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
