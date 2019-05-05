<template>
   <div id="showEmojis">
      <div 
         v-if="dataEmojiSelected && showInfo" 
         :style="{
            position: 'absolute',
            left: latlngToXY(dataEmojiSelected.latitud, dataEmojiSelected.longitud, dataEmojiSelected).x - 15 +'px',
            top:  latlngToXY(dataEmojiSelected.latitud, dataEmojiSelected.longitud, dataEmojiSelected).y - 6  +'px',
            width:'70px',
            height:'70px',
            opacity: '0.4',
            background: getSelectedBackgroundColor(dataEmojiSelected.emoji),
            'border-radius':'50px',
             /* Effect */
            '-o-transition':'.5s',
            '-ms-transition':'.5s',
            '-moz-transition':'.5s',
            '-webkit-transition':'.5s',
            transition:'.5s'
         }"
      >      
      </div>
      <!--<transition-group name="fadeLeft" tag="div" :src='day.preview' v-if='day.current' title='Preview'>
            <img v-for="day in days" v-bind:key="day">  
         </transition-group> -->   
      <transition-group name="fade" style="animation-duration: 1s;" >    
         <img
            v-for="post in posts" 
            :key="post"
            
            v-bind:src="getImgPinType(post)"
            :style="{
               cursor:'pointer',
               position: 'absolute',
               left: latlngToXY(post.latitud, post.longitud, post).x  +'px',
               top:  latlngToXY(post.latitud, post.longitud, post).y  +'px',   
            }"
            @click="  
               dataEmojiSelected = post
               postData = post 
               $emit('getPostData' , postData)
               $emit('showInfo' , true)
               $emit('updateImageSource')
               " 
         >
     
      </transition-group>
            
   </div>
</template>

<script>
   import angry from '@/assets/angry_pin.png'
   import happy from '@/assets/happy_pin.png'
   import sad from '@/assets/sad_pin.png'
   import good from '@/assets/good_pin.png'
   
   export default {
      name:'showEmojis',
      components:{
         
      },
      props:{
         posts:Array,
         readPosts:Function,
         showInfo:Boolean
      },
      data(){
         return{
            forKey:'',
            emojisImg:{
               angry:angry,
               happy:happy,
               good:good,
               sad:sad
            },
            postData:{
               /*postId:'',
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
               minutos:'',*/
            },
            dataEmojiSelected:null,
         }
      },
      created(){
         
      },
      methods:{
         getSelectedBackgroundColor(type){
            var  colors = ['#86e3ff', '#007ac5' , '#ffb03a', '#ff0000']

            if (type === 'smile')
               return colors[0]
            if (type === 'good')
               return colors[1]
            if (type === 'sad')
               return colors[2]
            if (type === 'angry')
               return colors[3]

         },
        // this function returns the image conrresponding to the type of post
          getImgPinType(post){ 
            if (post.emoji === 'angry')
               return this.emojisImg.angry
            if (post.emoji === 'smile')
               return this.emojisImg.happy
            if (post.emoji === 'sad')
               return this.emojisImg.sad
            if (post.emoji === 'good')
               return this.emojisImg.good
         },
           latlngToXY(lat, lng, post){

              if (post.location == 'pixels'){
                 return {
                    x : post.X - 10,
                    y : post.Y
                 }
              }

               //top-left reference point
               var p0 = {
                  scrX: 48,        // Minimum X position on screen
                  scrY: 124,         // Minimum Y position on screen
                  lat: 8.298718,    // Latitude
                  lng: -62.713531     // Longitude
               }
               //bottom-right reference point
               var p1 = {
                  scrX: 793,          // Maximum X position on screen
                  scrY: 706,        // Maximum Y position on screen
                  lat: 8.295632,    // Latitude
                  lng: -62.709545     // Longitude
               }
               var radius = 6.371;     //Earth Radius in Km

               //## Now I can calculate the global X and Y for each reference point ##\\

               // This function converts lat and lng coordinates to GLOBAL X and Y positions
               function latlngToGlobalXY(lat, lng){
                  //Calculates x based on cos of average of the latitudes
                  let x = radius*lng*Math.cos((p0.lat + p1.lat)/2);
                  //Calculates y based on latitude
                  let y = radius*lat;
                  return {x: x, y: y}
               }
               // Calculate global X and Y for top-left reference point
               p0.pos = latlngToGlobalXY(p0.lat, p0.lng);
               // Calculate global X and Y for bottom-right reference point
               p1.pos = latlngToGlobalXY(p1.lat, p1.lng);

               //Calculate global X and Y for projection point
               let pos = latlngToGlobalXY(lat, lng);
               //Calculate the percentage of Global X position in relation to total global width
               pos.perX = ((pos.x-p0.pos.x)/(p1.pos.x - p0.pos.x));
               //Calculate the percentage of Global Y position in relation to total global height
               pos.perY = ((pos.y-p0.pos.y)/(p1.pos.y - p0.pos.y));

               //console.log(p1.scrX * pos.perX - 5,p1.scrY * pos.perY + 63)
               return{
                  x: (p0.scrX + (p1.scrX - p0.scrX)*pos.perX) - 20,
                  y: (p0.scrY + (p1.scrY - p0.scrY)*pos.perY) - 60
               }
            }
      }
   
   }
</script>

<style scoped>
   .pin-emoji{
      cursor:pointer;
      
   }
   
   
 
</style>

