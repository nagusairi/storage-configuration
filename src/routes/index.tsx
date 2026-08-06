import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from '../components/layouts/AppLayout';
import { DashboardHome } from '../pages/DashboardHome';
import { NotFound } from '../pages/NotFound';

// Lazy load pages for better performance
const InventoryOverview = lazy(() => import('../pages/inventory/InventoryOverview').then(m => ({ default: m.InventoryOverview })));
const ItemMaster = lazy(() => import('../pages/inventory/ItemMaster').then(m => ({ default: m.ItemMaster })));
const Bundles = lazy(() => import('../pages/inventory/Bundles').then(m => ({ default: m.Bundles })));
const CreateBundle = lazy(() => import('../pages/inventory/CreateBundle').then(m => ({ default: m.CreateBundle })));
const CreateUOM = lazy(() => import('../pages/inventory/CreateUOM').then(m => ({ default: m.CreateUOM })));
const EditUOM = lazy(() => import('../pages/inventory/EditUOM').then(m => ({ default: m.EditUOM })));
const UnitOfMeasure = lazy(() => import('../pages/inventory/UnitOfMeasure').then(m => ({ default: m.UnitOfMeasure })));
const MapItemTransformation = lazy(() => import('../pages/inventory/MapItemTransformation').then(m => ({ default: m.MapItemTransformation })));
const StockOverview = lazy(() => import('../pages/inventory/StockOverview').then(m => ({ default: m.StockOverview })));
const StockMovements = lazy(() => import('../pages/inventory/StockMovements').then(m => ({ default: m.StockMovements })));
const InventoryAdjustments = lazy(() => import('../pages/inventory/InventoryAdjustments').then(m => ({ default: m.InventoryAdjustments })));
const InventoryReports = lazy(() => import('../pages/inventory/InventoryReports').then(m => ({ default: m.InventoryReports })));
const InventoryAlerts = lazy(() => import('../pages/inventory/InventoryAlerts').then(m => ({ default: m.InventoryAlerts })));
const StockAdjustmentDraft = lazy(() => import('../pages/inventory/StockAdjustmentDraft').then(m => ({ default: m.StockAdjustmentDraft })));
const StorageConfiguration = lazy(() => import('../pages/storage-configuration/StorageConfiguration'));
const StorageConfigurationV2 = lazy(() => import('../pages/storage-configuration/StorageConfigurationV2'));
const StorageConfigurationV3 = lazy(() => import('../pages/storage-configuration/StorageConfigurationV3'));
const StorageConfigurationV4 = lazy(() => import('../pages/storage-configuration/StorageConfigurationV4'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C1F3D]"></div>
  </div>
);

// Wrapper for lazy loaded components
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export interface RouteMetadata {
  title: string;
  breadcrumbs: string[];
  moduleKey?: string;
  sidebarGroup?: string;
  requiresAuth?: boolean;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        handle: {
          title: 'Dashboard',
          breadcrumbs: ['Dashboard'],
          moduleKey: null
        } as RouteMetadata,
        children: [
          {
            index: true,
            element: <DashboardHome />
          },
          // Inventory Module Routes
          {
            path: 'inventory',
            handle: {
              title: 'Inventory',
              breadcrumbs: ['Dashboard', 'Inventory'],
              moduleKey: 'inventory-management',
              sidebarGroup: 'inventory'
            } as RouteMetadata,
            children: [
              {
                index: true,
                element: <Navigate to="overview" replace />
              },
              {
                path: 'overview',
                element: <LazyWrapper><InventoryOverview /></LazyWrapper>,
                handle: {
                  title: 'Overview',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Overview'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'all-items',
                element: <LazyWrapper><ItemMaster /></LazyWrapper>,
                handle: {
                  title: 'All Items',
                  breadcrumbs: ['Dashboard', 'Inventory', 'All Items'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'create-bundle',
                element: <LazyWrapper><CreateBundle /></LazyWrapper>,
                handle: {
                  title: 'Create Bundle',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Bundles', 'Create Bundle'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'bundles',
                element: <LazyWrapper><Bundles /></LazyWrapper>,
                handle: {
                  title: 'Bundles',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Bundles'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'bundles/create',
                element: <Navigate to="/dashboard/inventory/create-bundle" replace />
              },
              {
                path: 'low-stock',
                element: <LazyWrapper><StockOverview /></LazyWrapper>,
                handle: {
                  title: 'Low Stock',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Low Stock'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'out-of-stock',
                element: <LazyWrapper><StockOverview /></LazyWrapper>,
                handle: {
                  title: 'Out of Stock',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Out of Stock'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'adjustments',
                element: <LazyWrapper><InventoryAdjustments /></LazyWrapper>,
                handle: {
                  title: 'Inventory Adjustments',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Inventory Adjustments'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'reports',
                element: <LazyWrapper><InventoryReports /></LazyWrapper>,
                handle: {
                  title: 'Inventory Reports',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Reports'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'stock-out',
                element: <LazyWrapper><StockMovements /></LazyWrapper>,
                handle: {
                  title: 'Stock Out',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Stock Out'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'stock-transfers',
                element: <LazyWrapper><StockMovements /></LazyWrapper>,
                handle: {
                  title: 'Stock Transfers',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Stock Transfers'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'daily-take',
                element: <LazyWrapper><InventoryOverview /></LazyWrapper>,
                handle: {
                  title: 'Daily Take / Cycle Count',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Daily Take / Cycle Count'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'uom',
                element: <LazyWrapper><UnitOfMeasure /></LazyWrapper>,
                handle: {
                  title: 'Item transformation',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Item transformation'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'uom/map',
                element: <LazyWrapper><MapItemTransformation /></LazyWrapper>,
                handle: {
                  title: 'Map Items to UOM',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Item transformation', 'Map Items'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'uom/create',
                element: <LazyWrapper><CreateUOM /></LazyWrapper>,
                handle: {
                  title: 'Configure Item Unit',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Item transformation', 'Configure Item Unit'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'uom/edit/:itemId',
                element: <LazyWrapper><EditUOM /></LazyWrapper>,
                handle: {
                  title: 'Edit Item Unit',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Item transformation', 'Edit Item Unit'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'unit-of-measure',
                element: <Navigate to="../uom" replace />
              },
              {
                path: 'unit-of-measure/edit/:itemId',
                element: <LazyWrapper><EditUOM /></LazyWrapper>,
                handle: {
                  title: 'Edit Item Unit',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Item transformation', 'Edit Item Unit'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'unit-of-measure/edit/:itemId/variant/:variantId',
                element: <LazyWrapper><EditUOM /></LazyWrapper>,
                handle: {
                  title: 'Edit Variant',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Item transformation', 'Edit Variant'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'alerts',
                element: <LazyWrapper><InventoryAlerts /></LazyWrapper>,
                handle: {
                  title: 'Inventory Alerts',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Alerts'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              {
                path: 'stock-adjustments/draft/:draftId',
                element: <LazyWrapper><StockAdjustmentDraft /></LazyWrapper>,
                handle: {
                  title: 'Stock Adjustment Draft',
                  breadcrumbs: ['Dashboard', 'Inventory', 'Stock Adjustments', 'Draft'],
                  moduleKey: 'inventory-management',
                  sidebarGroup: 'inventory'
                } as RouteMetadata
              },
              // Legacy routes for backward compatibility
              {
                path: 'item-master',
                element: <Navigate to="../all-items" replace />
              },
              {
                path: 'stock-overview',
                element: <Navigate to="../low-stock" replace />
              },
              {
                path: 'stock-movements',
                element: <Navigate to="../adjustments" replace />
              }
            ]
          },
          // Storage Configuration Route
          {
            path: 'storage-configuration',
            element: <LazyWrapper><StorageConfiguration /></LazyWrapper>,
            handle: {
              title: 'Storage Configuration',
              breadcrumbs: ['Dashboard', 'Storage Configuration'],
              moduleKey: 'warehouse-management',
              sidebarGroup: 'warehouse'
            } as RouteMetadata
          },
          // Storage Configuration V2 Route
          {
            path: 'storage-configuration-v2',
            element: <LazyWrapper><StorageConfigurationV2 /></LazyWrapper>,
            handle: {
              title: 'Storage Configuration v2',
              breadcrumbs: ['Dashboard', 'Storage Configuration v2'],
              moduleKey: 'warehouse-management',
              sidebarGroup: 'warehouse'
            } as RouteMetadata
          },
          // Storage Configuration V3 Route
          {
            path: 'storage-configuration-v3',
            element: <LazyWrapper><StorageConfigurationV3 /></LazyWrapper>,
            handle: {
              title: 'Storage Configuration v3',
              breadcrumbs: ['Dashboard', 'Storage Configuration v3'],
              moduleKey: 'warehouse-management',
              sidebarGroup: 'warehouse'
            } as RouteMetadata
          },
          // Storage Configuration V4 Route
          {
            path: 'storage-configuration-v4',
            element: <LazyWrapper><StorageConfigurationV4 /></LazyWrapper>,
            handle: {
              title: 'Storage Configuration v4',
              breadcrumbs: ['Dashboard', 'Storage Configuration v4'],
              moduleKey: 'warehouse-management',
              sidebarGroup: 'warehouse'
            } as RouteMetadata
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);