import { inject, Injectable } from "@angular/core";
import { User } from "./users-list/users-list.component";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "./local-storage.service";

@Injectable({providedIn:'root'})
export class UsersService {
  public readonly usersSubject = new BehaviorSubject<User[]>([]);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly localData = this.localStorageService.getItem('users');

  setUsers(users: User[]) {
    // if (this.data !== null) {
    //   this.usersSubject.next(this.data);
    // } else {
    //   this.usersSubject.next(users);
    // }

    return this.localData !== null ? this.usersSubject.next(this.localData) : this.usersSubject.next(users);
  }

  editUser(editedUser: User) {
    this.usersSubject.next(
      this.usersSubject.value.map(
        user => user.id === editedUser.id ? editedUser : user
      )
    )
    this.localStorageService.setItem('users', this.usersSubject.value);
  }

  createUser(user: User) {
    const userIsExisting = this.usersSubject.value.find(
      currentElement => currentElement.email === user.email
    )

    userIsExisting !== undefined ? alert('такой email зарегистрирован') : this.usersSubject.next([...this.usersSubject.value, user]);

    this.localStorageService.setItem('users', this.usersSubject.value);

  }

  deleteUser(id: number) {
    this.usersSubject.next(
      this.usersSubject.value.filter(
        item => id !== item.id
      )
    )
    this.localStorageService.setItem('users', this.usersSubject.value);
  }

}