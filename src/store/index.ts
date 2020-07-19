import Vue from 'vue'
import Vuex from 'vuex'

import { getApplicationInitData, applicationConfig } from "../src/ApplicationConfig"
import { TWorkbook } from "../src/dxdb/workbook"
import { TExternalSearch } from "../src/dxdb/externalSearch"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedWorkbookId: 1,
    selectedExternalSearchId: 1,
    workbooks: [] as TWorkbook[],
    externalSearchs: [] as TExternalSearch[],
    pageName: "",
  },
  mutations: {
    getApplicationData(state, val) {
      state.selectedWorkbookId = val.defaultId
      state.selectedExternalSearchId = val.defaultExternalSearchId
      state.workbooks = val.workbooks
      state.externalSearchs = val.externalSearchs
    },
    emitSelectedWorkbookId(state, val) {
      state.selectedWorkbookId = val

      applicationConfig.defaultWorkbookId = val;
      applicationConfig.save()
    },
    emitSelectedExternalSearchId(state, val) {
      state.selectedExternalSearchId = val

      applicationConfig.defaultExternalSearchId = val;

      applicationConfig.save()
    },
  },
  actions: {
    getApplicationData(context) {
      return getApplicationInitData()
        .then((data) => {
          context.commit('getApplicationData', data)
        })
    },

  },
  modules: {
  }
})
