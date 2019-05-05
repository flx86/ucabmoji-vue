<template>
   <div id="post">
      <div class="header">
          <h3>Haz una nueva publicación</h3>
          <i class="material-icons"
             @click="
               resetForm()
               $emit('closePost',false)
             "
          >close</i>
      </div>
      <div class="map" @click="drawPoint">
         <div 
            class="circle"
            v-if="selectedLocation"
            :style="{
               position:'absolute',
               left: selectedX  + 'px',  
               top:  selectedY  + 'px'
            }"
         >
         </div>
      </div>

      <div class="post">
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
            <div class="file-input">
                <button 
                  type="button" class="btn btn-light"
                  @click="onPickFile"
                
                >
                   <i class="material-icons">attachment</i>
                   Añade una foto
                </button>
               <input
                  type="file"
                  style="display:none;"
                  ref="fileInput"
                  accept="image/*"
                  @change="onFilePicked"
               >
               <transition name="fade" >
                  <div class="preview-container" v-show="image"> 
                     <div class="img-container"  >
                        <img :src="imgURL" alt="">
                     </div>

                     <i class="material-icons delete" 
                        
                        @click="imgURL = ''; image=null"
                     >delete</i>  

                     </div>
               </transition> 
            </div>
            <div class="type">
               <span class="span-title">¿Cómo te sientes?</span>
               <ul>
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
               </ul>
               <div class="span-types">
                  <span style="margin-left:40px;">Féliz</span>
                  <span style="margin-left:90px;" >Bien</span>
                  <span style="margin-left:85px;">Triste</span>
                  <span style="margin-left:75px;">Molesto</span>
               </div>

            </div>
         </form>
         <span class="span-location">
            Selecciona una ubicación dando click en el mapa!
         </span>


          <div id="btn-container">
                  <button 
                     id="btn-ucabmoji"  
                     type="button" 
                     @click="
                        addPost()
                        
                     "
                  >Emojizar</button>
            </div>

      </div>
      <transition name="fade">
            <div v-if="showAlert" class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>{{errorTitle}}</strong><br>{{errorMsg}}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="showAlert = !showAlert">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </transition>

        <transition name="fade">
            <div v-if="showAlertSuccess" class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Publicacion realizada con exito!</strong><br>{{name}} 
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="showAlertSuccess = !showAlertSuccess">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </transition>


   </div>


</template>


<script>
   import firebase from 'firebase'
   export default {
      name:'post',
      props:{
         readPosts:Function
      },
      data(){
         return{
            happy: false,
            good: false,
            sad: false,
            angry: false,
            postData:{
               postId:'',
               dia:'',
               mes:'',
               año:'',
               comentario:'',
               titulo:'',
               emoji:'',
               fotoId:'',
               imgURL:'',
               latitud:'',
               longitud:'',
               hora:'',
               minutos:'',
               X:'',
               Y:'',
               location:'',
            },
            imgURL:'',
            image:null,
            selectedLocation:false,
            selectedX:null,
            selectedY:null,
            errorTitle:'',
            errorMsg:'',
            showAlertSuccess:false,
            showAlert:false,

         }
      },
      methods:{
         addPost(){
            if (this.postData.titulo.length <= 0 || this.postData.comentario.length <= 0){
               this.showErrorAlert('Debes completar los campos')
               return
            }

            if (this.postData.comentario.length > 140){
               this.showErrorAlert('Comentario muy largo')
               return
            }

             if (this.postData.titulo.length > 45){
               this.showErrorAlert('Titulo muy largo')
               return
            }


            if (!(this.happy || this.good || this.sad || this.angry)){
                this.showErrorAlert('Debes seleccionar un emoji')
               return
            }
            if (!this.selectedLocation){
               this.showErrorAlert('Debes seleccionar una ubicacion en el mapa')
               return
            }



            const db = firebase.firestore()  // importing firebase firestore
            this.postData.postId = this.generateRandomString(10)
            this.getDateAndTime() // Initializion date And Time to post
            this.postData.location = 'pixels'
            this.postData.X = this.selectedX
            this.postData.Y = this.selectedY
            this.postData.emoji = this.getEmoji()
            this.postData.latitud = 'invalid'
            this.postData.longitud = 'invalid'

            if (this.image != null){
               const filename = this.image.name
               const ext = filename.slice(filename.lastIndexOf('.'))
               this.postData.fotoId = this.postData.postId + ext
               firebase.storage().ref('PostFotos/' + this.postData.postId + ext).put(this.image)
               .then(() => {
                  
               }).catch(()=>{
                  this.showErrorAlert('Error al subir la foto')
                  this.postData.fotoId = 'default'
               })
            }else{
               this.postData.fotoId = 'default'
            }

            db.collection('Post').add(this.postData)
            .then( () =>{
               this.showAlertSuccess = true
               setTimeout(function(){
                  this.showAlertSuccess = false
                  this.resetForm() 
                  this.readPosts()
               }.bind(this),2000); 
                
            })
            .catch( (/*error*/) =>{
               this.showErrorAlert('No se pudo realizar la publicacion')
            });   

         },
         generateRandomString(size){
            /* generating postId */
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            let autoId = ''
            for (let i = 0; i < size; i++) {
               autoId += chars.charAt(Math.floor(Math.random() * chars.length))
            }
            return autoId
         },
         getEmoji(){
            if (this.happy){
               return 'smile'
            }
            
            if (this.good){
               return 'good'
            }
            
            if (this.sad){
               return 'sad'
            }
            
            if (this.angry){
               return 'angry'
            }
            
         },
         getDateAndTime(){
            var date = new Date()
            var splitDate = date.toISOString().slice(0,10).split('-')
             if(splitDate.count == 0){
               return null;
            }
            this.postData.año = Number(splitDate[0])
            this.postData.mes = Number(splitDate[1])
            this.postData.dia = Number(splitDate[2])
            this.postData.hora = Number(date.getHours())
            this.postData.minutos = Number(date.getMinutes())
         },   
         onSubmit: function() {
            this.resetForm(); //clear form automatically after successful request
         }, 
         resetForm() {
            this.imgURL=''
            this.image=null
            this.happy = false, this.good = false, this.sad = false, this.angry = false
            this.selectedLocation= false
            this.selectedX = null
            this.selectedY = null

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
         },
         onPickFile(){
            this.$refs.fileInput.click()
         },
         onFilePicked(event){
            const files = event.target.files
            let filename = files[0].name
            if (filename.lastIndexOf('.')<=0){
               return alert('Add a valid file')
            }
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
               this.imgURL = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
            this.image = files[0]  
         },
         drawPoint(event){
            this.selectedLocation = true
            this.selectedX = event.clientX - 5
            this.selectedY = event.clientY + 5
           /* console.log(event.clientX); // x coordinate
            console.log(event.clientY); // y coordinate

            // pageX/Y gives the coordinates relative to the <html> element in CSS pixels.
            console.log(event.pageX); 
            console.log(event.pagey); 

            // screenX/Y gives the coordinates relative to the screen in device pixels.
            console.log(event.screenX);
            console.log(event.screenY);*/
         },
         showErrorAlert(title, msg){
            this.errorTitle = title
            this.errorMsg = msg
            this.showAlert = true
            setTimeout(function(){
              this.showAlert = false
            }.bind(this),2000);  
         }
      }
      
   }
</script>



<style scoped>

   #post{
      
      position: absolute;
      padding: 24px 48px;
      display: grid;
      grid-template-columns: 745px  470px;
      grid-template-rows:  50px 582px ;
      grid-template-areas: 
         "header header"
         "map post"
      ;
   }

   .header{
      grid-area: header;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background: #2c1656;
      border-top-right-radius: 24px;
      border-top-left-radius: 24px;
      color: white;
      padding: 24px;
      box-shadow: -5px 7px 11px -1px rgba(0,0,0,0.164);
   }

   .material-icons{
      margin-left: auto;
      cursor:pointer;
   }

   .map{
      grid-area: map;
      cursor: pointer;
      border-bottom-left-radius: 24px;
   }

   .circle{
      position: absolute;
      width: 10px;
      height: 10px;
      background: #ff00ff;
      border-radius: 50px;
      -o-transition:.2s;
      -ms-transition:.2s;
      -moz-transition:.2s;
      -webkit-transition:.2s;
      transition:.2s;
   }

   


   .post{
      grid-area: post;
      background: white;
      border-bottom-right-radius: 24px;
   }

   .form-group{padding: 8px 16px; margin: 0}
   .form-group label{margin:0;}
   .form-group input{margin-bottom:5px;}
   .type{
      margin: 8px 0px;
      width: 100%;
      height: 125px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
   }

   .span-title{
      color: rgb(0, 131, 0);
      align-self: center;
      font-weight: 600;

   }
   .type ul{ 
      width: 100%;
      height: 80px;
      padding: 0;
      margin: 0;
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
   .span-types{
      color: #acacac;
      padding-top: 2px;
      font-size: 12px;
      display: flex;
      margin: 0;
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

   .file-input{
      margin-top: 8px;
      padding-right: 24px;
      display: flex;
      justify-content:flex-start;
      width: 100%;
      height: 110px;
      border-bottom: 2px solid rgba(211, 211, 211, 0.199);
   }

   .preview-container{
      display: flex;
      justify-content: center;
      align-items: flex-start;
      
   }

   .img-container{
      
      margin-left: 18px;
      height: 100px;
      width: 100px;
   }

   .img-container img{
      border-radius: 4px;
      height: 100%;
      width: 100%;
   }
   .delete{
      margin-left: 12px;
      color: gray;
      
   }
   .delete:hover{
      color: black;
   }

   .btn{
      padding: 0 4px;;
      height: 40px;
      display: flex;
      align-items: center;
      font-weight: 600;
      border:none; 
   }

   .btn-light:focus{
       border:none !important; 
       box-shadow: none ! important;
   }

   .btn i{
      margin-right: 8px;
   }
  
  .span-location {

     padding: 0 8px;
     display:flex;
     align-items: center;
     justify-content: center;
     color: lightskyblue;
     font-weight: 600;
  }

  .span-location i{
     margin-left: 0px;
     
     
    
  }
   
   #btn-container{
      width: 100%;
      height: 100px;
      margin-top: 8px;
      display: flex;
      justify-content: center;
      border-top: 2px solid rgba(211, 211, 211, 0.199);
    }


   .alert{
      text-align: center;
      bottom:0px;
      right:25%;
      left:50%;
      margin-left:-150px;
      position: absolute;
      width: 30%; 
      display: inline-block;
   }

</style>
