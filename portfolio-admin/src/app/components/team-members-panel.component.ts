import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { AdminSessionService } from '../admin-session.service';

const API_URL = environment.apiUrl;
const API_ORIGIN = new URL(API_URL).origin;

export interface TeamMember {
  id?: string;
  name: string;
  roleTitle: string;
  specialty: string;
  bio: string;
  avatarUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  displayOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-team-members-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section-heading">
      <div>
        <p class="eyebrow">COMPANY TEAM</p>
        <h2>Manage team members</h2>
        <p class="muted">
          Add genuine engineering &amp; leadership team profiles shown on the About Us page.
        </p>
      </div>

      <button class="primary" type="button" (click)="startCreate()">
        ＋ Add team member
      </button>
    </section>

    @if (error) {
      <div class="alert error">{{ error }}</div>
    }

    @if (success) {
      <div class="alert success">{{ success }}</div>
    }

    @if (showForm) {
      <div class="form-panel content-editor">
        <h3>{{ editingId ? 'Edit team member' : 'New team member' }}</h3>

        <form (ngSubmit)="save()">
          <div class="form-grid">
            <div class="field">
              <label>Full Name *</label>
              <input
                name="tmName"
                [(ngModel)]="form.name"
                required
                maxlength="160"
                placeholder="e.g. Rohan Verma"
              />
            </div>

            <div class="field">
              <label>Role / Designation *</label>
              <input
                name="tmRoleTitle"
                [(ngModel)]="form.roleTitle"
                required
                maxlength="160"
                placeholder="e.g. Lead Full-Stack Engineer"
              />
            </div>

            <div class="field">
              <label>Specialty / Focus Area</label>
              <input
                name="tmSpecialty"
                [(ngModel)]="form.specialty"
                maxlength="255"
                placeholder="e.g. Cloud Architecture & React Systems"
              />
            </div>

            <div class="field">
              <label>Display Order</label>
              <input
                type="number"
                name="tmDisplayOrder"
                [(ngModel)]="form.displayOrder"
                required
              />
            </div>

            <div class="field full-field">
              <label>Avatar Image URL (or upload below)</label>
              <input
                name="tmAvatarUrl"
                [(ngModel)]="form.avatarUrl"
                maxlength="2048"
                placeholder="https://res.cloudinary.com/..."
              />
              <div class="upload-row">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  (change)="onAvatarSelected($event)"
                />
                @if (selectedFile) {
                  <button
                    class="secondary"
                    type="button"
                    [disabled]="uploading"
                    (click)="uploadAvatar()"
                  >
                    {{ uploading ? 'Uploading...' : 'Upload photo' }}
                  </button>
                }
              </div>
              @if (previewUrl || form.avatarUrl) {
                <img
                  class="avatar-preview"
                  [src]="previewUrl || assetUrl(form.avatarUrl)"
                  alt="Avatar preview"
                />
              }
            </div>

            <div class="field">
              <label>LinkedIn URL</label>
              <input
                type="url"
                name="tmLinkedin"
                [(ngModel)]="form.linkedinUrl"
                maxlength="2048"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div class="field">
              <label>GitHub URL</label>
              <input
                type="url"
                name="tmGithub"
                [(ngModel)]="form.githubUrl"
                maxlength="2048"
                placeholder="https://github.com/..."
              />
            </div>

            <div class="field full-field">
              <label>Short Bio</label>
              <textarea
                name="tmBio"
                [(ngModel)]="form.bio"
                rows="4"
                maxlength="2000"
                placeholder="Brief background on technical experience and responsibilities..."
              ></textarea>
            </div>

            <div class="field full-field">
              <label class="checkbox-row">
                <input
                  type="checkbox"
                  name="tmPublished"
                  [(ngModel)]="form.published"
                />
                <span>Publish on public About Us page</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button class="secondary" type="button" (click)="cancelEdit()">
              Cancel
            </button>
            <button class="primary" type="submit" [disabled]="saving">
              {{ saving ? 'Saving...' : 'Save team member' }}
            </button>
          </div>
        </form>
      </div>
    }

    <div class="filter-bar">
      <input
        name="tmSearch"
        [(ngModel)]="searchTerm"
        placeholder="Search by name, role, or specialty..."
      />

      <select name="tmFilter" [(ngModel)]="statusFilter">
        <option value="ALL">All members</option>
        <option value="PUBLISHED">Published</option>
        <option value="DRAFT">Unpublished</option>
      </select>
    </div>

    @if (loading) {
      <div class="empty-state">Loading team members...</div>
    } @else if (filteredMembers.length === 0) {
      <div class="empty-state">
        <h3>No team members added yet</h3>
        <p>Publish real team profiles here when ready to show your leadership &amp; engineering roster.</p>
      </div>
    } @else {
      <div class="team-grid">
        @for (item of filteredMembers; track item.id) {
          <article class="team-card">
            <div class="team-header">
              @if (item.avatarUrl) {
                <img class="team-avatar" [src]="assetUrl(item.avatarUrl)" [alt]="item.name" />
              } @else {
                <div class="team-avatar-fallback">{{ item.name.slice(0, 1).toUpperCase() }}</div>
              }
              <div class="team-meta">
                <h3>{{ item.name }}</h3>
                <p class="role">{{ item.roleTitle }}</p>
                @if (item.specialty) {
                  <span class="specialty">{{ item.specialty }}</span>
                }
              </div>
              <span class="status-badge" [class.published]="item.published">
                {{ item.published ? 'Published' : 'Draft' }}
              </span>
            </div>

            @if (item.bio) {
              <p class="bio">{{ item.bio }}</p>
            }

            <div class="team-footer">
              <small>Order: {{ item.displayOrder }}</small>
              <div class="team-actions">
                <button class="secondary" type="button" (click)="edit(item)">Edit</button>
                <button class="secondary" type="button" (click)="togglePublished(item)">
                  {{ item.published ? 'Unpublish' : 'Publish' }}
                </button>
                <button class="danger" type="button" (click)="remove(item)">Delete</button>
              </div>
            </div>
          </article>
        }
      </div>
    }
  `,
  styles: [`
    .content-editor { margin-bottom: 24px; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .full-field { grid-column: 1 / -1; }
    .field label { font-size: 12px; color: var(--muted); font-weight: 600; }
    .upload-row { display: flex; align-items: center; gap: 10px; margin-top: 6px; flex-wrap: wrap; }
    .avatar-preview {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid var(--border);
      margin-top: 8px;
    }
    .checkbox-row {
      display: flex !important;
      flex-direction: row !important;
      align-items: center;
      gap: 8px;
      color: #e6e2f0 !important;
      cursor: pointer;
    }
    .checkbox-row input[type='checkbox'] { width: 16px; height: 16px; accent-color: var(--accent); }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .team-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .team-header { display: flex; align-items: flex-start; gap: 14px; }
    .team-avatar, .team-avatar-fallback {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      flex-shrink: 0;
      object-fit: cover;
      border: 1px solid var(--border);
    }
    .team-avatar-fallback {
      display: grid;
      place-items: center;
      background: rgba(161, 140, 255, 0.14);
      color: var(--accent-soft);
      font-weight: 700;
      font-size: 18px;
    }
    .team-meta { flex: 1; min-width: 0; }
    .team-meta h3 { margin: 0 0 4px; font-size: 16px; color: #fff; }
    .team-meta .role { margin: 0 0 6px; font-size: 13px; color: var(--accent-soft); }
    .team-meta .specialty { font-size: 11px; color: var(--muted); display: block; }
    .bio { margin: 0; font-size: 13.5px; color: #c8c2d6; line-height: 1.55; flex: 1; }
    .team-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      border-top: 1px solid var(--border);
      padding-top: 12px;
      flex-wrap: wrap;
    }
    .team-footer small { color: var(--muted); font-family: 'DM Mono', monospace; font-size: 11px; }
    .team-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .status-badge {
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.06);
      color: var(--muted);
      border: 1px solid var(--border);
    }
    .status-badge.published {
      background: rgba(74, 222, 128, 0.14);
      color: #86efac;
      border-color: rgba(74, 222, 128, 0.35);
    }
    .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 13px; }
    .alert.error { background: rgba(239, 68, 68, 0.14); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; }
    .alert.success { background: rgba(34, 197, 94, 0.14); border: 1px solid rgba(34, 197, 94, 0.4); color: #86efac; }
    @media (max-width: 720px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class TeamMembersPanelComponent implements OnInit {
  members: TeamMember[] = [];
  loading = false;
  saving = false;
  uploading = false;
  showForm = false;
  editingId = '';
  error = '';
  success = '';
  searchTerm = '';
  statusFilter: 'ALL' | 'PUBLISHED' | 'DRAFT' = 'ALL';
  selectedFile: File | null = null;
  previewUrl = '';
  form: TeamMember = this.emptyForm();

  constructor(
    private http: HttpClient,
    private session: AdminSessionService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  emptyForm(): TeamMember {
    return {
      name: '',
      roleTitle: '',
      specialty: '',
      bio: '',
      avatarUrl: '',
      linkedinUrl: '',
      githubUrl: '',
      displayOrder: this.members.length,
      published: true
    };
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.http.get<TeamMember[]>(`${API_URL}/admin/team`).subscribe({
      next: data => {
        this.members = data || [];
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = this.session.extractErrorMessage(err, 'Could not load team members.');
      }
    });
  }

  startCreate(): void {
    this.editingId = '';
    this.form = this.emptyForm();
    this.selectedFile = null;
    this.previewUrl = '';
    this.error = '';
    this.success = '';
    this.showForm = true;
  }

  edit(member: TeamMember): void {
    this.editingId = member.id || '';
    this.form = {
      ...member,
      specialty: member.specialty || '',
      bio: member.bio || '',
      avatarUrl: member.avatarUrl || '',
      linkedinUrl: member.linkedinUrl || '',
      githubUrl: member.githubUrl || ''
    };
    this.selectedFile = null;
    this.previewUrl = '';
    this.error = '';
    this.success = '';
    this.showForm = true;
  }

  cancelEdit(): void {
    this.showForm = false;
    this.editingId = '';
    this.selectedFile = null;
    this.previewUrl = '';
    this.form = this.emptyForm();
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.error = '';
    this.selectedFile = null;
    this.previewUrl = '';

    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.error = 'Choose a PNG, JPG, or WEBP image.';
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
      this.previewUrl = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  }

  uploadAvatar(): void {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.error = '';

    const data = new FormData();
    data.append('file', this.selectedFile);

    this.http.post<{ url: string }>(`${API_URL}/admin/uploads`, data).subscribe({
      next: res => {
        this.form.avatarUrl = res.url;
        this.selectedFile = null;
        this.uploading = false;
        this.success = 'Photo uploaded. Save team member to keep changes.';
      },
      error: err => {
        this.uploading = false;
        this.error = this.session.extractErrorMessage(err, 'Photo upload failed.');
      }
    });
  }

  save(): void {
    this.error = '';
    this.success = '';

    const name = this.form.name.trim();
    const roleTitle = this.form.roleTitle.trim();
    if (!name || !roleTitle) {
      this.error = 'Name and role title are required.';
      return;
    }

    const payload = {
      name,
      roleTitle,
      specialty: this.form.specialty.trim() || null,
      bio: this.form.bio.trim() || null,
      avatarUrl: this.form.avatarUrl.trim() || null,
      linkedinUrl: this.form.linkedinUrl.trim() || null,
      githubUrl: this.form.githubUrl.trim() || null,
      displayOrder: Number(this.form.displayOrder) || 0,
      published: Boolean(this.form.published)
    };

    this.saving = true;
    const req$ = this.editingId
      ? this.http.put<TeamMember>(`${API_URL}/admin/team/${this.editingId}`, payload)
      : this.http.post<TeamMember>(`${API_URL}/admin/team`, payload);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingId = '';
        this.previewUrl = '';
        this.success = 'Team member saved successfully.';
        this.load();
      },
      error: err => {
        this.saving = false;
        this.error = this.session.extractErrorMessage(err, 'Could not save team member.');
      }
    });
  }

  togglePublished(member: TeamMember): void {
    if (!member.id) return;
    const payload = {
      name: member.name,
      roleTitle: member.roleTitle,
      specialty: member.specialty || null,
      bio: member.bio || null,
      avatarUrl: member.avatarUrl || null,
      linkedinUrl: member.linkedinUrl || null,
      githubUrl: member.githubUrl || null,
      displayOrder: member.displayOrder,
      published: !member.published
    };

    this.http.put<TeamMember>(`${API_URL}/admin/team/${member.id}`, payload).subscribe({
      next: () => {
        this.success = `Team member ${payload.published ? 'published' : 'unpublished'} successfully.`;
        this.load();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not update team member status.');
      }
    });
  }

  remove(member: TeamMember): void {
    if (!member.id) return;
    if (!confirm(`Delete team member ${member.name}?`)) return;

    this.http.delete(`${API_URL}/admin/team/${member.id}`).subscribe({
      next: () => {
        this.success = 'Team member deleted successfully.';
        this.load();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not delete team member.');
      }
    });
  }

  get filteredMembers(): TeamMember[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.members.filter(m => {
      const matchesStatus =
        this.statusFilter === 'ALL' ||
        (this.statusFilter === 'PUBLISHED' && m.published) ||
        (this.statusFilter === 'DRAFT' && !m.published);

      const matchesTerm =
        !term ||
        m.name.toLowerCase().includes(term) ||
        m.roleTitle.toLowerCase().includes(term) ||
        (m.specialty || '').toLowerCase().includes(term);

      return matchesStatus && matchesTerm;
    });
  }

  assetUrl(url?: string | null): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
  }
}
