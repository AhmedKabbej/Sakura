import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

import Lenis from "lenis";
import { MusicManager } from "./MusicManager";

export class ScrollManager {
  scrollContainer: HTMLElement; //contains all the scenes, the horizontal scrolling is in it
  frameContainers: NodeListOf<HTMLElement>; //the individual scenes containers
  scrollElements: { [index: number]: NodeListOf<HTMLElement> } = {}; //the individual scenes containers and the element within
  sceneWidth : number;
  musicManager: MusicManager

  scrollTimeline: GSAPTimeline; //the timeline that plays with the scroll

  constructor(musicManager: MusicManager) {
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

    this.musicManager = musicManager

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
      end: window.innerWidth * this.frameContainers.length *5, // this affects the speed of the scroll
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

    this.addTextAnimToTimelineForSelector('.text-1', 0)
    //zoom au tout debut
    this.scrollTimeline.to(".zoom-in", {
      scale: 1.5,
      stager: 1,
      duration: 2
    },"<")
    this.addTextAnimToTimelineForSelector('.text-2', 0)
    this.addTextAnimToTimelineForSelector('.text-3', 0)
    //fée qui apparait
    this.scrollTimeline.to(".fee-scene-1", {
      x: 400,
      duration: 2
    },"<")
    this.addTextToTimeline('.text-4')

    const transformationFrames = this.frameContainers[0].querySelectorAll('.transformation-anim') as NodeListOf<HTMLElement>;
    this.transfromationAnim(transformationFrames);

    this.addTextToTimeline('.text-5')
  }

  addTextToTimeline(selector:string){
    //text qui apparait
    const sceneText = this.frameContainers[0].querySelector(selector) as HTMLElement
    this.scrollTimeline.add(this.createSplitTextAnim(sceneText));
    //texte qui part vers le bas
    this.scrollTimeline.to(selector, {
      y: 400,
      duration: 3
    })
  }

  /**
   * adds to the scrollTrigger timeline all the animation happening during the focus on the second scene
   */
  scrollWithinFrameTwo() {
    const sceneText = this.frameContainers[1].querySelector('.animated-text') as HTMLElement
    this.scrollTimeline.add(this.createSplitTextAnim(sceneText));
    const tween = gsap.to(this.scrollElements[1][0], {
      x: -this.scrollElements[1][0].clientWidth  + this.sceneWidth,
      onStart: () => {
        
      },
      onUpdate: () => {
        console.log(tween.progress())
        console.log(this.musicManager.sounds,this.musicManager.sounds.angelical);
                if (tween.progress() > 0.5) {
          this.musicManager.sounds.angelical.play()
          
        }  if (tween.progress() > 0.9) {
          this.musicManager.sounds.angelical.stop()
          
        } 
      }
    });
    this.scrollTimeline.add(tween);
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
    const fadeOutElement = this.frameContainers[2].querySelector('.fade-out') as HTMLElement;
    const scene3Foregreounds = this.frameContainers[2].querySelectorAll('.scene-3-foreground');
    const scene3Texts = this.frameContainers[2].querySelectorAll('.animated-text') as NodeListOf<HTMLParagraphElement>;

    scene3Foregreounds.forEach((img, index) => {
      if (index > 0) {
        // put sun back to the right
        this.scrollTimeline.set(sunElement, {
          rotateZ: '-20deg'
        })
        // black box back to transparent
        this.scrollTimeline.to(fadeOutElement, {
          opacity: 0
        })
      };
      // sun revoluytion \o/
      this.scrollTimeline.to(sunElement, {
        rotateZ: '-60deg',
        duration: 3
      })
      //text anim
      .add(this.createSplitTextAnim(scene3Texts[index]), "<")
      // black box appears (it's night time go to sleep and stop coding, also take a shower u nerd)
      .to(fadeOutElement, {
        opacity: 1,
          onComplete: () => {
            // hide the current img and text and show the next day's img
            img.classList.add('hidden');
            scene3Texts[index].classList.add('hidden')
            if (index + 1 >= scene3Foregreounds.length) { return; }
            scene3Foregreounds[index + 1].classList.remove('hidden')
          }
        });
    })
  }

  /**
   * adds to the scrollTrigger timeline all the animation happening during the focus on the fourth scene
   */
  scrollWithinFrameFour() {

    const textElements = this.frameContainers[3].querySelectorAll('.animated-text') as NodeListOf<HTMLElement>;

    const fairyEl = this.frameContainers[3].querySelector('#fee-scene-4');
    const fadeToPink = this.frameContainers[3].querySelector('.fade-out-pink');
    const charasEl = this.frameContainers[3].querySelector('#scene4-charas-confession');
    const treeEl = this.frameContainers[3].querySelector('#scene4-sakura-tree');

    this.addTextAnimToTimeline(textElements[0])

    this.addTextAnimToTimeline(textElements[1])
    //La fée apparaît
    this.scrollTimeline.to(fairyEl, {
      x: 600,
      duration: 1.5
    },"<")

    this.addTextAnimToTimeline(textElements[2]);
    const transformationFrames = this.frameContainers[3].querySelectorAll('.transformation-anim') as NodeListOf<HTMLElement>;
    this.transfromationAnim(transformationFrames);
  }

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

  addTextAnimToTimelineForSelector(selector:string, sceneId: number) {
    //text qui apparait
    const sceneText = this.frameContainers[sceneId].querySelector(selector) as HTMLElement
    this.addTextAnimToTimeline(sceneText)
  }

  addTextAnimToTimeline(el:HTMLElement){
    //text qui apparait
    this.scrollTimeline.add(this.createSplitTextAnim(el));
    //texte qui part vers le bas
    this.scrollTimeline.to(el, {
      y: 400,
      duration: 3
    })
  }

  transfromationAnim(frames: NodeListOf<HTMLElement>) {
    for (let i = 0; i < frames.length-1; i++) {
      const frameDisappear = frames[i];
      const frameAppear = frames[i+1];

      this.scrollTimeline.to(frameDisappear,{
        opacity: 0,
        duration: 2
      })
      .to(frameAppear,{
        opacity: 1,
        duration: 2
      },"<")
    }
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
