export interface StorageNode {
  id: string;
  name: string;
  code: string;
  type: 'warehouse' | 'zone' | 'aisle' | 'rack' | 'shelf' | 'bin';
  status: 'active' | 'inactive' | 'maintenance';
  capacity: {
    total: number;
    occupied: number;
    unit: string;
  };
  attributes?: Record<string, any>;
  colorTag?: string; // Zone color tag (predefined color ID or custom hex)
  children?: StorageNode[];
}

// Warehouse-keyed storage hierarchy
export const mockStorageHierarchyByWarehouse: Record<string, StorageNode> = {
  'WH-001': {
    id: 'WH-001',
    name: 'Main Distribution Center',
    code: 'WH-MDC-001',
    type: 'warehouse',
    status: 'active',
    capacity: {
      total: 10000,
      occupied: 6500,
      unit: 'bins'
    },
    attributes: {
      location: 'Mumbai, Maharashtra',
      manager: 'Rajesh Kumar',
      operatingHours: '24/7',
      facilityType: 'Distribution',
      zoneUtilization: 72
    },
    children: [
      {
        id: 'ZN-001',
        name: 'Zone A - Production Area',
        code: 'ZN-A-001',
        type: 'zone',
        status: 'active',
        colorTag: 'blue',
        capacity: {
          total: 3000,
          occupied: 2040,
          unit: 'bins'
        },
        attributes: {
          temperatureControl: 'Ambient',
          securityLevel: 'High',
          accessRestriction: 'Yes'
        },
        children: [
          {
            id: 'AS-001',
            name: 'Aisle A1',
            code: 'AS-A1-001',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1000,
              occupied: 850,
              unit: 'bins'
            },
            attributes: {
              width: '3.5 meters',
              length: '50 meters',
              floorType: 'Concrete'
            },
            children: [
              {
                id: 'RK-001',
                name: 'Rack R1-A1',
                code: 'RK-R1-A1-001',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 300,
                  occupied: 276,
                  unit: 'bins'
                },
                attributes: {
                  height: '6 meters',
                  material: 'Steel',
                  maxLoadPerShelf: '500 kg'
                },
                children: [
                  {
                    id: 'SF-001',
                    name: 'Shelf S1',
                    code: 'SF-S1-001',
                    type: 'shelf',
                    status: 'active',
                    capacity: {
                      total: 100,
                      occupied: 92,
                      unit: 'bins'
                    },
                    attributes: {
                      level: '1',
                      depth: '1.2 meters',
                      maxWeight: '500 kg'
                    },
                    children: [
                      {
                        id: 'BN-001',
                        name: 'Bin B1',
                        code: 'BN-B1-001',
                        type: 'bin',
                        status: 'active',
                        capacity: {
                          total: 50,
                          occupied: 50,
                          unit: 'items'
                        },
                        attributes: {
                          dimensions: '0.5m x 0.5m x 0.5m',
                          barcode: 'BN001-ABC123',
                          lastUpdated: '2024-03-15'
                        }
                      },
                      {
                        id: 'BN-002',
                        name: 'Bin B2',
                        code: 'BN-B2-002',
                        type: 'bin',
                        status: 'active',
                        capacity: {
                          total: 50,
                          occupied: 42,
                          unit: 'items'
                        },
                        attributes: {
                          dimensions: '0.5m x 0.5m x 0.5m',
                          barcode: 'BN002-ABC124',
                          lastUpdated: '2024-03-14'
                        }
                      }
                    ]
                  },
                  {
                    id: 'SF-002',
                    name: 'Shelf S2',
                    code: 'SF-S2-002',
                    type: 'shelf',
                    status: 'active',
                    capacity: {
                      total: 100,
                      occupied: 92,
                      unit: 'bins'
                    },
                    attributes: {
                      level: '2',
                      depth: '1.2 meters',
                      maxWeight: '500 kg'
                    },
                    children: [
                      {
                        id: 'BN-003',
                        name: 'Bin B3',
                        code: 'BN-B3-003',
                        type: 'bin',
                        status: 'active',
                        capacity: {
                          total: 50,
                          occupied: 46,
                          unit: 'items'
                        },
                        attributes: {
                          dimensions: '0.5m x 0.5m x 0.5m',
                          barcode: 'BN003-ABC125',
                          lastUpdated: '2024-03-15'
                        }
                      },
                      {
                        id: 'BN-004',
                        name: 'Bin B4',
                        code: 'BN-B4-004',
                        type: 'bin',
                        status: 'active',
                        capacity: {
                          total: 50,
                          occupied: 46,
                          unit: 'items'
                        },
                        attributes: {
                          dimensions: '0.5m x 0.5m x 0.5m',
                          barcode: 'BN004-ABC126',
                          lastUpdated: '2024-03-13'
                        }
                      }
                    ]
                  },
                  {
                    id: 'SF-003',
                    name: 'Shelf S3',
                    code: 'SF-S3-003',
                    type: 'shelf',
                    status: 'active',
                    capacity: {
                      total: 100,
                      occupied: 92,
                      unit: 'bins'
                    },
                    attributes: {
                      level: '3',
                      depth: '1.2 meters',
                      maxWeight: '500 kg'
                    },
                    children: [
                      {
                        id: 'BN-005',
                        name: 'Bin B5',
                        code: 'BN-B5-005',
                        type: 'bin',
                        status: 'active',
                        capacity: {
                          total: 50,
                          occupied: 46,
                          unit: 'items'
                        },
                        attributes: {
                          dimensions: '0.5m x 0.5m x 0.5m',
                          barcode: 'BN005-ABC127',
                          lastUpdated: '2024-03-15'
                        }
                      },
                      {
                        id: 'BN-006',
                        name: 'Bin B6',
                        code: 'BN-B6-006',
                        type: 'bin',
                        status: 'active',
                        capacity: {
                          total: 50,
                          occupied: 46,
                          unit: 'items'
                        },
                        attributes: {
                          dimensions: '0.5m x 0.5m x 0.5m',
                          barcode: 'BN006-ABC128',
                          lastUpdated: '2024-03-12'
                        }
                      }
                    ]
                  }
                ]
              },
              {
                id: 'RK-002',
                name: 'Rack R2-A1',
                code: 'RK-R2-A1-002',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 300,
                  occupied: 270,
                  unit: 'bins'
                },
                attributes: {
                  height: '6 meters',
                  material: 'Steel',
                  maxLoadPerShelf: '500 kg'
                },
                children: [
                  {
                    id: 'SF-004',
                    name: 'Shelf S1',
                    code: 'SF-S1-004',
                    type: 'shelf',
                    status: 'active',
                    capacity: {
                      total: 100,
                      occupied: 90,
                      unit: 'bins'
                    },
                    attributes: {
                      level: '1',
                      depth: '1.2 meters',
                      maxWeight: '500 kg'
                    },
                    children: [
                      {
                        id: 'BN-007',
                        name: 'Bin B7',
                        code: 'BN-B7-007',
                        type: 'bin',
                        status: 'active',
                        capacity: {
                          total: 50,
                          occupied: 45,
                          unit: 'items'
                        },
                        attributes: {
                          dimensions: '0.5m x 0.5m x 0.5m',
                          barcode: 'BN007-ABC129',
                          lastUpdated: '2024-03-15'
                        }
                      },
                      {
                        id: 'BN-008',
                        name: 'Bin B8',
                        code: 'BN-B8-008',
                        type: 'bin',
                        status: 'active',
                        capacity: {
                          total: 50,
                          occupied: 45,
                          unit: 'items'
                        },
                        attributes: {
                          dimensions: '0.5m x 0.5m x 0.5m',
                          barcode: 'BN008-ABC130',
                          lastUpdated: '2024-03-14'
                        }
                      }
                    ]
                  },
                  {
                    id: 'SF-005',
                    name: 'Shelf S2',
                    code: 'SF-S2-005',
                    type: 'shelf',
                    status: 'active',
                    capacity: {
                      total: 100,
                      occupied: 90,
                      unit: 'bins'
                    },
                    attributes: {
                      level: '2',
                      depth: '1.2 meters',
                      maxWeight: '500 kg'
                    }
                  },
                  {
                    id: 'SF-006',
                    name: 'Shelf S3',
                    code: 'SF-S3-006',
                    type: 'shelf',
                    status: 'active',
                    capacity: {
                      total: 100,
                      occupied: 90,
                      unit: 'bins'
                    },
                    attributes: {
                      level: '3',
                      depth: '1.2 meters',
                      maxWeight: '500 kg'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'AS-002',
            name: 'Aisle A2',
            code: 'AS-A2-002',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1000,
              occupied: 590,
              unit: 'bins'
            },
            attributes: {
              width: '3.5 meters',
              length: '50 meters',
              floorType: 'Concrete'
            },
            children: [
              {
                id: 'RK-003',
                name: 'Rack R1-A2',
                code: 'RK-R1-A2-003',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 300,
                  occupied: 195,
                  unit: 'bins'
                },
                attributes: {
                  height: '6 meters',
                  material: 'Steel',
                  maxLoadPerShelf: '500 kg'
                }
              },
              {
                id: 'RK-004',
                name: 'Rack R2-A2',
                code: 'RK-R2-A2-004',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 300,
                  occupied: 195,
                  unit: 'bins'
                },
                attributes: {
                  height: '6 meters',
                  material: 'Steel',
                  maxLoadPerShelf: '500 kg'
                }
              }
            ]
          },
          {
            id: 'AS-003',
            name: 'Aisle A3',
            code: 'AS-A3-003',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1000,
              occupied: 600,
              unit: 'bins'
            },
            attributes: {
              width: '3.5 meters',
              length: '50 meters',
              floorType: 'Concrete'
            }
          }
        ]
      },
      {
        id: 'ZN-002',
        name: 'Zone B - Cold Storage',
        code: 'ZN-B-002',
        type: 'zone',
        status: 'active',
        colorTag: 'green',
        capacity: {
          total: 2000,
          occupied: 1100,
          unit: 'bins'
        },
        attributes: {
          temperatureControl: '-18°C to -20°C',
          securityLevel: 'High',
          accessRestriction: 'Yes',
          refrigerationSystem: 'Industrial'
        },
        children: [
          {
            id: 'AS-004',
            name: 'Aisle B1',
            code: 'AS-B1-004',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1000,
              occupied: 550,
              unit: 'bins'
            },
            attributes: {
              width: '3 meters',
              length: '40 meters',
              floorType: 'Insulated'
            },
            children: [
              {
                id: 'RK-005',
                name: 'Rack R1-B1',
                code: 'RK-R1-B1-005',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 300,
                  occupied: 165,
                  unit: 'bins'
                },
                attributes: {
                  height: '5 meters',
                  material: 'Stainless Steel',
                  maxLoadPerShelf: '400 kg'
                }
              }
            ]
          },
          {
            id: 'AS-005',
            name: 'Aisle B2',
            code: 'AS-B2-005',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1000,
              occupied: 550,
              unit: 'bins'
            },
            attributes: {
              width: '3 meters',
              length: '40 meters',
              floorType: 'Insulated'
            }
          }
        ]
      },
      {
        id: 'ZN-003',
        name: 'Zone C - Dispatch Area',
        code: 'ZN-C-003',
        type: 'zone',
        status: 'active',
        colorTag: 'yellow',
        capacity: {
          total: 5000,
          occupied: 3360,
          unit: 'bins'
        },
        attributes: {
          temperatureControl: 'Ambient',
          securityLevel: 'Medium',
          accessRestriction: 'No',
          loadingDocks: '12'
        },
        children: [
          {
            id: 'AS-006',
            name: 'Aisle C1',
            code: 'AS-C1-006',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 2000,
              occupied: 1340,
              unit: 'bins'
            },
            attributes: {
              width: '4 meters',
              length: '60 meters',
              floorType: 'Reinforced Concrete'
            },
            children: [
              {
                id: 'RK-006',
                name: 'Rack R1-C1',
                code: 'RK-R1-C1-006',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 500,
                  occupied: 335,
                  unit: 'bins'
                },
                attributes: {
                  height: '7 meters',
                  material: 'Steel',
                  maxLoadPerShelf: '600 kg'
                }
              }
            ]
          },
          {
            id: 'AS-007',
            name: 'Aisle C2',
            code: 'AS-C2-007',
            type: 'aisle',
            status: 'maintenance',
            capacity: {
              total: 2000,
              occupied: 1340,
              unit: 'bins'
            },
            attributes: {
              width: '4 meters',
              length: '60 meters',
              floorType: 'Reinforced Concrete',
              maintenanceReason: 'Floor repair'
            }
          },
          {
            id: 'AS-008',
            name: 'Aisle C3',
            code: 'AS-C3-008',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1000,
              occupied: 680,
              unit: 'bins'
            },
            attributes: {
              width: '4 meters',
              length: '60 meters',
              floorType: 'Reinforced Concrete'
            }
          }
        ]
      }
    ]
  },
  'WH-002': {
    id: 'WH-002',
    name: 'Regional Warehouse North',
    code: 'WH-RWN-002',
    type: 'warehouse',
    status: 'active',
    capacity: {
      total: 8000,
      occupied: 4800,
      unit: 'bins'
    },
    attributes: {
      location: 'Delhi, NCR',
      manager: 'Amit Sharma',
      operatingHours: '6 AM - 10 PM',
      facilityType: 'Regional Distribution',
      zoneUtilization: 65
    },
    children: [
      {
        id: 'ZN-004',
        name: 'Zone D - Electronics',
        code: 'ZN-D-004',
        type: 'zone',
        status: 'active',
        colorTag: 'orange',
        capacity: {
          total: 4000,
          occupied: 2400,
          unit: 'bins'
        },
        attributes: {
          temperatureControl: 'Climate Controlled 20-25°C',
          securityLevel: 'High',
          accessRestriction: 'Yes',
          staticProtection: 'ESD Safe'
        },
        children: [
          {
            id: 'AS-009',
            name: 'Aisle D1',
            code: 'AS-D1-009',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 2000,
              occupied: 1200,
              unit: 'bins'
            },
            attributes: {
              width: '3 meters',
              length: '45 meters',
              floorType: 'Anti-Static'
            },
            children: [
              {
                id: 'RK-007',
                name: 'Rack R1-D1',
                code: 'RK-R1-D1-007',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 600,
                  occupied: 360,
                  unit: 'bins'
                },
                attributes: {
                  height: '5 meters',
                  material: 'Aluminum',
                  maxLoadPerShelf: '300 kg'
                },
                children: [
                  {
                    id: 'SF-007',
                    name: 'Shelf S1',
                    code: 'SF-S1-007',
                    type: 'shelf',
                    status: 'active',
                    capacity: {
                      total: 200,
                      occupied: 120,
                      unit: 'bins'
                    },
                    attributes: {
                      level: '1',
                      depth: '1 meter',
                      maxWeight: '300 kg'
                    }
                  }
                ]
              },
              {
                id: 'RK-008',
                name: 'Rack R2-D1',
                code: 'RK-R2-D1-008',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 600,
                  occupied: 360,
                  unit: 'bins'
                },
                attributes: {
                  height: '5 meters',
                  material: 'Aluminum',
                  maxLoadPerShelf: '300 kg'
                }
              }
            ]
          },
          {
            id: 'AS-010',
            name: 'Aisle D2',
            code: 'AS-D2-010',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 2000,
              occupied: 1200,
              unit: 'bins'
            },
            attributes: {
              width: '3 meters',
              length: '45 meters',
              floorType: 'Anti-Static'
            }
          }
        ]
      },
      {
        id: 'ZN-005',
        name: 'Zone E - General Storage',
        code: 'ZN-E-005',
        type: 'zone',
        status: 'active',
        colorTag: 'purple',
        capacity: {
          total: 4000,
          occupied: 2400,
          unit: 'bins'
        },
        attributes: {
          temperatureControl: 'Ambient',
          securityLevel: 'Medium',
          accessRestriction: 'No'
        },
        children: [
          {
            id: 'AS-011',
            name: 'Aisle E1',
            code: 'AS-E1-011',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1500,
              occupied: 900,
              unit: 'bins'
            },
            attributes: {
              width: '3.5 meters',
              length: '50 meters',
              floorType: 'Concrete'
            },
            children: [
              {
                id: 'RK-009',
                name: 'Rack R1-E1',
                code: 'RK-R1-E1-009',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 500,
                  occupied: 300,
                  unit: 'bins'
                },
                attributes: {
                  height: '6 meters',
                  material: 'Steel',
                  maxLoadPerShelf: '500 kg'
                }
              }
            ]
          },
          {
            id: 'AS-012',
            name: 'Aisle E2',
            code: 'AS-E2-012',
            type: 'aisle',
            status: 'maintenance',
            capacity: {
              total: 1500,
              occupied: 900,
              unit: 'bins'
            },
            attributes: {
              width: '3.5 meters',
              length: '50 meters',
              floorType: 'Concrete',
              maintenanceReason: 'Rack replacement'
            }
          }
        ]
      }
    ]
  },
  'WH-003': {
    id: 'WH-003',
    name: 'Regional Warehouse South',
    code: 'WH-RWS-003',
    type: 'warehouse',
    status: 'active',
    capacity: {
      total: 6000,
      occupied: 3600,
      unit: 'bins'
    },
    attributes: {
      location: 'Chennai, Tamil Nadu',
      manager: 'Priya Iyer',
      operatingHours: '24/7',
      facilityType: 'Regional Hub',
      zoneUtilization: 85
    },
    children: [
      {
        id: 'ZN-006',
        name: 'Zone F - Automotive Parts',
        code: 'ZN-F-006',
        type: 'zone',
        status: 'active',
        colorTag: 'red',
        capacity: {
          total: 3000,
          occupied: 1800,
          unit: 'bins'
        },
        attributes: {
          temperatureControl: 'Ambient',
          securityLevel: 'High',
          accessRestriction: 'Yes',
          oilProof: 'Yes'
        },
        children: [
          {
            id: 'AS-013',
            name: 'Aisle F1',
            code: 'AS-F1-013',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1500,
              occupied: 900,
              unit: 'bins'
            },
            attributes: {
              width: '4 meters',
              length: '55 meters',
              floorType: 'Epoxy Coated'
            },
            children: [
              {
                id: 'RK-010',
                name: 'Rack R1-F1',
                code: 'RK-R1-F1-010',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 500,
                  occupied: 300,
                  unit: 'bins'
                },
                attributes: {
                  height: '6.5 meters',
                  material: 'Heavy Duty Steel',
                  maxLoadPerShelf: '800 kg'
                },
                children: [
                  {
                    id: 'SF-008',
                    name: 'Shelf S1',
                    code: 'SF-S1-008',
                    type: 'shelf',
                    status: 'active',
                    capacity: {
                      total: 150,
                      occupied: 90,
                      unit: 'bins'
                    },
                    attributes: {
                      level: '1',
                      depth: '1.5 meters',
                      maxWeight: '800 kg'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'AS-014',
            name: 'Aisle F2',
            code: 'AS-F2-014',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1500,
              occupied: 900,
              unit: 'bins'
            },
            attributes: {
              width: '4 meters',
              length: '55 meters',
              floorType: 'Epoxy Coated'
            }
          }
        ]
      },
      {
        id: 'ZN-007',
        name: 'Zone G - Fast Moving Goods',
        code: 'ZN-G-007',
        type: 'zone',
        status: 'active',
        colorTag: 'gray',
        capacity: {
          total: 3000,
          occupied: 1800,
          unit: 'bins'
        },
        attributes: {
          temperatureControl: 'Ambient',
          securityLevel: 'Medium',
          accessRestriction: 'No',
          pickingOptimized: 'Yes'
        },
        children: [
          {
            id: 'AS-015',
            name: 'Aisle G1',
            code: 'AS-G1-015',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1000,
              occupied: 600,
              unit: 'bins'
            },
            attributes: {
              width: '3 meters',
              length: '40 meters',
              floorType: 'Concrete'
            },
            children: [
              {
                id: 'RK-011',
                name: 'Rack R1-G1',
                code: 'RK-R1-G1-011',
                type: 'rack',
                status: 'active',
                capacity: {
                  total: 400,
                  occupied: 240,
                  unit: 'bins'
                },
                attributes: {
                  height: '4 meters',
                  material: 'Steel',
                  maxLoadPerShelf: '400 kg'
                }
              }
            ]
          },
          {
            id: 'AS-016',
            name: 'Aisle G2',
            code: 'AS-G2-016',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1000,
              occupied: 600,
              unit: 'bins'
            },
            attributes: {
              width: '3 meters',
              length: '40 meters',
              floorType: 'Concrete'
            }
          },
          {
            id: 'AS-017',
            name: 'Aisle G3',
            code: 'AS-G3-017',
            type: 'aisle',
            status: 'active',
            capacity: {
              total: 1000,
              occupied: 600,
              unit: 'bins'
            },
            attributes: {
              width: '3 meters',
              length: '40 meters',
              floorType: 'Concrete'
            }
          }
        ]
      }
    ]
  }
};

// Legacy export for backward compatibility
export const mockStorageHierarchy: StorageNode[] = [mockStorageHierarchyByWarehouse['WH-001']];

export const mockWarehouses = [
  { id: 'WH-001', name: 'Main Distribution Center', location: 'Mumbai, Maharashtra' },
  { id: 'WH-002', name: 'Regional Warehouse North', location: 'Delhi, NCR' },
  { id: 'WH-003', name: 'Regional Warehouse South', location: 'Chennai, Tamil Nadu' }
];