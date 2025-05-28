import { Howl, Howler } from 'howler';

export class MusicManager {
    sound: Howl;
    sounds: any;

    constructor() {
        this.createSound()
        
    }
    createSound() {
        
        this.sounds = {
            main: new Howl({
                src: ['/sounds/main/AhmedSakuraProject.mp3'],
                autoplay: true,
                loop: true,
                volume: 0.05   
            }),
            main2: new Howl({
                src: ['/sounds/main/AhmedSakuraProject2.mp3'],
                loop: true,
                volume: 0.09   
            }),
            angelical: new Howl({
                src: ['/sounds/sound_effect/angelical.mp3'],
                volume: 0.06
            }),
            crow: new Howl({
                src: ['/sounds/sound_effect/crow.wav'],
                volume: 0.4
            }),
            guerre1: new Howl({
                src: ['/sounds/sound_effect/guerre1.mp3'],
            }),
            guerre2: new Howl({
                src: ['/sounds/sound_effect/guerre2.mp3'],
            }),
            guerreMainsound: new Howl({
                src: ['/sounds/sound_effect/guerreMainsound.mp3'],
                volume: 0.2
            }),
            magic: new Howl({
                src: ['/sounds/sound_effect/magic.mp3'],
                volume: 0.9
            }),
            magic1: new Howl({
                src: ['/sounds/sound_effect/magic1.mp3'],
                volume: 0.09
            }),
            nappescrooollllo: new Howl({
                src: ['/sounds/sound_effect/nappescrooollllo.mp3'],
                // fade(0.7, 0.6, 1, [d])
            }),
            plagueTale: new Howl({
                src: ['/sounds/sound_effect/plagueTale.mp3'],
            }),
            plagueTale1: new Howl({
                src: ['/sounds/sound_effect/plagueTale1.mp3'],
            }),
            sabre: new Howl({
                src: ['/sounds/sound_effect/sabre.mp3'],
                loop: true,
                volume: 0.9   
            }),
            sabre2: new Howl({
                src: ['/sounds/sound_effect/sabre2.mp3'],
                loop: true,
                volume: 0.9 
            }),
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

    tooglePlaying(sound:Howl) {
        if (sound.playing()) {
            sound.stop()
            
        }else{
            sound.play()
        }
    }
}
