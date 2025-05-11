import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  totalposts = 0;
  postperpage = 2;
  Loading = false;
  pageSizeOption = [1, 2, 5, 10];
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchTerm: string = '';
  selectedSort: string = 'titleAsc';
  private postsSub!: Subscription;
  private authStatusSub!: Subscription;
  userIsAuthenticated = false;
  userId: string = ''; // Fix: initialized with empty string

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.Loading = true;
    this.postsService.getPosts(this.postperpage, 1);
    this.userId = this.authService.getUserId() || ''; // Fix: handle null
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((postData: { posts: Post[]; totalPosts: number }) => {
        this.posts = postData.posts;
        this.filteredPosts = [...this.posts];
        this.totalposts = postData.totalPosts;
        this.Loading = false;
        this.onSearchChange();
      });

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId() || ''; // Fix: handle null
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

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPosts = this.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term)
    );
    this.sortPosts();
  }

  onSortChange() {
    this.sortPosts();
  }

  sortPosts() {
    if (this.selectedSort === 'titleAsc') {
      this.filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.selectedSort === 'titleDesc') {
      this.filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
    }
  }

  exportToCSV() {
    const csvData = this.convertToCSV(this.filteredPosts);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'posts.csv';
    link.click();
  }

  convertToCSV(posts: Post[]): string {
    const headers = ['Title', 'Content', 'Image Path'];
    const rows = posts.map((post) => {
      return `${post.title},${post.content.replace(/,/g, '')},${post.imagePath}`;
    });
    return [headers.join(','), ...rows].join('\n');
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
