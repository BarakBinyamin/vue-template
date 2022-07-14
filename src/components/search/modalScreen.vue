<template>
    <div class="modal-screen">
    </div>
</template>


<script>
export default {
  mounted(){
    /* prevent scrole */
    document.body.style.height = '100vh';
    document.body.style.width  = '100vw';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

  },
  beforeUnmount(){
    /* Enable scroll */
    document.body.style.height = '';
    document.body.style.width  = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = 'pan-x pan-y';
  }
}
</script>

<style scoped>
.modal-screen{
    z-index: 99;
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5);
}
</style>