import { Component, OnInit } from "@angular/core";
import { BlogService, TeamMember } from "../../services/blog.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.html",
  styleUrls: ["./about.css"],
})
export class About implements OnInit {
  team: TeamMember[] = [];

  constructor(private blog: BlogService) {}

  ngOnInit(): void {
    this.blog.getTeamFromPosts().subscribe({
      next: (data) => (this.team = data ?? []),
      error: () => (this.team = []),
    });
  }
}
