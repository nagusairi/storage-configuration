export default function AiDesignGuidelinesGlobalRules() {
  return (
    <div className="bg-white relative size-full" data-name="AI DESIGN GUIDELINES – GLOBAL RULES">
      <div className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-[49px] not-italic text-[12px] text-black text-nowrap top-[50px]">
        <p className="leading-[normal] mb-0 whitespace-pre">📌 AI DESIGN GUIDELINES – GLOBAL RULES (flowOne)</p>
        <p className="leading-[normal] mb-0 whitespace-pre">
          Use these rules for EVERY screen. Do NOT override unless explicitly instructed.
          <br aria-hidden="true" />
          {` All generated screens must follow these UX, UI, accessibility, layout, and design-system principles.`}
        </p>
        <p className="leading-[normal] mb-0 whitespace-pre">1. Core UX Philosophy (Required)</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Prioritize clarity, simplicity, predictability, and intuitive navigation.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Follow Nielsen’s 10 Heuristics, Fitts’ Law, Hick’s Law, and Gestalt grouping.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Reduce cognitive load using progressive disclosure, grouping, segmentation, and clear hierarchy.</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">Every action or component must have a clear purpose and feedback.</span>
          </li>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">{`2. Layout, Spacing & Structure Standards`}</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Use Auto Layout everywhere. No manual spacing unless required.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Strict 8-point spacing system (8/16/24/32 px).</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Global margins = 24px.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Component padding = 16px.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Grid alignment must remain consistent across all screens.</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">
              Maintain clear hierarchy:
              <br aria-hidden="true" />
              H1 → H2 → Subtitle → Body → Caption.
            </span>
          </li>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">3. Branding Guidelines (flowOne)</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Font: Poppins (all weights available).</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Corner Radius: 8–12px for components, 12–16px for containers.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Color Tokens:</span>
          </li>
          <ul className="mb-0">
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Primary (flowOne Blues): For CTAs, primary interactions.</span>
            </li>
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Secondary (Purples): For highlights and AI features.</span>
            </li>
            <li className="ms-[36px]">
              <span className="leading-[normal]">Neutral Grays: For backgrounds, borders, text hierarchy.</span>
            </li>
          </ul>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">No gradients unless explicitly requested.</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">Icons must follow a consistent line style, 20–24px.</span>
          </li>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">{`4. Component & Interaction Rules`}</p>
        <p className="leading-[normal] mb-0 whitespace-pre">Buttons</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Required states: default, hover, pressed, disabled.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Primary button always uses flowOne primary blue.</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">Secondary button uses outlined or neutral variants.</span>
          </li>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">Tables</p>
        <ul className="mb-0">
          <li className="list-disc mb-0 ms-[18px]">
            <span className="leading-[normal]">Must include:</span>
          </li>
          <ul className="list-disc">
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Sorting arrows</span>
            </li>
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Hover states</span>
            </li>
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Optional filtering</span>
            </li>
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Zebra rows if heavy data</span>
            </li>
            <li className="ms-[36px]">
              <span className="leading-[normal]">Fixed header for long tables</span>
            </li>
          </ul>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">Cards</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Use shadow at 4–8dp.</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">Include title → insight → action hierarchy.</span>
          </li>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">Forms</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Label, input, helper text, error state mandatory.</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">Error text in red with clear messaging.</span>
          </li>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">5. Accessibility Standards</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Minimum text size:</span>
          </li>
          <ul className="mb-0">
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Body: 14px</span>
            </li>
            <li className="ms-[36px]">
              <span className="leading-[normal]">Table text: 16px</span>
            </li>
          </ul>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Minimum contrast ratio: 4.5 : 1.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Touch targets must be 44px or larger.</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">Clear focus states for all interactive elements.</span>
          </li>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">6. Common Screen Structure Framework</p>
        <p className="leading-[normal] mb-0 whitespace-pre">All screens must follow this baseline structure unless otherwise instructed:</p>
        <ol className="list-decimal mb-0" start="1">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Header / Top Navigation</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Left Navigation Panel</span>
          </li>
          <ul className="list-disc mb-0">
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Dynamic module switching</span>
            </li>
            <li className="ms-[36px]">
              <span className="leading-[normal]">Replace menu items based on module selection</span>
            </li>
          </ul>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Main Content Area</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Optional Right Context Panel (details, insights, related items)</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">AI Insights Panel (if the module uses AI)</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">Footer (optional)</span>
          </li>
        </ol>
        <p className="leading-[normal] mb-0 whitespace-pre">7. AI Interaction Rules</p>
        <ul className="mb-0">
          <li className="list-disc mb-0 ms-[18px]">
            <span className="leading-[normal]">Always show actionable AI insights such as:</span>
          </li>
          <ul className="list-disc mb-0">
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Recommendations</span>
            </li>
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Predictions</span>
            </li>
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Alerts</span>
            </li>
            <li className="ms-[36px]">
              <span className="leading-[normal]">Risk indicators</span>
            </li>
          </ul>
          <li className="list-disc mb-0 ms-[18px]">
            <span className="leading-[normal]">Place AI insights in a visually distinct card using secondary (purple) tokens.</span>
          </li>
          <li className="list-disc mb-0 ms-[18px]">
            <span className="leading-[normal]">AI content must always be:</span>
          </li>
          <ul className="list-disc">
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Short</span>
            </li>
            <li className="mb-0 ms-[36px]">
              <span className="leading-[normal]">Actionable</span>
            </li>
            <li className="ms-[36px]">
              <span className="leading-[normal]">High-value</span>
            </li>
          </ul>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">8. Usability Standards</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Show KPIs above the fold on dashboards.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Avoid clutter — use whitespace effectively.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Group related elements visually.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Use consistent iconography and terminology.</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">Provide tooltips for icons, unclear actions, or abbreviations.</span>
          </li>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">9. Persistence Rule for Figma Make</p>
        <p className="leading-[normal] mb-0 whitespace-pre">These guidelines must be applied to every generated frame, layout, component, or screen unless the prompt explicitly overrides a rule.</p>
        <p className="leading-[normal] mb-0 whitespace-pre">&nbsp;</p>
        <p className="leading-[normal] mb-0 whitespace-pre">10. Modern Interaction Design Patterns (2025 SaaS Standards)</p>
        <p className="leading-[normal] mb-0 whitespace-pre">Use these patterns wherever appropriate:</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Command palette (quick actions)</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">AI insight panel</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Multi-panel layouts</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Progressive disclosure</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Sticky headers</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Inline editing</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Bulk action toolbars</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Smart empty states</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Right-side contextual drawer</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Floating filter bar</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Segmented controls</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Accordions for long forms</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">{`Global search pattern `}</span>
          </li>
        </ul>
        <p className="leading-[normal] mb-0 whitespace-pre">11. Information Architecture Standards</p>
        <p className="leading-[normal] mb-0 whitespace-pre">All screens must follow consistent IA principles:</p>
        <ul className="list-disc">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Top-level modules remain constant</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Navigation adapts per module</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Group content using visual hierarchy</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Overview pages → KPIs → charts → tables</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Detail pages → summary → stats → details → activity → related</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Forms must group fields logically</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Tables follow consistent column hierarchy</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">Contextual data should live in the right panel</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">Primary tasks always above the fold</span>
          </li>
        </ul>
      </div>
    </div>
  );
}