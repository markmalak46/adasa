import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import type { BlogData, Post } from '../../app/models/post.model';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  featured: boolean;
};

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<BlogData>('data/posts.json').pipe(map((data) => data.posts ?? []));
  }

  getBlogData(): Observable<{ posts: Post[]; categories: any[] }> {
    return this.http.get<any>('data/posts.json').pipe(
      map((data) => ({
        posts: data?.posts ?? [],
        categories: data?.categories ?? [],
      })),
    );
  }

  getTeamFromPosts(): Observable<TeamMember[]> {
    return this.getPosts().pipe(
      map((posts) =>
        posts.map((post) => ({
          id: post.author.name,
          name: post.author.name,
          role: post.author.role,
          avatar: post.author.avatar,
          featured: !!post.featured,
        })),
      ),
    );
  }
}
