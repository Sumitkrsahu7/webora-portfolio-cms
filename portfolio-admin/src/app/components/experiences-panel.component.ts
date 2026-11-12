import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { AdminSessionService } from '../admin-session.service';

const API_URL = environment.apiUrl;

export type ExperienceRoleType = 'FULL_TIME' | 'CONTRACT' | 'FREELANCE' | 'FOUNDER';

export interface ExperienceItem {
  id?: string;
  company: string;
  companyUrl: string;
  roleTitle: string;
  roleType: ExperienceRoleType;
  location: string;
  startDate: string;
  endDate: string;
  currentRole: boolean;
  description: string;
  technologies: string[];
  displayOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-experiences-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section-heading">
      <div>
        <p class="eyebrow">WEBSITE CONTENT</p>
        <h2>Manage career &amp; experience</h2>
        <p class="muted">
          Track leadership milestones, delivery engagements, and technical roles stored in the CMS.
        </p>
      </div>

      <button class="primary" type="button" (click)="startCreate()">
        ＋ Add experience
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
        <h3>{{ editingId ? 'Edit experience' : 'New experience' }}</h3>

        <form (ngSubmit)="save()">
          <div class="form-grid">
            <div class="field">
              <label>Company / Organization *</label>
              <input
                name="expCompany"
                [(ngModel)]="form.company"
                required
                maxlength="160"
                placeholder="e.g. WEBORA Systems"
              />
            </div>

            <div class="field">
              <label>Role Title *</label>
              <input
                name="expRoleTitle"
                [(ngModel)]="form.roleTitle"
                required
                maxlength="160"
                placeholder="e.g. Lead Software Architect"
              />
            </div>

            <div class="field">
              <label>Engagement / Role Type *</label>
              <select name="expRoleType" [(ngModel)]="form.roleType" required>
                <option value="FULL_TIME">Full-Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="FREELANCE">Freelance</option>
                <option value="FOUNDER">Founder / Partner</option>
              </select>
            </div>

            <div class="field">
              <label>Location</label>
              <input
                name="expLocation"
                [(ngModel)]="form.location"
                maxlength="160"
                placeholder="e.g. Remote / India"
              />
            </div>

            <div class="field">
              <label>Start Date *</label>
              <input
                type="date"
                name="expStartDate"
                [(ngModel)]="form.startDate"
                required
              />
            </div>

            <div class="field">
              <label>End Date {{ form.currentRole ? '(Current role)' : '' }}</label>
              <input
                type="date"
                name="expEndDate"
                [(ngModel)]="form.endDate"
                [disabled]="form.currentRole"
              />
            </div>

            <div class="field">
              <label>Company Website URL</label>
              <input
                type="url"
                name="expCompanyUrl"
                [(ngModel)]="form.companyUrl"
                maxlength="500"
                placeholder="https://example.com"
              />
            </div>

            <div class="field">
              <label>Display Order</label>
              <input
                type="number"
                name="expDisplayOrder"
                [(ngModel)]="form.displayOrder"
                required
              />
            </div>

            <div class="field full-field">
              <label>Technologies (comma-separated)</label>
              <input
                name="expTechnologies"
                [(ngModel)]="technologiesText"
                placeholder="React, TypeScript, Spring Boot, SQL Server"
              />
            </div>

            <div class="field full-field">
              <label>Summary &amp; Key Contributions</label>
              <textarea
                name="expDescription"
                [(ngModel)]="form.description"
                rows="5"
                maxlength="4000"
                placeholder="Describe deliverables, engineering architecture, and business outcomes..."
              ></textarea>
            </div>

            <div class="field">
              <label class="checkbox-row">
                <input
                  type="checkbox"
                  name="expCurrentRole"
                  [(ngModel)]="form.currentRole"
                  (ngModelChange)="onCurrentRoleToggle($event)"
                />
                <span>Currently active in this role</span>
              </label>
            </div>

            <div class="field">
              <label class="checkbox-row">
                <input
                  type="checkbox"
                  name="expPublished"
                  [(ngModel)]="form.published"
                />
                <span>Publish on website</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button class="secondary" type="button" (click)="cancelEdit()">
              Cancel
            </button>
            <button class="primary" type="submit" [disabled]="saving">
              {{ saving ? 'Saving...' : 'Save experience' }}
            </button>
          </div>
        </form>
      </div>
    }

    <div class="filter-bar">
      <input
        name="expSearch"
        [(ngModel)]="searchTerm"
        placeholder="Search by company, role, location or technology..."
      />

      <select name="expFilter" [(ngModel)]="statusFilter">
        <option value="ALL">All entries</option>
        <option value="PUBLISHED">Published</option>
        <option value="DRAFT">Unpublished</option>
      </select>
    </div>

    @if (loading) {
      <div class="empty-state">Loading experience entries...</div>
    } @else if (filteredItems.length === 0) {
      <div class="empty-state">
        <h3>No experience entries found</h3>
        <p>Add genuine career milestones or adjust your search filters.</p>
      </div>
    } @else {
      <div class="exp-list">
        @for (item of filteredItems; track item.id) {
          <article class="exp-card">
            <div class="exp-main">
              <div class="exp-meta">
                <span class="type-pill">{{ formatRoleType(item.roleType) }}</span>
                <span>{{ item.startDate }} — {{ item.currentRole ? 'Present' : (item.endDate || 'N/A') }}</span>
                @if (item.location) {
                  <span>· {{ item.location }}</span>
                }
              </div>

              <h3>{{ item.roleTitle }} <span>at {{ item.company }}</span></h3>

              @if (item.description) {
                <p class="exp-desc">{{ item.description }}</p>
              }

              @if (item.technologies && item.technologies.length > 0) {
                <div class="exp-tags">
                  @for (tech of item.technologies; track tech) {
                    <span>{{ tech }}</span>
                  }
                </div>
              }

              <small class="exp-order">Display order: {{ item.displayOrder }}</small>
            </div>

            <div class="exp-actions">
              <span class="status-badge" [class.published]="item.published">
                {{ item.published ? 'Published' : 'Draft' }}
              </span>
              <button class="secondary" type="button" (click)="edit(item)">
                Edit
              </button>
              <button class="secondary" type="button" (click)="togglePublished(item)">
                {{ item.published ? 'Unpublish' : 'Publish' }}
              </button>
              <button class="danger" type="button" (click)="remove(item)">
                Delete
              </button>
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
    .field label {
      font-size: 12px;
      color: var(--muted);
      font-weight: 600;
    }
    .checkbox-row {
      display: flex !important;
      flex-direction: row !important;
      align-items: center;
      gap: 8px;
      color: #e6e2f0 !important;
      cursor: pointer;
    }
    .checkbox-row input[type='checkbox'] {
      width: 16px;
      height: 16px;
      accent-color: var(--accent);
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    .exp-list {
      display: grid;
      gap: 14px;
    }
    .exp-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .exp-main { min-width: 0; flex: 1; }
    .exp-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .type-pill {
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid #a18cff44;
      background: #a18cff18;
      color: var(--accent-soft);
      font-family: 'DM Mono', monospace;
      font-size: 10px;
    }
    .exp-main h3 {
      margin: 0 0 8px;
      font-size: 17px;
      color: #fff;
    }
    .exp-main h3 span {
      color: var(--muted);
      font-weight: 500;
    }
    .exp-desc {
      margin: 0 0 12px;
      color: #c8c2d6;
      font-size: 13.5px;
      line-height: 1.55;
      white-space: pre-line;
    }
    .exp-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 10px;
    }
    .exp-tags span {
      font-size: 11px;
      padding: 3px 9px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: #d6d0e4;
    }
    .exp-order {
      color: var(--muted);
      font-size: 11px;
      font-family: 'DM Mono', monospace;
    }
    .exp-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      flex-shrink: 0;
    }
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
    .alert {
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      font-size: 13px;
    }
    .alert.error {
      background: rgba(239, 68, 68, 0.14);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
    .alert.success {
      background: rgba(34, 197, 94, 0.14);
      border: 1px solid rgba(34, 197, 94, 0.4);
      color: #86efac;
    }
    @media (max-width: 720px) {
      .form-grid { grid-template-columns: 1fr; }
      .exp-card { flex-direction: column; }
      .exp-actions { flex-direction: row; flex-wrap: wrap; align-items: center; }
    }
  `]
})
export class ExperiencesPanelComponent implements OnInit {
  items: ExperienceItem[] = [];
  loading = false;
  saving = false;
  showForm = false;
  editingId = '';
  error = '';
  success = '';
  searchTerm = '';
  statusFilter: 'ALL' | 'PUBLISHED' | 'DRAFT' = 'ALL';
  technologiesText = '';
  form: ExperienceItem = this.emptyForm();

  constructor(
    private http: HttpClient,
    private session: AdminSessionService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  emptyForm(): ExperienceItem {
    return {
      company: '',
      companyUrl: '',
      roleTitle: '',
      roleType: 'FULL_TIME',
      location: '',
      startDate: '',
      endDate: '',
      currentRole: false,
      description: '',
      technologies: [],
      displayOrder: this.items.length,
      published: true
    };
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.http.get<ExperienceItem[]>(`${API_URL}/admin/experiences`).subscribe({
      next: data => {
        this.items = data || [];
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = this.session.extractErrorMessage(err, 'Could not load experience entries.');
      }
    });
  }

  startCreate(): void {
    this.editingId = '';
    this.form = this.emptyForm();
    this.technologiesText = '';
    this.error = '';
    this.success = '';
    this.showForm = true;
  }

  edit(item: ExperienceItem): void {
    this.editingId = item.id || '';
    this.form = {
      ...item,
      companyUrl: item.companyUrl || '',
      location: item.location || '',
      endDate: item.endDate || '',
      description: item.description || '',
      technologies: item.technologies || []
    };
    this.technologiesText = (item.technologies || []).join(', ');
    this.error = '';
    this.success = '';
    this.showForm = true;
  }

  cancelEdit(): void {
    this.showForm = false;
    this.editingId = '';
    this.form = this.emptyForm();
    this.technologiesText = '';
  }

  onCurrentRoleToggle(checked: boolean): void {
    if (checked) {
      this.form.endDate = '';
    }
  }

  save(): void {
    this.error = '';
    this.success = '';

    const company = this.form.company.trim();
    const roleTitle = this.form.roleTitle.trim();
    if (!company || !roleTitle || !this.form.startDate) {
      this.error = 'Company, role title, and start date are required.';
      return;
    }

    const url = this.form.companyUrl.trim();
    if (url && !/^https?:\/\/\S+$/i.test(url)) {
      this.error = 'Company URL must start with http:// or https://.';
      return;
    }

    const endDate = this.form.currentRole ? null : (this.form.endDate.trim() || null);
    if (endDate && endDate < this.form.startDate) {
      this.error = 'End date must be on or after the start date.';
      return;
    }

    const technologies = this.technologiesText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      company,
      companyUrl: url || null,
      roleTitle,
      roleType: this.form.roleType,
      location: this.form.location.trim() || null,
      startDate: this.form.startDate,
      endDate,
      currentRole: Boolean(this.form.currentRole),
      description: this.form.description.trim() || null,
      technologies,
      displayOrder: Number(this.form.displayOrder) || 0,
      published: Boolean(this.form.published)
    };

    this.saving = true;
    const req$ = this.editingId
      ? this.http.put<ExperienceItem>(`${API_URL}/admin/experiences/${this.editingId}`, payload)
      : this.http.post<ExperienceItem>(`${API_URL}/admin/experiences`, payload);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingId = '';
        this.success = 'Experience saved successfully.';
        this.load();
      },
      error: err => {
        this.saving = false;
        this.error = this.session.extractErrorMessage(err, 'Could not save experience entry.');
      }
    });
  }

  togglePublished(item: ExperienceItem): void {
    if (!item.id) return;
    this.error = '';
    this.success = '';

    const payload = {
      company: item.company,
      companyUrl: item.companyUrl || null,
      roleTitle: item.roleTitle,
      roleType: item.roleType,
      location: item.location || null,
      startDate: item.startDate,
      endDate: item.currentRole ? null : (item.endDate || null),
      currentRole: Boolean(item.currentRole),
      description: item.description || null,
      technologies: item.technologies || [],
      displayOrder: item.displayOrder,
      published: !item.published
    };

    this.http.put<ExperienceItem>(`${API_URL}/admin/experiences/${item.id}`, payload).subscribe({
      next: () => {
        this.success = `Experience ${payload.published ? 'published' : 'unpublished'} successfully.`;
        this.load();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not update experience status.');
      }
    });
  }

  remove(item: ExperienceItem): void {
    if (!item.id) return;
    if (!confirm(`Delete experience "${item.roleTitle} at ${item.company}"?`)) {
      return;
    }

    this.error = '';
    this.success = '';
    this.http.delete(`${API_URL}/admin/experiences/${item.id}`).subscribe({
      next: () => {
        this.success = 'Experience deleted successfully.';
        this.load();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not delete experience entry.');
      }
    });
  }

  get filteredItems(): ExperienceItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.items.filter(item => {
      const matchesStatus =
        this.statusFilter === 'ALL' ||
        (this.statusFilter === 'PUBLISHED' && item.published) ||
        (this.statusFilter === 'DRAFT' && !item.published);

      const matchesTerm =
        !term ||
        item.company.toLowerCase().includes(term) ||
        item.roleTitle.toLowerCase().includes(term) ||
        (item.location || '').toLowerCase().includes(term) ||
        (item.technologies || []).some(t => t.toLowerCase().includes(term));

      return matchesStatus && matchesTerm;
    });
  }

  formatRoleType(roleType: string): string {
    switch (roleType) {
      case 'FULL_TIME': return 'FULL-TIME';
      case 'CONTRACT': return 'CONTRACT';
      case 'FREELANCE': return 'FREELANCE';
      case 'FOUNDER': return 'FOUNDER';
      default: return roleType;
    }
  }
}
