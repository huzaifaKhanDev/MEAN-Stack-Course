import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: any = 'null';
  form: FormGroup;
  post: { id?: string; title?: string; content?: string; imagePath?: string} = {};
  isLoading = false;
  imagePreview: string = '';

  constructor(public postsService: PostsService, public route: ActivatedRoute) {

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null,{
      validators: [Validators.required],
      asyncValidators: [mimeType]})
    });

   }

  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;

        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
          id: postData._id,
          title: postData.title,
          content: postData.content,
          imagePath: postData.imagePath
        }
        this.form.setValue({
          title: this.post.title,
          content: this.post.content,
          image: this.post.imagePath
        })
        });
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  };

  onSavePost(){

    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image)
    }
    else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image)
    }
    this.form.reset();
  };
  onImagePicked(e: Event){

    const file = (e.target as any).files[0];
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file)
    // console.log('file', file);
    // console.log('form', this.form);

  }

}
