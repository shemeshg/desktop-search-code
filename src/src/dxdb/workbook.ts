import { db } from "../dxdb"
import { v1 as uuid } from 'uuid';

export interface TWorkbook {
  id?: number;
  uuid: string;
  name: string;
}


export class Workbook implements TWorkbook {
  id?: number;
  uuid = uuid();
  name = "";

  // eslint-disable-next-line
  constructor(w: TWorkbook | undefined) {
    if (w !== undefined) {
      this.id = w.id
      this.name = w.name;
      this.uuid = w.uuid;
    }
  }

  save() {
    return db.workbooks.put(this, this.id)
  }

  delete() {
    if (this.id === undefined) { return; }
    return db.workbooks.delete(this.id)
  }

  static async deleteById(id: number) {
    return db.workbooks.delete(id)
  }

  static async getAll() {
    return db.workbooks.toArray();
  }
}