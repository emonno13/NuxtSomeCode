<template>
  <v-row class="fill-height">
    <v-col class="py-0">
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-toolbar-title class="ay-color--grey-7 ay-text--basic">
            体重データ
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-title
            class="mr-5 ay-color--grey-7 ay-text--detail"
          >
            目標 {{ targetValue.toFixed(1) }}kg
          </v-toolbar-title>
          <v-toolbar-title
            class="mr-5 ay-color--grey-7 ay-text--detail"
          >
            現在 {{ latestValue }}kg
          </v-toolbar-title>
          <v-toolbar-title class="ay-color--grey-7 ay-text--detail">
            開始時より {{ comparedValue }}kg
          </v-toolbar-title>
        </v-toolbar>

        <v-toolbar flat color="ay-bg--grey-2">
          <v-card class="rounded-pill" :elevation="2">
            <v-btn
              rounded
              :class="[
                { nonSelectedTime: !isWeek },
                { selectedTime: isWeek },
              ]"
              :elevation="0"
              @click="setTermType('week')"
            >
              <span class="ay-text--detail">週</span>
            </v-btn>
            <v-btn
              rounded
              :class="[
                { nonSelectedTime: !isMonth },
                { selectedTime: isMonth },
              ]"
              class="ay-text--detail"
              :elevation="0"
              @click="setTermType('month')"
            >
              <span class="ay-text--detail">月</span>
            </v-btn>
            <v-btn
              rounded
              :class="[
                { nonSelectedTime: !is3Month },
                { selectedTime: is3Month },
              ]"
              class="ay-text--detail"
              :elevation="0"
              @click="setTermType('3month')"
            >
              <span class="ay-text--detail"> 3ヶ月</span>
            </v-btn>
          </v-card>
          <v-spacer />
          <v-btn
            icon
            height="24"
            width="24"
            class="mx-2"
            :disabled="!isPrevData"
            @click="setTerm('previous')"
          >
            <v-img
              :class="isPrevData ? 'mt-2' : ''"
              :src="isPrevData ? prevIcon : noPrevIcon"
            />
          </v-btn>
          <v-toolbar-title class="ay-color--grey-7 ay-text--detail">
            {{ startDate }}（{{ startDateText }}）〜
            {{ endDate }}({{ endDateText }})
          </v-toolbar-title>
          <v-btn
            icon
            height="24"
            width="24"
            :disabled="!isNextData"
            class="mx-1 mt-1"
            @click="setTerm('next')"
          >
            <v-img
              :class="isNextData ? 'mb-2' : ''"
              :src="isNextData ? nextIcon : noNextIcon"
            />
          </v-btn>
        </v-toolbar>
      </v-sheet>

      <v-sheet id="chart" class="mt-15" height="calc(100vh - 440px)">
        <apexchart
          ref="chart"
          height="100%"
          type="area"
          :options="chartOptions"
          :series="series"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
// import { API } from 'aws-amplify'
// import { getWeights } from './../../pages/graphql/queries'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)
export default {
  data () {
    return {
      currentData: null,
      targetValue: null,
      latestValue: null,
      comparedValue: null,
      startDate: null,
      endDate: null,
      firstLoginWeight: null,
      nextIcon: '/Vital/vital_icon/group839_right.png',
      prevIcon: '/Vital/vital_icon/group839_left.png',
      noNextIcon: '/Vital/vital_icon/group840_right.png',
      noPrevIcon: '/Vital/vital_icon/group840_left.png',
      isPrevData: true,
      isNextData: true,
      isWeek: true,
      isMonth: false,
      is3Month: false,
      dateRange: 7,
      weekNames: [
        { eng: 'Mon', jp: '月' },
        { eng: 'Tue', jp: '火' },
        { eng: 'Wed', jp: '水' },
        { eng: 'Thu', jp: '木' },
        { eng: 'Fri', jp: '金' },
        { eng: 'Sat', jp: '土' },
        { eng: 'Sun', jp: '日' }
      ],
      startDateText: null,
      endDateText: null,
      series: [
        {
          name: 'Weight Chart',
          type: 'area',
          data: []
        }
      ],
      chartOptions: {
        chart: {
          id: 'area-datetime',
          height: 350,
          stacked: true,
          foreColor: '#ABA7A4',
          toolbar: {
            autoSelected: 'pan',
            show: false
          },
          background: '#FDF8ED'
        },
        colors: ['#F18D17'],
        stroke: {
          width: 2,
          curve: 'straight',
          dashArray: [0, 5]
        },
        grid: {
          strokeDashArray: 0,
          borderColor: '#D0CBC7',
          padding: {
            left: 10,
            right: 18
          },
          clipMarkers: true,
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: ['gradient'],
          gradient: {
            enabled: true,
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
          }
        },
        legend: {
          show: false
        },
        markers: {
          size: 5,
          colors: ['#F18D17'],
          strokeColor: ['white'],
          strokeWidth: 2,
          hover: {
            size: 7,
            sizeOffset: 8
          },
          discrete: [
            {
              seriesIndex: 0,
              dataPointIndex: 0,
              fillColor: 'transparent',
              strokeColor: 'transparent',
              size: 0
            }
          ]
        },
        tooltip: {
          theme: 'light',
          style: {
            background: 'red'
          },
          fixed: {
            enabled: false,
            position: 'topRight'
          },
          custom ({ series, seriesIndex, dataPointIndex, w }) {
            if (
              dataPointIndex !== 0 &&
                            series[seriesIndex][dataPointIndex]
            ) {
              return (
                '<div class="chart_tooltip">' +
                                '<span>' +
                                series[seriesIndex][dataPointIndex].toFixed(1) +
                                ' kg' +
                                '<br/>' +
                                '<span class="achievement_text">' +
                                '目標達成度 ' +
                                (
                                  w.config.annotations.yaxis[0].y -
                                    series[seriesIndex][dataPointIndex]
                                ).toFixed(1) +
                                '<span>' +
                                '</span>' +
                                '</div>'
              )
            } else {
              return null
            }
          }
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'M/d'
          },
          tickAmount: 7,
          tooltip: {
            enabled: false
          },
          offsetX: -0
        },
        yaxis: {
          type: 'numeric',
          tickAmount: 5,
          labels: {
            formatter: (value) => {
              if (value === 0) {
                return 'kg'
              } else {
                return value.toFixed(1)
              }
            },
            offsetY: 10
          }
        }
      }
    }
  },

  // CALCULATE WHEN DATA CHANGE
  watch: {
    series () {
      this.$refs.chart.updateOptions({
        annotations: {
          yaxis: [
            {
              y: this.targetValue,
              borderColor: '#00B1DB',
              strokeDashArray: 5,
              label: {
                borderColor: 'transparent',
                style: {
                  color: '#00B1DB',
                  background: 'transparent'
                },
                offsetX: -20,
                offsetY: 20,
                text: `${this.targetValue}.0`
              }
            }
          ]
        }
      })
      const lastIndex = this.currentData.length - 1
      this.startDate = this.currentData[1].x.replace('GMT', '')
      this.endDate = this.currentData[lastIndex].x.replace('GMT', '')
      this.latestValue = Number(this.currentData[lastIndex].y).toFixed(1)
      this.comparedValue = (
        this.currentData[lastIndex].y - this.firstLoginWeight
      ).toFixed(1)
      if (this.comparedValue >= 0) {
        this.comparedValue = '+' + this.comparedValue
      }
      if (this.isWeek) {
        this.dateRange = 7
      }
      if (this.isMonth) {
        this.dateRange = 30
      }
      if (this.is3Month) {
        this.dateRange = 90
      }
      const minCopy = new Date(this.startDate).toDateString().substr(0, 3)
      const maxCopy = new Date(this.endDate).toDateString().substr(0, 3)
      this.weekNames.map((item) => {
        if (item.eng === maxCopy) {
          this.endDateText = item.jp
        }
      })
      this.weekNames.map((item) => {
        if (item.eng === minCopy) {
          this.startDateText = item.jp
        }
      })
    }
  },

  // INIT DATA
  created () {
    this.firstLoginWeight = 45
    this.targetValue = 75
    this.initData('week')
  },
  methods: {
    formatDate (date) {
      return (
        date.getFullYear() +
                '/' +
                (date.getMonth() + 1).toString().padStart(2, '0') +
                '/' +
                date.getDate().toString().padStart(2, '0') +
                ' GMT'
      )
    },
    initData (type) {
      let newData = []
      const fakeValue = [35, 31, 20, 40, 45, 50.32323, null]
      let count = 0
      let rangeCount = 0
      if (type === 'week') {
        rangeCount = 8
        count = 7
      }
      if (type === 'month') {
        rangeCount = 31
        count = 30
      }
      if (type === '3month') {
        rangeCount = 91
        count = 90
      }
      for (let i = 0; i < rangeCount; i++) {
        const temp = new Date()
        const temp2 = new Date(temp.setDate(temp.getDate() - count))
        count--
        const dataByX = this.formatDate(temp2)
        let dataByY = null
        if (i === 0) {
          dataByY = this.targetValue
        } else {
          dataByY =
                        fakeValue[Math.floor(Math.random() * fakeValue.length)]
        }
        newData.push({
          x: dataByX,
          y: dataByY
        })
      }

      // Remove null value object from array
      this.currentData = newData
      const nullDataIndex = []
      newData.map((item, index) => {
        if (!item.y) {
          nullDataIndex.push(item.x)
        }
      })
      newData = newData.filter(
        (item, index) => !nullDataIndex.includes(item.x)
      )

      this.series = [
        {
          data: newData
        }
      ]
    },

    // async callGetWeights(param) {
    //     // 体重一覧取得
    //     const weightResults = await API.graphql({
    //         query: getWeights,
    //         variables: {
    //             getVitalModel: param,
    //         },
    //     })
    //     return weightResults
    // },

    // UPDATE DATA WHEN (PREVIOUS DATE - NEXT DATE) CHANGE
    async setTerm (type) {
      // const getVitalModelWeight = {
      //     userIds: 2,
      //     offset: 0,
      //     limit: 100,
      // }
      // const weightResults = await this.callGetWeights(getVitalModelWeight)
      // console.log(weightResults.data.getWeights)
      let newData = await []
      const fakeValue = [35, 31, 20, 40, 45, null]
      if (this.series) {
        for (let i = 0; i < this.currentData.length; i++) {
          const temp = new Date(this.currentData[i].x)
          const temp2 = new Date(
            temp.setDate(
              temp.getDate() -
                                (type === 'previous'
                                  ? this.dateRange
                                  : -this.dateRange)
            )
          )
          const dataByX = this.formatDate(temp2)
          let dataByY = null
          if (i === 0) {
            dataByY = this.targetValue
          } else {
            dataByY =
                            fakeValue[
                              Math.floor(Math.random() * fakeValue.length)
                            ]
          }
          newData.push({
            x: dataByX,
            y: dataByY
          })
        }
      }
      // Remove null value object from array
      this.currentData = newData
      const nullDataIndex = []
      newData.map((item, index) => {
        if (!item.y) {
          nullDataIndex.push(item.x)
        }
      })
      newData = newData.filter(
        (item, index) => !nullDataIndex.includes(item.x)
      )
      this.series = [
        {
          data: newData
        }
      ]
    },
    // SET DATA WHEN CHANGING TERM TYPE
    setTermType (type) {
      switch (type) {
        case 'week':
          this.isWeek = true
          this.isMonth = false
          this.is3Month = false
          this.initData('week')
          break
        case 'month':
          this.isWeek = false
          this.isMonth = true
          this.is3Month = false
          this.initData('month')
          break
        case '3month':
          this.isWeek = false
          this.isMonth = false
          this.is3Month = true
          this.initData('3month')
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
.chart_tooltip {
    padding: 10px;
}
.selectedTime {
    background-color: #f18d17 !important;
    color: white !important;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}
.nonSelectedTime {
    background-color: white !important;
    color: #aba7a4 !important;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}
.apexcharts-text tspan:nth-child(6) {
    font-size: 20px;
}
.achievement_text {
    color: #aba7a4;
}
</style>
