/**
 * FilterToggleButton Component Examples
 * 
 * This file demonstrates all variants and states of the FilterToggleButton component.
 * Use this as a reference for implementing the button across the ERP application.
 */

import { useState } from 'react';
import { FilterToggleButton } from '../FilterToggleButton';
import { Settings, Sliders } from 'lucide-react';

export function FilterToggleButtonExamples() {
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(true);
  const [isActive3, setIsActive3] = useState(false);

  return (
    <div className="p-8 space-y-12 bg-gray-50">
      <div>
        <h1 className="text-2xl mb-6">FilterToggleButton Component Examples</h1>
        <p className="text-gray-600 mb-8">
          A comprehensive showcase of all FilterToggleButton variants, states, and configurations.
        </p>
      </div>

      {/* Basic Usage */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Basic Usage</h2>
        <div className="flex flex-wrap items-center gap-4">
          <FilterToggleButton
            isActive={isActive1}
            onClick={() => setIsActive1(!isActive1)}
            activeCount={0}
          />
          <FilterToggleButton
            isActive={isActive2}
            onClick={() => setIsActive2(!isActive2)}
            activeCount={3}
          />
          <p className="text-sm text-gray-600">
            Click the buttons to toggle between active and inactive states.
          </p>
        </div>
      </section>

      {/* Size Variants */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Size Variants</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Small</p>
            <FilterToggleButton
              isActive={false}
              onClick={() => {}}
              activeCount={2}
              size="small"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Medium (Default)</p>
            <FilterToggleButton
              isActive={false}
              onClick={() => {}}
              activeCount={3}
              size="medium"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Large</p>
            <FilterToggleButton
              isActive={false}
              onClick={() => {}}
              activeCount={5}
              size="large"
            />
          </div>
        </div>
      </section>

      {/* Badge Variants */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Badge Color Variants</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Primary (Default)</p>
            <FilterToggleButton
              isActive={true}
              onClick={() => {}}
              activeCount={3}
              badgeVariant="primary"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Secondary</p>
            <FilterToggleButton
              isActive={true}
              onClick={() => {}}
              activeCount={3}
              badgeVariant="secondary"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Success</p>
            <FilterToggleButton
              isActive={true}
              onClick={() => {}}
              activeCount={3}
              badgeVariant="success"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Warning</p>
            <FilterToggleButton
              isActive={true}
              onClick={() => {}}
              activeCount={10}
              badgeVariant="warning"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Danger</p>
            <FilterToggleButton
              isActive={true}
              onClick={() => {}}
              activeCount={1}
              badgeVariant="danger"
            />
          </div>
        </div>
      </section>

      {/* States */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">States</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Inactive (No Filters)</p>
            <FilterToggleButton
              isActive={false}
              onClick={() => {}}
              activeCount={0}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Active (With Badge)</p>
            <FilterToggleButton
              isActive={true}
              onClick={() => {}}
              activeCount={5}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Disabled</p>
            <FilterToggleButton
              isActive={false}
              onClick={() => {}}
              activeCount={0}
              disabled={true}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Disabled (With Badge)</p>
            <FilterToggleButton
              isActive={true}
              onClick={() => {}}
              activeCount={3}
              disabled={true}
            />
          </div>
        </div>
      </section>

      {/* Custom Labels */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Custom Labels</h2>
        <div className="flex flex-wrap items-center gap-4">
          <FilterToggleButton
            isActive={false}
            onClick={() => {}}
            label="Filters"
            activeCount={0}
          />
          <FilterToggleButton
            isActive={false}
            onClick={() => {}}
            label="Advanced Filters"
            activeCount={2}
          />
          <FilterToggleButton
            isActive={false}
            onClick={() => {}}
            label="Quick Filters"
            activeCount={5}
          />
        </div>
      </section>

      {/* Custom Icons */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Custom Icons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <FilterToggleButton
            isActive={false}
            onClick={() => {}}
            icon={<Settings className="w-4 h-4" />}
            label="Settings"
            activeCount={3}
          />
          <FilterToggleButton
            isActive={true}
            onClick={() => {}}
            icon={<Sliders className="w-4 h-4" />}
            label="Advanced"
            activeCount={7}
          />
        </div>
      </section>

      {/* Always Show Badge */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Always Show Badge (Zero State)</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Default (Hidden at 0)</p>
            <FilterToggleButton
              isActive={false}
              onClick={() => {}}
              activeCount={0}
              alwaysShowBadge={false}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Always Visible</p>
            <FilterToggleButton
              isActive={false}
              onClick={() => {}}
              activeCount={0}
              alwaysShowBadge={true}
            />
          </div>
        </div>
      </section>

      {/* Tooltips */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Custom Tooltips</h2>
        <p className="text-sm text-gray-600 mb-4">Hover over the buttons to see custom tooltips</p>
        <div className="flex flex-wrap items-center gap-4">
          <FilterToggleButton
            isActive={false}
            onClick={() => {}}
            activeCount={0}
            tooltip="Open filter panel to refine results"
          />
          <FilterToggleButton
            isActive={true}
            onClick={() => {}}
            activeCount={5}
            tooltip="Close advanced filters panel"
          />
          <FilterToggleButton
            isActive={false}
            onClick={() => {}}
            disabled={true}
            tooltip="Filters unavailable for this view"
          />
        </div>
      </section>

      {/* Backward Compatibility */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Backward Compatibility (Deprecated Props)</h2>
        <p className="text-sm text-gray-600 mb-4">Old prop names still work but are deprecated</p>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Old Props (showFilters, onToggle)</p>
            <FilterToggleButton
              showFilters={isActive3}
              onToggle={() => setIsActive3(!isActive3)}
              activeFilterCount={4}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">New Props (isActive, onClick)</p>
            <FilterToggleButton
              isActive={isActive3}
              onClick={() => setIsActive3(!isActive3)}
              activeCount={4}
            />
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Interactive Demo</h2>
        <p className="text-sm text-gray-600 mb-4">
          Simulates a realistic use case with filter panel toggle
        </p>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm">Product List</h3>
            <FilterToggleButton
              isActive={isActive1}
              onClick={() => setIsActive1(!isActive1)}
              activeCount={isActive1 ? 3 : 0}
            />
          </div>
          {isActive1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 mb-2">Filter Panel</p>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded border border-blue-100 text-xs">
                  Category: Electronics
                </div>
                <div className="bg-white p-2 rounded border border-blue-100 text-xs">
                  Price Range: $100 - $500
                </div>
                <div className="bg-white p-2 rounded border border-blue-100 text-xs">
                  In Stock: Yes
                </div>
              </div>
            </div>
          )}
          {!isActive1 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Click the Filters button above to show filter panel
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Code Examples */}
      <section className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg mb-4">Code Examples</h2>
        <div className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <pre>{`// Basic Usage
<FilterToggleButton
  isActive={showFilters}
  onClick={() => setShowFilters(!showFilters)}
  activeCount={filterCount}
/>`}</pre>
          </div>
          
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <pre>{`// With Custom Badge Color
<FilterToggleButton
  isActive={true}
  onClick={handleToggle}
  activeCount={10}
  badgeVariant="warning"
  label="Advanced Filters"
/>`}</pre>
          </div>
          
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <pre>{`// Disabled State
<FilterToggleButton
  isActive={false}
  onClick={handleToggle}
  disabled={true}
  tooltip="Filters unavailable"
/>`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FilterToggleButtonExamples;
