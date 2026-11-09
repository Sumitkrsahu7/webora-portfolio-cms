import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

const API_URL = environment.apiUrl;
const API_ORIGIN = new URL(API_URL).origin;

type ProjectStatus = 'DRAFT' | 'PUBLISHED';

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  category?: string;
  thumbnailUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  startDate?: string;
  completionDate?: string;
  featured: boolean;
  status: ProjectStatus;
  technologies: string[];
  images?: ProjectImage[];
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectImage {
  imageUrl: string;
  altText?: string;
  displayOrder?: number;
}

interface ProjectPage {
  content: Project[];
  totalElements: number;
  totalPages: number;
}

interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
  displayOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  displayOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SiteProfile {
  id?: string;
  name: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  updatedAt?: string;
}

interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string;
  displayOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED';
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (!token) {
      <div class="login-page">
        <form class="login-card" (ngSubmit)="login()">
          <div class="brand">WEBORA<span>.</span></div>
          <p class="eyebrow">CONTENT MANAGEMENT SYSTEM</p>
          <h1>Welcome back.</h1>
          <p class="muted">Sign in to manage your website.</p>

          <label>Email address</label>
          <input
            type="email"
            name="email"
            [(ngModel)]="email"
            placeholder="admin@example.com"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            [(ngModel)]="password"
            placeholder="Enter your password"
            required
          />

          @if (error) {
            <div class="alert error">{{ error }}</div>
          }

          <button class="primary full" type="submit" [disabled]="busy">
            {{ busy ? 'Signing in...' : 'Sign in to dashboard' }}
          </button>

          <p class="login-foot">WEBORA · Private administration</p>
        </form>
      </div>
    } @else {
      <div class="app-shell">
        <aside class="sidebar" [class.mobile-open]="mobileMenu">
          <a
            class="brand"
            href="#"
            (click)="navigate('overview'); $event.preventDefault()"
          >
            WEBORA<span>.</span>
            <small>ADMIN WORKSPACE</small>
          </a>

          <p class="nav-label">WORKSPACE</p>

          <button
            class="nav-item"
            [class.active]="view === 'overview'"
            (click)="navigate('overview')"
          >
            <span>◫</span> Overview
          </button>

          <button
            class="nav-item"
            [class.active]="view === 'projects'"
            (click)="navigate('projects')"
          >
            <span>◇</span> Projects
          </button>

          <p class="nav-label">WEBSITE</p>

          <button
            class="nav-item"
            [class.active]="view === 'skills'"
            (click)="navigate('skills')"
          >
            <span>✳</span> Skills
          </button>

          <button
            class="nav-item"
            [class.active]="view === 'services'"
            (click)="navigate('services')"
          >
            <span>◈</span> Services
          </button>

          <button
            class="nav-item"
            [class.active]="view === 'testimonials'"
            (click)="navigate('testimonials')"
          >
            <span>♡</span> Testimonials
          </button>

          <button
            class="nav-item"
            [class.active]="view === 'profile'"
            (click)="navigate('profile')"
          >
          <span>◎</span> Profile
          </button>

          <button
            class="nav-item"
            [class.active]="view === 'inquiries'"
            (click)="navigate('inquiries')"
          >
            <span>↗</span> Inquiries
          </button>

          <div class="sidebar-bottom">
            <div class="user-avatar">W</div>
            <div>
              <strong>Administrator</strong>
              <small>WEBORA CMS</small>
            </div>
            <button
              class="logout-icon"
              title="Sign out"
              (click)="logout()"
            >
              ↗
            </button>
          </div>
        </aside>

        <main class="main-content">
          <header class="topbar">
            <button
              class="mobile-menu"
              (click)="mobileMenu = !mobileMenu"
            >
              ☰
            </button>

            <div>
              <p class="eyebrow">WEBORA / WORKSPACE</p>
              <h1>
                {{
                  view === 'overview' ? 'Overview' :
                  view === 'projects' ? 'Projects' :
                  view === 'skills' ? 'Skills' :
                  view === 'services' ? 'Services' :
                  view === 'profile' ? 'Profile' :
                  view === 'testimonials' ? 'Testimonials' :
                  view === 'inquiries' ? 'Inquiries' :
                  'Project editor'
                }}
              </h1>
            </div>

            <div class="topbar-right">
              <span class="online-dot"></span>
              <span>System connected</span>
              <div class="top-avatar">W</div>
            </div>
          </header>

          @if (error) {
            <div class="alert error">{{ error }}</div>
          }

          @if (success) {
            <div class="alert success">{{ success }}</div>
          }

          @if (view === 'overview') {
            <section class="welcome">
              <div>
                <p class="eyebrow">YOUR CONTROL ROOM</p>
                <h2>Build something<br />remarkable.</h2>
                <p>
                  Manage the work and content that powers the WEBORA website.
                </p>
                <button class="primary" (click)="openNewProject()">
                  ＋ Add a project
                </button>
              </div>
              <div class="welcome-symbol">✳</div>
            </section>

            <section class="stats-grid">
              <article class="stat-card">
                <span>TOTAL PROJECTS</span>
                <strong>{{ projects.length }}</strong>
                <small>{{ publishedCount }} published · {{ draftCount }} drafts</small>
              </article>

              <article class="stat-card">
                <span>FEATURED PROJECTS</span>
                <strong>{{ featuredCount }}</strong>
                <small>Highlighted projects</small>
              </article>

              <article class="stat-card">
                <span>TOTAL SKILLS</span>
                <strong>{{ skills.length }}</strong>
                <small>{{ publishedSkillsCount }} published</small>
              </article>

              <article class="stat-card">
                <span>TOTAL SERVICES</span>
                <strong>{{ services.length }}</strong>
                <small>{{ publishedServicesCount }} published</small>
              </article>

              <article class="stat-card">
                <span>TESTIMONIALS</span>
                <strong>{{ testimonials.length }}</strong>
                <small>{{ publishedTestimonialsCount }} published</small>
              </article>

              <article class="stat-card">
                <span>TOTAL INQUIRIES</span>
                <strong>{{ inquiries.length }}</strong>
                <small>{{ newInquiriesCount }} awaiting attention</small>
              </article>
            </section>

            <section class="section-heading">
              <div>
                <p class="eyebrow">CONTENT MANAGEMENT</p>
                <h2>Recent projects</h2>
              </div>
              <button
                class="secondary"
                (click)="navigate('projects')"
              >
                View all projects →
              </button>
            </section>

            @if (loading) {
              <div class="empty-state">Loading projects...</div>
            } @else if (projects.length === 0) {
              <div class="empty-state">
                No projects yet. Add your first project to get started.
              </div>
            } @else {
              <div class="project-list">
                @for (project of projects.slice(0, 5); track project.id) {
                  <div class="project-row">
                    <div class="project-thumb">
                      @if (project.thumbnailUrl) {
                        <img
                          [src]="assetUrl(project.thumbnailUrl)"
                          [alt]="project.title"
                        />
                      } @else {
                        <span>◇</span>
                      }
                    </div>

                    <div class="project-info">
                      <strong>{{ project.title }}</strong>
                      <small>{{ project.category || 'Uncategorized' }}</small>
                    </div>

                    <span
                      class="status"
                      [class.published]="project.status === 'PUBLISHED'"
                    >
                      {{ project.status }}
                    </span>

                    <button
                      class="text-button"
                      (click)="editProject(project)"
                    >
                      Edit
                    </button>
                  </div>
                }
              </div>
            }
          }

          <section class="section-heading">
  <div>
    <p class="eyebrow">COMMUNICATION</p>
    <h2>Recent inquiries</h2>
  </div>

  <button
    class="secondary"
    (click)="navigate('inquiries')"
  >
    View all inquiries →
  </button>
</section>

@if (inquiries.length === 0) {
  <div class="empty-state">
    No inquiries received yet. Messages submitted through your contact form
    will appear here.
  </div>
} @else {
  <div class="project-list">
    @for (item of recentInquiries; track item.id) {
      <div class="project-row">
        <div class="project-thumb">
          <span>✉</span>
        </div>

        <div class="project-info">
          <strong>{{ item.name }}</strong>
          <small>
            {{ item.subject || item.email }}
          </small>
        </div>

        <span
          class="status"
          [class.published]="item.status === 'REPLIED'"
        >
          {{ item.status }}
        </span>

        <button
          class="text-button"
          (click)="navigate('inquiries')"
        >
          View
        </button>
      </div>
    }
  </div>
}


          @if (view === 'projects') {
            <section class="section-heading project-toolbar">
              <div>
                <p class="eyebrow">YOUR PORTFOLIO CONTENT</p>
                <h2>All projects</h2>
                <p class="muted">
                  Create, edit and publish the projects displayed on your website.
                </p>
              </div>

              <button class="primary" (click)="openNewProject()">
                ＋ New project
              </button>
            </section>

            <div class="filter-bar">
              <input
                type="search"
                placeholder="Search projects..."
                [(ngModel)]="searchTerm"
                name="search"
              />

              <select
                [(ngModel)]="statusFilter"
                name="statusFilter"
              >
                <option value="ALL">All statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Drafts</option>
              </select>

              <button class="secondary" (click)="loadProjects()">
                ↻ Refresh
              </button>
            </div>

            @if (loading) {
              <div class="empty-state">Loading projects...</div>
            } @else if (filteredProjects.length === 0) {
              <div class="empty-state">
                No matching projects found.
                <button
                  class="text-button"
                  (click)="openNewProject()"
                >
                  Create a project
                </button>
              </div>
            } @else {
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>PROJECT</th>
                      <th>CATEGORY</th>
                      <th>STATUS</th>
                      <th>FEATURED</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    @for (project of filteredProjects; track project.id) {
                      <tr>
                        <td>
                          <div class="table-project">
                            <div class="project-thumb small-thumb">
                              @if (project.thumbnailUrl) {
                                <img
                                  [src]="assetUrl(project.thumbnailUrl)"
                                  [alt]="project.title"
                                />
                              } @else {
                                ◇
                              }
                            </div>

                            <div>
                              <strong>{{ project.title }}</strong>
                              <small>{{ project.slug }}</small>
                            </div>
                          </div>
                        </td>

                        <td>{{ project.category || '—' }}</td>

                        <td>
                          <span
                            class="status"
                            [class.published]="project.status === 'PUBLISHED'"
                          >
                            {{ project.status }}
                          </span>
                        </td>

                        <td>{{ project.featured ? 'Yes' : 'No' }}</td>

                        <td>
                          <div class="actions">
                            <button
                              class="text-button"
                              (click)="editProject(project)"
                            >
                              Edit
                            </button>

                            <button
                              class="text-button"
                              (click)="toggleStatus(project)"
                            >
                              {{
                                project.status === 'PUBLISHED'
                                  ? 'Unpublish'
                                  : 'Publish'
                              }}
                            </button>

                            <button
                              class="danger-button"
                              (click)="deleteProject(project)"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <p class="result-count">
                Showing {{ filteredProjects.length }} of
                {{ projects.length }} projects
              </p>
            }
          }

          @if (view === 'editor') {
            <section class="editor-heading">
              <div>
                <p class="eyebrow">PROJECT MANAGEMENT</p>
                <h2>{{ editingId ? 'Edit project' : 'Create project' }}</h2>
                <p class="muted">
                  Enter the project details that will appear on your portfolio.
                </p>
              </div>

              <button
                class="secondary"
                (click)="navigate('projects')"
              >
                ← Back to projects
              </button>
            </section>

            <form class="editor-form" (ngSubmit)="saveProject()">
              <div class="form-panel">
                <h3>Basic information</h3>

                <div class="form-grid">
                  <div class="field">
                    <label>Project title *</label>
                    <input
                      name="title"
                      [(ngModel)]="form.title"
                      required
                      maxlength="160"
                      placeholder="e.g. Portfolio CMS"
                    />
                  </div>

                  <div class="field">
                    <label>URL slug *</label>
                    <input
                      name="slug"
                      [(ngModel)]="form.slug"
                      required
                      maxlength="180"
                      placeholder="portfolio-cms"
                    />
                  </div>

                  <div class="field full-field">
                    <label>Short description *</label>
                    <textarea
                      name="shortDescription"
                      [(ngModel)]="form.shortDescription"
                      required
                      maxlength="320"
                      rows="2"
                      placeholder="A short summary of this project"
                    ></textarea>
                  </div>

                  <div class="field full-field">
                    <label>Full description</label>
                    <textarea
                      name="fullDescription"
                      [(ngModel)]="form.fullDescription"
                      rows="5"
                      placeholder="Describe the project, its purpose and implementation..."
                    ></textarea>
                  </div>

                  <div class="field">
                    <label>Category</label>
                    <input
                      name="category"
                      [(ngModel)]="form.category"
                      placeholder="Full Stack Development"
                    />
                  </div>

                  <div class="field">
                    <label>Technologies</label>
                    <input
                      name="technologies"
                      [(ngModel)]="technologyText"
                      placeholder="Java, React, SQL Server"
                    />
                    <small>Separate technologies with commas.</small>
                  </div>
                </div>
              </div>

              <div class="form-panel">
                <h3>Project image</h3>

                <div class="image-upload-layout">
                  <div class="image-preview">
                    @if (imagePreview || form.thumbnailUrl) {
                      <img
                        [src]="imagePreview || assetUrl(form.thumbnailUrl)"
                        alt="Project preview"
                      />
                    } @else {
                      <div class="preview-placeholder">
                        ◇
                        <small>Image preview</small>
                      </div>
                    }
                  </div>

                  <div class="upload-controls">
                    <label>Thumbnail image</label>

                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                      (change)="onFileSelected($event)"
                    />

                    <button
                      type="button"
                      class="secondary"
                      (click)="uploadImage()"
                      [disabled]="!selectedFile || uploading"
                    >
                      {{ uploading ? 'Uploading...' : 'Upload selected image' }}
                    </button>

                    <small>PNG, JPG or WEBP. Maximum size: 5 MB.</small>

                    <label>Or image URL</label>

                    <input
                      name="thumbnailUrl"
                      [(ngModel)]="form.thumbnailUrl"
                      (ngModelChange)="imagePreview = ''"
                      placeholder="https://... or /api/public/uploads/..."
                    />
                  </div>
                </div>
              </div>

              <div class="form-panel">
                <h3>Links and timeline</h3>

                <div class="form-grid">
                  <div class="field">
                    <label>Live project URL</label>
                    <input
                      name="liveUrl"
                      [(ngModel)]="form.liveUrl"
                      placeholder="https://..."
                    />
                  </div>

                  <div class="field">
                    <label>GitHub URL</label>
                    <input
                      name="githubUrl"
                      [(ngModel)]="form.githubUrl"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div class="field">
                    <label>Start date</label>
                    <input
                      type="date"
                      name="startDate"
                      [(ngModel)]="form.startDate"
                    />
                  </div>

                  <div class="field">
                    <label>Completion date</label>
                    <input
                      type="date"
                      name="completionDate"
                      [(ngModel)]="form.completionDate"
                    />
                  </div>
                </div>
              </div>

              <div class="form-panel">
                <h3>Publishing settings</h3>

                <div class="form-grid">
                  <div class="field">
                    <label>Publication status</label>
                    <select
                      name="status"
                      [(ngModel)]="form.status"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>

                  <label class="check-field">
                    <input
                      type="checkbox"
                      name="featured"
                      [(ngModel)]="form.featured"
                    />
                    <span>Feature this project on the homepage</span>
                  </label>
                </div>
              </div>

              @if (error) {
                <div class="alert error">{{ error }}</div>
              }

              <div class="form-actions">
                <button
                  type="button"
                  class="secondary"
                  (click)="navigate('projects')"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="primary"
                  [disabled]="busy"
                >
                  {{
                    busy ? 'Saving...' :
                    editingId ? 'Save changes' :
                    'Create project'
                  }}
                </button>
              </div>
            </form>
          }

          @if (view === 'skills') {
            <section class="section-heading project-toolbar">
              <div>
                <p class="eyebrow">WEBSITE CONTENT</p>
                <h2>Manage skills</h2>
                <p class="muted">
                  Add and manage the skills displayed on your website.
                </p>
              </div>

              <button class="primary" (click)="openNewSkill()">
                ＋ Add skill
              </button>
            </section>

            <div class="filter-bar">
              <input
                type="search"
                placeholder="Search skills..."
                [(ngModel)]="skillSearchTerm"
                name="skillSearch"
              />

              <button class="secondary" (click)="loadSkills()">
                ↻ Refresh
              </button>
            </div>

            <div class="form-panel content-editor">
              <h3>Bulk import skills</h3>
              <p class="muted">
                Paste CSV data with columns:
                name, category, proficiency, displayOrder, published
              </p>

              <textarea
                name="skillBulkText"
                [(ngModel)]="skillBulkText"
                rows="6"
                placeholder="name,category,proficiency,displayOrder,published&#10;Java,Programming,70,1,true&#10;React,Frontend,65,2,true&#10;SQL,Database,70,3,false"
              ></textarea>

              <div class="form-actions">
                <button
                  class="secondary"
                  type="button"
                  (click)="skillBulkText = ''"
                >
                  Clear
                </button>

                <button
                  class="primary"
                  type="button"
                  (click)="importSkills()"
                  [disabled]="bulkImporting || !skillBulkText.trim()"
                >
                  {{ bulkImporting ? 'Importing...' : 'Import skills' }}
                </button>
              </div>
            </div>

            
                        @if (contentLoading) {
              <div class="empty-state">Loading skills...</div>
            } @else if (filteredSkills.length === 0) {
              <div class="empty-state">
                No skills found.
                <button
                  class="text-button"
                  (click)="openNewSkill()"
                >
                  Add a skill
                </button>
              </div>
            } @else {
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>SKILL</th>
                      <th>CATEGORY</th>
                      <th>PROFICIENCY</th>
                      <th>ORDER</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    @for (skill of filteredSkills; track skill.id) {
                      <tr>
                        <td><strong>{{ skill.name }}</strong></td>
                        <td>{{ skill.category || '—' }}</td>
                        <td>
                          {{
                            skill.proficiency == null
                              ? '—'
                              : skill.proficiency + '%'
                          }}
                        </td>
                        <td>{{ skill.displayOrder }}</td>

                        <td>
                          <span
                            class="status"
                            [class.published]="skill.published"
                          >
                            {{ skill.published ? 'PUBLISHED' : 'DRAFT' }}
                          </span>
                        </td>

                        <td>
                          <div class="actions">
                            <button
                              class="text-button"
                              (click)="editSkill(skill)"
                            >
                              Edit
                            </button>

                            <button
                              class="text-button"
                              (click)="toggleSkillStatus(skill)"
                            >
                              {{ skill.published ? 'Unpublish' : 'Publish' }}
                            </button>

                            <button
                              class="danger-button"
                              (click)="deleteSkill(skill)"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            @if (showSkillForm) {
              <div class="form-panel content-editor">
                <h3>
                  {{ editingSkillId ? 'Edit skill' : 'Add new skill' }}
                </h3>

                <form (ngSubmit)="saveSkill()">
                  <div class="form-grid">
                    <div class="field">
                      <label>Skill name *</label>
                      <input
                        name="skillName"
                        [(ngModel)]="skillForm.name"
                        required
                        maxlength="120"
                        placeholder="e.g. React"
                      />
                    </div>

                    <div class="field">
                      <label>Category</label>
                      <input
                        name="skillCategory"
                        [(ngModel)]="skillForm.category"
                        maxlength="120"
                        placeholder="e.g. Frontend"
                      />
                    </div>

                    <div class="field">
                      <label>Proficiency (0–100)</label>
                      <input
                        type="number"
                        name="skillProficiency"
                        [(ngModel)]="skillForm.proficiency"
                        min="0"
                        max="100"
                        placeholder="Optional"
                      />
                    </div>

                    <div class="field">
                      <label>Display order</label>
                      <input
                        type="number"
                        name="skillOrder"
                        [(ngModel)]="skillForm.displayOrder"
                      />
                    </div>

                    <label class="check-field">
                      <input
                        type="checkbox"
                        name="skillPublished"
                        [(ngModel)]="skillForm.published"
                      />
                      <span>Publish this skill on the website</span>
                    </label>
                  </div>

                  <div class="form-actions">
                    <button
                      type="button"
                      class="secondary"
                      (click)="cancelSkillForm()"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      class="primary"
                      [disabled]="busy"
                    >
                      {{
                        busy ? 'Saving...' :
                        editingSkillId ? 'Save changes' :
                        'Add skill'
                      }}
                    </button>
                  </div>
                </form>
              </div>
            }
          }

          @if (view === 'services') {
            <section class="section-heading project-toolbar">
              <div>
                <p class="eyebrow">WEBSITE CONTENT</p>
                <h2>Manage services</h2>
                <p class="muted">
                  Manage the services displayed on your website.
                </p>
              </div>

              <button
                type="button"
                class="primary"
                (click)="openNewService()"
              >
                + Add service
              </button>
            </section>

            <div class="filter-bar">
              <input
                type="search"
                placeholder="Search services..."
                [(ngModel)]="serviceSearchTerm"
                name="serviceSearch"
              />

              <button class="secondary" (click)="loadServices()">
                ↻ Refresh
              </button>
            </div>

            <div class="form-panel content-editor">
              <h3>Bulk import services</h3>
              <p class="muted">
                Paste CSV data with columns:
                title, description, icon, displayOrder, published
              </p>

              <textarea
  class="bulk-import-textarea"
  name="serviceBulkText"
  [(ngModel)]="serviceBulkText"
  rows="7"
  placeholder="title,description,icon,displayOrder,published&#10;Web Development,Building responsive websites,Code2,1,true&#10;Backend Development,Building REST APIs,Server,2,true"
></textarea>

              <div class="form-actions">
                <button
                  class="secondary"
                  type="button"
                  (click)="serviceBulkText = ''"
                >
                  Clear
                </button>

                <button
                  class="primary"
                  type="button"
                  (click)="importServices()"
                  [disabled]="bulkImporting || !serviceBulkText.trim()"
                >
                  {{ bulkImporting ? 'Importing...' : 'Import services' }}
                </button>
              </div>
            </div>

            @if (contentLoading) {
  <div class="empty-state">Loading services...</div>
} @else if (filteredServices.length === 0) {
  <div class="empty-state">
    No services found.
    <button class="text-button" (click)="openNewService()">
      Add a service
    </button>
  </div>
} @else {
  <div class="table-wrap">
    <table class="services-table">
      <thead>
        <tr>
          <th>SERVICE DETAILS</th>
          <th>ICON</th>
          <th>ORDER</th>
          <th>STATUS</th>
          <th>ACTIONS</th>
        </tr>
      </thead>

      <tbody>
        @for (service of filteredServices; track service.id) {
          <tr>
            <td class="service-details-cell">
              <div class="service-info">
                <strong class="service-title">
                  {{ service.title }}
                </strong>
                <p class="service-description">
                  {{ service.description }}
                </p>
              </div>
            </td>

            <td>
              <span class="service-icon-label">
                {{ service.icon || '—' }}
              </span>
            </td>

            <td>
              <span class="service-order">
                {{ service.displayOrder }}
              </span>
            </td>

            <td>
              <span
                class="status"
                [class.published]="service.published"
              >
                {{ service.published ? 'PUBLISHED' : 'DRAFT' }}
              </span>
            </td>

            <td>
              <div class="actions service-actions">
                <button
                  type="button"
                  class="text-button"
                  (click)="editService(service)"
                >
                  Edit
                </button>

                <button
                  class="text-button"
                  (click)="toggleServiceStatus(service)"
                >
                  {{ service.published ? 'Unpublish' : 'Publish' }}
                </button>

                <button
                  class="danger-button"
                  (click)="deleteService(service)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
}

@if (showServiceForm) {
  <div
  #serviceEditor
  class="form-panel content-editor service-editor"
>
    <div class="service-editor-heading">
      <div>
        <h3>
          {{ editingServiceId ? 'Edit service' : 'Add new service' }}
        </h3>
        <p class="muted">
          Define the service details displayed on your portfolio.
        </p>
      </div>
    </div>

    <form (ngSubmit)="saveService()">
      <div class="form-grid">
        <div class="field full-field">
          <label>Service title *</label>
          <input
            name="serviceTitle"
            [(ngModel)]="serviceForm.title"
            required
            maxlength="160"
            placeholder="e.g. Web Development"
          />
        </div>

        <div class="field full-field">
          <label>Description *</label>
          <textarea
            name="serviceDescription"
            [(ngModel)]="serviceForm.description"
            required
            rows="4"
            placeholder="Describe what this service includes..."
          ></textarea>
        </div>

        <div class="field">
          <label>Icon identifier</label>
          <input
            name="serviceIcon"
            [(ngModel)]="serviceForm.icon"
            maxlength="100"
            placeholder="e.g. Code2, Wrench, Workflow"
          />
          <small>
            Use a supported icon identifier or leave blank.
          </small>
        </div>

        <div class="field">
          <label>Display order</label>
          <input
            type="number"
            name="serviceOrder"
            [(ngModel)]="serviceForm.displayOrder"
          />
        </div>

        <label class="check-field">
          <input
            type="checkbox"
            name="servicePublished"
            [(ngModel)]="serviceForm.published"
          />
          <span>Publish this service on the website</span>
        </label>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="secondary"
          (click)="cancelServiceForm()"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="primary"
          [disabled]="busy"
        >
          {{
            busy ? 'Saving...' :
            editingServiceId ? 'Save changes' :
            'Add service'
          }}
        </button>
      </div>
    </form>
  </div>
}
          }
          @if (view === 'profile') {
  <section class="section-heading">
    <div>
      <p class="eyebrow">WEBSITE CONTENT</p>
      <h2>Manage your profile</h2>
      <p class="muted">
        Update the information displayed across your portfolio.
      </p>
    </div>
  </section>

  @if (contentLoading) {
    <div class="empty-state">Loading profile...</div>
  } @else {
    <div class="form-panel content-editor">
      <form (ngSubmit)="saveProfile()">

        <h3>Basic information</h3>

        <div class="form-grid">
          <div class="field">
            <label>Full name *</label>
            <input
              name="profileName"
              [(ngModel)]="profileForm.name"
              required
              maxlength="160"
              placeholder="Your name"
            />
          </div>

          <div class="field">
            <label>Professional headline</label>
            <input
              name="profileHeadline"
              [(ngModel)]="profileForm.headline"
              maxlength="255"
              placeholder="e.g. Junior Software Engineer"
            />
          </div>

          <div class="field full-field">
            <label>About / Bio</label>
            <textarea
              name="profileBio"
              [(ngModel)]="profileForm.bio"
              rows="6"
              placeholder="Write a short professional introduction..."
            ></textarea>
          </div>

          <div class="field">
            <label>Location</label>
            <input
              name="profileLocation"
              [(ngModel)]="profileForm.location"
              placeholder="Your location"
            />
          </div>
        </div>

        <h3>Contact information</h3>

        <div class="form-grid">
          <div class="field">
            <label>Email</label>
            <input
              type="email"
              name="profileEmail"
              [(ngModel)]="profileForm.email"
              placeholder="you@example.com"
            />
          </div>

          <div class="field">
            <label>Phone</label>
            <input
              name="profilePhone"
              [(ngModel)]="profileForm.phone"
              maxlength="50"
              placeholder="Your contact number"
            />
          </div>
        </div>

        <h3>Profile links</h3>

        <div class="form-grid">
          <div class="field full-field">
            <label>Profile image URL</label>
            <input
              name="profileAvatar"
              [(ngModel)]="profileForm.avatarUrl"
              placeholder="https://..."
            />
          </div>

          <div class="field full-field">
            <label>Resume URL</label>
            <input
              name="profileResume"
              [(ngModel)]="profileForm.resumeUrl"
              placeholder="https://..."
            />
          </div>

          <div class="field">
            <label>GitHub URL</label>
            <input
              name="profileGithub"
              [(ngModel)]="profileForm.githubUrl"
              placeholder="https://github.com/..."
            />
          </div>

          <div class="field">
            <label>LinkedIn URL</label>
            <input
              name="profileLinkedin"
              [(ngModel)]="profileForm.linkedinUrl"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div class="field full-field">
            <label>Personal website URL</label>
            <input
              name="profileWebsite"
              [(ngModel)]="profileForm.websiteUrl"
              placeholder="https://..."
            />
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="primary"
            [disabled]="busy"
          >
            {{ busy ? 'Saving...' : 'Save profile' }}
          </button>
        </div>
      </form>
    </div>
  }
}

@if (view === 'testimonials') {
  <section class="section-heading">
    <div>
      <p class="eyebrow">WEBSITE CONTENT</p>
      <h2>Manage testimonials</h2>
      <p class="muted">Manage feedback shared by your clients and collaborators.</p>
    </div>

    <button
      class="primary"
      type="button"
      (click)="startTestimonialCreate()"
    >
      Add testimonial
    </button>
  </section>

  @if (showTestimonialForm) {
    <div class="form-panel content-editor">
      <h3>{{ editingTestimonialId ? 'Edit testimonial' : 'New testimonial' }}</h3>

      <form (ngSubmit)="saveTestimonial()">
        <div class="form-grid">
          <div class="field">
            <label>Name *</label>
            <input
              name="testimonialName"
              [(ngModel)]="testimonialForm.name"
              required
              maxlength="160"
              placeholder="Person's name"
            />
          </div>

          <div class="field">
            <label>Role</label>
            <input
              name="testimonialRole"
              [(ngModel)]="testimonialForm.role"
              maxlength="160"
              placeholder="e.g. Product Manager"
            />
          </div>

          <div class="field">
            <label>Company</label>
            <input
              name="testimonialCompany"
              [(ngModel)]="testimonialForm.company"
              maxlength="160"
              placeholder="Company name"
            />
          </div>

          <div class="field">
            <label>Display order</label>
            <input
              type="number"
              name="testimonialOrder"
              [(ngModel)]="testimonialForm.displayOrder"
              required
            />
          </div>

          <div class="field full-field">
            <label>Testimonial *</label>
            <textarea
              name="testimonialContent"
              [(ngModel)]="testimonialForm.content"
              rows="5"
              required
              placeholder="Enter the actual feedback..."
            ></textarea>
          </div>

          <div class="field full-field">
            <label>Avatar image URL</label>
            <input
              name="testimonialAvatar"
              [(ngModel)]="testimonialForm.avatarUrl"
              placeholder="https://..."
            />
          </div>

          <div class="field full-field">
            <label>
              <input
                type="checkbox"
                name="testimonialPublished"
                [(ngModel)]="testimonialForm.published"
              />
              Publish testimonial
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button class="secondary" type="button" (click)="cancelTestimonialEdit()">
            Cancel
          </button>

          <button class="primary" type="submit" [disabled]="busy">
            {{ busy ? 'Saving...' : 'Save testimonial' }}
          </button>
        </div>
      </form>
    </div>
  }

  <div class="filter-bar">
    <input
      name="testimonialSearch"
      [(ngModel)]="testimonialSearchTerm"
      placeholder="Search testimonials..."
    />

    <select name="testimonialFilter" [(ngModel)]="testimonialFilter">
      <option value="ALL">All testimonials</option>
      <option value="PUBLISHED">Published</option>
      <option value="DRAFT">Unpublished</option>
    </select>
  </div>


@if (contentLoading) {
  <div class="empty-state">Loading testimonials...</div>
} @else if (filteredTestimonials.length === 0) {
  <div class="empty-state">
    <h3>No testimonials found</h3>
    <p>Add genuine feedback or adjust your search filters.</p>
  </div>
} @else {
  <div class="testimonial-list">
    @for (item of filteredTestimonials; track item.id) {
      <article class="testimonial-card">

        <div class="testimonial-card-main">

          <div class="testimonial-quote-icon">
            <span>“</span>
          </div>

          <h3>{{ item.name }}</h3>

          <p class="muted">
            {{ item.role || 'No role specified' }}
            {{ item.company ? ' · ' + item.company : '' }}
          </p>

          <p class="testimonial-content">
            {{ item.content }}
          </p>

          <small class="testimonial-order">
            Display order: {{ item.displayOrder }}
          </small>

        </div>

        <div class="testimonial-card-actions">

          <span
            class="status-badge"
            [class.published]="item.published"
          >
            {{ item.published ? 'Published' : 'Draft' }}
          </span>

          <button
            class="secondary"
            type="button"
            (click)="editTestimonial(item)"
          >
            Edit
          </button>

          <button
            class="secondary"
            type="button"
            (click)="toggleTestimonialStatus(item)"
          >
            {{ item.published ? 'Unpublish' : 'Publish' }}
          </button>

          <button
            class="danger"
            type="button"
            (click)="deleteTestimonial(item)"
          >
            Delete
          </button>

        </div>

      </article>
    }
  </div>
}
}

@if (view === 'inquiries') {
  <section class="inquiry-page">

    <div class="inquiry-toolbar">
      <input
        type="text"
        [(ngModel)]="inquirySearchTerm"
        placeholder="Search by name, email or subject..."
      />

      <select [(ngModel)]="inquiryFilter">
        <option value="ALL">All inquiries</option>
        <option value="NEW">New</option>
        <option value="READ">Read</option>
        <option value="REPLIED">Replied</option>
      </select>
    </div>

    <div class="inquiry-summary">
      <div class="inquiry-stat">
        <span>Total</span>
        <strong>{{ inquiries.length }}</strong>
      </div>
      <div class="inquiry-stat">
        <span>New</span>
        <strong>{{ newInquiriesCount }}</strong>
      </div>
      <div class="inquiry-stat">
        <span>Read</span>
        <strong>{{ readInquiriesCount }}</strong>
      </div>
      <div class="inquiry-stat">
        <span>Replied</span>
        <strong>{{ repliedInquiriesCount }}</strong>
      </div>
    </div>

    @if (contentLoading) {
      <div class="empty-state">Loading inquiries...</div>
    } @else if (filteredInquiries.length === 0) {
      <div class="empty-state">
        <h3>No inquiries found</h3>
        <p>Messages submitted through your portfolio contact form will appear here.</p>
      </div>
    } @else {
      <div class="inquiry-list">

        @for (item of filteredInquiries; track item.id) {
          <article
            class="inquiry-card"
            [class.inquiry-selected]="selectedInquiryId === item.id"
          >

            <div class="inquiry-card-header">
              <div>
                <h3>{{ item.name }}</h3>
                <a [href]="'mailto:' + item.email">
                  {{ item.email }}
                </a>
              </div>

              <span
                class="inquiry-status"
                [class.status-new]="item.status === 'NEW'"
                [class.status-read]="item.status === 'READ'"
                [class.status-replied]="item.status === 'REPLIED'"
              >
                {{ item.status }}
              </span>
            </div>

            <h4>{{ item.subject || 'No subject' }}</h4>

            <p class="inquiry-message">
              {{ item.message }}
            </p>

            <small class="inquiry-date">
              Received: {{ item.createdAt | date:'medium' }}
            </small>

            <div class="inquiry-actions">

              <button
                class="secondary"
                type="button"
                (click)="selectedInquiryId = selectedInquiryId === item.id ? '' : item.id"
              >
                {{ selectedInquiryId === item.id ? 'Hide details' : 'Details' }}
              </button>

              @if (item.status !== 'NEW') {
                <button
                  class="secondary"
                  type="button"
                  (click)="updateInquiryStatus(item, 'NEW')"
                >
                  Mark new
                </button>
              }

              @if (item.status !== 'READ') {
                <button
                  class="secondary"
                  type="button"
                  (click)="updateInquiryStatus(item, 'READ')"
                >
                  Mark read
                </button>
              }

              @if (item.status !== 'REPLIED') {
                <button
                  class="secondary"
                  type="button"
                  (click)="updateInquiryStatus(item, 'REPLIED')"
                >
                  Mark replied
                </button>
              }

              <a class="inquiry-reply" [href]="'mailto:' + item.email">
                Reply by email ↗
              </a>

              <button
                class="danger"
                type="button"
                (click)="deleteInquiry(item)"
              >
                Delete
              </button>

            </div>

            @if (selectedInquiryId === item.id) {
              <div class="inquiry-details">
                <span>Full message</span>
                <p>{{ item.message }}</p>
                <small>Last updated: {{ item.updatedAt | date:'medium' }}</small>
              </div>
            }

          </article>
        }

      </div>
    }

  </section>
}
          <footer class="footer">
            WEBORA CMS · Private administration workspace
          </footer>
        </main>
      </div>
    }
  `, styleUrl: './app.component.css'
})
export class AppComponent {

  @ViewChild('serviceEditor')
  serviceEditor?: ElementRef<HTMLElement>;
  token = localStorage.getItem('webora_admin_token') || '';

  email = '';
  password = '';

  view:
  | 'overview'
  | 'projects'
  | 'editor'
  | 'skills'
  | 'services'
  | 'profile'
  | 'testimonials'
  | 'inquiries' = 'overview';

  mobileMenu = false;

  projects: Project[] = [];
  skills: Skill[] = [];
  services: ServiceItem[] = [];
  profileForm: SiteProfile = this.emptyProfile();
  testimonials: Testimonial[] = [];
  inquiries: Inquiry[] = [];
  inquirySearchTerm = '';
  inquiryFilter = 'ALL';
  selectedInquiryId = '';

testimonialForm: Testimonial = this.emptyTestimonial();

showTestimonialForm = false;
editingTestimonialId = '';
testimonialSearchTerm = '';
testimonialFilter = 'ALL';

  loading = false;
  contentLoading = false;
  busy = false;
  uploading = false;

  error = '';
  success = '';

  searchTerm = '';
  statusFilter = 'ALL';

  skillSearchTerm = '';
  serviceSearchTerm = '';

  editingId = '';
  editingSkillId = '';
  editingServiceId = '';

  selectedFile: File | null = null;
  imagePreview = '';
  technologyText = '';

  showSkillForm = false;
  showServiceForm = false;

  skillBulkText = '';
  serviceBulkText = '';
  bulkImporting = false;

  form: Project = this.emptyProject();
  skillForm: Skill = this.emptySkill();
  serviceForm: ServiceItem = this.emptyService();

  constructor(private http: HttpClient) {
  if (this.token) {
    this.loadOverviewData();
  }
}
loadOverviewData(): void {
  if (!this.token) return;

  this.loadProjects();
  this.loadSkills();
  this.loadServices();
  this.loadTestimonials();
  this.loadInquiries();
}

  get publishedCount(): number {
    return this.projects.filter(p => p.status === 'PUBLISHED').length;
  }

  get draftCount(): number {
    return this.projects.filter(p => p.status === 'DRAFT').length;
  }

  get featuredCount(): number {
    return this.projects.filter(p => p.featured).length;
  }

  get publishedSkillsCount(): number {
  return this.skills.filter(skill => skill.published).length;
}

get publishedServicesCount(): number {
  return this.services.filter(service => service.published).length;
}

get publishedTestimonialsCount(): number {
  return this.testimonials.filter(item => item.published).length;
}


get recentInquiries(): Inquiry[] {
  return [...this.inquiries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
}

  get filteredProjects(): Project[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.projects.filter(project => {
      const matchesSearch =
        !term ||
        project.title.toLowerCase().includes(term) ||
        project.slug.toLowerCase().includes(term) ||
        (project.category || '').toLowerCase().includes(term);

      const matchesStatus =
        this.statusFilter === 'ALL' ||
        project.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  get filteredSkills(): Skill[] {
    const term = this.skillSearchTerm.trim().toLowerCase();

    return this.skills.filter(skill =>
      !term ||
      skill.name.toLowerCase().includes(term) ||
      (skill.category || '').toLowerCase().includes(term)
    );
  }

  get filteredServices(): ServiceItem[] {
    const term = this.serviceSearchTerm.trim().toLowerCase();

    return this.services.filter(service =>
      !term ||
      service.title.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term)
    );
  }

  get newInquiriesCount(): number {
  return this.inquiries.filter(
    inquiry => inquiry.status === 'NEW'
  ).length;
}

get readInquiriesCount(): number {
  return this.inquiries.filter(
    inquiry => inquiry.status === 'READ'
  ).length;
}

get repliedInquiriesCount(): number {
  return this.inquiries.filter(
    inquiry => inquiry.status === 'REPLIED'
  ).length;
}


  private emptyProject(): Project {
    return {
      id: '',
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      category: '',
      thumbnailUrl: '',
      liveUrl: '',
      githubUrl: '',
      startDate: '',
      completionDate: '',
      featured: false,
      status: 'DRAFT',
      technologies: [],
      images: []
    };
  }

  private emptySkill(): Skill {
    return {
      id: '',
      name: '',
      category: '',
      proficiency: null,
      displayOrder: 0,
      published: false
    };
  }

  private emptyService(): ServiceItem {
    return {
      id: '',
      title: '',
      description: '',
      icon: '',
      displayOrder: 0,
      published: false
    };
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  }

  login(): void {
    this.error = '';
    this.busy = true;

    this.http.post<any>(`${API_URL}/auth/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: response => {
        if (!response?.accessToken) {
          this.error = 'Login response did not contain an access token.';
          this.busy = false;
          return;
        }

        this.token = response.accessToken;
        localStorage.setItem('webora_admin_token', this.token);
        this.password = '';
        this.busy = false;
        this.loadProjects();
      },
      error: err => {
        this.error = this.errorMessage(
          err,
          'Login failed. Check your credentials.'
        );
        this.busy = false;
      }
    });
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem('webora_admin_token');

    this.projects = [];
    this.skills = [];
    this.services = [];

    this.view = 'overview';
    this.error = '';
    this.success = '';

    this.showSkillForm = false;
    this.showServiceForm = false;
  }

  loadProjects(): void {
    if (!this.token) return;

    this.loading = true;
    this.error = '';

    this.http.get<ProjectPage>(
      `${API_URL}/admin/projects?page=0&size=100`,
      { headers: this.authHeaders() }
    ).subscribe({
      next: response => {
        this.projects = response.content || [];
        this.loading = false;
      },
      error: err => {
        this.loading = false;

        if (err.status === 401 || err.status === 403) {
          this.logout();
          this.error =
            'Your session expired or access was denied. Please sign in again.';
        } else {
          this.error = this.errorMessage(err, 'Could not load projects.');
        }
      }
    });
  }

  navigate(
  view:
    | 'overview'
    | 'projects'
    | 'editor'
    | 'skills'
    | 'services'
    | 'profile'
    | 'testimonials'
    | 'inquiries'
): void {
    this.view = view;
    this.mobileMenu = false;
    this.error = '';
    this.success = '';

    if (view === 'projects') {
      this.loadProjects();
    }

    if (view === 'overview') {
      this.loadOverviewData();
    }

    if (view === 'skills') {
      this.showSkillForm = false;
      this.loadSkills();
    }

    if (view === 'services') {
      this.showServiceForm = false;
      this.loadServices();
    }
    if (view === 'profile') {
      this.loadProfile();
    }

    if (view === 'testimonials') {
      this.showTestimonialForm = false;
      this.loadTestimonials();
    }
    if (view === 'inquiries') {
      this.selectedInquiryId = '';
      this.loadInquiries();
    }
  }

  // PROJECT MANAGEMENT

  openNewProject(): void {
    this.editingId = '';
    this.form = this.emptyProject();
    this.technologyText = '';
    this.selectedFile = null;
    this.imagePreview = '';
    this.error = '';
    this.success = '';
    this.view = 'editor';
  }

  editProject(project: Project): void {
    this.editingId = project.id;
    this.form = { ...project };
    this.technologyText = (project.technologies || []).join(', ');
    this.selectedFile = null;
    this.imagePreview = '';
    this.error = '';
    this.success = '';
    this.view = 'editor';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    this.error = '';
    this.selectedFile = null;
    this.imagePreview = '';

    if (!file) return;

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.error = 'Choose a PNG, JPG or WEBP image.';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.error = 'Image size must not exceed 5 MB.';
      input.value = '';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = String(reader.result || '');
    };

    reader.readAsDataURL(file);
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.error = '';
    this.success = '';

    const data = new FormData();
    data.append('file', this.selectedFile);

    this.http.post<any>(
      `${API_URL}/admin/uploads`,
      data,
      { headers: this.authHeaders() }
    ).subscribe({
      next: response => {
        this.form.thumbnailUrl = response.url;
        this.selectedFile = null;
        this.uploading = false;
        this.success =
          'Image uploaded. Save the project to keep this image linked.';
      },
      error: err => {
        this.uploading = false;
        this.error = this.errorMessage(err, 'Image upload failed.');
      }
    });
  }

  saveProject(): void {
    this.error = '';
    this.success = '';

    if (
      !this.form.title.trim() ||
      !this.form.slug.trim() ||
      !this.form.shortDescription.trim()
    ) {
      this.error = 'Title, slug and short description are required.';
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(this.form.slug)) {
      this.error =
        'Slug must use lowercase letters, numbers and hyphens only.';
      return;
    }

    const payload: any = {
      title: this.form.title.trim(),
      slug: this.form.slug.trim(),
      shortDescription: this.form.shortDescription.trim(),
      fullDescription: this.form.fullDescription || null,
      category: this.form.category || null,
      thumbnailUrl: this.form.thumbnailUrl || null,
      liveUrl: this.form.liveUrl || null,
      githubUrl: this.form.githubUrl || null,
      startDate: this.form.startDate || null,
      completionDate: this.form.completionDate || null,
      featured: this.form.featured,
      status: this.form.status,
      technologies: this.technologyText
        .split(',')
        .map(value => value.trim())
        .filter(Boolean)
    };

    this.busy = true;

    const request = this.editingId
      ? this.http.put<Project>(
          `${API_URL}/admin/projects/${this.editingId}`,
          payload,
          { headers: this.authHeaders() }
        )
      : this.http.post<Project>(
          `${API_URL}/admin/projects`,
          payload,
          { headers: this.authHeaders() }
        );

    request.subscribe({
      next: () => {
        this.busy = false;

        this.success = this.editingId
          ? 'Project updated successfully.'
          : 'Project created successfully.';

        this.view = 'projects';
        this.loadProjects();
      },
      error: err => {
        this.busy = false;
        this.error = this.errorMessage(err, 'Could not save the project.');
      }
    });
  }

  toggleStatus(project: Project): void {
    const newStatus: ProjectStatus =
      project.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

    if (
      !confirm(
        `${newStatus === 'PUBLISHED' ? 'Publish' : 'Unpublish'} "${project.title}"?`
      )
    ) {
      return;
    }

    this.http.patch<Project>(
      `${API_URL}/admin/projects/${project.id}/status`,
      { status: newStatus },
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        this.success =
          `Project ${newStatus.toLowerCase()} successfully.`;
        this.loadProjects();
      },
      error: err => {
        this.error = this.errorMessage(
          err,
          'Could not change project status.'
        );
      }
    });
  }

  deleteProject(project: Project): void {
    if (
      !confirm(
        `Permanently delete "${project.title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    this.http.delete(
      `${API_URL}/admin/projects/${project.id}`,
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        this.success = 'Project deleted successfully.';
        this.loadProjects();
      },
      error: err => {
        this.error = this.errorMessage(
          err,
          'Could not delete project.'
        );
      }
    });
  }

  // SKILLS MANAGEMENT

 loadSkills(): void {
  if (!this.token) {
    this.error = 'Please sign in to access skills.';
    return;
  }

  this.contentLoading = true;
  this.error = '';

  this.http.get<any>(
    `${API_URL}/admin/skills`,
    { headers: this.authHeaders() }
  ).subscribe({
    next: response => {
      this.skills = Array.isArray(response)
        ? response
        : Array.isArray(response?.content)
          ? response.content
          : [];

      this.contentLoading = false;
    },
    error: err => {
      this.contentLoading = false;

      if (err.status === 401 || err.status === 403) {
        this.logout();
        this.error = 'Your session expired or access was denied. Please sign in again.';
      } else {
        this.error = this.errorMessage(err, 'Could not load skills.');
      }
    }
  });
}

  openNewSkill(): void {
    this.editingSkillId = '';
    this.skillForm = this.emptySkill();
    this.showSkillForm = true;
    this.error = '';
    this.success = '';
  }

  editSkill(skill: Skill): void {
    this.editingSkillId = skill.id;
    this.skillForm = { ...skill };
    this.showSkillForm = true;
    this.error = '';
    this.success = '';
  }

  cancelSkillForm(): void {
    this.showSkillForm = false;
    this.editingSkillId = '';
    this.skillForm = this.emptySkill();
  }

  saveSkill(): void {
    this.error = '';
    this.success = '';

    if (!this.skillForm.name.trim()) {
      this.error = 'Skill name is required.';
      return;
    }

    const proficiency = this.skillForm.proficiency;

    if (
      proficiency !== null &&
      (proficiency < 0 || proficiency > 100)
    ) {
      this.error = 'Proficiency must be between 0 and 100.';
      return;
    }

    const payload = {
      name: this.skillForm.name.trim(),
      category: this.skillForm.category?.trim() || null,
      proficiency,
      displayOrder: Number(this.skillForm.displayOrder) || 0,
      published: this.skillForm.published
    };

    this.busy = true;

    const request = this.editingSkillId
      ? this.http.put<Skill>(
          `${API_URL}/admin/skills/${this.editingSkillId}`,
          payload,
          { headers: this.authHeaders() }
        )
      : this.http.post<Skill>(
          `${API_URL}/admin/skills`,
          payload,
          { headers: this.authHeaders() }
        );

    request.subscribe({
      next: () => {
        this.busy = false;

        this.success = this.editingSkillId
          ? 'Skill updated successfully.'
          : 'Skill created successfully.';

        this.cancelSkillForm();
        this.loadSkills();
      },
      error: err => {
        this.busy = false;
        this.error = this.errorMessage(err, 'Could not save the skill.');
      }
    });
  }

  toggleSkillStatus(skill: Skill): void {
    const published = !skill.published;

    const payload = {
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      displayOrder: skill.displayOrder,
      published
    };

    this.http.put(
      `${API_URL}/admin/skills/${skill.id}`,
      payload,
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        this.success =
          `Skill ${published ? 'published' : 'unpublished'} successfully.`;
        this.loadSkills();
      },
      error: err => {
        this.error = this.errorMessage(
          err,
          'Could not update skill status.'
        );
      }
    });
  }


  //added

  private scrollToServiceEditor(): void {
  setTimeout(() => {
    this.serviceEditor?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 100);
}


  deleteSkill(skill: Skill): void {
    if (!confirm(`Permanently delete skill "${skill.name}"?`)) {
      return;
    }

    this.http.delete(
      `${API_URL}/admin/skills/${skill.id}`,
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        this.success = 'Skill deleted successfully.';
        this.loadSkills();
      },
      error: err => {
        this.error = this.errorMessage(
          err,
          'Could not delete the skill.'
        );
      }
    });
  }

  // SERVICES MANAGEMENT

  loadServices(): void {
  if (!this.token) {
    this.error = 'Please sign in to access services.';
    return;
  }

  this.contentLoading = true;
  this.error = '';

  this.http.get<any>(
    `${API_URL}/admin/services`,
    { headers: this.authHeaders() }
  ).subscribe({
    next: response => {
      this.services = Array.isArray(response)
        ? response
        : Array.isArray(response?.content)
          ? response.content
          : [];

      this.contentLoading = false;
    },
    error: err => {
      this.contentLoading = false;

      if (err.status === 401 || err.status === 403) {
        this.logout();
        this.error = 'Your session expired or access was denied. Please sign in again.';
      } else {
        this.error = this.errorMessage(err, 'Could not load services.');
      }
    }
  });
}

  openNewService(): void {
  this.editingServiceId = '';
  this.serviceForm = this.emptyService();
  this.showServiceForm = true;
  this.error = '';
  this.success = '';

  this.scrollToServiceEditor();
}

editService(service: ServiceItem): void {
  this.editingServiceId = service.id;
  this.serviceForm = { ...service };
  this.showServiceForm = true;
  this.error = '';
  this.success = '';

  this.scrollToServiceEditor();
}

  cancelServiceForm(): void {
    this.showServiceForm = false;
    this.editingServiceId = '';
    this.serviceForm = this.emptyService();
  }

  saveService(): void {
    this.error = '';
    this.success = '';

    if (!this.serviceForm.title.trim()) {
      this.error = 'Service title is required.';
      return;
    }

    if (!this.serviceForm.description.trim()) {
      this.error = 'Service description is required.';
      return;
    }

    const payload = {
      title: this.serviceForm.title.trim(),
      description: this.serviceForm.description.trim(),
      icon: this.serviceForm.icon?.trim() || null,
      displayOrder: Number(this.serviceForm.displayOrder) || 0,
      published: this.serviceForm.published
    };

    this.busy = true;

    const request = this.editingServiceId
      ? this.http.put<ServiceItem>(
          `${API_URL}/admin/services/${this.editingServiceId}`,
          payload,
          { headers: this.authHeaders() }
        )
      : this.http.post<ServiceItem>(
          `${API_URL}/admin/services`,
          payload,
          { headers: this.authHeaders() }
        );

    request.subscribe({
      next: () => {
        this.busy = false;

        this.success = this.editingServiceId
          ? 'Service updated successfully.'
          : 'Service created successfully.';

        this.cancelServiceForm();
        this.loadServices();
      },
      error: err => {
        this.busy = false;
        this.error = this.errorMessage(err, 'Could not save the service.');
      }
    });
  }

  toggleServiceStatus(service: ServiceItem): void {
    const published = !service.published;

    const payload = {
      title: service.title,
      description: service.description,
      icon: service.icon,
      displayOrder: service.displayOrder,
      published
    };

    this.http.put(
      `${API_URL}/admin/services/${service.id}`,
      payload,
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        this.success =
          `Service ${published ? 'published' : 'unpublished'} successfully.`;
        this.loadServices();
      },
      error: err => {
        this.error = this.errorMessage(
          err,
          'Could not update service status.'
        );
      }
    });
  }

  deleteService(service: ServiceItem): void {
    if (!confirm(`Permanently delete service "${service.title}"?`)) {
      return;
    }

    this.http.delete(
      `${API_URL}/admin/services/${service.id}`,
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        this.success = 'Service deleted successfully.';
        this.loadServices();
      },
      error: err => {
        this.error = this.errorMessage(
          err,
          'Could not delete the service.'
        );
      }
    });
  }

  private parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.trim().split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;

    const values: string[] = [];
    let value = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          value += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        values.push(value.trim());
        value = '';
      } else {
        value += char;
      }
    }

    values.push(value.trim());
    rows.push(values);
  }

  return rows;
}

private parsePublished(value: string | undefined): boolean {
  return ['true', 'yes', '1', 'published'].includes(
    (value || '').trim().toLowerCase()
  );
}


importSkills(): void {
  this.error = '';
  this.success = '';

  const rows = this.parseCsv(this.skillBulkText);

  if (rows.length === 0) {
    this.error = 'Please enter skill data.';
    return;
  }

  // Skip an optional header row.
  const firstCell = (rows[0][0] || '').toLowerCase();

  if (firstCell === 'name') {
    rows.shift();
  }

  const records = rows.map((row, index) => ({
    name: row[0] || '',
    category: row[1] || null,
    proficiency:
      row[2] === undefined || row[2] === ''
        ? null
        : Number(row[2]),
    displayOrder:
      row[3] === undefined || row[3] === ''
        ? index + 1
        : Number(row[3]),
    published: this.parsePublished(row[4])
  }));

  if (records.length === 0 || records.some(record =>
    !record.name.trim() ||
    (record.proficiency !== null &&
      (!Number.isInteger(record.proficiency) ||
        record.proficiency < 0 ||
        record.proficiency > 100)) ||
    !Number.isInteger(record.displayOrder)
  )) {
    this.error =
      'Invalid skill data. Check names, proficiency (0–100) and display order.';
    return;
  }

  this.bulkImporting = true;

  let imported = 0;

  const saveNext = (index: number): void => {
    if (index >= records.length) {
      this.bulkImporting = false;
      this.skillBulkText = '';
      this.success = `${imported} skill(s) imported successfully.`;
      this.loadSkills();
      return;
    }

    this.http.post(
      `${API_URL}/admin/skills`,
      records[index],
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        imported++;
        saveNext(index + 1);
      },
      error: err => {
        this.bulkImporting = false;
        this.error = `${imported} skill(s) imported before an error: ${
          this.errorMessage(err, 'Import failed.')
        }`;
        this.loadSkills();
      }
    });
  };

  saveNext(0);
}


importServices(): void {
  this.error = '';
  this.success = '';

  const rows = this.parseCsv(this.serviceBulkText);

  if (rows.length === 0) {
    this.error = 'Please enter service data.';
    return;
  }

  // Skip an optional header row.
  const firstCell = (rows[0][0] || '').toLowerCase();

  if (firstCell === 'title') {
    rows.shift();
  }

  const records = rows.map((row, index) => ({
    title: row[0] || '',
    description: row[1] || '',
    icon: row[2] || null,
    displayOrder:
      row[3] === undefined || row[3] === ''
        ? index + 1
        : Number(row[3]),
    published: this.parsePublished(row[4])
  }));

  if (records.length === 0 || records.some(record =>
    !record.title.trim() ||
    !record.description.trim() ||
    !Number.isInteger(record.displayOrder)
  )) {
    this.error =
      'Invalid service data. Every service needs a title, description and valid display order.';
    return;
  }

  this.bulkImporting = true;

  let imported = 0;

  const saveNext = (index: number): void => {
    if (index >= records.length) {
      this.bulkImporting = false;
      this.serviceBulkText = '';
      this.success = `${imported} service(s) imported successfully.`;
      this.loadServices();
      return;
    }

    this.http.post(
      `${API_URL}/admin/services`,
      records[index],
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        imported++;
        saveNext(index + 1);
      },
      error: err => {
        this.bulkImporting = false;
        this.error = `${imported} service(s) imported before an error: ${
          this.errorMessage(err, 'Import failed.')
        }`;
        this.loadServices();
      }
    });
  };

  saveNext(0);
}
// PROFILE MANAGEMENT

private emptyProfile(): SiteProfile {
  return {
    name: '',
    headline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    avatarUrl: '',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: ''
  };
}

loadProfile(): void {
  this.contentLoading = true;
  this.error = '';

  this.http.get<SiteProfile>(
    `${API_URL}/admin/profile`,
    { headers: this.authHeaders() }
  ).subscribe({
    next: response => {
      this.profileForm = {
        ...this.emptyProfile(),
        ...response,
        name: response.name ?? '',
        headline: response.headline ?? '',
        bio: response.bio ?? '',
        email: response.email ?? '',
        phone: response.phone ?? '',
        location: response.location ?? '',
        avatarUrl: response.avatarUrl ?? '',
        resumeUrl: response.resumeUrl ?? '',
        githubUrl: response.githubUrl ?? '',
        linkedinUrl: response.linkedinUrl ?? '',
        websiteUrl: response.websiteUrl ?? ''
      };

      this.contentLoading = false;
    },
    error: err => {
      this.contentLoading = false;
      this.error = this.errorMessage(
        err,
        'Could not load website profile.'
      );
    }
  });
}

saveProfile(): void {
  this.busy = true;
  this.error = '';
  this.success = '';

  const payload = {
    name: this.profileForm.name.trim(),
    headline: this.profileForm.headline,
    bio: this.profileForm.bio,
    email: this.profileForm.email || null,
    phone: this.profileForm.phone,
    location: this.profileForm.location,
    avatarUrl: this.profileForm.avatarUrl,
    resumeUrl: this.profileForm.resumeUrl,
    githubUrl: this.profileForm.githubUrl,
    linkedinUrl: this.profileForm.linkedinUrl,
    websiteUrl: this.profileForm.websiteUrl
  };

  this.http.put<SiteProfile>(
    `${API_URL}/admin/profile`,
    payload,
    { headers: this.authHeaders() }
  ).subscribe({
    next: response => {
      this.profileForm = {
        ...this.profileForm,
        ...response
      };

      this.busy = false;
      this.success = 'Profile updated successfully.';
    },
    error: err => {
      this.busy = false;
      this.error = this.errorMessage(
        err,
        'Could not save profile.'
      );
    }
  });
}

// TESTIMONIAL MANAGEMENT

private emptyTestimonial(): Testimonial {
  return {
    name: '',
    role: '',
    company: '',
    content: '',
    avatarUrl: '',
    displayOrder: 1,
    published: false
  };
}

get filteredTestimonials(): Testimonial[] {
  const search = this.testimonialSearchTerm.trim().toLowerCase();

  return this.testimonials.filter(item => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search) ||
      (item.role || '').toLowerCase().includes(search) ||
      (item.company || '').toLowerCase().includes(search) ||
      item.content.toLowerCase().includes(search);

    const matchesFilter =
      this.testimonialFilter === 'ALL' ||
      (this.testimonialFilter === 'PUBLISHED' && item.published) ||
      (this.testimonialFilter === 'DRAFT' && !item.published);

    return matchesSearch && matchesFilter;
  });
}

loadTestimonials(): void {
  this.contentLoading = true;
  this.error = '';

  this.http.get<Testimonial[]>(
    `${API_URL}/admin/testimonials`,
    { headers: this.authHeaders() }
  ).subscribe({
    next: response => {
      this.testimonials = response;
      this.contentLoading = false;
    },
    error: err => {
      this.contentLoading = false;
      this.error = this.errorMessage(
        err,
        'Could not load testimonials.'
      );
    }
  });
}

startTestimonialCreate(): void {
  this.editingTestimonialId = '';
  this.testimonialForm = this.emptyTestimonial();
  this.showTestimonialForm = true;
  this.error = '';
  this.success = '';
}

editTestimonial(item: Testimonial): void {
  this.editingTestimonialId = item.id || '';
  this.testimonialForm = { ...item };
  this.showTestimonialForm = true;
  this.error = '';
  this.success = '';
}

cancelTestimonialEdit(): void {
  this.showTestimonialForm = false;
  this.editingTestimonialId = '';
  this.testimonialForm = this.emptyTestimonial();
}

saveTestimonial(): void {
  if (
    !this.testimonialForm.name.trim() ||
    !this.testimonialForm.content.trim()
  ) {
    this.error = 'Name and testimonial content are required.';
    return;
  }

  this.busy = true;
  this.error = '';
  this.success = '';

  const payload = {
    name: this.testimonialForm.name.trim(),
    role: this.testimonialForm.role,
    company: this.testimonialForm.company,
    content: this.testimonialForm.content.trim(),
    avatarUrl: this.testimonialForm.avatarUrl,
    displayOrder: Number(this.testimonialForm.displayOrder),
    published: this.testimonialForm.published
  };

  const request = this.editingTestimonialId
    ? this.http.put<Testimonial>(
        `${API_URL}/admin/testimonials/${this.editingTestimonialId}`,
        payload,
        { headers: this.authHeaders() }
      )
    : this.http.post<Testimonial>(
        `${API_URL}/admin/testimonials`,
        payload,
        { headers: this.authHeaders() }
      );

  request.subscribe({
    next: () => {
      this.busy = false;
      this.showTestimonialForm = false;
      this.editingTestimonialId = '';
      this.testimonialForm = this.emptyTestimonial();
      this.success = 'Testimonial saved successfully.';
      this.loadTestimonials();
    },
    error: err => {
      this.busy = false;
      this.error = this.errorMessage(
        err,
        'Could not save testimonial.'
      );
    }
  });
}

toggleTestimonialStatus(item: Testimonial): void {
  if (!item.id) return;

  const payload = {
    name: item.name,
    role: item.role,
    company: item.company,
    content: item.content,
    avatarUrl: item.avatarUrl,
    displayOrder: item.displayOrder,
    published: !item.published
  };

  this.http.put<Testimonial>(
    `${API_URL}/admin/testimonials/${item.id}`,
    payload,
    { headers: this.authHeaders() }
  ).subscribe({
    next: () => {
      this.success = `Testimonial ${payload.published ? 'published' : 'unpublished'} successfully.`;
      this.loadTestimonials();
    },
    error: err => {
      this.error = this.errorMessage(
        err,
        'Could not update testimonial status.'
      );
    }
  });
}

deleteTestimonial(item: Testimonial): void {
  if (!item.id) return;

  if (!confirm(`Delete testimonial from ${item.name}?`)) {
    return;
  }

  this.http.delete(
    `${API_URL}/admin/testimonials/${item.id}`,
    { headers: this.authHeaders() }
  ).subscribe({
    next: () => {
      this.success = 'Testimonial deleted successfully.';
      this.loadTestimonials();
    },
    error: err => {
      this.error = this.errorMessage(
        err,
        'Could not delete testimonial.'
      );
    }
  });
}

// INQUIRY MANAGEMENT

get filteredInquiries(): Inquiry[] {
  const term = this.inquirySearchTerm.trim().toLowerCase();

  return this.inquiries.filter(item => {
    const matchesSearch =
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      (item.subject || '').toLowerCase().includes(term) ||
      item.message.toLowerCase().includes(term);

    const matchesStatus =
      this.inquiryFilter === 'ALL' ||
      item.status === this.inquiryFilter;

    return matchesSearch && matchesStatus;
  });
}

loadInquiries(): void {
  this.contentLoading = true;
  this.error = '';

  this.http.get<Inquiry[]>(
    `${API_URL}/admin/inquiries`,
    { headers: this.authHeaders() }
  ).subscribe({
    next: response => {
      this.inquiries = response || [];
      this.contentLoading = false;
    },
    error: err => {
      this.contentLoading = false;

      if (err.status === 401 || err.status === 403) {
        this.logout();
        this.error = 'Your session expired. Please sign in again.';
      } else {
        this.error = this.errorMessage(
          err,
          'Could not load inquiries.'
        );
      }
    }
  });
}

updateInquiryStatus(
  inquiry: Inquiry,
  status: 'NEW' | 'READ' | 'REPLIED'
): void {
  this.error = '';
  this.success = '';

  this.http.patch(
    `${API_URL}/admin/inquiries/${inquiry.id}/status`,
    { status },
    { headers: this.authHeaders() }
  ).subscribe({
    next: () => {
      this.success = `Inquiry marked as ${status.toLowerCase()}.`;
      this.loadInquiries();
    },
    error: err => {
      this.error = this.errorMessage(
        err,
        'Could not update inquiry status.'
      );
    }
  });
}

deleteInquiry(inquiry: Inquiry): void {
  if (!confirm(`Permanently delete the inquiry from ${inquiry.name}?`)) {
    return;
  }

  this.http.delete(
    `${API_URL}/admin/inquiries/${inquiry.id}`,
    { headers: this.authHeaders() }
  ).subscribe({
    next: () => {
      this.success = 'Inquiry deleted successfully.';

      if (this.selectedInquiryId === inquiry.id) {
        this.selectedInquiryId = '';
      }

      this.loadInquiries();
    },
    error: err => {
      this.error = this.errorMessage(
        err,
        'Could not delete inquiry.'
      );
    }
  });
}

  // SHARED UTILITIES

  assetUrl(url?: string | null): string {
  if (!url) return '';

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

  private errorMessage(err: any, fallback: string): string {
    return (
      err?.error?.message ||
      err?.error?.detail ||
      err?.message ||
      fallback
    );
  }
}
