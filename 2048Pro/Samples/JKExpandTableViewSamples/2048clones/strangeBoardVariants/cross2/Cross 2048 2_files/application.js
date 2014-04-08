// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  window.gameName = "2048-cross2";
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager);
});
