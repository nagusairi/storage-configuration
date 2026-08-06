import { useState } from 'react';
import type { WizardState, NamingRules } from '../types';

interface Props { state: WizardState; onChange: (s: WizardState) => void; }

const SUB_TABS = ['Location Codes', 'Barcode / QR', 'Capacity Rules', 'Reserved / Blocked'];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-[#5C1F3D]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f0f4f8] last:border-b-0">
      <div>
        <p className="text-sm font-medium text-[#172B4D]">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export function Step6NamingRules({ state, onChange }: Props) {
  const [subTab, setSubTab] = useState(0);
  const rules = state.namingRules;

  const update = (patch: Partial<NamingRules>) => {
    onChange({ ...state, namingRules: { ...rules, ...patch } });
  };

  const input = (field: keyof NamingRules, type: string = 'text', extra: object = {}) => (
    <input
      type={type}
      value={rules[field] as string | number}
      onChange={e => update({ [field]: type === 'number' ? Number(e.target.value) : e.target.value })}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#5C1F3D] focus:ring-1 focus:ring-[#5C1F3D]/20 transition"
      {...extra}
    />
  );

  return (
    <div className="p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#172B4D] mb-1">Naming & Rules</h3>
        <p className="text-sm text-gray-500">Configure location codes, barcodes, and capacity rules.</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-5 w-fit">
        {SUB_TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setSubTab(idx)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${subTab === idx ? 'bg-white text-[#172B4D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#d1def0] p-5">
        {subTab === 0 && (
          <div className="grid grid-cols-2 gap-5">
            <Field label="Location Code Prefix">
              {input('prefix')}
            </Field>
            <Field label="Separator Character">
              {input('separator')}
            </Field>
            <Field label="Digit Padding (e.g. 3 → 001, 002)">
              {input('padding', 'number', { min: 0, max: 10 })}
            </Field>
            <Field label="Sequence Type">
              <select
                value={rules.sequence}
                onChange={e => update({ sequence: e.target.value as NamingRules['sequence'] })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#5C1F3D] bg-white"
              >
                <option value="numeric">Numeric (001, 002, ...)</option>
                <option value="alpha">Alphabetic (A, B, ...)</option>
                <option value="alphanumeric">Alphanumeric (A01, A02, ...)</option>
              </select>
            </Field>
            <div className="col-span-2 p-3 bg-[#f7f8f9] rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Preview</p>
              <p className="text-sm font-mono font-bold text-[#172B4D]">
                {rules.prefix}{rules.separator}ZA{rules.separator}{'1'.padStart(rules.padding, '0')}
                &nbsp;→&nbsp;
                {rules.prefix}{rules.separator}ZA{rules.separator}{'2'.padStart(rules.padding, '0')}
              </p>
            </div>
          </div>
        )}

        {subTab === 1 && (
          <div className="flex flex-col divide-y divide-[#f0f4f8]">
            <Row label="Auto-generate Barcode" description="Automatically generate barcodes for all storage locations on publish">
              <Toggle enabled={rules.autoGenerateBarcode} onChange={v => update({ autoGenerateBarcode: v })} />
            </Row>
            <Row label="Auto-generate QR Code" description="Also generate QR codes alongside barcodes">
              <Toggle enabled={rules.autoGenerateQR} onChange={v => update({ autoGenerateQR: v })} />
            </Row>
            <div className="py-3">
              <Field label="Barcode Format">
                <select
                  value={rules.barcodeFormat}
                  onChange={e => update({ barcodeFormat: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#5C1F3D] bg-white"
                >
                  <option value="CODE128">CODE128 (recommended)</option>
                  <option value="CODE39">CODE39</option>
                  <option value="EAN13">EAN-13</option>
                  <option value="QR">QR Only</option>
                </select>
              </Field>
            </div>
          </div>
        )}

        {subTab === 2 && (
          <div className="text-sm text-gray-500">
            <p className="mb-4">Set capacity constraints per hierarchy level. These are applied globally across all zones unless overridden per zone.</p>
            {state.hierarchyModel.levels.filter(l => l.supportsCapacity).map(lvl => (
              <div key={lvl.id} className="flex items-center gap-4 mb-3">
                <span className="w-24 text-sm font-medium text-[#172B4D]">{lvl.name}</span>
                <div className="flex items-center gap-2 flex-1">
                  <input type="number" className="w-28 text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#5C1F3D]" placeholder="Max weight (kg)" />
                  <input type="number" className="w-28 text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#5C1F3D]" placeholder="Max volume (m³)" />
                </div>
              </div>
            ))}
          </div>
        )}

        {subTab === 3 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">Mark specific location codes as reserved or blocked. These will be excluded from auto-generation.</p>
            <textarea
              className="w-full h-32 text-sm border border-gray-200 rounded-lg p-3 outline-none focus:border-[#5C1F3D] font-mono resize-none"
              placeholder="Enter location codes, one per line (e.g. WH-ZA-001, WH-ZA-002)"
            />
          </div>
        )}
      </div>
    </div>
  );
}
