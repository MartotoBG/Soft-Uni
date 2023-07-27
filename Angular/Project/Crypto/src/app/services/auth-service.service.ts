import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register, Login } from '../types/user';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Profile } from '../types/user';
const registerUrl = 'http://localhost:3000/api/register'; //POST
const loginUrl = 'http://localhost:3000/api/login'; //POST
const profileUrl = 'http://localhost:3000/api/users/profile/'; //GET need to add /:username
const updateProfileUrl = 'http://localhost:3000/api/users/profile'; //PUT
const buyCryptoUrl = 'http://localhost:3000/api/cryptos/' //POST, add type of crypto at the end of link
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  buyCrypto(payingDollars: number, typeOfCypto: string, amount: number) {
    const username = this.cookieService.get('username');
    const data = {
      payingDollars,
      username,
      amount
    }
    this.http.post(buyCryptoUrl + typeOfCypto, data).subscribe({
      next: (res:any) => {
        this.cookieService.delete('error');
        this.cookieService.delete('walletBalance');
        this.cookieService.set('walletBalance', res.walletBalance);
      },error: (err) => {
        this.cookieService.set('error', err.error.message);
      }
    })
  }

  postRegister(data: Register) {
    this.http.post(registerUrl, data).subscribe({
      next: (res: any) => {
        this.cookieService.set('username', res.username);
        this.cookieService.set('email', res.email);
        this.cookieService.delete('error');
        this.router.navigate(['/']);
      }, error: (error) => this.cookieService.set('error', error.error.message)
    });
  }
  postLogin(data: Login): string | void {
    this.http.post(loginUrl, data).subscribe({
      next: (res: any) => {
        this.cookieService.set('username', res.username);
        this.cookieService.set('email', res.email);
        this.cookieService.delete('error');
        this.router.navigate(['/']);
      }, error: (error) => {
        console.log(error)
        this.cookieService.set('error', error.error.message);
      }
    });
  }

  getProfileInfo(): Profile | void {
    const username = this.cookieService.get('username');
    this.http.get(profileUrl + username).subscribe({
      next: (res: any) => {
        const imageUrl = res.imageUrl;
        const walletBalance = res.walletBalance
        this.cookieService.set('imageUrl', imageUrl);
        this.cookieService.set('walletBalance', walletBalance)
      }, error: (error) => console.log(error)
    })
  }

  updateProfileInfo(imageUrl: string) {
    const email = this.cookieService.get('email');
    const username = this.cookieService.get('username');
    const data = {
      username,
      email,
      imageUrl
    }

    this.http.put(updateProfileUrl, data).subscribe({
      next: (res) => {
      },
      error: (error) => console.log(error)
    })
  }
}
