<template>
    <div id="register">
        <div id="container" class="container">
            <form>
               <div class="form-group">
                  <label for="name">Nombre y Apellido</label>
                  <input 
                     autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" 
                     type="name" 
                     class="form-control" 
                     id="name"  
                     placeholder=" " 
                     v-model="name">
               </div>
               <div class="form-group">
                  <label for="ucabmail">Correo Ucab</label>
                  <input 
                     autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" 
                     type="mail" class="form-control" 
                     id="ucabmail" placeholder=" " 
                     v-model="ucabmail">
               </div>
               <div class="form-group">
                  <label for="pw">Contraseña</label>
                  <input 
                     type="password" 
                     class="form-control" id="pw" 
                     placeholder=" " 
                     v-model="password">
               </div>
               <div id="btn-container">
                  <button 
                  v-on:click="register()" 
                  id="btn-ucabmoji"  
                  type="button" 
                  class=""
                  >Registrar</button>
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
                     <strong>Bienvenido</strong><br>{{name}} 
                     <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="showAlertSuccess = !showAlertSuccess">
                        <span aria-hidden="true">&times;</span>
                     </button>
                  </div>
               </transition>



            </form>
        </div>
    </div>
</template>

<script>
   import firebase from 'firebase'
   export default {
      name:'register',
      data:function(){
         return {
            name: '',
            ucabmail:'',
            password:'',
            showAlert:false,
            showAlertSuccess:false,
            errorMsg:'',
            errorTitle:''
         };
      },
      methods:{
         register(){
            if (this.ucabmail.length <= 0 || this.name.length <= 0 || this.password.length <=0){
               this.showErrorAlert('Debes completar los campos','')
               return 
            }
            if (!this.ucabmail.match(/@/g)){
               this.showErrorAlert('Correo Invalido','')
               return 
            }
            if (!(this.ucabmail.match(/@ucab.edu.ve/g) || this.ucabmail.match(/@est.ucab.edu.ve/g))){
               this.showErrorAlert('Correo Invalido','Correo ucab necesario para ingresar a Ucabmoji')
               return    
            }
            if (this.password.length < 6){
               this.showErrorAlert('Contraseña Debil:','Mínimo 6 caracteres')
               return 
            }
            
            firebase.auth().createUserWithEmailAndPassword(this.ucabmail, this.password)
            .then((user) => {
               user = firebase.auth().currentUser;
               user.updateProfile({
                  displayName: this.name
               })

               this.showAlertSuccess = true
                setTimeout(function(){
                  this.showAlertSuccess = false
               }.bind(this),2000);
            })
            .catch(() => { 
                this.showErrorAlert('Correo Invalido:','Correo Ucab ya esta registrado')
            });
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
   #register{
      padding-top: 15px;
   }
   #container{
      width: 100%;
      height: 250px;    
      color: white;
   }
   .form-group label {
        margin:0;
    }
   .form-control:focus{
      border: none;
      box-shadow: 0 4px 2px -2px rgb(0, 169, 211) !important;
   }
   #btn-container{
      width: 100%;
      height: 100px;
      margin-top: 24px;
      display: flex;
      justify-content: center;
      border-top: 2px solid rgba(211, 211, 211, 0.199);

   }
   </style>
