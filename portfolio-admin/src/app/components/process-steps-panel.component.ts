import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { AdminSessionService } from '../admin-session.service';

const API_URL = environment.apiUrl;

export interface ProcessStepItem {
  id?: string;
  stepNumber: number;
  title: string;
  description: string;
  deliverableHint: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-process-steps-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section-heading">
      <div>
        <p class="eyebrow">DELIVERY WORKFLOW</p>
        <h2>Manage development process</h2>
        <p class="muted">
          Configure the 6-stage WEBORA workflow shown on Services and Homepage.
        </p>
      </div>

      <button class="primary" type="button" (click)="startCreate()">
        ＋ Add stage
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
        <h3>{{ editingId ? 'Edit process stage' : 'New process stage' }}</h3>

        <form (ngSubmit)="save()">
          <div class="form-grid">
            <div class="field">
              <label>Stage Number *</label>
              <input
                type="number"
                name="stepNumber"
                [(ngModel)]="form.stepNumber"
                min="1"
                required
              />
            </div>

            <div class="field">
              <label>Stage Title *</label>
              <input
                name="stepTitle"
                [(ngModel)]="form.title"
                required
                maxlength="160"
                placeholder="e.g. Discovery & Scoping"
              />
            </div>

            <div class="field full-field">
              <label>Deliverable / Outcome Label</label>
              <input
                name="stepDeliverable"
                [(ngModel)]="form.deliverableHint"
                maxlength="255"
                placeholder="e.g. Architecture & Scope Plan"
              />
            </div>

            <div class="field full-field">
              <label>Description *</label>
              <textarea
                name="stepDescription"
                [(ngModel)]="form.description"
                rows="3"
                required
                maxlength="2000"
                placeholder="Explain what happens during this stage..."
              ></textarea>
            </div>

            <div class="field full-field">
              <label class="checkbox-row">
                <input
                  type="checkbox"
                  name="stepPublished"
                  [(ngModel)]="form.published"
                />
                <span>Publish on public website</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button class="secondary" type="button" (click)="cancelEdit()">Cancel</button>
            <button class="primary" type="submit" [disabled]="saving">
              {{ saving ? 'Saving...' : 'Save stage' }}
            </button>
          </div>
        </form>
      </div>
    }

    @if (loading) {
      <div class="empty-state">Loading process stages...</div>
    } @else if (steps.length === 0) {
      <div class="empty-state">
        <h3>No process stages found</h3>
        <p>Add stages or run migrations to populate default WEBORA workflow stages.</p>
      </div>
    } @else {
      <div class="step-list">
        @for (item of steps; track item.id) {
          <article class="step-card">
            <div class="step-num">{{ item.stepNumber < 10 ? '0' + item.stepNumber : item.stepNumber }}</div>
            <div class="step-main">
              <h3>{{ item.title }}</h3>
              @if (item.deliverableHint) {
                <span class="hint">{{ item.deliverableHint }}</span>
              }
              <p>{{ item.description }}</p>
            </div>
            <div class="step-actions">
              <span class="status-badge" [class.published]="item.published">
                {{ item.published ? 'Published' : 'Draft' }}
              </span>
              <button class="secondary" type="button" (click)="edit(item)">Edit</button>
              <button class="secondary" type="button" (click)="togglePublished(item)">
                {{ item.published ? 'Unpublish' : 'Publish' }}
              </button>
              <button class="danger" type="button" (click)="remove(item)">Delete</button>
            </div>
          </article>
        }
      </div>
    }
  `,
  styles: [`
    .content-editor { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .full-field { grid-column: 1 / -1; }
    .field label { font-size: 12px; color: var(--muted); font-weight: 600; }
    .checkbox-row { display: flex !important; flex-direction: row !important; align-items: center; gap: 8px; cursor: pointer; }
    .checkbox-row input[type='checkbox'] { width: 16px; height: 16px; accent-color: var(--accent); }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .step-list { display: grid; gap: 12px; }
    .step-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 20px;
      display: flex;
      align-items: flex-start;
      gap: 18px;
    }
    .step-num {
      font-family: 'DM Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      color: var(--accent-soft);
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(161, 140, 255, 0.12);
      border: 1px solid rgba(161, 140, 255, 0.25);
    }
    .step-main { flex: 1; min-width: 0; }
    .step-main h3 { margin: 0 0 4px; color: #fff; font-size: 16px; }
    .hint { display: inline-block; font-size: 11px; color: var(--accent-soft); margin-bottom: 6px; }
    .step-main p { margin: 0; color: #c8c2d6; font-size: 13.5px; line-height: 1.5; }
    .step-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
    .status-badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.06); color: var(--muted); border: 1px solid var(--border); }
    .status-badge.published { background: rgba(74,222,128,0.14); color: #86efac; border-color: rgba(74,222,128,0.35); }
    .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 13px; }
    .alert.error { background: rgba(239,68,68,0.14); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5; }
    .alert.success { background: rgba(34,197,94,0.14); border: 1px solid rgba(34,197,94,0.4); color: #86efac; }
    @media (max-width: 720px) {
      .form-grid { grid-template-columns: 1fr; }
      .step-card { flex-direction: column; }
      .step-actions { flex-direction: row; flex-wrap: wrap; align-items: center; }
    }
  `]
})
export class ProcessStepsPanelComponent implements OnInit {
  steps: ProcessStepItem[] = [];
  loading = false;
  saving = false;
  showForm = false;
  editingId = '';
  error = '';
  success = '';
  form: ProcessStepItem = this.emptyForm();

  constructor(private http: HttpClient, private session: AdminSessionService) {}

  ngOnInit(): void {
    this.load();
  }

  emptyForm(): ProcessStepItem {
    return {
      stepNumber: this.steps.length + 1,
      title: '',
      description: '',
      deliverableHint: '',
      published: true
    };
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.http.get<ProcessStepItem[]>(`${API_URL}/admin/process-steps`).subscribe({
      next: data => {
        this.steps = data || [];
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = this.session.extractErrorMessage(err, 'Could not load process steps.');
      }
    });
  }

  startCreate(): void {
    this.editingId = '';
    this.form = this.emptyForm();
    this.error = '';
    this.success = '';
    this.showForm = true;
  }

  edit(item: ProcessStepItem): void {
    this.editingId = item.id || '';
    this.form = { ...item, deliverableHint: item.deliverableHint || '' };
    this.error = '';
    this.success = '';
    this.showForm = true;
  }

  cancelEdit(): void {
    this.showForm = false;
    this.editingId = '';
    this.form = this.emptyForm();
  }

  save(): void {
    if (!this.form.title.trim() || !this.form.description.trim() || this.form.stepNumber < 1) {
      this.error = 'Stage number (>= 1), title, and description are required.';
      return;
    }

    const payload = {
      stepNumber: Number(this.form.stepNumber),
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      deliverableHint: this.form.deliverableHint.trim() || null,
      published: Boolean(this.form.published)
    };

    this.saving = true;
    this.error = '';
    this.success = '';

    const req$ = this.editingId
      ? this.http.put<ProcessStepItem>(`${API_URL}/admin/process-steps/${this.editingId}`, payload)
      : this.http.post<ProcessStepItem>(`${API_URL}/admin/process-steps`, payload);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingId = '';
        this.success = 'Process stage saved successfully.';
        this.load();
      },
      error: err => {
        this.saving = false;
        this.error = this.session.extractErrorMessage(err, 'Could not save process stage.');
      }
    });
  }

  togglePublished(item: ProcessStepItem): void {
    if (!item.id) return;
    const payload = {
      stepNumber: item.stepNumber,
      title: item.title,
      description: item.description,
      deliverableHint: item.deliverableHint || null,
      published: !item.published
    };
    this.http.put<ProcessStepItem>(`${API_URL}/admin/process-steps/${item.id}`, payload).subscribe({
      next: () => {
        this.success = `Stage ${payload.published ? 'published' : 'unpublished'} successfully.`;
        this.load();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not update stage status.');
      }
    });
  }

  remove(item: ProcessStepItem): void {
    if (!item.id || !confirm(`Delete stage "${item.title}"?`)) return;
    this.http.delete(`${API_URL}/admin/process-steps/${item.id}`).subscribe({
      next: () => {
        this.success = 'Process stage deleted successfully.';
        this.load();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not delete process stage.');
      }
    });
  }
}
