<template>
  <v-row class="fill-height">
    <v-col class="py-0">
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-toolbar-title class="ay-color--grey-7 ay-text--basic">
            歩数データ
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-title
            class="mr-5 ay-color--grey-7 ay-text--detail"
          >
            目標 {{ targetValue }}歩/day
          </v-toolbar-title>
          <v-toolbar-title
            class="mr-5 ay-color--grey-7 ay-text--detail"
          >
            平均 {{ averageValue }}歩/day ({{ averagePercent }}％）
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-title class="ay-color--grey-7 ay-text--detail">
            Total {{ totalValue }}歩/week ({{ totalPercent }}％）
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
            {{ endDate }} ({{ endDateText }})
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
          id="chart"
          ref="chart"
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
// import { API } from 'aws-amplify'
// import { getUsers, getSteps } from '../../../pages/graphql/queries'

import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)
export default {
  data () {
    return {
      currentData: null,
      today: new Date(),
      targetValue: null,
      averageValue: null,
      averagePercent: null,
      totalValue: null,
      totalPercent: null,
      startDate: null,
      endDate: null,
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
          name: 'Waist Chart',
          type: 'bar',
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
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '35%',
            endingShape: 'rounded'
          }
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          }
        },
        colors: [
          function s ({ value, seriesIndex, dataPointIndex, w }) {
            if (dataPointIndex === 0) {
              return 'transparent'
            } else {
              return '#F18D17'
            }
          }
        ],
        stroke: {
          width: 2,
          curve: 'straight',
          dashArray: [0, 5]
        },
        grid: {
          padding: {
            left: 10,
            right: 0
          },
          strokeDashArray: 0,
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
          type: ['solid']
        },
        legend: {
          show: false
        },
        noData: {
          text: "There's no data",
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0
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
            if (dataPointIndex !== 0) {
              return (
                '<div class="chart_tooltip">' +
                                '<span>' +
                                series[seriesIndex][dataPointIndex] +
                                ' 歩' +
                                '<br/>' +
                                '<span class="achievement_text">' +
                                '目標達成度' +
                                ` ${
                                    w.config.annotations.yaxis[0].y -
                                    series[seriesIndex][dataPointIndex]
                                }` +
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
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          type: 'numeric',
          tickAmount: 5,
          labels: {
            formatter: (value) => {
              if (value === 0) {
                return '歩'
              } else {
                return value.toFixed(0)
              }
            },
            offsetY: 10
          }
          // title: {
          //     text: '歩',
          //     rotate: 0,
          //     offsetX: 27,
          //     offsetY: 200,
          //     floating: true,
          //     style: {
          //         fontSize: '12px',
          //         fontFamily: 'Helvetica, Arial, sans-serif',
          //         fontWeight: 200,
          //         cssClass: 'apexcharts-yaxis-title',
          //     },
          // },
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
      this.totalValue = this.currentData.reduce((total, curr, index) => {
        if (
          index !== 0 &&
                    curr.x.toString() !== this.today.toString()
        ) {
          return total + curr.y
        } else {
          return total + 0
        }
      }, 0)
      const numberOfDate =
                (new Date(this.endDate) - new Date(this.startDate)) / 86400000 +
                (this.today.toString().replace('GMT', '') ===
                this.endDate.toString()
                  ? 0
                  : 1)
      this.totalPercent = (
        (this.totalValue / (this.targetValue * numberOfDate)) *
                100
      ).toFixed(1)
      this.averageValue = (this.totalValue / numberOfDate).toFixed(0)
      this.averagePercent = (
        (this.averageValue / this.targetValue) *
                100
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
      this.totalValue = this.numberWithCommas(this.totalValue)
      setTimeout(() => {
        if (this.isWeek) {
          document
            .querySelector(`#${this.findTargetLineByDom()}`)
            .setAttribute('x1', -35)
        } else {
          document
            .querySelector(`#${this.findTargetLineByDom()}`)
            .setAttribute('x1', -10)
        }
        document
          .querySelector(`#${this.findTargetLineByDom()}`)
          .setAttribute('x2', 2000)
      }, 0)
    }
  },

  // INIT DATA
  created () {
    this.targetValue = 7000
    this.today = this.formatDate(this.today)
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
    numberWithCommas (x) {
      x = x.toString()
      const pattern = /(-?\d+)(\d{3})/
      while (pattern.test(x)) { x = x.replace(pattern, '$1,$2') }
      return x
    },
    findTargetLineByDom () {
      const ele = document.getElementsByTagName('line')
      return ele[ele.length - 1].id
    },
    initData (type) {
      const newData = []
      const fakeValue = [7200, 3100, 4250, 2875, 5100, null]
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
      // const nullDataIndex = []
      // newData.map((item, index) => {
      //     if (!item.y) {
      //         nullDataIndex.push(item.x)
      //     }
      // })
      // newData = newData.filter(
      //     (item, index) => !nullDataIndex.includes(item.x)
      // )
      this.series = [
        {
          data: newData
        }
      ]
    },
    // GRAPHQL
    // async callGetSteps(param) {
    //     // 体重一覧取得
    //     const stepResults = await API.graphql({
    //         query: getSteps,
    //         variables: {
    //             getVitalModel: param,
    //         },
    //     })
    //     return stepResults
    // },

    // UPDATE DATA WHEN (PREVIOUS DATE - NEXT DATE) CHANGE
    async setTerm (type) {
      // CALL GET MEALS IN VITAL.GRAPHQL
      // const getVitalModelStep = {
      //     userIds: targetIds,
      //     offset: 0,
      //     limit: 100,
      // }
      // // const stepResults = await this.callGetSteps(getVitalModel)
      // console.log('戻り値:歩数')
      // console.log(stepResults.data.getSteps)
      let newData = await []
      const fakeValue = [7200, 3100, 4250, 2875, 5100, null]

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
            x: this.formatDate(temp2),
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

    // UPDATE DATA WHEN TERM TYPE CHANGE
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

<style lang="scss" style="scoped">
.chart_tooltip {
    padding: 10px;
}
.selectedTime {
    background-color: #f18d17 !important;
    color: white !important;
}
.nonSelectedTime {
    background-color: white !important;
    color: #aba7a4 !important;
}
</style>
