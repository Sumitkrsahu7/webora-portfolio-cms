import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { AdminSessionService } from '../admin-session.service';

const API_URL = environment.apiUrl;

export interface PricingPackageItem {
  id?: string;
  name: string;
  slug: string;
  categoryLabel: string;
  priceLabel: string;
  billingNote: string;
  idealFor: string;
  featuresJson: string;
  excludedNote: string;
  supportPeriodLabel: string;
  highlighted: boolean;
  ctaLabel: string;
  displayOrder: number;
  published: boolean;
}

export type PolicyType = 'SEPARATE_COSTS' | 'SUPPORT_INCLUDED' | 'SUPPORT_EXCLUDED' | 'GENERAL';

export interface ServicePolicyItem {
  id?: string;
  title: string;
  policyType: PolicyType;
  summary: string;
  bulletPointsJson: string;
  displayOrder: number;
  published: boolean;
}

@Component({
  selector: 'app-pricing-policies-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="subtabs">
      <button
        type="button"
        class="subtab"
        [class.active]="activeTab === 'packages'"
        (click)="activeTab = 'packages'"
      >
        INR Packages ({{ packages.length }})
      </button>
      <button
        type="button"
        class="subtab"
        [class.active]="activeTab === 'policies'"
        (click)="activeTab = 'policies'"
      >
        Support &amp; Cost Policies ({{ policies.length }})
      </button>
    </div>

    @if (error) {
      <div class="alert error">{{ error }}</div>
    }
    @if (success) {
      <div class="alert success">{{ success }}</div>
    }

    @if (activeTab === 'packages') {
      <section class="section-heading">
        <div>
          <p class="eyebrow">PRICING PACKAGES</p>
          <h2>Manage INR packages</h2>
          <p class="muted">
            Configure website &amp; custom engineering packages with clear deliverables and support windows.
          </p>
        </div>

        <button class="primary" type="button" (click)="startPackageCreate()">
          ＋ Add package
        </button>
      </section>

      @if (showPkgForm) {
        <div class="form-panel content-editor">
          <h3>{{ editingPkgId ? 'Edit pricing package' : 'New pricing package' }}</h3>
          <form (ngSubmit)="savePackage()">
            <div class="form-grid">
              <div class="field">
                <label>Package Name *</label>
                <input
                  name="pkgName"
                  [(ngModel)]="pkgForm.name"
                  required
                  maxlength="160"
                  placeholder="e.g. Business Website"
                />
              </div>

              <div class="field">
                <label>Price Label *</label>
                <input
                  name="pkgPrice"
                  [(ngModel)]="pkgForm.priceLabel"
                  required
                  maxlength="120"
                  placeholder="e.g. ₹5,000 – ₹6,000"
                />
              </div>

              <div class="field">
                <label>Slug (optional auto-generated)</label>
                <input
                  name="pkgSlug"
                  [(ngModel)]="pkgForm.slug"
                  maxlength="160"
                  placeholder="business-website"
                />
              </div>

              <div class="field">
                <label>Badge / Category Label</label>
                <input
                  name="pkgCat"
                  [(ngModel)]="pkgForm.categoryLabel"
                  maxlength="120"
                  placeholder="e.g. MOST POPULAR"
                />
              </div>

              <div class="field">
                <label>Included Support Window</label>
                <input
                  name="pkgSupport"
                  [(ngModel)]="pkgForm.supportPeriodLabel"
                  maxlength="120"
                  placeholder="6 Months Basic Support Included"
                />
              </div>

              <div class="field">
                <label>Billing &amp; Scope Note</label>
                <input
                  name="pkgBilling"
                  [(ngModel)]="pkgForm.billingNote"
                  maxlength="255"
                  placeholder="One-time build fee · Domain & hosting separate"
                />
              </div>

              <div class="field full-field">
                <label>Ideal For</label>
                <input
                  name="pkgIdealFor"
                  [(ngModel)]="pkgForm.idealFor"
                  maxlength="500"
                  placeholder="Who gets the most value from this tier..."
                />
              </div>

              <div class="field full-field">
                <label>Included Features (one per line)</label>
                <textarea
                  name="pkgFeaturesText"
                  [(ngModel)]="pkgFeaturesText"
                  rows="5"
                  placeholder="Responsive layout&#10;CMS panel&#10;WhatsApp CTA"
                ></textarea>
              </div>

              <div class="field full-field">
                <label>Exclusion / Separate Cost Note</label>
                <input
                  name="pkgExcluded"
                  [(ngModel)]="pkgForm.excludedNote"
                  maxlength="500"
                  placeholder="Domain, cloud hosting, and paid external APIs billed separately."
                />
              </div>

              <div class="field">
                <label>CTA Button Label</label>
                <input
                  name="pkgCta"
                  [(ngModel)]="pkgForm.ctaLabel"
                  maxlength="80"
                  placeholder="Request Business Quote"
                />
              </div>

              <div class="field">
                <label>Display Order</label>
                <input
                  type="number"
                  name="pkgOrder"
                  [(ngModel)]="pkgForm.displayOrder"
                  required
                />
              </div>

              <div class="field">
                <label class="checkbox-row">
                  <input type="checkbox" name="pkgHighlighted" [(ngModel)]="pkgForm.highlighted" />
                  <span>Highlight as recommended tier</span>
                </label>
              </div>

              <div class="field">
                <label class="checkbox-row">
                  <input type="checkbox" name="pkgPublished" [(ngModel)]="pkgForm.published" />
                  <span>Publish on Pricing page</span>
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button class="secondary" type="button" (click)="cancelPkgEdit()">Cancel</button>
              <button class="primary" type="submit" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Save package' }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (loading) {
        <div class="empty-state">Loading pricing packages...</div>
      } @else if (packages.length === 0) {
        <div class="empty-state">
          <h3>No pricing packages configured</h3>
          <p>Add INR packages or run Flyway V11 to seed standard WEBORA tiers.</p>
        </div>
      } @else {
        <div class="card-grid">
          @for (pkg of packages; track pkg.id) {
            <article class="item-card" [class.highlighted]="pkg.highlighted">
              <div class="item-top">
                <span class="tag">{{ pkg.categoryLabel || 'PACKAGE' }}</span>
                <span class="status-badge" [class.published]="pkg.published">
                  {{ pkg.published ? 'Published' : 'Draft' }}
                </span>
              </div>
              <h3>{{ pkg.name }}</h3>
              <div class="price-display">{{ pkg.priceLabel }}</div>
              @if (pkg.billingNote) {
                <p class="muted-note">{{ pkg.billingNote }}</p>
              }
              @if (pkg.supportPeriodLabel) {
                <span class="support-chip">{{ pkg.supportPeriodLabel }}</span>
              }
              <div class="card-footer">
                <small>Order: {{ pkg.displayOrder }}</small>
                <div class="actions">
                  <button class="secondary" type="button" (click)="editPackage(pkg)">Edit</button>
                  <button class="secondary" type="button" (click)="togglePackage(pkg)">
                    {{ pkg.published ? 'Unpublish' : 'Publish' }}
                  </button>
                  <button class="danger" type="button" (click)="deletePackage(pkg)">Delete</button>
                </div>
              </div>
            </article>
          }
        </div>
      }
    }

    @if (activeTab === 'policies') {
      <section class="section-heading">
        <div>
          <p class="eyebrow">TRANSPARENCY &amp; TERMS</p>
          <h2>Manage separate costs &amp; support policies</h2>
          <p class="muted">
            Clarify domain/hosting separation and 6-month basic support boundaries.
          </p>
        </div>

        <button class="primary" type="button" (click)="startPolicyCreate()">
          ＋ Add policy
        </button>
      </section>

      @if (showPolicyForm) {
        <div class="form-panel content-editor">
          <h3>{{ editingPolicyId ? 'Edit policy' : 'New policy' }}</h3>
          <form (ngSubmit)="savePolicy()">
            <div class="form-grid">
              <div class="field">
                <label>Policy Title *</label>
                <input
                  name="polTitle"
                  [(ngModel)]="policyForm.title"
                  required
                  maxlength="160"
                  placeholder="e.g. 6 Months Basic Support (Included)"
                />
              </div>

              <div class="field">
                <label>Policy Type *</label>
                <select name="polType" [(ngModel)]="policyForm.policyType" required>
                  <option value="SEPARATE_COSTS">Separate Costs (Domain / Hosting)</option>
                  <option value="SUPPORT_INCLUDED">6-Month Support Included</option>
                  <option value="SUPPORT_EXCLUDED">Support Exclusions</option>
                  <option value="GENERAL">General Policy</option>
                </select>
              </div>

              <div class="field full-field">
                <label>Policy Summary *</label>
                <textarea
                  name="polSummary"
                  [(ngModel)]="policyForm.summary"
                  rows="3"
                  required
                  maxlength="2000"
                ></textarea>
              </div>

              <div class="field full-field">
                <label>Bullet Points (one per line)</label>
                <textarea
                  name="polBullets"
                  [(ngModel)]="policyBulletsText"
                  rows="5"
                ></textarea>
              </div>

              <div class="field">
                <label>Display Order</label>
                <input
                  type="number"
                  name="polOrder"
                  [(ngModel)]="policyForm.displayOrder"
                  required
                />
              </div>

              <div class="field">
                <label class="checkbox-row">
                  <input type="checkbox" name="polPublished" [(ngModel)]="policyForm.published" />
                  <span>Publish on Pricing page</span>
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button class="secondary" type="button" (click)="cancelPolicyEdit()">Cancel</button>
              <button class="primary" type="submit" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Save policy' }}
              </button>
            </div>
          </form>
        </div>
      }

      @if (policies.length === 0) {
        <div class="empty-state">
          <h3>No policies configured yet</h3>
          <p>Add cost and support transparency policies here.</p>
        </div>
      } @else {
        <div class="policy-list">
          @for (pol of policies; track pol.id) {
            <article class="policy-card">
              <div class="policy-main">
                <span class="tag">{{ pol.policyType }}</span>
                <h3>{{ pol.title }}</h3>
                <p>{{ pol.summary }}</p>
                <small>Order: {{ pol.displayOrder }}</small>
              </div>
              <div class="policy-actions">
                <span class="status-badge" [class.published]="pol.published">
                  {{ pol.published ? 'Published' : 'Draft' }}
                </span>
                <button class="secondary" type="button" (click)="editPolicy(pol)">Edit</button>
                <button class="secondary" type="button" (click)="togglePolicy(pol)">
                  {{ pol.published ? 'Unpublish' : 'Publish' }}
                </button>
                <button class="danger" type="button" (click)="deletePolicy(pol)">Delete</button>
              </div>
            </article>
          }
        </div>
      }
    }
  `,
  styles: [`
    .subtabs { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
    .subtab {
      background: var(--panel);
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 10px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 13px;
    }
    .subtab.active {
      border-color: rgba(161, 140, 255, 0.55);
      background: rgba(161, 140, 255, 0.14);
      color: #fff;
    }
    .content-editor { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .full-field { grid-column: 1 / -1; }
    .field label { font-size: 12px; color: var(--muted); font-weight: 600; }
    .checkbox-row { display: flex !important; flex-direction: row !important; align-items: center; gap: 8px; cursor: pointer; }
    .checkbox-row input[type='checkbox'] { width: 16px; height: 16px; accent-color: var(--accent); }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .item-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .item-card.highlighted { border-color: rgba(161, 140, 255, 0.55); }
    .item-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .tag {
      font-family: 'DM Mono', monospace;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(161, 140, 255, 0.12);
      color: var(--accent-soft);
      border: 1px solid rgba(161, 140, 255, 0.25);
    }
    .item-card h3 { margin: 0; color: #fff; font-size: 18px; }
    .price-display { font-size: 24px; font-weight: 800; color: var(--accent-soft); }
    .muted-note { margin: 0; font-size: 12.5px; color: var(--muted); }
    .support-chip {
      align-self: flex-start;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(74, 222, 128, 0.12);
      color: #86efac;
      border: 1px solid rgba(74, 222, 128, 0.3);
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border);
      padding-top: 12px;
      margin-top: auto;
      gap: 10px;
      flex-wrap: wrap;
    }
    .card-footer small, .policy-main small { color: var(--muted); font-family: 'DM Mono', monospace; font-size: 11px; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .policy-list { display: grid; gap: 14px; }
    .policy-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .policy-main h3 { margin: 8px 0 6px; color: #fff; font-size: 17px; }
    .policy-main p { margin: 0 0 8px; color: #c8c2d6; font-size: 13.5px; line-height: 1.55; }
    .policy-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
    .status-badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.06); color: var(--muted); border: 1px solid var(--border); }
    .status-badge.published { background: rgba(74,222,128,0.14); color: #86efac; border-color: rgba(74,222,128,0.35); }
    .alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 13px; }
    .alert.error { background: rgba(239,68,68,0.14); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5; }
    .alert.success { background: rgba(34,197,94,0.14); border: 1px solid rgba(34,197,94,0.4); color: #86efac; }
    @media (max-width: 720px) {
      .form-grid { grid-template-columns: 1fr; }
      .policy-card { flex-direction: column; }
      .policy-actions { flex-direction: row; flex-wrap: wrap; align-items: center; }
    }
  `]
})
export class PricingPoliciesPanelComponent implements OnInit {
  activeTab: 'packages' | 'policies' = 'packages';
  packages: PricingPackageItem[] = [];
  policies: ServicePolicyItem[] = [];
  loading = false;
  saving = false;
  error = '';
  success = '';

  showPkgForm = false;
  editingPkgId = '';
  pkgForm: PricingPackageItem = this.emptyPackage();
  pkgFeaturesText = '';

  showPolicyForm = false;
  editingPolicyId = '';
  policyForm: ServicePolicyItem = this.emptyPolicy();
  policyBulletsText = '';

  constructor(private http: HttpClient, private session: AdminSessionService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  emptyPackage(): PricingPackageItem {
    return {
      name: '',
      slug: '',
      categoryLabel: '',
      priceLabel: '',
      billingNote: '',
      idealFor: '',
      featuresJson: '',
      excludedNote: '',
      supportPeriodLabel: '6 Months Basic Support Included',
      highlighted: false,
      ctaLabel: 'Request Quote',
      displayOrder: this.packages.length + 1,
      published: true
    };
  }

  emptyPolicy(): ServicePolicyItem {
    return {
      title: '',
      policyType: 'SEPARATE_COSTS',
      summary: '',
      bulletPointsJson: '',
      displayOrder: this.policies.length + 1,
      published: true
    };
  }

  loadAll(): void {
    this.loading = true;
    this.error = '';
    this.http.get<PricingPackageItem[]>(`${API_URL}/admin/pricing`).subscribe({
      next: data => {
        this.packages = data || [];
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = this.session.extractErrorMessage(err, 'Could not load pricing packages.');
      }
    });
    this.http.get<ServicePolicyItem[]>(`${API_URL}/admin/policies`).subscribe({
      next: data => { this.policies = data || []; },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not load policies.');
      }
    });
  }

  private jsonToLines(raw?: string | null): string {
    if (!raw) return '';
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.join('\n') : raw;
    } catch {
      return raw;
    }
  }

  private linesToJson(text: string): string | null {
    const items = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    return items.length > 0 ? JSON.stringify(items) : null;
  }

  startPackageCreate(): void {
    this.editingPkgId = '';
    this.pkgForm = this.emptyPackage();
    this.pkgFeaturesText = '';
    this.error = '';
    this.success = '';
    this.showPkgForm = true;
  }

  editPackage(pkg: PricingPackageItem): void {
    this.editingPkgId = pkg.id || '';
    this.pkgForm = { ...pkg };
    this.pkgFeaturesText = this.jsonToLines(pkg.featuresJson);
    this.error = '';
    this.success = '';
    this.showPkgForm = true;
  }

  cancelPkgEdit(): void {
    this.showPkgForm = false;
    this.editingPkgId = '';
    this.pkgForm = this.emptyPackage();
    this.pkgFeaturesText = '';
  }

  savePackage(): void {
    if (!this.pkgForm.name.trim() || !this.pkgForm.priceLabel.trim()) {
      this.error = 'Package name and price label are required.';
      return;
    }
    const payload = {
      name: this.pkgForm.name.trim(),
      slug: this.pkgForm.slug.trim() || null,
      categoryLabel: this.pkgForm.categoryLabel.trim() || null,
      priceLabel: this.pkgForm.priceLabel.trim(),
      billingNote: this.pkgForm.billingNote.trim() || null,
      idealFor: this.pkgForm.idealFor.trim() || null,
      featuresJson: this.linesToJson(this.pkgFeaturesText),
      excludedNote: this.pkgForm.excludedNote.trim() || null,
      supportPeriodLabel: this.pkgForm.supportPeriodLabel.trim() || null,
      highlighted: Boolean(this.pkgForm.highlighted),
      ctaLabel: this.pkgForm.ctaLabel.trim() || null,
      displayOrder: Number(this.pkgForm.displayOrder) || 0,
      published: Boolean(this.pkgForm.published)
    };
    this.saving = true;
    this.error = '';
    this.success = '';
    const req$ = this.editingPkgId
      ? this.http.put<PricingPackageItem>(`${API_URL}/admin/pricing/${this.editingPkgId}`, payload)
      : this.http.post<PricingPackageItem>(`${API_URL}/admin/pricing`, payload);
    req$.subscribe({
      next: () => {
        this.saving = false;
        this.showPkgForm = false;
        this.editingPkgId = '';
        this.success = 'Pricing package saved successfully.';
        this.loadAll();
      },
      error: err => {
        this.saving = false;
        this.error = this.session.extractErrorMessage(err, 'Could not save pricing package.');
      }
    });
  }

  togglePackage(pkg: PricingPackageItem): void {
    if (!pkg.id) return;
    this.http.put<PricingPackageItem>(`${API_URL}/admin/pricing/${pkg.id}`, {
      ...pkg,
      published: !pkg.published
    }).subscribe({
      next: () => {
        this.success = `Package ${!pkg.published ? 'published' : 'unpublished'} successfully.`;
        this.loadAll();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not update package.');
      }
    });
  }

  deletePackage(pkg: PricingPackageItem): void {
    if (!pkg.id || !confirm(`Delete package "${pkg.name}"?`)) return;
    this.http.delete(`${API_URL}/admin/pricing/${pkg.id}`).subscribe({
      next: () => {
        this.success = 'Pricing package deleted successfully.';
        this.loadAll();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not delete package.');
      }
    });
  }

  startPolicyCreate(): void {
    this.editingPolicyId = '';
    this.policyForm = this.emptyPolicy();
    this.policyBulletsText = '';
    this.error = '';
    this.success = '';
    this.showPolicyForm = true;
  }

  editPolicy(pol: ServicePolicyItem): void {
    this.editingPolicyId = pol.id || '';
    this.policyForm = { ...pol };
    this.policyBulletsText = this.jsonToLines(pol.bulletPointsJson);
    this.error = '';
    this.success = '';
    this.showPolicyForm = true;
  }

  cancelPolicyEdit(): void {
    this.showPolicyForm = false;
    this.editingPolicyId = '';
    this.policyForm = this.emptyPolicy();
    this.policyBulletsText = '';
  }

  savePolicy(): void {
    if (!this.policyForm.title.trim() || !this.policyForm.summary.trim()) {
      this.error = 'Policy title and summary are required.';
      return;
    }
    const payload = {
      title: this.policyForm.title.trim(),
      policyType: this.policyForm.policyType,
      summary: this.policyForm.summary.trim(),
      bulletPointsJson: this.linesToJson(this.policyBulletsText),
      displayOrder: Number(this.policyForm.displayOrder) || 0,
      published: Boolean(this.policyForm.published)
    };
    this.saving = true;
    this.error = '';
    this.success = '';
    const req$ = this.editingPolicyId
      ? this.http.put<ServicePolicyItem>(`${API_URL}/admin/policies/${this.editingPolicyId}`, payload)
      : this.http.post<ServicePolicyItem>(`${API_URL}/admin/policies`, payload);
    req$.subscribe({
      next: () => {
        this.saving = false;
        this.showPolicyForm = false;
        this.editingPolicyId = '';
        this.success = 'Policy saved successfully.';
        this.loadAll();
      },
      error: err => {
        this.saving = false;
        this.error = this.session.extractErrorMessage(err, 'Could not save policy.');
      }
    });
  }

  togglePolicy(pol: ServicePolicyItem): void {
    if (!pol.id) return;
    this.http.put<ServicePolicyItem>(`${API_URL}/admin/policies/${pol.id}`, {
      ...pol,
      published: !pol.published
    }).subscribe({
      next: () => {
        this.success = `Policy ${!pol.published ? 'published' : 'unpublished'} successfully.`;
        this.loadAll();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not update policy.');
      }
    });
  }

  deletePolicy(pol: ServicePolicyItem): void {
    if (!pol.id || !confirm(`Delete policy "${pol.title}"?`)) return;
    this.http.delete(`${API_URL}/admin/policies/${pol.id}`).subscribe({
      next: () => {
        this.success = 'Policy deleted successfully.';
        this.loadAll();
      },
      error: err => {
        this.error = this.session.extractErrorMessage(err, 'Could not delete policy.');
      }
    });
  }
}
