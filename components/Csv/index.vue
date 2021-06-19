<template>
  <v-form ref="entryForm" class="mail-form" @submit.prevent="submitHandler">
    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12" md="1" sm="3">
          <p class="text-left text-h6 font-weight-black mt-5">
            File
          </p>
        </v-col>
        <v-col cols="12" md="2" sm="2">
          <v-switch
            id="sa-mail-unlogged"
            v-model="isSwitch"
            label="未ログイン者"
          />
        </v-col>
        <v-col id="mail-form--csv-input" cols="12" md="5" sm="5">
          <v-file-input
            v-model="inputFile"
            accept=".csv, text/csv"
            :disabled="isSwitch ? true : false"
            :rules="validateInputFile"
            label="CSV upload"
            @change="loadCsvFile"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="1" sm="3">
          <p class="text-left text-h6 font-weight-black mt-2">
            Content
          </p>
        </v-col>
        <v-col cols="12" md="6" sm="4">
          <v-text-field
            v-model="title"
            class="sa-text--title"
            counter
            single-line
            outlined
            validate-on-blur
            :rules="validateRuleTitle"
          />
        </v-col>
      </v-row>

      <v-row style="height: calc(100% - 300px);">
        <v-col cols="12" md="1" sm="3" />
        <v-col cols="3">
          <v-btn
            block
            type="submit"
            color="primary"
            :loading="isSending"
            :disabled="isSending"
          >
            <span class="sa-text--title">Submit</span>
          </v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn
            block
            @click="downloadCsv"
          >
            <span class="sa-text--title">Download csv</span>
          </v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn
            block
            @click="runClear"
          >
            <span class="sa-text--title">Clear</span>
          </v-btn>
        </v-col>
      </v-row>
      <!-- <app-bar /> -->
    </v-container>
  </v-form>
</template>

<script>
import Vue from 'vue'
import VuePapaParse from 'vue-papa-parse'
Vue.use(VuePapaParse)
// import { API } from 'aws-amplify'
// import Bar from '@/components/sa/SnackBar/SnackBar.vue'
// import * as Config from '@/config.js'
// import { getTempMail } from '../../../pages/graphql/queries'
// import {
//   sendMail,
//   sendMailNotLoginUser
// } from '../../../pages/graphql/mutations'
export default {
  components: {
    // AppBar: Bar
  },
  data () {
    return {
      isSending: false,
      isValid: false,
      isUnlogged: false,
      isSwitch: false,
      inputFile: null,
      displayUserIds: null,
      title: '',
      content: '',
      sendReservation: '',
      validateInputFile: [],
      validateRuleTitle: [],
      validateRuleContent: [],
      parseData: null,
      fileResult: '',
      headerName: 'ID'

    }
  },
  watch: {
    isSwitch (val) {
      if (val === true) { this.inputFile = null }
    }
  },

  methods: {

    async downloadCsv (List) {
      const targetInfos = [[11, 'Liem'], [12, 'Khanh'], [13, 'Nhat'], [14, 'Quang']]

      if (!targetInfos) { return }

      // -------------CSV 1 作成-------------
      // // ヘッダー作成
      // let csv =
      //     '\uFEFF' + 'ユーザID,表示用ユーザID,初回ログイン日時,健保名\n'
      // // レコード作成
      // for (const user of targetInfos) {
      //     if (!targetInfos) {
      //         continue
      //     }
      //     const line =
      //         '"' +
      //         user.userId +
      //         '","' +
      //         user.displayUserId +
      //         '","' +
      //         user.firstLoginAt +
      //         '","' +
      //         user.associationName +
      //         '"\n'
      //     csv += line
      // }

      // // 作成したCSVをダウンロードさせる
      // const blob = new Blob([csv], { type: 'text/csv' })
      // const link = document.createElement('a')
      // link.href = window.URL.createObjectURL(blob)
      // link.download = 'userResults.csv'
      // link.click()

      // // -------------CSV 2 作成-------------
      const csvHeader = [
        'ID',
        'Name'
      ]

      const makeCsv = await this.$papa.unparse(
        {
          fields: csvHeader,
          data: targetInfos.map(Object.values)
        },
        {
          quotes: true,
          delimiter: ',',
          newline: '\n'
        }
      )
      this.$papa.download(makeCsv, 'userResults')
    },

    async loadCsvFile (file) {
      try {
        const content = await this.readFileAsync(file)
        this.fileResult = content

        // Pass scope of this in child scope !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const vm = this
        this.$papa.parse(this.inputFile, {
          header: true,
          complete (results, file) {
            console.log('Parsing complete:', results.data)
            vm.parseData = results?.data
            console.log(vm.parseData)
          }
        //   complete: (results) => {
        //     this.parseData = results.data
        //   }
        })
      } catch (err) {
        return err
      }
    },

    readFileAsync (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsText(file)
      })
    },

    submitHandler () {
      this.validateRuleTitle = [
        v => !!v || 'Dont be blank',
        v => (v && v.length <= 256) || 'fdfdf'
      ]

      this.validateRuleContent = [
        v => !!v || 'Dont be blank',
        v => (v && v.length <= 20000) || 'fdsf'
      ]

      if (this.inputFile) {
        this.validateInputFile = [
          (v) => {
            const pattern = /^.*\.(csv)$/
            return (
              pattern.test(
                this.inputFile && this.inputFile.name
              ) || 'dfsdf'
            )
          }
        ]
      }

      const seft = this
      // SEND MAIL
      setTimeout(() => {
        if (seft.$refs.entryForm.validate()) {
          // upload user id
          console.log('Parse data\n', this.parseData)
          console.log('User ID \n', this.displayUserIds)

          // GET RECEIVER LIST
          //   const sendUserIds = []
          //   this.parseData.forEach((v) => {
          //     if (v.ユーザID.trim()) {
          //       sendUserIds.push(
          //         v.ユーザID.trim().replace(/\r\n?/g, '')
          //       )
          //     }
          //   })
          //   this.displayUserIds = sendUserIds
          //   console.log(this.displayUserIds)
          console.log('Submit success')
        }
      })
    },

    runClear () {
      this.validateRuleTitle = []
      this.validateRuleContent = []
      this.validateInputFile = []
      this.$refs.entryForm.reset()
    },

    // HANDEL ERROR MESSAGE
    onError (err) {
      const {
        errors: [{ errorType, errorInfo, message }]
      } = err
      if (
        errorType !== undefined &&
                errorType.includes('Validation Error')
      ) {
        this.$store.commit(
          'setMessage',
          'Validation Error: ' + JSON.stringify(errorInfo)
        )
      } else {
        this.$store.commit('setMessage', 'Error: ' + message)
      }
    }
  }
}
</script>
<style lang="sass">
label[for="sa-mail-unlogged"]
    font-size: 12px
.mail-form
    #mail-form--csv-input
        .v-label
            font-size: 12px
        .v-file-input__text
            font-size: 20px
</style>
