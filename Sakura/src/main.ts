import { gsap } from "gsap";
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(SplitText);

import { Intro } from "./intro.ts";
import { ScrollManager } from "./ScrollManager";

class Manager {
   
    constructor() {
        
        this.initIntro()
        document.addEventListener("completedIntro", () => {
            this.initScrollManager()
        })
        this.initSoundManager()
        this.animationSplitText()
        
    }

    initScrollManager() {
        new ScrollManager;
    }

    initSoundManager() {
        //probably going to have a class for that
    }

    initIntro(){
     new Intro()
    }

    animationSplitText(){
        let split = SplitText.create(".text", {
        type: "words" 
        });
        gsap.from(split.words,{
            x:-1,
            autoAlpha:0,
            stagger:0.1
        })
}}



window.addEventListener("DOMContentLoaded", () => {new Manager})