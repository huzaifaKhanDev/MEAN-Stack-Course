import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/post';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts : Post[] = [];
  public postsSub!: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit() {
   this.postsService.getPosts();
   this.postsSub = this.postsService.getPostUpdatedListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
      console.log(posts)
    });
  }
  onDelete(postId: string){
    this.postsService.deletePost(postId)
  }
  ngOnDestroy() {
      this.postsSub.unsubscribe();
  }

}

