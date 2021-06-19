<template>
  <v-form ref="entryForm" class="mail-form" @submit.prevent="submitHandler">
    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12" md="1" sm="3">
          <p class="text-left text-h6 font-weight-black mt-5">
            宛名
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
            label="CSVファイルをアップロードしてください"
            @change="loadCsvFile"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="1" sm="3" />
        <v-col cols="12" md="2" sm="2">
          <p class="mb-n5 sa-text--small">
            テンプレート貼り付け
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="1" sm="3" />
        <v-col cols="12" md="3" sm="2">
          <v-btn
            color="accent"
            block
            @click="runFirstLogin"
          >
            <span class="sa-text--title">初回ログイン</span>
          </v-btn>
        </v-col>
        <v-col cols="12" md="3" sm="2">
          <v-btn
            color="accent"
            block
            @click="runUnLoginned"
          >
            <span class="sa-text--title">未ログイン</span>
          </v-btn>
        </v-col>
        <v-col cols="12" md="5" sm="5">
          <EmailTemplateEdit :email-template="emailTemplate" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="1" sm="3">
          <p class="text-left text-h6 font-weight-black mt-2">
            件名
          </p>
        </v-col>
        <v-col cols="12" md="6" sm="4">
          <v-text-field
            v-model="subject"
            class="sa-text--title"
            counter
            single-line
            outlined
            validate-on-blur
            :rules="validateRuleSubject"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="1" sm="3">
          <p class="text-left text-h6 font-weight-black">
            本文
          </p>
        </v-col>
        <v-col cols="12" md="7" sm="6">
          <v-textarea
            v-model="content"
            class="sa-text--title"
            counter
            single-line
            outlined
            validate-on-blur
            :rules="validateRuleContent"
          />
        </v-col>
      </v-row>
      <v-row style="height: calc(100% - 300px);">
        <v-col cols="12" md="1" sm="3" />
        <v-col cols="12" md="1" sm="2">
          <v-btn
            block
            type="submit"
            color="primary"
          >
            <span class="sa-text--title">送信</span>
          </v-btn>
        </v-col>
        <v-col cols="12" md="2" sm="2">
          <EmailSendReservation :is-switch="isSwitch" />
        </v-col>
        <v-col cols="12" md="1" sm="5">
          <v-btn
            block
            @click="runClear"
          >
            <span class="sa-text--title">クリア</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { API } from 'aws-amplify'
import * as Config from '@/config.js'
import { getTempMail, getCsvResults } from '../../../pages/graphql/queries'
import {
  sendMail,
  sendMailNotLoginUser
} from '../../../pages/graphql/mutations'
export default {
  data () {
    return {
      isUnlogged: false,
      isSwitch: false,
      inputFile: null,
      subject: '',
      content: '',
      sendReservation: '',
      emailTemplate: {
        firstLoginTemplate: {
          subject: 'Title 初回ログイン(First Login)',
          content: '初回ログイン(First Login)'
        },
        UnloggedTemplate: {
          subject: 'Title 未ログイン(Un-loggged-in)',
          content: '未ログイン(Un-loggged-in)'
        }
      },

      validateInputFile: [],
      validateRuleSubject: [],
      validateRuleContent: []
    }
  },
  watch: {
    isSwitch (val) {
      if (val === true) { this.inputFile = null }
    },
    inputFile () {
      console.log(this.inputFile)
    },
    subject () {
      if (this.subject === this.emailTemplate.UnloggedTemplate.subject) {
        this.isUnlogged = true
      } else {
        this.isUnlogged = false
      }
    }
  },

  methods: {
    // ファイル選択時
    async loadCsvFile (file) {
      try {
        const content = await this.readFileAsync(file)
        const fileResult = content
        console.log('ファイル内容')
        console.log(this.inputFile, fileResult.split('\n'))
      } catch (e) {
        console.log('ファイル読み込みエラー')
        console.log(e)
      }
    },
    // ファイル読み込み
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
    // GRAPHQL
    async callGetTempMail (param) {
      const response = await API.graphql({
        query: getTempMail,
        variables: { tempMailId: param }
      })
      return response.data.getTempMail
    },
    async callSendMail (param) {
      const response = await API.graphql({
        query: sendMail,
        variables: {
          sendMailModel: param
        }
      })
      return response.data.sendMail
    },
    async callSendMailNotLoginUser (param) {
      const response = await API.graphql({
        query: sendMailNotLoginUser,
        variables: {
          sendMailNotLoginUserModel: param
        }
      })
      return response.data.sendMailNotLoginUser
    },

    // HANDEL ERROR MESSAGE
    onError (err) {
      const {
        errors: [{ errorType, errorInfo, message }]
      } = err
      console.log('ERROR: \n', errorType, errorInfo, message)
    },

    // ACTIONS
    async getTempMail () {
      try {
        const result = await this.callGetTempMail('「初回ログイン」')
        if (result.data.getTempMail) {
          const { title, mainText } = result.data.getTempMail
          this.subject = title
          this.content = mainText
        }
        return result.data
      } catch (err) {
        this.onError(err)
      }
    },
    async sendMail () {
      try {
        const sendMail = {
          mailId: '123',
          userId: '123',
          subject: 'Meeting',
          text: 'Hi Im Goku'
        }
        const response = await this.callSendMailNotLoginUser(sendMail)
        return response
      } catch (err) {
        this.onError(err)
      }
    },
    async sendMailNotLoginUser () {
      try {
        const sendMailNotLoginUserModel = {
          mailId: '123',
          userId: '123',
          subject: 'Meeting',
          text: 'Hi Im Goku'
        }
        const response = await this.callSendMail(
          sendMailNotLoginUserModel
        )
        return response
      } catch (error) {
        this.onError(error)
      }
    },

    submitHandler () {
      this.validateRuleSubject = [
        v => !!v || Config.ERRMSG003,
        v => (v && v.length <= 256) || Config.ERRMSG013
      ]

      this.validateRuleContent = [
        v => !!v || Config.ERRMSG003,
        v => (v && v.length <= 20000) || Config.ERRMSG005
      ]

      if (this.inputFile) {
        this.validateInputFile = [
          (v) => {
            const pattern = /^.*\.(csv)$/
            return (
              pattern.test(
                this.inputFile && this.inputFile.name
              ) || Config.ERRMSG017
            )
          }
        ]
      }

      const seft = this

      // SEND MAIL
      setTimeout(() => {
        if (seft.$refs.entryForm.validate()) {
          this.isUnlogged
            ? this.sendMailNotLoginUser()
            : this.sendMail()
        }
      })
    },

    runFirstLogin () {
      this.getTempMail()
      this.subject = this.emailTemplate.firstLoginTemplate.subject
      this.content = this.emailTemplate.firstLoginTemplate.content
    },

    runUnLoginned () {
      this.getTempMail()
      this.subject = this.emailTemplate.UnloggedTemplate.subject
      this.content = this.emailTemplate.UnloggedTemplate.content
    },

    runClear () {
      this.validateRuleSubject = []
      this.validateRuleContent = []
      this.validateInputFile = []
      this.$refs.entryForm.reset()
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
