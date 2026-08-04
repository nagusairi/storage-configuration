import React, { useState } from 'react';
import { Sparkles, TrendingUp, FileCheck, Shield, Zap } from 'lucide-react';

interface EnhancedAIFeaturesProps {
  addItemType: string;
  gstApplicable: boolean;
  hsnSacCode: string;
  uploadedImages: any[];
  attachedVendors: any[];
  currentStep: number;
}

export function EnhancedAIFeatures({
  addItemType,
  gstApplicable,
  hsnSacCode,
  uploadedImages,
  attachedVendors,
  currentStep
}: EnhancedAIFeaturesProps) {
  const [showAIInsights, setShowAIInsights] = useState(true);

  // Calculate form completion score
  const calculateCompletionScore = () => {
    let score = 0;
    let maxScore = 0;

    // Basic info (40 points)
    maxScore += 40;
    if (addItemType) score += 10;
    if (gstApplicable && hsnSacCode) score += 15;
    if (gstApplicable) score += 15;

    // Images (20 points)
    maxScore += 20;
    if (uploadedImages.length > 0) score += 10;
    if (uploadedImages.length >= 3) score += 10;

    // Vendors (40 points)
    maxScore += 40;
    if (attachedVendors.length > 0) score += 20;
    if (attachedVendors.length >= 2) score += 10;
    if (attachedVendors.some(v => v.preferredVendor)) score += 10;

    return Math.round((score / maxScore) * 100);
  };

  const completionScore = calculateCompletionScore();

  // AI-powered recommendations
  const getRecommendations = () => {
    const recommendations = [];

    if (!addItemType) {
      recommendations.push({
        icon: Shield,
        title: 'Select Item Type',
        description: 'Choose between Goods or Service to unlock relevant fields',
        priority: 'high'
      });
    }

    if (gstApplicable && !hsnSacCode) {
      recommendations.push({
        icon: FileCheck,
        title: 'Add HSN/SAC Code',
        description: 'Required for GST compliance and accurate tax calculation',
        priority: 'high'
      });
    }

    if (uploadedImages.length === 0 && addItemType === 'goods') {
      recommendations.push({
        icon: TrendingUp,
        title: 'Add Product Images',
        description: 'Items with images sell 3x faster and build customer trust',
        priority: 'medium'
      });
    }

    if (attachedVendors.length === 0) {
      recommendations.push({
        icon: Zap,
        title: 'Add Vendor Information',
        description: 'Track supplier pricing and lead times for better procurement',
        priority: 'medium'
      });
    }

    if (attachedVendors.length === 1) {
      recommendations.push({
        icon: Shield,
        title: 'Add Backup Vendor',
        description: 'Having 2+ vendors reduces supply chain risk by 60%',
        priority: 'low'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  if (!showAIInsights) return null;

  return (
    <div className="space-y-4">
      {/* Completion Score Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm text-purple-900">AI Form Assistant</h3>
        </div>

        {/* Progress Circle */}
        <div className="flex items-center gap-4 mb-3">
          <div className="relative w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#E9D5FF"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#9333EA"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionScore / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-purple-900">{completionScore}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-purple-900">Form Completeness</p>
            <p className="text-xs text-purple-700">
              {completionScore < 50 ? 'Getting started' : 
               completionScore < 80 ? 'Good progress!' : 
               'Almost complete!'}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-purple-700 mb-2">AI Recommendations:</p>
            {recommendations.slice(0, 3).map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-2 rounded ${
                    rec.priority === 'high' ? 'bg-red-50 border border-red-200' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 mt-0.5 ${
                    rec.priority === 'high' ? 'text-red-600' :
                    rec.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-900">{rec.title}</p>
                    <p className="text-xs text-gray-600">{rec.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dismiss button */}
        <button
          onClick={() => setShowAIInsights(false)}
          className="mt-3 text-xs text-purple-600 hover:underline"
        >
          Hide AI insights
        </button>
      </div>
    </div>
  );
}
