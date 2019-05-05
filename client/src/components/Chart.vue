<template>
    <v-chart :options="pie"/>
</template>

<style>
   .echarts {
   width:100%;
   height: 230px;
   }
</style>

<script>
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  components: {
    'v-chart': ECharts
  },
  props:{
      counters: Object,
  },

  data() {
   let data =[ {value: this.counters.happy, name:'Excelente'},
               {value:this.counters.good, name:'Bien'},
               {value:this.counters.sad, name:'Triste'},
               {value:this.counters.angry, name:'Molesto'},
            ] 
   return {
      pie: {
         tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
         },
         toolbox:{
            showTitle:false, 
         },
         legend: {
            orient: 'vertical',
            x: '64%',
            y:'32%',
            data:['Excelente','Bien','Triste','Molesto'],
            textStyle:{
                  fontSize:'36px',
            }
         },
         series: [
            {
                  color:['#86e3ff', '#007ac5' , '#ffb03a', '#ff0000'],
                  name:'Estadisticas',
                  type:'pie',
                  radius: ['60%', '80%'],
                  center:['38%','55%'],
                  avoidLabelOverlap: false,
                  label: {
                     normal: {
                        show: false,
                        position: 'center'
                     },
                     emphasis: {
                        show: false,
                        textStyle: {
                              fontSize: '30',
                              fontWeight: 'bold'
                        }
                     }
                  },
                  labelLine: {
                     normal: {
                        show: false
                     }
                  },
                  data:data
            }
         ]
      }
   }
  }
}
</script>