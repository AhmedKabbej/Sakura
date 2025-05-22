import { Intro } from "./intro.ts";
import { ScrollManager } from "./ScrollManager";

class Manager {
   
    constructor() {
        
        this.initIntro()
        document.addEventListener("completedIntro", () => {
            this.initScrollManager()
        })
        this.initSoundManager()        
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
}



window.addEventListener("DOMContentLoaded", () => {new Manager})