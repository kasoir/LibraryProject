import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtervalueOfKey',
    pure: false
})
export class FilterValueOfKeyPipe implements PipeTransform {
    transform(_array: any[],key : string, value: string | Boolean | number) {
        if (_array && _array.length > 0)
        {
            if(typeof(value) == "string"){
                value = value.trim().toLowerCase();
                return _array.filter(ele=>ele[key].trim().toLowerCase().includes(value));
            }
            else{
                return _array.filter(ele=>ele[key] == value) ;
            }
        }
    }
}