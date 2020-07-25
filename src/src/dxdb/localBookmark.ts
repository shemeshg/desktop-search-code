import { GenericSearchResult, SubLink } from "../genericSearchResult";
import { splitStrBySpace } from "../searchExpr"
import { db } from "../dxdb"
import { v1 as uuid } from 'uuid';
import { SearchExpr } from "../searchExpr"

export interface TLocalBookmark {
  id?: number;
  sortOrderId: number;
  uuid: string;
  workbookId: number;
  tags: string[];
  url: string;
  header: string;
  text: string;
  relatedSubject: boolean;
  sublinks: SubLink[];
  isFavorite: number;
  isDeleted: number;
  modifiedDateTime: number;
}

function sortOrderFunc(firstEl: TLocalBookmark, secondEl: TLocalBookmark) {
  const costFirstCost = firstEl.relatedSubject ? firstEl.sortOrderId: firstEl.sortOrderId - 1000;
  const costSecondEl = secondEl.relatedSubject ? secondEl.sortOrderId: secondEl.sortOrderId - 1000;

  return costFirstCost - costSecondEl;

}


export class LocalBookmark implements TLocalBookmark {
  id?: number;
  sortOrderId = 0;
  uuid = uuid();
  workbookId = 1
  tags: string[] = []
  url = ""
  header = ""
  text = ""
  relatedSubject = true
  sublinks: SubLink[] = []
  isFavorite = 0
  modifiedDateTime = 0;
  isDeleted = 0

  constructor(t: TLocalBookmark | undefined) {
    if (t !== undefined) {
      this.id = t.id;
      this.uuid = t.uuid ? t.uuid : uuid();
      this.sortOrderId = t.sortOrderId
      this.workbookId = t.workbookId
      this.tags = t.tags;
      this.url = t.url;
      this.header = t.header
      this.text = t.text
      this.relatedSubject = t.relatedSubject
      this.sublinks = t.sublinks
      this.isFavorite = t.isFavorite
      this.modifiedDateTime = t.modifiedDateTime;
      this.isDeleted = t.isDeleted
    }

  }

  async moveToWorkbook(newWorkbookId: number){
    if (this.workbookId <0 || this.workbookId === newWorkbookId){return;}
    this.isDeleted = 1;
    await this.save();
    this.isDeleted = 0;
    delete this.id;
    this.workbookId = newWorkbookId;
    this.uuid = uuid();
    await this.save();    
  }

  save() {
    this.modifiedDateTime = new Date().getTime();
    return db.localBookmarks.put(this, this.id)
  }

  static getAllByWorkbookId(workbookId: number){
    return db.localBookmarks.where({workbookId: workbookId}).toArray();
  }

  static deleteByWorkbookId(workbookId: number){
    return db.localBookmarks.where({workbookId: workbookId}).delete();
  }

  static purgeByWorkbookId(workbookId: number){
    return db.localBookmarks.where({workbookId: workbookId, isDeleted: 1}).delete();
  }

  static async deleteById(id: number) {
    const r = await db.localBookmarks.get(id);
    if (r === undefined){return;}
    r.isDeleted = 1;
    await (new LocalBookmark(r)).save()

    //return db.localBookmarks.delete(id)
  }

  static getById(id: number) {
    return db.localBookmarks.get(id)
  }

  static async getByUuid(uuid: string) {
    const r = await db.localBookmarks.where({uuid: uuid}).toArray()
    return new LocalBookmark( r[0]);
  }

  static async addBookmarkFromGenericItem(item: GenericSearchResult, searchText: string, workbookId: number): Promise<number> {
    const firstSearchTag = splitStrBySpace(searchText)[0].replace(/"/g, "").trim();


    return await db.localBookmarks.add({
      uuid: uuid(), sortOrderId: 0,
      workbookId: workbookId, tags: [firstSearchTag], url: item.url,
      header: item.header, text: item.text, relatedSubject: item.relatedSubject, sublinks: item.sublinks,
      isFavorite: 0,
      isDeleted: 0,
      modifiedDateTime: new Date().getTime()
    })
  }

  static tagSearch(expr: string, workbookId: number) {
    const se = new SearchExpr(expr.toLowerCase())
    se.parseStr()

    return db.localBookmarks.where({ workbookId: workbookId, isDeleted: 0 }).filter((row) => {
      return se.evaluateExp(row.tags)
    })
      .toArray(a => a.sort(sortOrderFunc))
  }

   static async relatedTags(expr: string, workbookId: number) {

      const ret: Record<string, number> = {}
      const rows = await this.fullTextSearch(expr, false, workbookId);

      for (let i=0;i< rows.length; i++){
        rows[i].tags.forEach( (tag: string)=>{
          ret[tag] = 0
        })
      }
  
      return Object.keys(ret)      
  }

  static fullTextSearch(expr: string, onlyFavorites: boolean, workbookId: number) {
    
    const searchFilter: {workbookId: number; isDeleted: number; isFavorite?: number} = {workbookId: workbookId, isDeleted: 0}
    if (onlyFavorites){
      searchFilter.isFavorite = 1
    }
    return db.localBookmarks.where(searchFilter).filter((row) => {
      let s = row.header + row.tags + row.text + row.url;
      row.sublinks.forEach((currentval) => {
        s = s + currentval.header + currentval.text + currentval.url
      })
      const re = new RegExp(expr, "g");
      return re.test(s.toLowerCase())
    }).toArray(a => a.sort(sortOrderFunc))

  }

}