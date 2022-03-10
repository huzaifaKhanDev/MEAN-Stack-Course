import { Component, OnInit,Input } from '@angular/core';
import { Post } from 'src/app/interfaces/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
    console.log('posts',this.posts)
  }

  @Input() posts : Post[] = [];

}

