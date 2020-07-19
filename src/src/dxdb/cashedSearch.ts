import {db} from "../dxdb"
import { v1 as uuid } from 'uuid';

export interface TCashedSearch {
  id?: number;
  uuid: string;
  searchEngine: string;
  searchTerm: string;
  // eslint-disable-next-line
  searchResult?: any;
  dateTime: number;
}


export class CashedSearch implements TCashedSearch {
  id?: number;
  searchEngine: string;
  searchTerm: string;
  uuid = uuid();
  // eslint-disable-next-line
  searchResult?: any;
  dateTime: number;

  // eslint-disable-next-line
  constructor(searchEngine: string ,searchTerm: string, searchResult: any){
    this.dateTime = new Date().getTime();
    this.searchEngine = searchEngine;
    this.searchTerm = searchTerm;
    this.searchResult = searchResult;
  }

  save(){    
    return db.cashedSearchs.put(this, this.id)
  }

  static async deleteById(id: number){
    return db.cashedSearchs.delete(id)
  }

  static async findCashByEngineAndSearchTerm(searchEngine: string, searchTerm: string){
    return db.cashedSearchs.where({searchEngine: searchEngine ,searchTerm: searchTerm}).toArray();
  }
}