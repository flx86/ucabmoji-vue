<template>
   <div id="message">
      <div class="container" >
         <div class="title">
            <h4>Envia un mensaje a Ucabmoji Movil</h4>
            <i 
               class="material-icons"
               @click="
                  resetForm()
                  $emit('closeMessage',false)
               "
            >close</i>
         </div>
         <form class="form-group" @submit.prevent="onSubmit">
            <label>Titulo</label>
            <input 
               class="form-control clear-title"
               v-model="messageData.titulo"
               type="text"   
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" 
            >  
            <label>Mensaje</label>
            <textarea 
               class="form-control clear-comment"
               v-model="messageData.mensaje"
               rows="3"
               autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            >
            </textarea>


            <div class="file-input">
                <button 
                  type="button" class="btn btn-primary"
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
            
            <div id="btn-container">
               <button 
                  id="btn-ucabmoji"  
                  type="button" 
                  @click="
                     sendMessage()
                  "
               >Enviar</button>
            </div>
         </form>
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
                <strong>Tu mensaje fue enviado</strong><br>{{name}} 
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
      name:'message',
      data(){
         return{
            messageData:{
               msgId:'',
               fotoId:'',
               titulo:'',
               mensaje:'',
               status:'',
               dia:'',
               mes:'',
               año:'',
               hora:'',
               minutos:'',

            },
            image:null,
            imgURL:'',
            errorTitle:'',
            errorMsg:'',
            showAlertSuccess:false,
            showAlert:false,
         }
      },
      props:{
         generateRandomString: Function


      },
      methods:{
         onSubmit: function() {
            this.resetForm(); //clear form automatically after successful request
         }, 
         resetForm() {
            this.imgURL = ''
            this.image = null
            var self = this; //you need this because *this* will refer to Object.keys below`
            //Iterate through each object field, key is name of the object field`
            Object.keys(this.messageData).forEach(function(key) {
               self.messageData[key] = '';
            });
         },
         sendMessage(){

            if (this.messageData.titulo.length <= 0 || this.messageData.mensaje.length <= 0){
               this.showErrorAlert('Debes completar los campos')
               return
            }

            const db = firebase.firestore()  // importing firebase firestore
            this.messageData.msgId = this.generateRandomString(10)
            this.getDateAndTime() // Initializion date And Time to post
            this.messageData.status = 'new'

            if (this.image != null){
               const filename = this.image.name
               const ext = filename.slice(filename.lastIndexOf('.'))
               this.messageData.fotoId = this.messageData.msgId + ext
               firebase.storage().ref('MsgFotos/' + this.messageData.msgId + ext).put(this.image)
               .then(() => {
                  
               }).catch(()=>{
                  this.showErrorAlert('Error al subir la foto')
                  this.messageData.fotoId = 'default'
               })
            }else{
               this.messageData.fotoId = 'default'
            }


            db.collection('Mensaje').add(this.messageData)
            .then( () =>{
               this.showAlertSuccess = true
               setTimeout(function(){
                  this.showAlertSuccess = false
                  this.resetForm() 
               }.bind(this),2000); 
                
            })
            .catch((/*error */)=>{
               this.showErrorAlert('Error al enviar el mensaje')
            });   
         },
          getDateAndTime(){
            var date = new Date()
            var splitDate = date.toISOString().slice(0,10).split('-')
             if(splitDate.count == 0){
               return null;
            }
            this.messageData.año = Number(splitDate[0])
            this.messageData.mes = Number(splitDate[1])
            this.messageData.dia = Number(splitDate[2])
            this.messageData.hora = Number(date.getHours())
            this.messageData.minutos = Number(date.getMinutes())
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
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,700');

   #message{
      background:rgba(59, 59, 59, 0.274);
      width:100%;
      height:100%;
      position:absolute; 
      text-align: center;
   }
   
   .container{
      background: white;
      width: 500px;
      margin-top:40px;
      border-radius: 16px;
      padding: 0px;
   }

   .file-input{
      margin-top: 8px;
      padding-right: 24px;
      display: flex;
      justify-content:flex-start;
      width: 100%;
      height: 120px;
   }

   .preview-container{
      display: flex;
      justify-content: center;
      align-items: flex-start;
      
   }

   .img-container{
      margin-left: 24px;
      height: 120px;
      width: 120px;
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
   }

   .btn-primary:focus{
       border:none;
       box-shadow: none ! important
   }

   .btn i{
      margin-right: 8px;
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
 
   .form-group{padding: 8px 16px; text-align: start;}
   .form-group label{margin:0;}
   .form-group input{margin-bottom:5px;}
   
   #btn-container{
      width: 100%;
      height: 100px;
      margin-top: 10px;
      display: flex;
      justify-content: center;
      border-top: 2px solid rgba(211, 211, 211, 0.199);
   }

   .alert{
      width: 30%; 
      display: inline-block;
   }


</style>

