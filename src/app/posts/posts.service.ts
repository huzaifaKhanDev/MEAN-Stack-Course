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
private postUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPostUpdatedListener(){
    return this.postUpdated.asObservable();
  }

  getPosts(){
    this.http.get<{message:string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map((post: { _id: Post[]; title: Post[]; content: Post[]; }) => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
        }
      });
    }))
    .subscribe((posts) => {
      this.posts = posts;
      this.postUpdated.next([...this.posts]);
    });
  };

  getPost(id: string){
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string){
    const post: Post = {
      id: '',
      title: title,
      content: content
    }
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  };

  updatePost(id: any, title: string, content: string){
    const post: Post = { id: id, title: title, content: content };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }
}
