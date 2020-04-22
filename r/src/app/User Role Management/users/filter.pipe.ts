import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'Usersfilter'
})
export class FilterUserPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    searchText=searchText.trim();
    if(!items) return [];
    if(!searchText) return items;
searchText = searchText.toUpperCase();
return items.filter( it => {
      return it.strAlias.toUpperCase().includes(searchText);
    });
   }
}





@Pipe({
    name: 'strNamefilter'
  })
  export class FilterPrivilegesPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
      searchText=searchText.trim();
      if(!items) return [];
      if(!searchText) return items;
  searchText = searchText.toUpperCase();
  return items.filter( it => {
        return it.strName.toUpperCase().includes(searchText);
      });
     }
  }

