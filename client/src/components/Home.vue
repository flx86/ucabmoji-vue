<template>
   <div id="home">
      <Navbar/>
      <!-- home containter for the layout withd grid-->
      <div class="home-container">
         <!-- shows al the pin-emojis in the map-->
         <div class="map-container">
            <show-emojis
               :posts="posts"
               :showInfo="showInfo"
               v-on:getPostData="postData = $event"
               v-on:updateImageSource="getImg()"
            />
         </div>

         <!-- shows all the posts data -->
         <div class="info-container" >
            <!-- header for date  reload, make new post , calendar , time-->
            <div class="info-header"> 
               <div class="calendar-bt-container"  @click="openCalendar = !openCalendar,switchCalendarIcon()">
                   <i class="material-icons"
                    v-b-tooltip.hover :title="tooltipCalendarIconMsg"    
                   >{{calendarIcon}}</i>
                  <h4 class="date-title" >{{stringDate}}</h4> 
                  
               </div>
               <h4 v-if="timerEnabled" class="date-title date-hour">{{stringHour}}</h4> 

               <div class="info-btn-container">
                   <i  
                     v-b-tooltip.hover title="Envia un mensaje"
                     class="material-icons"
                     @click="
                        useMessage = !useMessage
                     " 
                  >mail</i>

                  <i  
                     v-b-tooltip.hover title="Nueva publicacion"
                     class="material-icons"
                     @click="
                        usePost = !usePost
                        showInfo = false
                        date = new Date().toISOString().slice(0,10)
                     " 
                  >add</i>
                  <i 
                     v-b-tooltip.hover title="Actualizar mapa"
                     class="material-icons"
                     @click="readPosts()"
                  >refresh</i>


               </div>
            </div>

            <div class="chart-calendar-container">
               <!--chart component and title -->
               <h4 v-if="!openCalendar" class="chart-title">Publicaciones Totales: {{posts.length}}</h4>
               <Chart
                  v-if="loaded && !openCalendar"
                  :counters="counters"
               />
               <!-- date picker component-->
               
               <date-pick
                  
                  v-show="openCalendar"
                  ref="datePicker"
                  v-model="date"
                  :value="dateValue"
                  :hasInputElement="false"
                  :inputAttributes="{readonly: true}"
                  :displayFormat="'DD.MM.YYYY'"
                  :weekdays ="weekdays"
                  :months="months" 
               />
            </div>

            <div class="post-info-container">
               <!-- show post info -->
               <transition name="fade">
                  <show-post-info
                     v-show="showInfo"
                     :postData="postData"
                     :imgSource="imgSource"
                     :months="months"
                     v-on:showInfo="showInfo = $event"
                  />
               </transition>     
            </div>
         </div>

         <!-- slider component -->
         <div class="slider-container" style="background:white;" >
            
            <vue-slider 
               ref="slider"
               v-model="value" 
               v-bind="options"
            
             ></vue-slider>
              <i 
                  v-b-tooltip.hover :title="tooltipTimerIconMsg"
                  class="material-icons"
                  @click="switchTimerIcon()"
               >{{timerIcon}}</i>   
         </div>  

          <!-- add post Component shows with button -->
         <transition name="fade">
            <Post2
               v-show="usePost"
               v-on:closePost="usePost = $event"
               :readPosts="readPosts"
            />
         </transition>

         <transition name="fade">
            <Post
               v-show="false"
               :postData="postData"
               :addPost="addPost"
               v-on:closePost="usePost = $event"
            />
         </transition>

          <transition name="fade">
            <Message
               :generateRandomString="generateRandomString"
               v-show="useMessage"
               v-on:closeMessage="useMessage = $event"
            />
         </transition>  


      </div>
   </div>
</template>
<script>
   import Navbar from '@/components/Navbar.vue'
   import Post from '@/components/Post.vue'
   import Post2 from '@/components/Post2.vue'
   import ShowEmojis from '@/components/ShowEmojis.vue'
   import ShowPostInfo  from '@/components/ShowPostInfo.vue'
   import Chart from '@/components/Chart.vue'
   import VueSlider from 'vue-slider-component'
   import DatePick from 'vue-date-pick';
   import 'vue-date-pick/dist/vueDatePick.css';
   import Message from '@/components/Message.vue'
   
   import firebase from 'firebase'

   export default {
      name: 'home',
      components:{
         Navbar, Post,Post2, Message, ShowEmojis,ShowPostInfo,Chart,DatePick,VueSlider
      },
      data:function(){
         return{

            /* date picker props */
            tooltipCalendarIconMsg:'Buscar fecha',
            calendarIcon:'calendar_today',
            openCalendar:false,
            dateValue: new Date(),
            date: new Date().toISOString().slice(0,10),
            weekdays: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
            months:[
                  'Enero', 'Febrero', 'Marzo', 'Abril',
                  'Mayo', 'Junio', 'Julio', 'Agosto',
                  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                  ],

            /* slider props */
            timerEnabled: false,
            timerIcon:'timer_off',
            tooltipTimerIconMsg:'Buscar Hora',
            hour: new Date().getHours(),
            value: 7,
            options:{
               data: [
               "7 AM","8 AM","9 AM","10 AM","11 AM",
               "12 M","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM"
               ],
               width: 500,
               height: 8,
               dotSize: 20,
               min: 7,
               max: 21,
               interval: 1,
               disabled: true,
               show: true,
               speed: 0.3,
               reverse: false,
               lazy: true,
               tooltip: "hover",
               piecewise: true,
               tooltipDir: "bottom",
            },

            /*
               Post

               postId   = string - string random
               dia      = string / number 
               mes      = string / number -  del  1 al 2
               año      = string / number - ejemplo: 2019
               comentario = string
               titulo   = string 
               emoji    = string - [smile , good, sad , angry]
               fotoId   = string - sera el mismo striong random que postID
               imgURL   = string - se utiliza cuando quieres referenciar una imagen por link
               latitud  = string / number - importante: solo 6 decimales , ejemplo: 8.297816
               longitud = string / number - importate: solo 6 decimales, ejemplo: -62.711316
               hora     = string / number - en formato 24 horas
               minutos  = string / number - del 1 al 60


            */



            /* content of posts */
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
            },
            posts:[],

            /*  boolean variables to control render components */
            loaded:false,  // show component when post array is loaded
            useMessage:false,
            usePost:false,
            showInfo:false,
            imgSource:'',
            renderChart:true,
            counters:{
               happy:0,
               good:0,
               sad:0,
               angry:0
            },
         }
      
      },
      created(){
         this.readPosts();
      },
      computed:{
         stringDate(){
            this.readPosts()
            var splitDate = this.date.split('-');
            if(splitDate.count == 0){
               return null;
            }

            var year = splitDate[0];
            var month = this.months[Number(splitDate[1]) - 1 ]
            var day = splitDate[2]; 
            return day + ' de ' + month + ',' + year + ''; 
         },
         stringHour(){
            this.readPosts()
            
            
            return 'a las ' + this.value
         },
      },
      methods:{
         readPosts(){
            this.showInfo = false 
            this.loaded = false
            const db = firebase.firestore();
            db.collection("Post").get().then((querySnapshot) => {
               const posts = []
               var happy = 0 ,  good = 0 , sad = 0, angry = 0
               querySnapshot.forEach((doc) => {
                  
                  if (doc.data().latitud == null || doc.data().longitud == null){   
                     return
                  }else if(doc.data().hora < 7 || doc.data().hora > 21){
                     return
                  }
                  if (doc.data().año + '-' +'0'+doc.data().mes + '-' + doc.data().dia == this.date){

                     
                    
                     if (this.timerEnabled){
                        if(doc.data().hora == this.getHourFromSliderValue()){
                           posts.push(doc.data()); 
                           //Counting emoji types
                           if (doc.data().emoji == 'smile'){happy++}
                           else if (doc.data().emoji == 'good'){good++}
                           else if (doc.data().emoji == 'sad'){sad++}
                           else if (doc.data().emoji == 'angry'){angry++}
                        }
                     }else{
                        posts.push(doc.data()); 
                        //Counting emoji types
                        if (doc.data().emoji == 'smile'){happy++}
                        else if (doc.data().emoji == 'good'){good++}
                        else if (doc.data().emoji == 'sad'){sad++}
                        else if (doc.data().emoji == 'angry'){angry++}
                     }
                  }
               })
               this.counters.happy = happy
               this.counters.good = good
               this.counters.sad = sad
               this.counters.angry = angry
               this.posts = posts
               this.loaded = true
            });
         },
        
         addPost(){
            const db = firebase.firestore()  // importing firebase firestore
            this.postData.postId = this.generateRandomString (10)
            this.getDateAndTime() // Initializion date And Time to post
            /* posting on firebase firestore */
            db.collection("Post").add(this.postData)
            .then(this.readPosts)   
            .catch(function(){
               //console.log("Error writing document: ", error);
            });
         },

         deletePost(postData){
            const db = firebase.firestore()
            
            db.collection('Post')
            .where('postId', '==', postData.postId).get()
            .then(querySnapshot => {
               querySnapshot.forEach(doc => {
                  doc.ref.delete().then(this.readPosts)
               })
            })
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
         clearPostData(){
            this.postData.titulo = ''
            this.postData.comentario = ''
            this.postData.emoji = ''
            this.postData.latitud = ''
            this.postData.longitud = ''
            this.postData.imgURL = ''
         },
         isFutureDate(date) {
               const currentDate = new Date();
               return date > currentDate;
         },
         switchCalendarIcon(){
            if (this.calendarIcon === 'calendar_today'){
               this.calendarIcon = 'close'
               this.tooltipCalendarIconMsg = 'Cerrar'
            }
            else {
               this.calendarIcon = 'calendar_today'
               this.tooltipCalendarIconMsg = 'Buscar fecha'
               }
         },
         switchTimerIcon(){
             
             this.showInfo = false
             if (this.timerIcon === 'timer_off'){
               this.options.disabled = false
               this.timerEnabled = true
               this.timerIcon = 'timer'
               this.tooltipTimerIconMsg = 'Desactivar'
            }
            else{
               this.timerIcon = 'timer_off'   
               this.tooltipTimerIconMsg = 'Buscar hora'
               this.options.disabled = true
               this.value = 7
               this.timerEnabled = false
               this.$refs.slider.setIndex(0)
            } 
            this.readPosts()
           
         },
          getDateAndTime(){
            var date = new Date()
            var splitDate = date.toISOString().slice(0,10).split('-')
             if(splitDate.count == 0){
               return null;
            }
            this.postData.año = splitDate[0]
            this.postData.mes = splitDate[1]
            this.postData.dia = splitDate[2]
            this.postData.hora = date.getHours()
            this.postData.minutos = date.getMinutes()
         },
         
         getHourFromSliderValue(){
            if (this.timerEnabled){
               if (this.value.match(/AM/g)){
                  return this.value.slice(0,1)
               }
               else if (this.value.match(/PM/g)){
                  return Number(this.value.slice(0,1)) + 12
                  
               }
               else if (this.value.match(/M/g)){
                  return 12
               }
            }
         },
         getImg(){

            let file
            if (this.postData.fotoId == 'default'){
               file =  'default.png'
            }else {
               file = 'PostFotos/'.concat(this.postData.fotoId)
            }
            const storageRef = firebase.storage().ref()
            storageRef.child(file).getDownloadURL()
            .then( (url) => {
               this.imgSource = url
               this.showInfo = true
            }).catch( () => {
               storageRef.child('default.png').getDownloadURL()
               .then((url) =>{
                  this.imgSource = url
                  this.showInfo = true
               })
            });
         },
        
        
      }
   }
</script>

<style scoped >

   .home-container{
      background:linear-gradient(to right, #2c1656, #423261);
      padding: 24px 48px;
      display: grid;
      grid-template-columns: 745px  470px;
      grid-template-rows:  50px 582px ;
      grid-template-areas: 
         "slider info"
         "map info"
      ;
      
   }

   .slider-container{
      
      grid-area: slider;
      background:white;
      border-top-left-radius: 24px;
      box-shadow: -5px 7px 11px -1px rgba(0,0,0,0.164);
      padding: 8px;
      display:flex;
      align-items: center;
      justify-content: center;
   }
   .map-container{
      grid-area: map;
      background: url("../assets/mapa2.png");
      background-size: cover;
      border-bottom-left-radius: 24px;
      
   }
   .info-container{
      background:white;
      width: 100%;
      grid-area: info;
      border-top-right-radius: 24px;
      border-bottom-right-radius: 24px;
      box-shadow: -4px 3px 11px -1px rgba(0, 0, 0, 0.164);
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows:  50px 1fr 1fr;
      grid-template-areas: 
         "header"
         "chartcalendar"
         "postinfo"
      ;
   

      /*box-shadow: -3px 4px 3px 0px rgba(61, 61, 61, 0.308);*/
   }
   .chart-calendar-container{
      grid-area: chartcalendar;
      border-bottom:1px solid #e2e2e2;  
   }
   .post-info-container{
      grid-area: postinfo;
      
   }
   .info-header{
      grid-area: header;
      padding: 8px;
      width:100%; height:50px; background: none;
      border-top-right-radius: 24px;
      border-bottom:1px solid #e2e2e2;
      display: flex;
      justify-content: space-around;
      align-items: center;
   } 
   .info-btn-container{

      margin-left: auto;
   }
   .calendar-bt-container{
      display:flex;
      align-items: center;
   }

   .date-title{
      cursor: pointer;
      color: #212529;
      margin:0;
      text-align: center;
      font-family: inherit;
      font-size: 16px;  
   }

   .date-hour{
      margin-left:8px;
   }

   .chart-title{
      cursor: default;
      color: #212529;
      margin:0;
      text-align: center;
      font-family: inherit;
      margin-top: 8px;
       
   }
   .material-icons{  
      color:gray ;
      cursor: pointer;
      margin: 0 8px;
   }
   .material-icons:hover{
      color:black;
   }


</style>
