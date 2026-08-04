import { useState } from 'react';
import { ModulePageTemplate } from '../components/layouts/ModulePageTemplate';
import { DataAgentButton } from '../components/DataAgentButton';
import { DataAgentPanel } from '../components/DataAgentPanel';
import { DataAgentBanner } from '../components/DataAgentBanner';
import { useSidebar } from '../contexts/SidebarContext';
import { Sparkles, CheckCircle, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';

/**
 * Example page demonstrating Data Agent implementation
 * 
 * This shows how to integrate the AI Data Agent functionality
 * with custom insights specific to a finance/banking module.
 */
export default function DataAgentExample() {
  const { sidebarExpanded } = useSidebar();
  
  // Data Agent state management
  const [showDataAgent, setShowDataAgent] = useState(false);
  const [dataAgentAnalyzing, setDataAgentAnalyzing] = useState(false);
  const [dataAgentActive, setDataAgentActive] = useState(false);

  /**
   * Handle Data Agent activation
   * Shows analyzing state, then activates the agent after simulated delay
   */
  const handleDataAgentActivate = () => {
    setDataAgentAnalyzing(true);
    setShowDataAgent(true);
    
    // Simulate AI analysis (replace with actual API call in production)
    setTimeout(() => {
      setDataAgentAnalyzing(false);
      setDataAgentActive(true);
    }, 1500);
  };

  // Custom Data Agent content with finance-specific insights
  const customDataAgentContent = (
    <div className="space-y-4">
      {/* Account Health Score */}
      <div>
        <h4 className="text-xs text-gray-500 mb-2 uppercase">Account Health</h4>
        <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-900">Excellent</span>
            <span className="text-lg text-green-900">95/100</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
          </div>
          <div className="mt-2 space-y-1 text-xs text-green-700">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Regular transactions</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>No overdrafts</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Healthy balance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Insights */}
      <div>
        <h4 className="text-xs text-gray-500 mb-2 uppercase">Cash Flow Insights</h4>
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-xs">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-blue-900">Positive Trend</div>
                <div className="text-blue-700 mt-0.5">Average balance increased by 15% this quarter</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded text-xs">
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#5C1F3D] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-purple-900">Smart Prediction</div>
                <div className="text-purple-700 mt-0.5">Expected month-end balance: ₹925,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Pattern */}
      <div>
        <h4 className="text-xs text-gray-500 mb-2 uppercase">Transaction Pattern</h4>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Monthly Inflow:</span>
              <span className="text-gray-900">₹450,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Monthly Outflow:</span>
              <span className="text-gray-900">₹380,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction Frequency:</span>
              <span className="text-gray-900">45/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Peak Activity:</span>
              <span className="text-gray-900">1st-5th of month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="text-xs text-gray-500 mb-2 uppercase">AI Recommendations</h4>
        <div className="space-y-2">
          <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded hover:shadow-sm transition-all text-left text-xs">
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#5C1F3D] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gray-900">Optimize payment timing</div>
                <div className="text-gray-500 mt-0.5">Save ₹5,000/month on early payments</div>
              </div>
            </div>
          </button>

          <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded hover:shadow-sm transition-all text-left text-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-gray-900">Review recurring charges</div>
                <div className="text-gray-500 mt-0.5">2 subscriptions may be duplicates</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Finance', 'Accounts & Transactions']}
      sidebarExpanded={sidebarExpanded}
      breadcrumbActions={
        <DataAgentButton
          onClick={handleDataAgentActivate}
          analyzing={dataAgentAnalyzing}
          active={dataAgentActive}
          variant="gradient"
          size="small"
        />
      }
    >
      {/* Main layout with flex container */}
      <div className="flex gap-4">
        {/* Left column - Main content */}
        <div className="flex-1">
          {/* Data Agent Active Banner */}
          <DataAgentBanner 
            isActive={dataAgentActive}
            message="Smart suggestions enabled. Review AI insights in the panel on the right."
          />
          
          {/* Example Content - KPI Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Balance</div>
                  <div className="text-2xl text-gray-900">₹3.2M</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Monthly Inflow</div>
                  <div className="text-2xl text-gray-900">₹450K</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Sparkles className="w-6 h-6 text-[#5C1F3D]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">AI Score</div>
                  <div className="text-2xl text-gray-900">95/100</div>
                </div>
              </div>
            </div>
          </div>

          {/* Example Content - Data Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg text-gray-900">Recent Transactions</h2>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-sm text-gray-600 pb-3">Date</th>
                    <th className="text-left text-sm text-gray-600 pb-3">Description</th>
                    <th className="text-right text-sm text-gray-600 pb-3">Amount</th>
                    <th className="text-right text-sm text-gray-600 pb-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">Dec 12, 2024</td>
                    <td className="py-3 text-sm text-gray-900">Customer Payment</td>
                    <td className="py-3 text-sm text-green-600 text-right">+₹25,000</td>
                    <td className="py-3 text-sm text-gray-900 text-right">₹875,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">Dec 11, 2024</td>
                    <td className="py-3 text-sm text-gray-900">Vendor Payment</td>
                    <td className="py-3 text-sm text-red-600 text-right">-₹12,500</td>
                    <td className="py-3 text-sm text-gray-900 text-right">₹850,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">Dec 10, 2024</td>
                    <td className="py-3 text-sm text-gray-900">Wire Transfer</td>
                    <td className="py-3 text-sm text-green-600 text-right">+₹50,000</td>
                    <td className="py-3 text-sm text-gray-900 text-right">₹862,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column - Data Agent Panel */}
        <DataAgentPanel
          isOpen={showDataAgent}
          onClose={() => setShowDataAgent(false)}
          analyzing={dataAgentAnalyzing}
        >
          {customDataAgentContent}
        </DataAgentPanel>
      </div>
    </ModulePageTemplate>
  );
}
