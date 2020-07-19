import { db } from "../dxdb"
import { v1 as uuid } from 'uuid';

import { applicationConfig } from "../ApplicationConfig"

export interface TExternalSearch {
  id?: number;
  uuid: string;
  name: string;
  url: string;
  externalSearchParams: ExternalSearchParam[];
}

export class ExternalSearchParam {
  uuid = uuid()
  paramName = ""
  paramValue = ""
  paramValueIsSearchText = false
}


export class ExternalSearch implements TExternalSearch {
  id?: number;
  uuid = uuid();
  name = "";
  url = "";
  externalSearchParams: ExternalSearchParam[] = [];
  // eslint-disable-next-line
  constructor(w: TExternalSearch | undefined) {
    if (w !== undefined) {
      this.id = w.id
      this.uuid = w.uuid;
      this.name = w.name;
      this.url = w.url
      this.externalSearchParams = w.externalSearchParams;


    }
  }

  save() {
    return db.externalSearchs.put(this, this.id)
  }

  delete() {
    if (this.id === undefined) { return; }
    return db.externalSearchs.delete(this.id)
  }

  static async deleteById(id: number) {
    return db.externalSearchs.delete(id)
  }

  static async getAll() {
    return db.externalSearchs.toArray();
  }


  static async doExternalSearch(q: string) {


    const es = await ExternalSearch.getAll()
    const selectedSearch = es.filter((row) => { return row.id === applicationConfig.defaultExternalSearchId })[0]

    const url = new URL(selectedSearch.url)
    const params: Record<string, string> = {}
    selectedSearch.externalSearchParams.forEach((row) => {
      if (row.paramValueIsSearchText) {
        params[row.paramName] = q
      } else {
        params[row.paramName] = row.paramValue
      }

    })

    url.search = new URLSearchParams(params).toString();
    window.open(url.toString(), "_blank");

  }

}