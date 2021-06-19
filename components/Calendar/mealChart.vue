<template>
  <v-row class="fill-height">
    <v-col class="py-0">
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-toolbar-title
            v-if="$refs.calendar"
            class="ay-color--grey-7 ay-text--basic"
          >
            食事データ
          </v-toolbar-title>
          <v-btn
            icon
            height="24"
            width="24"
            class="mx-2"
            :disabled="!isPrevData"
            @click="displayTerm('previous')"
          >
            <v-img
              :class="isPrevData ? 'mt-2' : ''"
              :src="isPrevData ? prevIcon : noPrevIcon"
            />
          </v-btn>
          <v-toolbar-title
            v-if="$refs.calendar"
            class="ay-color--grey-7 ay-text--detail"
          >
            {{ startDate }} （{{
              startDateText
            }}）
          </v-toolbar-title>
          <v-toolbar-title
            v-if="$refs.calendar"
            class="ay-color--grey-7 ay-text--detail"
          >
            ~ {{ endDate }} ({{ endDateText }})
          </v-toolbar-title>
          <v-btn
            icon
            height="24"
            width="24"
            :disabled="!isNextData"
            class="mx-1 mt-1"
            @click="displayTerm('next')"
          >
            <v-img
              :class="isNextData ? 'mb-2' : ''"
              :src="isNextData ? nextIcon : noNextIcon"
            />
          </v-btn>

          <v-spacer />
          <v-toolbar-title
            v-if="$refs.calendar"
            class="ay-color--grey-7 ay-text--detail"
          >
            入力率 {{ inputRate }}%（{{ inputRateByPercent }}）
          </v-toolbar-title>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="calc(100vh - 374px)">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="'orange'"
          :event-height="25"
          :event-more="true"
          :type="'week'"
          :weekdays="weekdays"
          first-interval="-1"
          interval-minutes="120"
          interval-count="13"
          interval-height="100"
          :interval-format="intervalFormat"
          :weekday-format="weekDayFormat"
          class="ay-bg--yellow-2"
          :short-intervals="false"
          @mouseenter:event="showEvent"
          @mouseleave:event="closeEvent"
          @click:event="showEventDetail"
          @change="getMeal"
        >
          <template v-slot:event="{ event }">
            <v-row class="d-flex align-center ma-0 pa-0">
              <v-col cols="7" class="pr-0 py-0">
                <v-img
                  :src="event.mealImagePath"
                  :aspect-ratio="3"
                  class="mr-1"
                />
                <!-- <amplify-s3-image
                  v-if="
                    event.mealImagePath !== null &&
                      event.mealImagePath !== ''
                  "
                  style="--height: 1vh; --width: 80%;"
                  :img-key="event.mealImagePath"
                /> -->
              </v-col>
              <v-col cols="5" class="pa-0 d-flex justify-start">
                <p class="ma-0">
                  {{
                    event.recordAt
                      .split('')
                      .splice(-5)
                      .join('')
                  }}
                </p>
              </v-col>
            </v-row>
          </template>
        </v-calendar>
      </v-sheet>
      <!-- MENU ON HOVER-->
      <MealChild
        v-model="selectedOpen"
        :selected-element="selectedElement"
        :selected-event="selectedEvent"
      />
      <!-- CLICK 食事コマ(MEAL UNIT)-->
      <MealDetail
        v-model="dialog"
        :selected-event="selectedEvent"
        @eventCloseDialog="closeEventDetail"
      />
      <!-- ---- -->
    </v-col>
  </v-row>
</template>

<script>
// import { API } from 'aws-amplify'
// import { getMeals } from '../../../pages/graphql/queries'
// import '@aws-amplify/ui-vue'
export default {
  data: () => ({
    nextIcon: '/Vital/vital_icon/group839_right.png',
    prevIcon: '/Vital/vital_icon/group839_left.png',
    noNextIcon: '/Vital/vital_icon/group840_right.png',
    noPrevIcon: '/Vital/vital_icon/group840_left.png',
    isPrevData: true,
    isNextData: true,
    inputRate: 0,
    inputRateByPercent: '0/21',
    focus: '',
    startDate: null,
    endDate: null,
    startDateText: null,
    endDateText: null,
    timeByHover: null,
    type: 'week',
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dialog: false,
    weekNames: [
      { eng: 'Mon', jp: '月', num: 1 },
      { eng: 'Tue', jp: '火', num: 2 },
      { eng: 'Wed', jp: '水', num: 3 },
      { eng: 'Thu', jp: '木', num: 4 },
      { eng: 'Fri', jp: '金', num: 5 },
      { eng: 'Sat', jp: '土', num: 6 },
      { eng: 'Sun', jp: '日', num: 0 }
    ],
    weekdays: [],
    events: [],
    eventName: '',
    // Mock Data
    names: ['朝食', '昼食', '間食', '夕食'],
    icons: [
      '/Vital/meal/path1672.png',
      '/Vital/meal/component30-1.png',
      '/Vital/meal/path1606.png',
      '/Vital/meal/component31-1.png'
    ],
    meals: [
      { name: '朝食', icon: '/Vital/meal/path1672.png' },
      { name: '昼食', icon: '/Vital/meal/component30-1.png' },
      { name: '間食', icon: '/Vital/meal/path1606.png' },
      { name: '夕食', icon: '/Vital/meal/component31-1.png' }
    ]
  }),
  created () {
    const max = new Date()
    const test = new Date()
    const min = new Date(test.setDate(test.getDate() - 6))
    const minCopy = min.toDateString().substr(0, 3)
    const maxCopy = max.toDateString().substr(0, 3)
    const weekdays = []
    this.weekNames.map((item) => {
      if (item.eng === minCopy) {
        this.startDateText = item.jp
        weekdays.push(item.num)
      }
    })
    this.weekNames.map((item) => {
      if (item.eng === maxCopy) {
        this.endDateText = item.jp
        weekdays.push(item.num)
      }
    })
    let indexByInsert = 1
    for (let i = weekdays[0] + 1; i < 7; i++) {
      weekdays.splice(indexByInsert, 0, i)
      indexByInsert++
    }
    for (let i = 0; i < weekdays[weekdays.length - 1]; i++) {
      weekdays.splice(indexByInsert, 0, i)
      indexByInsert++
    }
    this.weekdays = weekdays
  },
  mounted () {
    this.$refs.calendar.checkChange()
  },

  methods: {
    intervalFormat (interval) {
      return interval.time
    },
    weekDayFormat (d) {
      return `${d.month}/${d.day}`
    },
    displayTerm (type) {
      switch (type) {
        case 'previous':
          this.$refs.calendar.prev()
          break
        case 'next':
          this.$refs.calendar.next()
          break
        default:
          break
      }
    },
    // OPEN MEAL DETAIL DIALOG
    showEventDetail ({ nativeEvent, event }) {
      // this.eventName = event.name
      this.dialog = true
    },
    // CLOSE MEAL DETAIL DIALOG
    closeEventDetail () {
      this.dialog = false
    },
    // OPEN BASIC MEAL INFO ON HOVER
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    // CLOSE BASIC MEAL INFO ON HOVER OUTSIDE
    closeEvent () {
      this.selectedOpen = false
    },

    // GET ERRORS MESSAGE
    onError (err) {
      const {
        errors: [{ errorType, errorInfo, errorMessage }]
      } = err
      if (errorType) {
        this.$store.commit(
          'setMessage',
          'ユーザ更新に失敗しました。値が不正です：' +
                        JSON.stringify(errorInfo)
        )
      }
      if (errorMessage) {
        this.$store.commit(
          'setMessage',
          'ユーザ更新に失敗しました。' + errorMessage
        )
      }
    },

    formatDate (date) {
      return (
        date.getFullYear() +
                '/' +
                (date.getMonth() + 1).toString().padStart(2, '0') +
                '/' +
                date.getDate().toString().padStart(2, '0') +
                ' ' +
                date.getHours().toString().padStart(2, '0') +
                ':' +
                date.getMinutes().toString().padStart(2, '0')
      )
    },

    randomNumber (min, max) {
      return min + Math.trunc(Math.random() * (max - min))
    },
    // GRAPHQL
    // async callGetMeals (param) {
    //   console.log('Param \n', param)
    //   try {
    //     const response = await API.graphql({
    //       query: getMeals,
    //       variables: {
    //         getVitalModel: param
    //       }
    //     })
    //     return response
    //   } catch (err) {
    //     this.onError(err)
    //   }
    // },

    // UPDATE MEALS WHEN DATE RANGE CHANGE
    async getMeal ({ start, end }) {
      // CALL GET MEALS IN VITAL.GRAPHQL
      // const getVitalModelMeal = {
      //   userId: 'a45a6415-e00c-495a-a31c-ee9369efc81b',
      //   offset: 0,
      //   limit: 100
      // }
      // const result = await this.callGetMeals(getVitalModelMeal)
      // console.log('Meal result \n', result)

      // --------------------------------------------------------------------------------- MOCK DATA
      let events = await []
      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)
      for (let i = 0; i < eventCount; i++) {
        const generateID =
                    Date.now() + Math.random().toString(36).substr(2, 9)
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(
          firstTimestamp - (firstTimestamp % 900000)
        )
        const meal = this.meals[this.rnd(0, this.names.length - 1)]
        const mealName = meal.name
        const mealIcon = meal.icon

        events.push({
          mealId: generateID,
          userId: generateID,
          recordAt: this.formatDate(first),
          mMealtimeId: generateID,
          mMealtimeName: mealName,
          euText: '・テキストが入りますテキストが入ります',
          // mealImagePath:
          // 'profile/image/pfimg-48c1ba1f-885c-442f-913c-e4e3d2f374a2.png',
          // https://picsum.photos/id/722/300/300
          mealImagePath: `https://picsum.photos/id/${this.randomNumber(100, 1000)}/510/300?random`,
          name: mealName,
          icon: mealIcon,
          start: first, // prop required
          timed: !allDay
        })
      }
      // remove duplicate breakfest, lunch, dinner
      events = events.filter(
        (v, i, a) =>
          a.findIndex(
            t =>
              new Date(t.recordAt).getDate() ===
                                new Date(v.recordAt).getDate() &&
                            t.name === v.name
          ) === i
      )
      // GET INPUT RATE
      let count = 0
      events.map((item) => {
        if (item.name !== '昼食') {
          count++
        }
      })
      this.inputRate = ((count / 21) * 100).toFixed(1)
      this.inputRateByPercent = `${count}/${21}`
      if (start && start.date) {
        this.startDate = start.date.replace(/-/g, '/')
      }
      if (end && end.date) {
        this.endDate = end.date.replace(/-/g, '/')
      }
      // ------------------------------------------------------------------------------------------------------
      this.events = events
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  }
}
</script>

<style lang="sass">
::-webkit-scrollbar
    width: 10px
::-webkit-scrollbar-track
    background-color: #ebebeb
    -webkit-border-radius: 10px
    border-radius: 10px
::-webkit-scrollbar-thumb
    -webkit-border-radius: 10px
    border-radius: 10px
    background: #A8A8A8
// Main content
.v-calendar-daily__day-container
    background: #fdf8ed

// Event in header
.v-calendar .v-event
    height: 0 !important
    width: 0 !important
    visibility: hidden
// Event
.v-calendar .v-event-timed
    // height: 40px !important
//Header
.v-calendar-daily__head
    height: 30px !important
.v-calendar-daily .v-calendar-daily__day-interval
    border-style: dashed none none none !important
// Header week day
.v-calendar-daily_head-weekday
    font-size: 16px
.v-calendar-daily_head-day-label
    visibility: hidden
// Meal unit
.v-calendar .v-event-timed
    display: flex
</style>
