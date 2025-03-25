import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";


@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  post: Post = { id: '', title: '', content: '' };
  mode = 'create';
  postId: string | null = null;
  isLoading = false;


  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.isLoading = false;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;


        if (this.postId) {
          this.postsService.getPost(this.postId).subscribe((postData) => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content
            };
          });
        }
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = { id: '', title: '', content: '' };
      }
    });
  }


  onSavePost(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      this.isLoading = false;
      return;
    }


    if (this.mode === 'edit' && this.postId) {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    } else {
      this.postsService.addPost(form.value.title, form.value.content);
    }


    form.resetForm();
  }
}

