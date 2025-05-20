import { gsap } from "gsap";
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(SplitText);

class Manager {
    constructor() {
        this.initScrollManager()
        this.initSoundManager()
        this.animationSplitText()
    }

    initScrollManager() {
    }

    initSoundManager() {
        //probably going to have a class for that
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
}

}

window.addEventListener("DOMContentLoaded", () => {new Manager})