import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { AdminSessionService } from '../admin-session.service';

const API_URL = environment.apiUrl;

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-faqs-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="crud-toolbar">
      <div>
        <h2>Frequently Asked Questions</h2>
        <p class="muted">Manage pricing, support policy, billing, and process answers shown across the public website.</p>
      </div>
      <button type="button" class="primary" (click)="openNewForm()">+ Add FAQ</button>
    </div>

    @if (error) {
      <div class="alert error">{{ error }}</div>
    }
    @if (success) {
      <div class="alert success">{{ success }}</div>
    }

    @if (showForm) {
      <form class="panel-card" (ngSubmit)="save()">
        <h3>{{ editingId ? 'Edit FAQ' : 'New FAQ' }}</h3>

        <div class="form-grid">
          <div class="full-span">
            <label>Question *</label>
            <input type="text" name="question" [(ngModel)]="form.question" required maxlength="300" />
          </div>

          <div>
            <label>Category</label>
            <input type="text" name="category" [(ngModel)]="form.category" placeholder="Pricing, Support, Billing, Timeline..." maxlength="80" />
          </div>

          <div>
            <label>Display order</label>
            <input type="number" name="displayOrder" [(ngModel)]="form.displayOrder" min="1" required />
          </div>

          <div class="full-span">
            <label>Answer *</label>
            <textarea name="answer" rows="4" [(ngModel)]="form.answer" required maxlength="4000"></textarea>
          </div>

          <label class="checkbox-row full-span">
            <input type="checkbox" name="published" [(ngModel)]="form.published" />
            <span>Published on public website</span>
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="primary" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save FAQ' }}
          </button>
          <button type="button" class="secondary" (click)="cancel()">Cancel</button>
        </div>
      </form>
    }

    @if (loading) {
      <div class="empty-state">Loading FAQs...</div>
    } @else if (items.length === 0) {
      <div class="empty-state">
        <h3>No FAQs configured yet</h3>
        <p>Add common customer questions to help visitors understand your pricing, timelines, and support policy.</p>
      </div>
    } @else {
      <div class="card-list">
        @for (item of items; track item.id) {
          <article class="panel-card">
            <div class="item-header">
              <div>
                <span class="tag">{{ item.category || 'General' }}</span>
                <h4>#{{ item.displayOrder }} — {{ item.question }}</h4>
              </div>
              <span class="tag" [class.tag-published]="item.published">
                {{ item.published ? 'Published' : 'Hidden' }}
              </span>
            </div>
            <p class="faq-answer">{{ item.answer }}</p>
            <div class="item-actions">
              <button type="button" class="secondary" (click)="edit(item)">Edit</button>
              <button type="button" class="danger" (click)="remove(item)">Delete</button>
            </div>
          </article>
        }
      </div>
    }
  `,
  styles: [`
    .crud-toolbar { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px; flex-wrap: wrap; }
    .crud-toolbar h2 { margin: 0 0 4px; font-size: 20px; color: #fff; }
    .muted { margin: 0; font-size: 13.5px; color: #9c95ad; }
    .panel-card { background: rgba(24, 20, 36, 0.9); border: 1px solid rgba(161, 140, 255, 0.2); border-radius: 12px; padding: 18px; margin-bottom: 14px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 14px 0; }
    .full-span { grid-column: 1 / -1; }
    .form-grid label { display: block; font-size: 12.5px; color: #c8c2d6; margin-bottom: 5px; }
    .form-grid input[type="text"], .form-grid input[type="number"], .form-grid textarea {
      width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px;
      border: 1px solid rgba(161, 140, 255, 0.25); background: #0f0c18; color: #fff; font: inherit;
    }
    .checkbox-row { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
    .form-actions, .item-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .card-list { display: grid; gap: 12px; }
    .item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
    .item-header h4 { margin: 6px 0 0; color: #fff; font-size: 16px; }
    .tag {
      font-family: 'DM Mono', monospace; font-size: 11px; padding: 3px 9px; border-radius: 999px;
      background: rgba(161, 140, 255, 0.14); color: #c4b5fd; border: 1px solid rgba(161, 140, 255, 0.28);
    }
    .tag-published { background: rgba(74, 222, 128, 0.12); color: #86efac; border-color: rgba(74, 222, 128, 0.3); }
    .faq-answer { margin: 8px 0 12px; color: #c8c2d6; line-height: 1.6; }
    .alert { padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-size: 13.5px; }
    .alert.error { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.35); }
    .alert.success { background: rgba(34, 197, 94, 0.15); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.35); }
    @media (max-width: 720px) { .form-grid { grid-template-columns: 1fr; } }
  `],
})
export class FaqsPanelComponent implements OnInit {
  items: FaqItem[] = [];
  form: FaqItem = this.emptyForm();
  editingId = '';
  showForm = false;
  loading = false;
  saving = false;
  error = '';
  success = '';

  constructor(
    private readonly http: HttpClient,
    private readonly session: AdminSessionService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  emptyForm(): FaqItem {
    return {
      question: '',
      answer: '',
      category: 'Pricing',
      displayOrder: this.items.length + 1,
      published: true,
    };
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.http.get<FaqItem[]>(`${API_URL}/admin/faqs`).subscribe({
      next: (data) => {
        this.items = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.session.notifyUnauthorized();
          return;
        }
        this.error = 'Could not load FAQs.';
      },
    });
  }

  openNewForm(): void {
    this.editingId = '';
    this.form = this.emptyForm();
    this.showForm = true;
    this.error = '';
    this.success = '';
  }

  edit(item: FaqItem): void {
    this.editingId = item.id || '';
    this.form = { ...item };
    this.showForm = true;
    this.error = '';
    this.success = '';
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = '';
  }

  save(): void {
    this.saving = true;
    this.error = '';
    this.success = '';

    const req$ = this.editingId
      ? this.http.put<FaqItem>(`${API_URL}/admin/faqs/${this.editingId}`, this.form)
      : this.http.post<FaqItem>(`${API_URL}/admin/faqs`, this.form);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingId = '';
        this.success = 'FAQ saved successfully.';
        this.load();
      },
      error: (err) => {
        this.saving = false;
        if (err.status === 401) {
          this.session.notifyUnauthorized();
          return;
        }
        this.error = 'Could not save FAQ. Ensure question, answer, and display order >= 1 are provided.';
      },
    });
  }

  remove(item: FaqItem): void {
    if (!item.id || !confirm(`Delete FAQ "${item.question}"?`)) return;
    this.error = '';
    this.success = '';
    this.http.delete(`${API_URL}/admin/faqs/${item.id}`).subscribe({
      next: () => {
        this.success = 'FAQ deleted.';
        this.load();
      },
      error: (err) => {
        if (err.status === 401) {
          this.session.notifyUnauthorized();
          return;
        }
        this.error = 'Could not delete FAQ.';
      },
    });
  }
}
