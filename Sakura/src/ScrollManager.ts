import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export class ScrollManager {
    scrollContainer : HTMLElement;
    frameContainers : NodeListOf<HTMLElement>;
    scrollElements : {[index: number] : NodeListOf<HTMLElement>} = {};
    scrollTimeline : GSAPTimeline;

    constructor() {
        this.scrollContainer = document.querySelector("#main-container") as HTMLElement;
        this.frameContainers = document.querySelectorAll(".scene-container") as NodeListOf<HTMLElement>;
        this.frameContainers.forEach((frameContainer, idx) => {
            this.scrollElements[idx] = frameContainer.querySelectorAll(".scene-element") as NodeListOf<HTMLElement>;
        });

        this.scrollTimeline = gsap.timeline();

        this.initScroll()
    }

    initScroll() {
        const GAP = 512;
        ScrollTrigger.create({
            trigger: this.scrollContainer,
            animation: this.scrollTimeline,
            pin: true,
            scrub: true,
            end: (this.frameContainers[0].clientWidth + GAP) * (this.frameContainers.length-1)
        })

        this.frameContainers.forEach((_, idx) => {
            this.scrollWithin(idx)

            if(idx === this.frameContainers.length -1) return;
            this.scrollTimeline.to(this.scrollContainer, { //animate frame container to get to the center
                x: '-=100vw',
            });
        })
    }

    scrollWithin(i : number) {
        //add to scrollTrigger timeline anims for each scenes
        switch (i) {
            case 0:
                this.scrollWithinFrameOne()
                break;
            case 1:
                this.scrollWithinFrameTwo()
                break;
            case 2:
                this.scrollWithinFrameThree()
                break;
            case 3:
                this.scrollWithinFrameFour()
                break;
            default:
                break;
        }
    }

    scrollWithinFrameOne() {
        this.scrollElements[0].forEach(scrollEl => {
            this.scrollTimeline.to(scrollEl, {
                x: 100
            });
        });
    }

    scrollWithinFrameTwo() {
        this.scrollElements[1].forEach(scrollEl => {
            this.scrollTimeline.to(scrollEl, {
                x: -100
            });
        });
    }

    scrollWithinFrameThree() {

    }

    scrollWithinFrameFour() {
        
    }
}

// Reference for the scrollTrigger:
// https://gsap.com/community/forums/topic/34273-horizontal-scroll-with-nesteed-animations/ -> timeline on scrollTrigger w/ trigger container & tween -xPercent until pinned section then pinned section anim then -xPercent again

// Other way to do what we want with scrollTrigger if there's an issue with the technique we're using now:
// https://gsap.com/community/forums/topic/34434-pinning-inside-of-horizontal-scrolling/ -> the pinned slider goes against the horizontal scrolling animation (with a positive xPercent)

// 1920x1080