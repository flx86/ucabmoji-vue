<template>
   <div id="post">
      <div class="container" >
         <div class="title">
            <h3>Haz una publicacion!</h3>
            <i 
               class="material-icons"
               @click="
                  readPosts()
                  resetForm()
                  $emit('closePost',false)
               "
            >close</i>
         </div>
         <form class="form-group" @submit.prevent="onSubmit">
            <label>Titulo</label>
            <input 
               class="form-control clear-title"
               v-model="postData.titulo" 
               type="text"   
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" 
            >  
            <label>Comentario</label>
            <textarea 
               class="form-control clear-comment"
               v-model="postData.comentario"
               rows="3"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            >
            </textarea>
            <div class="type">
               <li 
                  class="happy"
                  :class="{'happy-selected' : happy }"
                   @click="
                     postData.emoji = 'smile'
                     switchSelected(0)
                  "
               >
                  <img src="@/assets/happy.png" alt="">
               </li>
               <li 
                  class="good"
                  :class="{'good-selected' : good }"
                   @click="
                     postData.emoji = 'good'
                     switchSelected(1)
                  "
               >
                  <img src="@/assets/good.png" alt="">
               </li>
               <li 
                  class="sad"
                  :class="{'sad-selected' : sad }"
                   @click="
                     postData.emoji = 'sad'
                     switchSelected(2)
                  "
               >
                  <img src="@/assets/sad.png" alt="">
               </li>
               <li 
                  class="angry"
                  :class="{'angry-selected' : angry }"
                   @click="
                     postData.emoji = 'angry'
                     switchSelected(3)
                  "
               >
                  <img src="@/assets/angry.png" alt="">
               </li>
            </div>
            
            <label>Link de la Imagen</label>
            <input 
               class="form-control  clear-lng"
               v-model="postData.imgURL" 
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            >
               


            <div class="coords">
               <div>
                  <label>Latitud</label>
                  <input 
                     class="form-control  clear-lat"
                     v-model="postData.latitud"  
                     autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                  >
               </div>
               <div>
                  <label>Longitud</label>
                  <input 
                     class="form-control  clear-lng"
                     v-model="postData.longitud" 
                     autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                  >
               </div>
            </div>
            <div id="btn-container">
                  <button 
                     id="btn-ucabmoji"  
                     type="button" 
                     @click="
                        addPost()
                        resetForm()
                     "
                  >Emojizar</button>
            </div>
         </form>
      </div>
    </div>
</template>

<script>    

   export default {
      name:'post',
      data(){
         return{
            happy: false,
            good: false,
            sad: false,
            angry: false,
         }
      },
      props:{
         postData:Object,
         addPost:Function,
         readPosts:Function,
         
      },
      created(){
         
      },
      methods:{
         onSubmit: function() {
            this.resetForm(); //clear form automatically after successful request
         }, 
         resetForm() {
            this.happy = false, this.good = false, this.sad = false, this.angry = false
            var self = this; //you need this because *this* will refer to Object.keys below`

            //Iterate through each object field, key is name of the object field`
            Object.keys(this.postData).forEach(function(key) {
               self.postData[key] = '';
            });
            },
         switchSelected (s) {
            switch (s) {
               case 0: this.happy = true, this.good = false, this.sad = false, this.angry = false
               break;
               case 1: this.happy = false, this.good = true, this.sad = false, this.angry = false
               break;
               case 2: this.happy = false, this.good = false, this.sad = true, this.angry = false
               break;
               case 3: this.happy = false, this.good = false, this.sad = false, this.angry = true
               break;
            
               default:
                  break;
            }
         }
      }  
   }
</script>

<style  scoped>

   @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,700');

   #post{
      background:rgba(59, 59, 59, 0.274);
      width:100%;
      height:100%;
      position:absolute; 
   }
   
   .container{
      background: white;
      width: 500px;
      margin-top:40px;
      border-radius: 16px;
      padding: 0px;
   }
   .title{
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #2c1656;
      width: 100%;
      height: 40px;
      border-top-right-radius: 16px;
      border-top-left-radius: 16px;
      padding: 0px 16px;
   }

   .material-icons{
      cursor: pointer;  
   }
   .material-icons:hover{
      border-radius: 100px;
     
      background-color: rgba(199, 199, 199, 0.5);
      /* Effect */
      -o-transition:.5s;
      -ms-transition:.5s;
      -moz-transition:.5s;
      -webkit-transition:.5s;
      transition:.5s;
   }

   .form-group{padding: 8px 16px;}
   .form-group label{margin:0;}
   .form-group input{margin-bottom:5px;}
   .type{
      margin: 8px 0px;
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
   }
   .type li {
      cursor: pointer;
      margin: 0 10px ;
      padding: 0;
      list-style: none;
      width: 90px;
      height: 90px;
      border-radius:100px;
      display: flex;
      align-items: center;
      justify-content: space-around;
   }
   .type img{
      height: 70px;
   }
   .happy:hover{background: #86e3ff; /* Effect */
      -o-transition:.5s;
      -ms-transition:.5s;
      -moz-transition:.5s;
      -webkit-transition:.5s;
      transition:.5s;
   }
   .happy-selected{background: #86e3ff;}
   .good:hover{background: #007ac5; /* Effect */
      -o-transition:.5s;
      -ms-transition:.5s;
      -moz-transition:.5s;
      -webkit-transition:.5s;
      transition:.5s;}
   .good-selected{background: #007ac5;}
   .sad:hover{background: #ffb03a; /* Effect */
      -o-transition:.5s;
      -ms-transition:.5s;
      -moz-transition:.5s;
      -webkit-transition:.5s;
      transition:.5s;}
   .sad-selected{background: #ffb03a;}
   .angry:hover{background: #ff0000; /* Effect */
      -o-transition:.5s;
      -ms-transition:.5s;
      -moz-transition:.5s;
      -webkit-transition:.5s;
      transition:.5s;}
   .angry-selected{background: #ff0000;}   

   .coords{
      display: flex;
      justify-content: space-between;
   }

    #btn-container{
      width: 100%;
      height: 100px;
      margin-top: 10px;
      display: flex;
      justify-content: center;
      border-top: 2px solid rgba(211, 211, 211, 0.199);
    }


</style>
