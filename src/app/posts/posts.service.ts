import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], totalPosts: number }>(); 

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, currentPage: number) {
    this.http
      .get<{ message: string; posts: any; totalPosts: number }>(
        `http://localhost:3000/api/posts?page=${currentPage}&pagesize=${pageSize}`
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => ({
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator || null,  // Make sure creator is handled as string or null
            })),
            totalPosts: postData.totalPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        console.log(transformedPostsData);  
        this.posts = transformedPostsData.posts; 
        this.postsUpdated.next({ posts: this.posts, totalPosts: transformedPostsData.totalPosts }); 
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string; creator: string | null }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);

    this.http.post<{ message: string; post: Post }>("http://localhost:3000/api/posts", postData).subscribe((response) => {
      const newPost: Post = {
        id: response.post.id,
        title: title,
        content: content,
        imagePath: response.post.imagePath,
        creator: response.post.creator || null,  // Ensure creator is handled properly
      };
      this.posts.push(newPost);
      this.postsUpdated.next({ posts: [...this.posts], totalPosts: this.posts.length });
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;

    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, image.name);
    } else {
      postData = { 
        id, 
        title, 
        content, 
        imagePath: image,
        creator: null,  // Handling creator as null
      };
    }

    this.http.put<{ message: string; imagePath?: string }>(
      "http://localhost:3000/api/posts/" + id,
      postData
    ).subscribe((response) => {
      const updatedPosts = [...this.posts];
      const index = updatedPosts.findIndex((p) => p.id === id);

      if (index !== -1) {
        updatedPosts[index] = {
          id,
          title,
          content,
          imagePath: response.imagePath || (typeof image === "string" ? image : updatedPosts[index].imagePath),
          creator: updatedPosts[index].creator || null,  // Ensure creator is maintained
        };
      }

      this.posts = updatedPosts;
      this.postsUpdated.next({ posts: [...this.posts], totalPosts: this.posts.length });
    });
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== postId);
      this.postsUpdated.next({ posts: [...this.posts], totalPosts: this.posts.length });
      this.router.navigate(["/"]);
    });
  }
}
