controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    skellyAI.removeSkelly()
})
skellyAI.startSkelly(10, true)
skellyAI.skellyColors(SpotEnum.Bubble, 15, 2)
pause(100)
skellyAI.skellySay("My name is skelly!", SpotEnum.Happy, 5000)
info.setScore(skellyAI.skellyIdleInterval())
skellyAI.skellyEffects(ApplyEffects.Apply, effects.halo)
