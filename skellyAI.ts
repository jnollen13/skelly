enum SpotEnum {
    //% block="think"
    Think,
    //% block="happy"
    Happy,
    //% block="Text bubble"
    Bubble
}

enum ApplyEffects{
    //% block="apply effect"
    Apply,
    //% block="remove all effects"
    Remove,
    //% block="set to one effect"
    Single
}

/**
 * Custom blocks
 */
//% weight=100 color=#c1b3b3 icon="☠" blockGap=8
//% groups='["Life", "Speech", "Utill", "Visuals"]'
//% blockGap=8
namespace skellyAI {
    
    export function happy(skely: Sprite): void {
        let wordsToSpeak = null
        let randomWordPicker = randint(1, 5)
        if (randomWordPicker == 1) {
            wordsToSpeak = word1
        } else if (randomWordPicker == 2) {
            wordsToSpeak = word2
        } else if (randomWordPicker == 3) {
            wordsToSpeak = word3
        } else if (randomWordPicker == 4) {
            wordsToSpeak = word4
        } else if (randomWordPicker == 5) {
            wordsToSpeak = word5
        }
        let skellyspeech = textsprite.create("" + wordsToSpeak, happy_bg, happy_fg)
        skellyspeech.setStayInScreen(true)
        skellyspeech.setPosition(skely.x + 1, skely.y + 17)
        skellyspeech.x += 2
        let textlifespan = randint(2000, 4920)
        skellyspeech.setKind(SpriteKind.SkellySpeech)
        skellyspeech.lifespan = textlifespan;
        let textArrow = sprites.create(img`
            . . 1 . .
            . 1 1 1 .
            1 1 1 1 1
            . . . . .
            . . . . .
        `, SpriteKind.SkellySpeech)
        textArrow.setPosition(skely.x + 2, skely.y + 13)
        textArrow.lifespan = textlifespan - 50
        animation.runImageAnimation(skely, assets.animation`skellyTalk`, 250, false)
    }
    export let happy_bg =1;
    export let happy_fg=15;
    export function think(skely: Sprite): void {
        animation.runImageAnimation(skely, assets.animation`skellyBlinkLong`, 592, false)
        let skellythink = textsprite.create("hmm...", think_bg, think_fg)
        skellythink.setStayInScreen(true)
        skellythink.setPosition(skely.x + 30, skely.y + 1)
        skellythink.x += 2
        let textlifespan = randint(2500, 2890)
        skellythink.setKind(SpriteKind.SkellySpeech)
        skellythink.lifespan = textlifespan
    }
    export let think_bg=-1;
    export let think_fg=0

    export function idle(shouldCheckBehavior: Boolean, skely: Sprite): void {
        if (!shouldCheckBehavior) {
            animation.runImageAnimation(skely, assets.animation`skellyBlink`, 50, false)
        } else {
            if (Math.percentChance(10)) {
                skellyAI.happy(skely)
            } else if (Math.percentChance(50)) {
                skellyAI.think(skely)
            }else if(Math.percentChance(40)){
                skellyAI.bubbleText("I am happy!", skely, 2000)
            } else {
                animation.runImageAnimation(skely, assets.animation`skellyBlink`, 50, false)
            }
        }
    }

    export function bubbleText(phrase: string, skely: Sprite, time:number): void {
        skely.sayText(""+phrase, time, false, bubble_fg, bubble_bg)
    }
    export let bubble_fg =15;
    export let bubble_bg =1;

    /**
     * Summons Skelly. Only use this block once. 
     * Will place skelly in top left corner.
     * 
     * @param distanceFromCorner how far away from the corner skelly will spawn.
     * @param shouldDoIdle if skelly should do idles, eg:true
     */
    //% blockId=startSkelly
    //% block="start skelly $distanceFromCorner from corner, idle $shouldDoIdle"
    //% weight=100
    //% blockGap=8
    //% help=skellyAI/start-skelly
    //% group="Life"
    export function startSkelly(distanceFromCorner: number, shouldDoIdle:boolean): void {
        //create skelly
        skelly = sprites.create(img`
            ........................
            ........................
            ........................
            ........................
            ..........8888..........
            ........88111188........
            .......8b111111b8.......
            .......8d11111118.......
            ......8dd1111111d8......
            ......8ddd111111d8......
            ......8dddddd111d8......
            ......8bddddbad1d8......
            ......8cbbbdcaddb8......
            .......8cbb111118.......
            ........888881b18.......
            ........8b118b8b8.......
            ........88b11118........
            ......8.888888b1........
            ......8888888..b........
            .......88888............
            ........................
            ........................
            ........................
            ........................
        `, SpriteKind.Skelly)
        skelly.setStayInScreen(true)
        skelly.setFlag(SpriteFlag.RelativeToCamera, true)
        skelly.setPosition(1, 1)
        let DistFromCorner = 7 + distanceFromCorner
        skelly.x += DistFromCorner - 2;
        skelly.y += DistFromCorner;
        //skellyAI runs
        let shouldstop = false
        if(shouldDoIdle){
        game.onUpdateInterval(actionrun, function () {
            if (hasbeencalculating) {
                if (Math.percentChance(25)) {
                    skellyAI.happy(skelly)
                } else if (Math.percentChance(33.3)) {
                    skellyAI.think(skelly)
                } else {
                    skellyAI.idle(false, skelly)
                    if(distanceFromCorner>= 25){
                        skellyAI.bubbleText("hi!", skelly, 3903)
                    }
                }
            } else {
                if(!shouldstop)
                hasbeencalculating = true
                shouldstop = true
            }
        })
        }
    }
    let actionrun = randint(5003,18500)
    let hasbeencalculating = false
    let skelly:Sprite=null

    /**
     * Removes Skelly. Can create skelly again after using this block.
     * Can also destroy skelly with particle effects.
     * minum destroy time with effects is 50 ms
     * 
     * @param effect what effect will happen when skelly is removed
     * @param duration the duration for the effect the skelly gets destroyed with, eg: 50
 */
    //% blockId=removeSkelly
    //% block="remove Skelly || with %effect effect for %duration ms"
    //% duration.shadow=timePicker
    //% expandableArgumentMode="toggle"
    //% weight=74
    //% blockGap=8
    //% help=skellyAI/remove-skelly
    //% group="Life"
    export function removeSkelly(effect?:effects.ParticleEffect, duration?:number): void {
        //remove skelly and skelly's text
        sprites.destroyAllSpritesOfKind(SpriteKind.Skelly, effect, duration)
        sprites.destroyAllSpritesOfKind(SpriteKind.SkellySpeech, effect, duration)
        //stops skellyAI runs
        hasbeencalculating = false
    }

    /**
    * sets skelly's happy speech options.
    * @param skellyspeech2 describe parameter here, eg: "thx!"
    * @param skellyspeech1 describe parameter here, eg: ":)"
    * @param skellyspeech3 describe parameter here, eg: "yay!"
    * @param skellyspeech4 describe parameter here, eg: "Fun!"
    * @param skellyspeech5 describe parameter here, eg: "happy!"
    */
    //% blockId=setSkellyText
    //% block="set skelly text: message1 $skellyspeech1 message2 $skellyspeech2 message3 $skellyspeech3 message4 $skellyspeech4 message5 $skellyspeech5"
    //% weight=60
    //% blockGap=8
    //% help=skellyAI/skelly-text
    //% group="Speech"
    export function skellyText(skellyspeech1: string, skellyspeech2: string, skellyspeech3: string, skellyspeech4: string, skellyspeech5: string,) {
        if (!skellyspeech1 == null) {
            word1 = skellyspeech1
        }
        if (!skellyspeech2 == null) {
            word2 = skellyspeech2
        }
        if (!skellyspeech3 == null) {
            word3 = skellyspeech3
        }
        if (!skellyspeech4 == null) {
            word4 = skellyspeech4
        }
        if (!skellyspeech2 == null) {
            word5 = skellyspeech5
        }
    }
    export let word1 = ":)";
    export let word2 = "thx!"; 
    export let word3 = "yay!"; 
    export let word4 = "fun!"; 
    export let word5 = "me happy!"

    /**
    * Makes skelly say a set string either with think format or lenth format.
    * Skelly must exist for this block to do anything
    *
    * @param phrase describe parameter here, eg: "Fun!"
    * @param skellyspeech5 describe parameter here, eg: "happy!"
    */
    //% blockId=skellySay
    //% block="Skelly say $phrase $spot || $length"
    //% length.shadow=timePicker
    //% expandableArgumentMode="toggle"
    //% weight=59
    //% blockGap=8
    //% help=skellyAI/skelly-say
    //% group="Speech"
    export function skellySay(phrase:string, spot:SpotEnum, length?:number): void {
        if(hasbeencalculating){
        let textlifespan = randint(2200, 4920)
        if(length){
            textlifespan=length
        }
        if(spot==SpotEnum.Happy){
        let skellyspeech = textsprite.create("" + phrase, 1, 15)
        skellyspeech.setStayInScreen(true)
        skellyspeech.setPosition(skelly.x + 1, skelly.y + 17)
        skellyspeech.x += 2
        skellyspeech.setKind(SpriteKind.SkellySpeech)
        skellyspeech.lifespan = textlifespan;
        let textArrow = sprites.create(img`
            . . 1 . .
            . 1 1 1 .
            1 1 1 1 1
            . . . . .
            . . . . .
        `, SpriteKind.SkellySpeech)
        textArrow.setPosition(skelly.x + 2, skelly.y + 13)
        textArrow.lifespan = textlifespan - 50
        animation.runImageAnimation(skelly, assets.animation`skellyTalk`, 250, false)
        }else if(spot==SpotEnum.Think){
            animation.runImageAnimation(skelly, assets.animation`skellyBlinkLong`, 592, false)
            let skellythink = textsprite.create(""+phrase, -1, 0)
            skellythink.setStayInScreen(true)
            skellythink.setPosition(skelly.x + 30, skelly.y + 1)
            skellythink.setKind(SpriteKind.SkellySpeech)
            skellythink.x += 2
            skellythink.lifespan = textlifespan
        }else if(spot==SpotEnum.Bubble){
            skellyAI.bubbleText(""+phrase, skelly, length);
        }
        }else{
            console.error("Skelly not created! ")
        }
    }

    /**
     * If ApplyEffects is set to Remove it will remove all particle effects
     * from skelly even if extended with an effect(the effect will not be added).
     * If ApplyEffects is set to Apply it will add the effect from the extended
     * will be applied to skelly. If ApplyEffects is set to Single, then
     * all effects currently applied to skelly will be removed and after
     * that it will apply the selected effect.
     * 
     * @param effect the effect that is set to be applied to skelly
     * @param duration the duration of the effect applied to skelly, eg: 500
    */
    //% blockId=skellyEffects
    //% block="Skelly effect $addOrClear %effect || for $duration ms"
    //% duration.shadow=timePicker
    //% weight=45
    //% blockGap=8
    //% help=skellyAI/skelly-effects
    //% group="Visuals"
    export function skellyEffects(addOrClear:ApplyEffects, effect?: effects.ParticleEffect, duration?: number): void {
        //check if skelly exists
        if(hasbeencalculating){
            //add effects
            skelly.startEffect(effect, duration)
            if(addOrClear==ApplyEffects.Remove){
                effects.clearParticles(skelly)
            }
            if(addOrClear==ApplyEffects.Single){
                skelly.startEffect(effect, duration)
            }
        }
    }

    /**
     * sets the color of the skelly text type said in the SpotEnum
     * to the color specified.
     * 
     * @param bg background color of the text.
     * @param fg font color of the text.
    */
    //% blockId=skellyColors
    //% block="set skelly $text text: $fg background: $bg"
    //% fg.shadow=colorindexpicker
    //% bg.shadow=colorindexpicker
    //% weight=55
    //% blockGap=8
    //% help=skellyAI/skelly-colors
    //% group="Visuals"
    export function skellyColors(text:SpotEnum, fg:color,bg:color): void {
        if(text==SpotEnum.Happy){
            happy_bg=bg
            happy_fg=fg
        }else if(text==SpotEnum.Bubble){
            bubble_bg=bg
            bubble_fg=fg
        }else if(text==SpotEnum.Think){
            think_fg=fg
            think_bg=bg
        }
    }

    /**
     * checks if skelly is created. will still return false if skelly 
     * was created at the same time as it was checked.
     * 
    */
    //% blockId=isSkellyCreated
    //% block="is skelly created"
    //% weight=50
    //% blockGap=8
    //% help=skellyAI/is-skelly
    //% group="Utill"
    export function isSkellyCreated(): boolean {
        if (hasbeencalculating) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * checks if skelly is created. will still return false if skelly 
     * was created at the same time as it was checked.
     * 
    */
    //% blockId=skellyIntervals
    //% block="skelly Inerval(ms)"
    //% weight=50
    //% blockGap=8
    //% help=skellyAI/skelly-actioninterval
    //% group="Utill"
    export function skellyIdleInterval(): number{
        return actionrun;
    }

    /**
     * gets the color of the selected skelly speech type.
     * 
    */
    //% blockId=skellyColors
    //% block="get $colorType of $textType"
    //% weight=40
    //% blockGap=8
    //% help=skellyAI/skelly-getcolors
    //% group="Utill"
    export function getSkellyColors(textType:SpotEnum, colorType:boolean): color {
        if(textType==SpotEnum.Happy){
            return happy_bg;
        }else if(textType==SpotEnum.Think){
            return think_bg;
        }else{
            return bubble_bg;
        }
    }
}