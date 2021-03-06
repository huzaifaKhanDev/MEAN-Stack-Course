import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Post } from '../interfaces/post';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

private  posts: Post[] = [];
private postUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPostUpdatedListener(){
    return this.postUpdated.asObservable();
  }

  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http
    .get<{message:string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map((post: { _id: Post[]; title: Post[]; content: Post[]; imagePath: string}) => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath
        }
      }),
    maxPosts: postData.maxPosts
  };
    }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postUpdated.next({
        posts: [...this.posts],
      postCount: transformedPostData.maxPosts});
    });
  };

  getPost(id: string){
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File){
    const postData = new FormData();

    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  };

  updatePost(id: any, title: string, content: string, image: File | string){
    let postData: Post | FormData;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    }else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string){
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
