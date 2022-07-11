<template>
    <div class="searches">
        {{searchData}}
    </div>
</template>

<script>
export default {
  props: ["searchData"],
  data() {
    return {
    }
  }
}
</script>

<style scoped>
.searches{
    height: 600px;
    background: #161b22;
}
</style>
