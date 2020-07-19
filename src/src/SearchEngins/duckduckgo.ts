import { TCashedSearch } from "../dxdb/cashedSearch"
import { GenericSearchResult, SubLink } from "../genericSearchResult"
import { v1 as uuid } from 'uuid';
import { SearchEngineItf, SearchEngineAbstract } from "../SearchEngineItf"


interface Duckduckresponse {
  FirstURL: string;
  Result: string;
  Text: string;
}





class GenericDucducGo implements GenericSearchResult {
  url = "";
  header = "";
  text = "";
  relatedSubject = false;
  sublinks: SubLink[] = [];
  uuid = uuid()

  constructor(url: string, header: string, text: string, relatedSubject: boolean) {
    const div = document.createElement('div')
    div.innerHTML = header;
    // eslint-disable-next-line 
    const aElement: any = div.firstElementChild
    this.url = url;
    this.header = aElement.text;

    if (text.length === this.header.length) {
      this.text = ""
    } else {
      this.text = text.substr(this.header.length + 3);
    }

    this.relatedSubject = relatedSubject;

  }
}



export class Docuduckgo extends SearchEngineAbstract implements SearchEngineItf {
  readonly searchEngine = "duckduckgo"

  protected externalSearchUrl() {
    return 'https://duckduckgo.com/'
  }

  // eslint-disable-next-line
  protected externalSearchParams(q: string): any {
    return { q: q, t: "hk", ia: "web" }
  }


  protected ajaxSearchUrl() {
    return 'https://api.duckduckgo.com/'
  }

  protected ajaxSearchParams(q: string) {
    return { q: q, format: "json" }
  }

  protected ajaxSearchFetchParams(){
    return {method: 'GET'};
  }

  async getResult(q: string): Promise<{ data: GenericSearchResult[]; dbRow: TCashedSearch }> {
    const result = await this.doGetRequest(q);

    const relatedTopics: Duckduckresponse[] = result.searchResult.RelatedTopics
    const results: Duckduckresponse[] = result.searchResult.Results
    const ret: GenericSearchResult[] = [];

    results.forEach((val) => {
      if (val.FirstURL) {
        ret.push(new GenericDucducGo(val.FirstURL, val.Result, val.Text, false))
      }

    })
    relatedTopics.forEach((val) => {
      if (val.FirstURL) {
        ret.push(new GenericDucducGo(val.FirstURL, val.Result, val.Text, true))
      }
    })

    return { data: ret, dbRow: result };
  }



}




