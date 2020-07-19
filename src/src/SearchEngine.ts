import {ExternalSearch} from "./dxdb/externalSearch"
import {TCashedSearch} from "./dxdb/cashedSearch"
import {GenericSearchResult} from "./genericSearchResult"
import {Docuduckgo} from "./SearchEngins/duckduckgo"


enum Engins {
  duckduckgo = 1,
}



class SearchEngine {

  engine: Engins = Engins.duckduckgo;

  duckduckgo = new Docuduckgo();


  
  doExternalSearch(q: string){
    /*
    if (this.engine === Engins.duckduckgo){
      this.duckduckgo.doExternalSearch(q);
    } 
    */
   return ExternalSearch.doExternalSearch(q);
  }

  async getResult(q: string): Promise<{data: GenericSearchResult[]; dbRow: TCashedSearch}>{

    if (this.engine === Engins.duckduckgo){
      return this.duckduckgo.getResult(q);
    } 
    return this.duckduckgo.getResult(q);
  }

}

export const searchEngine = new SearchEngine();