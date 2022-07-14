<template>
    <Transition name="fade">
        <screen @click="outsideClick" v-if="show"/>
    </Transition>
    <div class="modal-view"  v-if="show">
        <div class="title">Settings</div>
        <textbar @changed="update" label="Host" id="settings_host" 
v-model="host" placeholder="192.168.1.123:3000"/>
    </div>
</template>


<script>
import screen from "./modalScreen.vue"
import textbar from "./textbar.vue"

export default {
  props: ["modelValue", "toggle"],
  emits: ["changed", "update:modelValue"],
  components: {screen,textbar},
  data(){
    return{
        /* not exposed */
        storageName: "settingsModal",
        /* exposed */
        host: "",
        show: this.modelValue['show']
    }
  },
  async created(){
    const settingsData = {
        host: "",
        show: this.modelValue['show']
    }
    try{
      settingsData.host  = this.$cookies.get(this.storageName)['host']
      this.show=false

      settingsData['show'] = false
      this.$emit("update:modelValue", settingsData) 
    }
    catch{
      settingsData.host=""
      this.show=true

      settingsData['show'] = true
      this.$emit("update:modelValue", settingsData) 
    }
  },
  methods:{
    outsideClick(){
      this.update()
    },
    update(value=this.host){
      const settingsData = {
        host: "",
        show: this.modelValue['show']
      }
      this.show  = false
      this.host  = value
      settingsData['host'] = value
      settingsData['show'] = false

      this.$emit("update:modelValue",settingsData) 
      this.$emit("changed", this.host) 

      this.$cookies.set(this.storageName, settingsData)
    }
  },
  watch: {
    toggle:function(value){
      this.show = value
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.title{
    text-align: center;
    padding: 5px;
    font-size: 19px;
    color: black;
}
.modal-view{
    position: absolute;
    top: calc(50vh - 150px);
    top: calc(var(--vh, 1vh) * 50 - 150px);
    left: calc(50vw - 150px);
    left: calc(var(--vw, 1vw) * 50 - 150px);

    z-index: 99;
    align-self: center;
    width: 300px;
    height: 300px;
    border-radius: 5px;
    overflow: hidden;
    background: #eeeeee;
}
</style>