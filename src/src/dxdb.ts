import Dexie from 'dexie';
import {TLocalBookmark} from "./dxdb/localBookmark"
import {TCashedSearch } from "./dxdb/cashedSearch"
import {TWorkbook, Workbook } from "./dxdb/workbook"
import {TExternalSearch, ExternalSearch, ExternalSearchParam } from "./dxdb/externalSearch"

export class AppDatabase extends Dexie {
  cashedSearchs!: Dexie.Table<TCashedSearch, number>;
  localBookmarks!: Dexie.Table<TLocalBookmark, number>;
  workbooks!: Dexie.Table<TWorkbook, number>;
  externalSearchs!: Dexie.Table<TExternalSearch, number>;

  constructor() {

    super("DesktopSearchDatabase");


    this.version(1).stores({
      cashedSearchs: '++id, uuid, searchEngine, searchTerm, [searchEngine+searchTerm]',
      localBookmarks: '++id, uuid, workbookId,  [workbookId+isFavorite], [workbookId+isDeleted], [workbookId+isDeleted+isFavorite]',
      workbooks: '++id, uuid',
      externalSearchs: '++id, uuid',
    });
    
  }
}



export const db = new AppDatabase();

async function onPoulate(){
  const w = new Workbook(undefined);
  w.name = "Default workbook"
  await w.save();

  let r = new ExternalSearch(undefined);
  r.name = "duckduckgo"
  r.url = "https://duckduckgo.com/"
  let p = new ExternalSearchParam();
  p.paramName = "q"
  p.paramValueIsSearchText = true
  r.externalSearchParams = [p]
  r.save();

  r = new ExternalSearch(undefined);
  r.name = "google"
  r.url = "https://google.com/search"
  p = new ExternalSearchParam();
  p.paramName = "q"
  p.paramValueIsSearchText = true
  r.externalSearchParams = [p]
  r.save();
}

db.on("populate", () => {
  return onPoulate();
});






