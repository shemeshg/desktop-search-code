import {Workbook, TWorkbook} from "./dxdb/workbook"
import {LocalBookmark, TLocalBookmark} from "./dxdb/localBookmark"

export function downloadFileAsString(filename:  string, text: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// eslint-disable-next-line
export function readFileAsString(el: any): Promise<any> {
  return new Promise( (resolve)=>{

      if (el.files.length === 0) {            
          return;
      }

      const reader = new FileReader();
      reader.onload = function(event) {
          resolve(event.target?.result);
      };
      reader.readAsText(el.files[0]);
  })

}

export  async function doImport(str: string){
  const ret: {
    workbook: TWorkbook;
    bookmarks: TLocalBookmark[];
  }[] = JSON.parse(str);


  for (let r = 0; r < ret.length; r++) {
    const newWorkbook = new Workbook(ret[r].workbook)
    delete newWorkbook.id
    const oldWorkbook = await Workbook.getByUuid(ret[r].workbook.uuid);
    if (oldWorkbook.id) {
      newWorkbook.id = oldWorkbook.id
    } 
    if (!oldWorkbook.isExport && !oldWorkbook.id){continue;}

    if (oldWorkbook.id) {
      newWorkbook.id = oldWorkbook.id;
      if (newWorkbook.modifiedDateTime > oldWorkbook.modifiedDateTime) {
        await newWorkbook.save();
      }
    } else {
      await newWorkbook.save();
    }

    

    for (let i = 0; i < ret[r].bookmarks.length; i++) {
      const row: TLocalBookmark = ret[r].bookmarks[i];
      const newRecord = new LocalBookmark(row);
      delete newRecord.id;
      newRecord.uuid = row.uuid;
      newRecord.workbookId = newWorkbook.id as number;
      const extsting = await LocalBookmark.getByUuid(newRecord.uuid);

      if (extsting.id) {
        newRecord.id = extsting.id;
        if (newRecord.modifiedDateTime > extsting.modifiedDateTime) {
          await newRecord.save();
        }
      } else {
        await newRecord.save();
      }
    }
  }
}


export async function doExport(): Promise<string>{
  const workbooks = await Workbook.getAll();
    const ret: {
      workbook: TWorkbook;
      bookmarks: TLocalBookmark[];
    }[] = [];
    for (let w = 0; w < workbooks.length; w++) {
      if (workbooks[w].isExport) {
        const id = workbooks[w].id as number;
        const bookmarks = await LocalBookmark.getAllByWorkbookId(id);
        ret.push({ workbook: workbooks[w], bookmarks: bookmarks });
      } else {
        ret.push({ workbook: workbooks[w], bookmarks: [] });
      }
    }
    return JSON.stringify(ret);
}