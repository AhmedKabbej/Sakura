import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(SplitText);
import { Intro } from "./intro.ts";

class Manager {
   
    constructor() {
        
        this.initIntro()
        this.initScrollManager()
        this.initSoundManager()
        this.animationSplitText()
        
    }

    initScrollManager() {
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