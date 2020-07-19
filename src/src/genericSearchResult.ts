import { v1 as uuid } from 'uuid';

export class SubLink {
  uuid = uuid();
  url = "";
  header = "";
  text = "";
}

export interface GenericSearchResult {  
  uuid: string;
  url: string;
  header: string;
  text: string;
  relatedSubject: boolean;
  sublinks: SubLink[];
}