import { Workbook } from "./dxdb/workbook"
import { ExternalSearch } from './dxdb/externalSearch';

const localStorageTar = "config"
class ApplicationConfig {

  defaultWorkbookId = 1;
  defaultExternalSearchId = 1;
  isHomeSearchLocal = true;
  isHomeSearchInternet = true;

  load() {
    const config = localStorage.getItem(localStorageTar)
    if (config === null) {
      localStorage.setItem(localStorageTar, JSON.stringify(this));      
    } else {
      const json = JSON.parse(config)
      this.defaultWorkbookId = json.defaultWorkbookId
      this.defaultExternalSearchId = json.defaultExternalSearchId
      this.isHomeSearchLocal = json.isHomeSearchLocal;
      this.isHomeSearchInternet = json.isHomeSearchInternet;
    }
    return this;
  }

  save() {
    localStorage.setItem(localStorageTar, JSON.stringify(this));
  }

}

export const applicationConfig = (new ApplicationConfig()).load();

export async function getApplicationInitData() {
  const workbooks = await Workbook.getAll();
  const externalSearchs = await ExternalSearch.getAll()

  return { defaultId: applicationConfig.defaultWorkbookId, 
          defaultExternalSearchId: applicationConfig.defaultExternalSearchId , 
          workbooks: workbooks ,
          externalSearchs: externalSearchs}
}