import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Post
} from 'src/app/interfaces/post';
import {
  PostsService
} from '../posts.service';
import {
  Subscription
} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  public postsSub!: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10, 50]

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);

    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });
  }
  onPageChange(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
