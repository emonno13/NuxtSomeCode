<template>
  <v-layout
    column
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-form ref="entryForm" @submit.prevent="submitHandler">
        <v-row class="headerGroupButton">
          <v-spacer />
          <v-btn class="white--text mr-5 btn btn-modify" @click="saveDialog">
            SAVE
          </v-btn>
          <v-btn class="white--text mr-5 btn btn-cancel" @click="$router.go(-1)">
            CANCEL
          </v-btn>
        </v-row>
        <v-divider />
        <!------------------------------------------------------------------------ Panel -->
        <v-expansion-panels :value="[0,1]" multiple focusable class="px-5 mt-10">
          <!---------------------------------------------------------------------- Department -->
          <v-expansion-panel class="my-4">
            <v-expansion-panel-header class="text-h4 headerPanel">
              <v-col cols="2" class="pa-0">
                Project Profit Plan
              </v-col>
              <v-col cols="2" class="pa-0">
                Start date : 15/02/2020
              </v-col>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12">
                  <zk-table
                    ref="table"
                    sum-text="sum"
                    index-text="#"
                    :data="data"
                    :columns="columns"
                    :stripe="props.stripe"
                    :border="props.border"
                    :show-header="props.showHeader"
                    :show-summary="props.showSummary"
                    :show-row-hover="props.showRowHover"
                    :show-index="props.showIndex"
                    :tree-type="props.treeType"
                    :is-fold="props.isFold"
                    :expand-type="props.expandType"
                    :selection-type="props.selectionType"
                  >
                    <template slot="position" slot-scope="scope">
                      <v-row>
                        <v-col cols="6">
                          <p>
                            {{ scope.row.position }}
                          </p>
                        </v-col>
                        <v-spacer />
                        <v-col v-if="scope.row.roleWork ==='' && (scope.row.type ==='Partner profit' || scope.row.type ==='Partner OT profit')" cols="6">
                          <p>
                            Effort
                          </p>
                          <p>
                            Unit price
                          </p>
                        </v-col>
                      </v-row>
                    </template>
                    <template v-for="month in monthProps" :slot="month" slot-scope="scope">
                      <CustomInput
                        v-if="scope.row.roleWork ===''"
                        :key="month"
                        ref="test"
                        v-model="scope.row[`${month}`]"
                        type="number"
                        :required="true"
                        :min="0"
                        @input="changeTotal"
                      />
                      <CustomInput
                        v-if="scope.row.roleWork ==='' && (scope.row.type ==='Partner profit' || scope.row.type ==='Partner OT profit')"
                        :key="month+'UP'"
                        v-model="scope.row[`${month}`+'UP']"
                        class="my-2"
                        type="number"
                        :required="true"
                        :min="0"
                      />
                    </template>
                    <template slot="total" slot-scope="scope">
                      <p v-if="scope.row.roleWork !=='Other cost ($)'" class="ma-0 pa-0">
                        {{ scope.row.total }}
                      </p>
                      <p v-else class="ma-0 pa-0">
                        {{ scope.row.total }} $
                      </p>
                      <p
                        v-if="scope.row.roleWork ==='' && (scope.row.type ==='Partner profit' || scope.row.type ==='Partner OT profit')"
                        class="my-4"
                        :style="{visibility: 'hidden'}"
                      >
                        temp
                      </p>
                    </template>
                  </zk-table>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-------------------------------------------------------------------- Position -->
        <!--  -->
        </v-expansion-panels>
        <!------------------------------------------------------------------------ Panel -->
        <!-- OPEN CREATE/MODIFY DIALOG -->
        <ConfirmDialog
          v-model="isSave"
          :title="'Save confirm'"
          :text="'MSG_C_009'"
          @saveButtonClicked="saveConfirm"
          @closeButtonClicked="saveCancel"
        />
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import ZkTable from 'vue-table-with-tree-grid'
import Vue from 'vue'
import RoleWorkList from '~/api/mock/roleWorkList.json'
Vue.use(ZkTable)
export default {
  data () {
    return {
      isSave: false,
      errors: [],
      roleWork: '',
      position: '',
      monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      monthProps: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
      // -------------------------------------------------- Table
      props: {
        stripe: true,
        border: true,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: false,
        expandType: false,
        selectionType: true
      },
      data: [],
      columnsCopy: [],
      columns: []

    }
  },

  //  INIT DATA
  created () {
    const startMonthOfProject = 2
    const endMonthOfProject = 4
    this.setColumn(startMonthOfProject, endMonthOfProject)
    this.setData()
  },

  methods: {
    changeTotal () {
      const group = []
      let sumOfGroup = 0
      let indexOfGroup = 1
      setTimeout(() => {
        this.$refs.table.bodyData.map((item, index) => {
          item.feb = parseFloat(Number(item.feb))
          item.mar = parseFloat(Number(item.mar))
          item.apr = parseFloat(Number(item.apr))
          item.may = parseFloat(Number(item.may))
          item.jun = parseFloat(Number(item.jun))
          item.aug = parseFloat(Number(item.aug))
          item.sep = parseFloat(Number(item.sep))
          item.oct = parseFloat(Number(item.oct))
          item.nov = parseFloat(Number(item.nov))
          item.dec = parseFloat(Number(item.dec))
          item.total = item.jan + item.feb + item.mar + item.apr + item.may +
                      item.jun + item.sep + item.oct + item.nov + item.dec
          if (item.roleWork) { group.push(sumOfGroup); sumOfGroup = 0 }
          if (!item.roleWork) { sumOfGroup += item.total }
          if (index + 1 === this.$refs.table.bodyData.length) { group.push(sumOfGroup); sumOfGroup = 0 }
        })

        this.$refs.table.bodyData.map((item, index) => {
          if (item.roleWork) { item.total = group[indexOfGroup]; indexOfGroup++ }
        })
      })
      indexOfGroup = 1
    },
    setColumn (startMonth, endMonth) {
      this.columns = [
        {
          label: 'Role / Work',
          prop: 'roleWork',
          maxWidth: '100px'

        },
        {
          label: 'Rank',
          prop: 'position',
          maxWidth: '200px',
          type: 'template',
          template: 'position'
        },
        {
          label: 'Total (MM)',
          prop: 'total',
          maxWidth: '150px',
          type: 'template',
          template: 'total'
        }
      ]
      let index = 2
      let monthIndex = startMonth - 1
      for (let i = 0; i < endMonth - startMonth + 1; i++) {
        this.columns.splice(index, 0, {
          label: this.monthLabels[monthIndex],
          prop: this.monthProps[monthIndex],
          type: 'template',
          template: this.monthProps[monthIndex],
          maxWidth: '200px'
        })
        monthIndex++
        index++
      }
    },
    setData () {
      const newData = []
      const RoleWorkListCopy = JSON.parse(JSON.stringify(RoleWorkList))
      RoleWorkListCopy.map(item => newData.push({
        roleWork: item.roleWork,
        position: '',
        total: 0,
        children: []
      }))
      const newData2 = newData.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i)
      newData2.map((item) => {
        let sum = 0
        RoleWorkListCopy.map((work) => {
          if (work.roleWork === item.roleWork) {
            work.roleWork = ''
            work.jan = 0
            work.feb = 0
            work.mar = 0
            work.apr = 0
            work.may = 0
            work.jun = 0
            work.jul = 0
            work.aug = 0
            work.sep = 0
            work.oct = 0
            work.nov = 0
            work.dec = 0
            work.total = 0
            if (work.type === 'Partner profit' || work.type === 'Partner OT profit') {
              work.janUP = 0
              work.febUP = 0
              work.marUP = 0
              work.aprUP = 0
              work.mayUP = 0
              work.junUP = 0
              work.julUP = 0
              work.augUP = 0
              work.sepUP = 0
              work.octUP = 0
              work.novUP = 0
              work.decUP = 0
            }
            item.children.push(work)
            // console.log(work.position)
            sum += work.total
          }
        })
        item.total = sum
      })
      this.data = newData2
    },

    saveConfirm () {
      this.$router.go(-1)
      this.isSave = false
    },
    saveCancel () {
      // console.log(this.$refs.table.bodyData)
      this.isSave = false
    },
    saveDialog () {
      this.isSave = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
