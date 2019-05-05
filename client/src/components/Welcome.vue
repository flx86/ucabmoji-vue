<template>
   <div class="container-fluid  ">
      <div class="row  ">
         <div id="forms" class="col-3 ">
            <div id="img-container">
               <a href="#">
                  <img src="@/assets/logo.png" alt="Ucabmoji">
               </a>
            </div>   
            <div id="switch">
               <a href="#">
                  <button 
                     v-bind:class="{btnline: isLogin}" 
                     v-on:click="switchLogin();" 
                     type="button" 
                  >Ingreso</button>
               </a> 
               <a href="#">
                  <button 
                     v-bind:class="{btnline: isRegister}" 
                     v-on:click="switchRegister();" 
                     type="button"
                  >Registro</button>
               </a> 
            </div>
            
            <transition 
               name="fade"
               
            >
               <Login v-if="isLogin" />
            </transition>
         

            <transition name="fade">
               <Register v-if="isRegister"/>  
            </transition>
            
         </div>
         <div id="welcome" class="col">
                 <h1>Bienvenido a Ucabmoji Web</h1>
                 <img src="@/assets/ucabista.png" alt="ucabista" style="height:500px;">
         </div>
      </div>
   </div>
</template>


<script>

   import Login from '@/components/Login.vue'
   import Register from '@/components/Register.vue'
  

   export default {
      name: 'welcome',
      components:{
         Login,Register
      },
      data(){
         return{
            isLogin:true,
            isRegister:false,
            show:false
         };
         
      },
      methods:{
         switchLogin(){
            if (this.isRegister){
               this.isRegister=false;
                setTimeout(function(){
                  this.isLogin=true;
               }.bind(this),300)
            }      
         },
         switchRegister(){
            if (this.isLogin){
               this.isLogin=false;
               setTimeout(function(){
                  this.isRegister=true;
               }.bind(this),300)
               
            }      
         }
      }
   }
</script>

<style scoped >

#welcome{
   padding: 48px;
   display: flex;
   justify-content: center;
   align-items: center;
   
}

#welcome h1{
   margin-top:48px; 
   font-size: 64px;
   font-family: 'Roboto' ,sans-serif;
   font-weight: 700;
   color: #36225e;
  align-self:baseline;
}
   
#forms{
    min-height:100vh;
    background:linear-gradient(to bottom right, #2c1656, #36225e);
    /*box-shadow: 0 4px 2px -2px rgba(61, 61, 61, 0.308);*/
    color:white;
}

#img-container{
   margin: 8px 0;
   height: 100px;
   width: 100%,
}
#img-container img{
   width: 85%;
   margin: 8px 8px;
}

#switch{
   width: 100%;
   font-size: 14px;   
}

#switch a{
   padding: 15px 10px; 
}

#switch a button{
   cursor: pointer;
   background: transparent;
   border: transparent;
   outline: none;
   text-align: center;
   color: white;
   text-transform: uppercase;
   font-weight: 500;
   font-size: 20px;
   letter-spacing: normal;
   
}
.btnline {   
   border-bottom: 2px solid #0baa0b !important; 
}

 

</style>
