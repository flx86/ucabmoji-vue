<template>
   <div id="navbar">
      <div class="brand">
         <img src="@/assets/logo.png" alt="">

      </div>
      <div class="others">
         <h3>{{currentUser}}</h3>
         <i
            v-b-tooltip.hover title="Cerrar sesion"
            @click="logout"
            class="material-icons"
         >
            logout
         </i>
      </div>
   </div>   
</template>


<script>
   import firebase from 'firebase'
   export default {
      name:'navbar',
      data(){
         return{
            isLogged:true,
            currentUser:'',
         }
      },
      created(){
         if (firebase.auth().currentUser){
            this.currentUser = firebase.auth().currentUser.displayName
         }
      },
      methods:{
         logout(){
            firebase.auth().signOut().then(()=>{
               this.$router.push('/')
            })
         }

      }
      
   }
</script>

<style scoped>

#navbar{

  height: 50px;
  background:linear-gradient(to right, #2c1656, #423261);
  box-shadow: -5px 7px 11px -1px rgba(255, 255, 255, 0.21);
  display: flex;
  padding: 0px 50px;
  align-items: center;
  justify-content: space-around;
  
}

.brand img{
  height: 50px;
  cursor: pointer;
}

.others{
  margin-left: auto;
  grid-area:others;
  text-align:center;
  display: flex;
  align-items: center;
  color: white;
  
}

.others i{
  margin-left: 32px;
}

.material-icons{ 
  
  cursor: pointer;
  color: rgba(255, 255, 255, 1);
  line-height: 36px;
  width: 36px;
  
    /* Effect */
  -o-transition:.5s;
  -ms-transition:.5s;
  -moz-transition:.5s;
  -webkit-transition:.5s;
  transition:.5s;
}
.material-icons:hover{
  
  
  border-radius: 100px;
  background-color: rgba(241, 241, 241, 0.5); 
}
</style>

