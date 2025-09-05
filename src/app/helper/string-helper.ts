export class StringHelper {
  
    /**
     * Convert a string to PascalCase (ThisCase).
     * @param str - input string
     * @returns PascalCase string
     */
    static toPascalCase(str: string | undefined): string | undefined{
        if (!str) return str;
        return str
            .replace(/[_\- ]+/g, ' ') // normalize separators
            .split(' ')
            .map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('');
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stringFormat', standalone: true })
export class StringFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .replace(/_/g, ' ')                      // replace underscores
      .replace(/\b\w/g, char => char.toUpperCase()); // capitalize words
  }
}