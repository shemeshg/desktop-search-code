import {TCashedSearch, CashedSearch} from "./dxdb/cashedSearch"
import {GenericSearchResult} from "./genericSearchResult"

export interface SearchEngineItf {
  readonly searchEngine: string; 
  doExternalSearch(q: string): void;
  getResult(q: string): Promise<{data: GenericSearchResult[]; dbRow: TCashedSearch}>;
}

export abstract class SearchEngineAbstract {
  abstract readonly searchEngine: string;
  protected abstract externalSearchUrl(): string
  // eslint-disable-next-line
  protected abstract externalSearchParams(q: string): any;

  protected abstract ajaxSearchUrl(): string
  // eslint-disable-next-line
  protected abstract ajaxSearchParams(q: string): any
  // eslint-disable-next-line
  protected abstract ajaxSearchFetchParams(): any


  doExternalSearch(q: string): void {
    const url = new URL(this.externalSearchUrl())

    const params = this.externalSearchParams(q)

    url.search = new URLSearchParams(params).toString();
    window.open(url.toString(), "_blank");
  }

  protected async doGetRequest(q: string): Promise<TCashedSearch> {
    const queryFromDb: TCashedSearch[] = await CashedSearch.findCashByEngineAndSearchTerm(this.searchEngine, q);
    if (queryFromDb.length) { return queryFromDb[0] }

    const result = await this.getAjaxRequest(q);
    const ret = new CashedSearch(this.searchEngine, q, result)
    await ret.save()
    return ret;
  }

  protected async getAjaxRequest(q: string) {
    const url = new URL(this.ajaxSearchUrl())

    const params = this.ajaxSearchParams(q);

    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url.toString(), this.ajaxSearchFetchParams());

    return await response.json()
  }

}