<template>
  <router-view>
  </router-view>
</template>

<script>

// import MainView from "./components/Main.vue";
// import Authorization from "./components/Authorization.vue";
// import '../semantic/dist/semantic.min';
// import '../semantic/dist/semantic.min.css';

export default {

  name: 'App',
  data() {
    return{
      userInfo: {
        userName: "",
        userLastName: "",
      }
    }
  },
  components: {
    // MainView,
    // Authorization
  },

  // mounted() {
  //   window.addEventListener("beforeunload", function (e){
  //     console.log('Test')
  //     var confirmationMessage = "sd";
  //     (e || window.event).returnValue = confirmationMessage;
  //     return confirmationMessage; 
  //   })
  // },
  methods: {
    beforeUnloadFn(e) {
      alert('Boom!' + e)
    },
    sendData(val) {
      this.userInfo.userName = val.firstName;
      this.userInfo.userLastName = val.lastName;
    }
  },
}
</script>

<style>
body {
  height: 200px;
  /* width: 100%; */
  background: #aadae3;
  /* display: flex;
  align-items: stretch; */
}
</style>
