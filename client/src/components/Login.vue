<template>
  <div  id="login">
    <div id="container" class="container">
      <form>
        <div class="form-group">
            <label for="email">Correo Ucab</label>
            <input 
                autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                type="email" 
                class="form-control" 
                id="email"  
                placeholder="" 
                v-model="ucabmail">
        </div>
        <div class="form-group">
            <label for="pw">Contraseña</label>
            <input 
                type="password" 
                class="form-control" id="pw" 
                placeholder="" 
                v-model="password">
        </div>   
        <div id="btn-container">
            <button  
                v-on:click="login" 
                id="btn-ucabmoji"  
                type="button" 
                class=""
            >Ingresar</button>
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
      name: 'login',
      data:function(){
         return {
            name:'',
            ucabmail: '',
            password:'',
            showAlert:false,
            showAlertSuccess:false,
            errorMsg:'',
            errorTitle:''
         };
      },
      methods:{

        /* 
            auth/user-not-found
            auth/wrong-password

        */

         login(){

             if (this.ucabmail.length <= 0 ||  this.password.length <=0){
               this.showErrorAlert('Debes completar los campos','')
               return 
            }
            if (!this.ucabmail.match(/@/g)){
               this.showErrorAlert('Correo Invalido','')
               return 
            }
            if (!(this.ucabmail.match(/@ucab.edu.ve/g) || this.ucabmail.match(/@est.ucab.edu.ve/g))){
               this.showErrorAlert('Correo Invalido:','Correo ucab necesario para ingresar a Ucabmoji')
               return    
            }


            firebase.auth().signInWithEmailAndPassword(this.ucabmail, this.password)
            .then((user) => {

               user = firebase.auth().currentUser
               if (user != null){
                   this.name  = user.displayName
               }     

               this.showAlertSuccess = true
                setTimeout(function(){
                  this.showAlertSuccess = false
                  this.$router.push('/home')
               }.bind(this),2000);
               
           })
           .catch((error) => {
               if (error.code == 'auth/user-not-found'){
                   this.showErrorAlert('Correo Invalido:','Correo Ucab no registrado')
               }else if (error.code == 'auth/wrong-password'){
                   this.showErrorAlert('Contraseña Incorrecta','')     
                }
           })
               
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
    #login{
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
