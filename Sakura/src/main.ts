import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Intro } from "./intro.ts";

class Manager {
    constructor() {
        this.initIntro()
        this.initScrollManager()
        this.initSoundManager()
    }

    initScrollManager() {
    }

    initSoundManager() {
        //probably going to have a class for that
    }
    initIntro(){
     new Intro()
    }
}

window.addEventListener("DOMContentLoaded", () => {new Manager})