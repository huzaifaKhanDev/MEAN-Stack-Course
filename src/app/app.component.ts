import { Component } from '@angular/core';
import { Post } from 'src/app/interfaces/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedPosts: Post[] = [];

  onPostAdded(e: any){
    this.storedPosts.push(e)
  }
}
