import { AsyncPipe, NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, ViewChild } from "@angular/core";
import { UsersApiService } from "../users-api.service";
import { UserCardComponent } from "./user-card/user-card.component";
import { UsersService } from "../users.service";
import {MatDialog} from "@angular/material/dialog"
import {MatButton} from "@angular/material/button"
import { CreateEditUserDialogComponent } from "./create-edit-user-dialog/create-edit-user-dialog.component";
import { LocalStorageService } from "../local-storage.service";

export interface User {
  id:       number;
  name:     string;
  username?: string;
  email:    string;
  address?: {
    street:  string;
    suite:   string;
    city:    string;
    zipcode: string
    geo: {
      lat: string;
      lng: string;
    }
  }
  phone?:   string;
  website: string;
  company: {
    name:        string;
    catchPhrase?: string;
    bs?:          string;
  }
}

export interface userData {
  id: number,
  name: string,
  email: string,
  website: string,
  companyName: string
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  templateUrl:'./users-list.component.html',
  styleUrl:'./users-list.component.scss',
  imports: [NgFor, UserCardComponent, AsyncPipe, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  private readonly usersApiService = inject(UsersApiService);
  public readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly localeStorageService = inject(LocalStorageService);
  private isEdit: Boolean = false;

  constructor() {

    this.usersApiService.getUsers().subscribe(
      (response:any) => {
        this.usersService.setUsers(response);
        // this.localeStorageService.setItem('users', response) //для отката в изначальное
        if (this.localeStorageService.getItem('users') === null) {
          this.localeStorageService.setItem('users', response);
        }      
      }
    )

  }
  
  public openDialog(user?: User): void {
    this.isEdit = user !== undefined
    const dialogRef = this.dialog.open(CreateEditUserDialogComponent, {
      data: {
        user: user,
        isEdit: this.isEdit
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('USER: ',user, 'RESULT: ', result)
      if (!result) return;
      this.isEdit ? this.editUser({...user, ...result}) : this.createUser(result);
    });
  }


  deleteUser(id:number) {
    this.usersService.deleteUser(id);
  }

  public createUser(userData: userData) {
    this.usersService.createUser({
      id: new Date().getTime(),
      name: userData.name,
      email: userData.email,
      website: userData.website,
      company: {
        name: userData.companyName,
      }
    });
  }

  public editUser(userData: userData) {
    this.usersService.editUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      website: userData.website,
      company: {
        name: userData.companyName,}
    })
  }

}