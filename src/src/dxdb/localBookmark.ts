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
      this.modifiedDateTime = new Date().getTime();
    }

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

  static deleteById(id: number) {
    return db.localBookmarks.delete(id)
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
      isFavorite: 0
    })
  }

  static tagSearch(expr: string, workbookId: number) {
    const se = new SearchExpr(expr.toLowerCase())
    se.parseStr()

    return db.localBookmarks.where({ workbookId: workbookId }).filter((row) => {
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
    const re = new RegExp(expr, "g");
    const searchFilter: {workbookId: number;  isFavorite?: number} = {workbookId: workbookId}
    if (onlyFavorites){
      searchFilter.isFavorite = 1
    }
    return db.localBookmarks.where(searchFilter).filter((row) => {
      let s = row.header + row.tags + row.text + row.url;
      row.sublinks.forEach((currentval) => {
        s = s + currentval.header + currentval.text + currentval.url
      })
      return re.test(s)
    }).toArray(a => a.sort(sortOrderFunc))

  }

}