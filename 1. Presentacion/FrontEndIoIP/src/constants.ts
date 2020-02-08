import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const RegularExpressions = {
  onlyNumbers: '^[0-9]*$',
  onlyLettersIgnoreCase: '^[a-zA-ZñÑ]*$',
  onlyLettersUpperCase: '^[A-ZÑ]*$',
  onlyLettersLowerCase: '^[a-zñ]*$',
  onlyNumbersAndLetters: '^[0-9A-Za-zñÑ]*$',
  lettersWithSpace: '|^[a-zA-Z]+(\s*[a-zA-Z]*)*[a-zA-Z]+$|',
  numbersLettersSpace: '^[0-9a-zA-Z ]*$',
};

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  multi: true
};
