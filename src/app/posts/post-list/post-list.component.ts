import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../authentication/auth.service';  

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  totalposts = 0; 
  postperpage = 2;
  Loading = false;
  pageSizeOption = [1, 2, 5, 10];
  posts: Post[] = [];
  private postsSub!: Subscription;
  private authStatusSub!: Subscription;  
  userIsAuthenticated = false;  

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.Loading = true;
    this.postsService.getPosts(this.postperpage, 1);
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], totalPosts: number }) => { 
        this.posts = postData.posts;
        this.totalposts = postData.totalPosts;
        this.Loading = false;
      });

   
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;  
      });

    
    this.userIsAuthenticated = this.authService.getIsAuth();
  }

  onChangedPage(pageData: PageEvent) {
    this.Loading = true;
    const pageSize = pageData.pageSize;
    const currentPage = pageData.pageIndex + 1; 
    this.postsService.getPosts(pageSize, currentPage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
   
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }
}
