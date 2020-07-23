import { db } from "../dxdb"
import { v1 as uuid } from 'uuid';

export interface TWorkbook {
  id?: number;
  uuid: string;
  name: string;
  isExport: number;
}


export class Workbook implements TWorkbook {
  id?: number;
  uuid = uuid();
  name = "";
  isExport = 1;

  // eslint-disable-next-line
  constructor(w: TWorkbook | undefined) {
    if (w !== undefined) {
      this.id = w.id
      this.name = w.name;
      this.uuid = w.uuid;
      this.isExport = w.isExport;
    }
  }

  save() {
    return db.workbooks.put(this, this.id)
  }

  delete() {
    if (this.id === undefined) { return; }
    return db.workbooks.delete(this.id)
  }

  static async getByUuid(uuid: string) {
    const r = await db.workbooks.where({uuid: uuid}).toArray()
    return new Workbook( r[0]);
  }

  static async deleteById(id: number) {
    return db.workbooks.delete(id)
  }

  static async getAll() {
    return db.workbooks.toArray();
  }
}