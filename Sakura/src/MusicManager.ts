import { Howl, Howler } from 'howler';

export class MusicManager {
    sound: Howl;
    sounds: any;

    constructor() {
        this.createSound()
        this.sounds = {}
    }
    createSound() {
        this.sound = new Howl({
            src: ['/sounds/main/AhmedSakuraProject.mp3'],
            autoplay: true,
            loop: true,
            volume: 0.00
        });
        
        this.sounds = {
            angelical: new Howl({
                src: ['/sounds/sound_effect/angelical.mp3'],
            }),
            
        }
        this.sounds = {
            crow: new Howl({
                src: ['/sounds/sound_effect/crow.wav'],
            }),
            
        }
        this.sounds = {
            guerre1: new Howl({
                src: ['/sounds/sound_effect/guerre1.mp3'],
            }),
            
        }
        this.sounds = {
            guerre2: new Howl({
                src: ['/sounds/sound_effect/guerre2.mp3'],
            }),
            
        }
        this.sounds = {
            guerreMainsound: new Howl({
                src: ['/sounds/sound_effect/guerreMainsound.mp3'],
            }),
            
        }
        this.sounds = {
            magic1: new Howl({
                src: ['/sounds/sound_effect/magic1.mp3'],
            }),
            
        }
        this.sounds = {
            nappescrooollllo: new Howl({
                src: ['/sounds/sound_effect/nappescrooollllo.mp3'],
            }),
            
        }
        this.sounds = {
            plagueTale: new Howl({
                src: ['/sounds/sound_effect/plagueTale.mp3'],
            }),
            
        }
        this.sounds = {
            plagueTale1: new Howl({
                src: ['/sounds/sound_effect/plagueTale1.mp3'],
            }),
            
        }
        this.sounds = {
            sabre: new Howl({
                src: ['/sounds/sound_effect/sabre.mp3'],
                loop: true
            }),
            
        }
        this.sounds = {
            sabre2: new Howl({
                src: ['/sounds/sound_effect/sabre2.mp3'],
                loop: true
            }),
            
        }
        this.sounds = {
            wave: new Howl({
                src: ['/sounds/sound_effect/wave.wav'],
            }),
            
        }
       
    }

    // playWar() {
    //     this.sound = new Howl({
    //         src: ['/sounds/sound_effect/plagueTale1.mp3'],
           
    //         loop: true,
    //         volume: 0.9
    //     });
    //     console.log("le son war fonctionne parfaitement")
    // }
}
