import { useNavigate } from 'react-router-dom';
import { Home, Search, Package } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center px-4">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-purple-600" />
            </div>
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been removed.
          Please check the URL or navigate to one of the available pages.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#5C1F3D] text-white rounded-lg hover:bg-[#4a1831] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/inventory/overview')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Go to Inventory</span>
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Warehouse management pages have been consolidated into the Inventory module.
            All warehouse-related features are now available within Inventory.
          </p>
        </div>
      </div>
    </div>
  );
}
