<template>
  <dev/>
</template>

<script>
import dev from './components/search/index.vue'

export default {
  components: { dev },
   created : function(){
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }
}
</script>


<style>
body{
  margin: 0;
  display: grid;
  width: 100vw;
  align-items: center;
  justify-content: center;
  overflow: scroll;
  position: relative;
  overflow: hidden;
  max-width: 100vw;
  /*Getting the right height for mobile devices: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/ */
  min-height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  min-height: calc(var(--vh, 1vh) * 100);
}

html { 
  /* height: 100v; /* magic that makes the app normal on iphones */
  background-color: #0d1117;
  touch-action: none;
  -webkit-overflow-scrolling: touch; /* enables “momentum” (smooth) scrolling */
  overflow-x: hidden;

  /* Nice Font */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* By default text is non selectable */
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none; 

  /* no zoom */
  touch-action: pan-x pan-y;
  touch-action: none;
}

::selection {
  background: #1e4173;
}
</style>
