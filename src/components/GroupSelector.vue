<template>
<div >
<div class="ui search clearable selection dropdown" ref="selector" style="width: 300px">
  <input type="hidden" name="language" value="english">
  <i class="dropdown icon"></i>
  <!-- <i class="remove icon"></i> -->
  <div class="default text">{{label}}</div>
  <div class="menu">
        <div class="item" v-for="each in data" :key="each" @click="selectGroup(each)">{{each}}</div>
  </div>
</div>
</div>

</template>

<script>
  
	export default {
    props: ["data", "label"],
    data() {
      return {
        chosenGroup:"",
        showDropdown: false
      }
    },
    mounted() {
      $(this.$refs.selector).dropdown()
    },
    methods: {
      selectGroup(data) {
        this.$emit('groupSelected', data)
      }
    }
  };
</script>

<style>
</style>