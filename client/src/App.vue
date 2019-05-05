<template>
  <div id="app">
    <router-view/>
  </div> 
</template>

<script>
  

export default {
  name: 'app',
  
}
</script>
  

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,700');

  body{
    height: 100%;
  }

  #btn-ucabmoji{
   margin: auto auto;
   /* Text */
   color:whitesmoke;
   text-transform: uppercase;
   font-size: 24px;
   font-weight: thin;
   text-decoration: none;
   text-align: center;

   /* button */
   cursor: pointer;
   border-radius: 12px;
   background-color: rgb(64, 221, 70);
   border: 1px solid white;
   height: 40px;
   width: 200px;

   /* Effect */
   -o-transition:.5s;
   -ms-transition:.5s;
   -moz-transition:.5s;
   -webkit-transition:.5s;
   transition:.5s;
 }
 #btn-ucabmoji:focus {outline:0;}
 #btn-ucabmoji:hover{
   background-color:  rgb(47, 165, 51);
 }

</style>
