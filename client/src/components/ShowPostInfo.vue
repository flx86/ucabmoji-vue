<template>
   <div class="show-post-info" id="show-post-info">
      <div class="img" >
         <img :src="imgSource" alt="">
      </div>

      <div class="info">
         <h4>{{postData.titulo}}</h4>
         <p>{{postData.comentario}}</p>
         <span>{{stringDate()}}</span>
      </div>
      

   </div>

</template>


<script>

   

   export default {
      name:'showPostInfo',
      data(){
         return{ 
            
         }
      },
      props:{
         postData:Object,
         imgSource:String,
         months:Array,
      },
      created(){
        
      },
      computed:{
         
      },
      methods:{
         stringDate(){
            let hora = this.postData.hora 
            let minutos = this.postData.minutos
            if (this.postData.minutos < 10){
               minutos = '0' + minutos
            }
            if (this.postData.hora < 10){
               hora = '0' + hora
            }


            return this.postData.dia + ' de ' + this.months[this.postData.mes-1] + ',' 
                  + this.postData.año + ' a las ' + hora + ':' + minutos + ' Horas'
         },
      }
   }
</script>

<style scoped>
   @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,700');
   .show-post-info{ 
     
      justify-content: center;
      width: 100%;
      height: 100%;
      
      padding: 24px 24px;
      display: grid;
      grid-template-columns: 200px 1fr;
      grid-template-rows: 200px;
      grid-template-areas:
         "img info"          
      ;
      
   }


  .img{
     grid-area: img;
     border-top-left-radius:4px;
     border-bottom-left-radius:4px;
     border-top: 1px solid rgb(230, 230, 230);
     border-left: 1px solid rgb(230, 230, 230);
     border-bottom: 1px solid rgb(230, 230, 230);
     box-shadow: 0 2px 5px 0 rgba(0,0,0,.16); 
     
  }
  
   .img img{      
      width: 200px;
      height: 200px;
   }
     

   .info{
     padding: 12px;
     grid-area: info;  
     
     border-top-right-radius:4px;
     border-bottom-right-radius:4px;
     border-top: 1px solid rgb(230, 230, 230);
     border-right: 1px solid rgb(230, 230, 230);
     border-bottom: 1px solid rgb(230, 230, 230);
     box-shadow: 0 2px 5px 0 rgba(0,0,0,.16) ;

     display: flex;
     flex-direction: column;
     
   }
   .info h4{
      margin: 0;
      font-family: inherit;
      font-size: 18px;
      color: #212529;
      font-weight: 500;
      line-height: 1em;
   }
   .info p{
      margin: 0;
      color: #747373;
      font-size: .9rem;
      font-weight: 400;
      display: block;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
   }

   span{
      align-self: flex-end;
      margin-top: auto;
      color: gray;
      font-size: 10px;
   }



</style>
