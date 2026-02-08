import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BlogService } from "../../services/blog.service";
import type { Post } from "../../models/post.model";

type CategoryDto = { name: string; count: number; color: string };

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home implements OnInit {
  posts: Post[] = [];
  categories: CategoryDto[] = [];
  featuredPosts: Post[] = [];
  latestPosts: Post[] = [];

  constructor(private blog: BlogService) {}

  ngOnInit(): void {
    this.blog.getBlogData().subscribe({
      next: (data) => {
        this.posts = data.posts ?? [];
        this.categories = data.categories ?? [];

        const featured = this.posts.filter((p) => p.featured);
        this.featuredPosts = (featured.length ? featured : this.posts);

        this.latestPosts = this.posts;
      },
      error: () => {
        this.posts = [];
        this.categories = [];
        this.featuredPosts = [];
        this.latestPosts = [];
      },
    });
  }
}
