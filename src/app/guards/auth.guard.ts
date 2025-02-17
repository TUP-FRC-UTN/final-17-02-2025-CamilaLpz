import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let rolesPermitted = route.data['roles'];
  console.log(rolesPermitted);
  

  let actualRole = localStorage.getItem('actualRole');

  return rolesPermitted.includes(actualRole);
};
