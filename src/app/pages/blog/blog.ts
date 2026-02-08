import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BlogService } from "../../services/blog.service";
import type { Post } from "../../models/post.model";

type ViewMode = "grid" | "list";

@Component({
  selector: "app-blog",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./blog.html",
  styleUrl: "./blog.css",
})
export class Blog implements OnInit {
  posts: Post[] = [];

  activeCategory = "الكل";
  query = "";
  viewMode: ViewMode = "grid";

  pageSize = 6;
  page = 1;

  categories: string[] = ["الكل"];
  filtered: Post[] = [];
  paged: Post[] = [];
  pages: number[] = [];
  totalCount = 0;
  totalPages = 1;

  constructor(private blog: BlogService) {}

  ngOnInit(): void {
    this.blog.getPosts().subscribe({
      next: (data) => {
        this.posts = data ?? [];
        this.refresh(true); 
      },
      error: () => {
        this.posts = [];
        this.refresh(true);
      },
    });
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.page = 1;
    this.refresh();
  }

  setQuery(value: string) {
    this.query = value;
    this.page = 1;
    this.refresh();
  }

  setMode(mode: ViewMode) {
    this.viewMode = mode;
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.refresh();
    }
  }

  next() {
    if (this.page < this.totalPages) {
      this.page++;
      this.refresh();
    }
  }

  goTo(p: number) {
    this.page = Math.min(this.totalPages, Math.max(1, p));
    this.refresh();
  }

  private refresh(rebuildCategories = false) {
    if (rebuildCategories) {
      const set = new Set(
        this.posts.map((p) => (p.category ?? "").trim()).filter(Boolean)
      );
      const cats = Array.from(set).sort((a, b) => a.localeCompare(b, "ar"));
      this.categories = ["الكل", ...cats];
    }

    const q = this.query.trim().toLowerCase();
    const cat = this.activeCategory;

    let arr = [...this.posts];

    arr.sort(
      (a, b) => new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime()
    );

    if (cat !== "الكل") {
      arr = arr.filter((p) => (p.category ?? "").trim() === cat);
    }

    if (q) {
      arr = arr.filter((p) => {
        const title = (p.title ?? "").toLowerCase();
        const excerpt = (p.excerpt ?? "").toLowerCase();
        const author = (p.author?.name ?? "").toLowerCase();
        const tags = (p.tags ?? []).join(" ").toLowerCase();

        return (
          title.includes(q) ||
          excerpt.includes(q) ||
          author.includes(q) ||
          tags.includes(q)
        );
      });
    }

    this.filtered = arr;
    this.totalCount = arr.length;

    this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    if (this.page > this.totalPages) this.page = 1;

    const start = (this.page - 1) * this.pageSize;
    this.paged = this.filtered.slice(start, start + this.pageSize);

    this.pages = this.makePages(this.totalPages, this.page, 5);
  }

  private makePages(total: number, current: number, windowSize: number): number[] {
    let start = Math.max(1, current - Math.floor(windowSize / 2));
    let end = start + windowSize - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - windowSize + 1);
    }

    const res: number[] = [];
    for (let i = start; i <= end; i++) res.push(i);
    return res;
  }
}
