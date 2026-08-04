import { X, Maximize2, UserPlus, Package, FileText, CreditCard, Contact, Save, Calendar, DollarSign, Hash, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { TextField, Button, InputAdornment } from '@mui/material';
import { StyledSelect, MenuItem } from './ui/StyledSelect';

interface CreateActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'vendor' | 'inventory' | 'invoice' | 'payment' | 'contact' | null;
  sidebarExpanded?: boolean;
}

interface ActionConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconBgColor: string;
}

export function CreateActionPanel({ isOpen, onClose, actionType, sidebarExpanded = false }: CreateActionPanelProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    setIsFullScreen(!isFullScreen);
  };

  const sidebarWidth = sidebarExpanded ? 240 : 54;

  // GSAP animation when panel opens
  useEffect(() => {
    if (isOpen && panelRef.current && panelRef.current.children.length > 0) {
      const content = Array.from(panelRef.current.children);
      gsap.fromTo(
        content,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.05,
          delay: 0.15,
        }
      );
    }
  }, [isOpen, actionType]);

  // Action Configuration
  const actionConfigs: Record<string, ActionConfig> = {
    'vendor': {
      icon: <UserPlus className="w-5 h-5 text-blue-600" />,
      title: 'Add Vendor',
      description: 'Create a new vendor profile',
      bgColor: 'bg-blue-50',
      iconBgColor: 'bg-blue-50'
    },
    'inventory': {
      icon: <Package className="w-5 h-5 text-green-600" />,
      title: 'Add Inventory',
      description: 'Add new inventory item',
      bgColor: 'bg-green-50',
      iconBgColor: 'bg-green-50'
    },
    'invoice': {
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      title: 'Create Invoice',
      description: 'Generate a new invoice',
      bgColor: 'bg-purple-50',
      iconBgColor: 'bg-purple-50'
    },
    'payment': {
      icon: <CreditCard className="w-5 h-5 text-orange-600" />,
      title: 'Add Payment',
      description: 'Record a new payment',
      bgColor: 'bg-orange-50',
      iconBgColor: 'bg-orange-50'
    },
    'contact': {
      icon: <Contact className="w-5 h-5 text-indigo-600" />,
      title: 'Add Contact',
      description: 'Create a new contact',
      bgColor: 'bg-indigo-50',
      iconBgColor: 'bg-indigo-50'
    }
  };

  const currentAction = actionType ? actionConfigs[actionType] : null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-20 ${
          isOpen && currentAction ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          top: '44px',
          left: `${sidebarWidth}px`
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        ref={panelRef}
        className={`fixed right-0 top-[44px] bottom-0 bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-30 ${
          isOpen && currentAction ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          width: isFullScreen ? `calc(100% - ${sidebarWidth}px)` : '600px'
        }}
      >
        {currentAction && (
          <>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${currentAction.iconBgColor} rounded-lg`}>
                {currentAction.icon}
              </div>
              <div>
            <h2 className="text-lg text-gray-900">{currentAction.title}</h2>
            <p className="text-sm text-gray-500">{currentAction.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Expand Button */}
          <button 
            onClick={handleExpand}
            className="p-1 hover:bg-gray-100 rounded transition-colors text-[14px]"
            title={isFullScreen ? "Exit full screen" : "Expand to full screen"}
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-73px)] overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
        <div className="p-6">
          {/* Vendor Form */}
          {actionType === 'vendor' && (
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Vendor Name *</label>
                  <TextField
                    placeholder="Enter vendor name"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Vendor Code</label>
                  <TextField
                    placeholder="AUTO-GENERATED"
                    disabled
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Contact Person</label>
                  <TextField
                    placeholder="Enter contact name"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Email</label>
                  <TextField
                    type="email"
                    placeholder="vendor@company.com"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Phone</label>
                  <TextField
                    type="tel"
                    placeholder="+91 00000 00000"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">GST Number</label>
                  <TextField
                    placeholder="00AAAAA0000A0Z0"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Address</label>
                <TextField
                  placeholder="Enter full address"
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5C1F3D',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">City</label>
                  <TextField
                    placeholder="City"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">State</label>
                  <TextField
                    placeholder="State"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">PIN Code</label>
                  <TextField
                    placeholder="000000"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Payment Terms</label>
                  <StyledSelect
                    defaultValue="Net 30"
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="Net 30" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Net 30</MenuItem>
                    <MenuItem value="Net 45" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Net 45</MenuItem>
                    <MenuItem value="Net 60" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Net 60</MenuItem>
                    <MenuItem value="Immediate" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Immediate</MenuItem>
                  </StyledSelect>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Credit Limit</label>
                  <TextField
                    placeholder="0.00"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Notes</label>
                <TextField
                  placeholder="Add any additional notes..."
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5C1F3D',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>
            </form>
          )}

          {/* Inventory Form */}
          {actionType === 'inventory' && (
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Item Name *</label>
                  <TextField
                    placeholder="Enter item name"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">SKU *</label>
                  <TextField
                    placeholder="SKU-0000"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Description</label>
                <TextField
                  placeholder="Enter item description"
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5C1F3D',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Category *</label>
                  <StyledSelect
                    defaultValue=""
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select category</MenuItem>
                    <MenuItem value="Electronics" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Electronics</MenuItem>
                    <MenuItem value="Furniture" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Furniture</MenuItem>
                    <MenuItem value="Supplies" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Supplies</MenuItem>
                    <MenuItem value="Raw Materials" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Raw Materials</MenuItem>
                  </StyledSelect>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Unit of Measure</label>
                  <StyledSelect
                    defaultValue="Pieces"
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="Pieces" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Pieces</MenuItem>
                    <MenuItem value="Kg" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Kg</MenuItem>
                    <MenuItem value="Liters" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Liters</MenuItem>
                    <MenuItem value="Boxes" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Boxes</MenuItem>
                  </StyledSelect>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Initial Quantity *</label>
                  <TextField
                    type="number"
                    placeholder="0"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Hash className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Reorder Point</label>
                  <TextField
                    type="number"
                    placeholder="0"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Hash className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Max Stock Level</label>
                  <TextField
                    type="number"
                    placeholder="0"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Hash className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Unit Cost</label>
                  <TextField
                    placeholder="0.00"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Selling Price</label>
                  <TextField
                    placeholder="0.00"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Location</label>
                  <TextField
                    placeholder="Warehouse/Shelf location"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Supplier</label>
                  <StyledSelect
                    defaultValue=""
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select supplier</MenuItem>
                    <MenuItem value="Supplier A" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Supplier A</MenuItem>
                    <MenuItem value="Supplier B" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Supplier B</MenuItem>
                    <MenuItem value="Supplier C" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Supplier C</MenuItem>
                  </StyledSelect>
                </div>
              </div>
            </form>
          )}

          {/* Invoice Form */}
          {actionType === 'invoice' && (
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Invoice Number</label>
                  <TextField
                    placeholder="AUTO-GENERATED"
                    disabled
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Invoice Date *</label>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Customer *</label>
                  <StyledSelect
                    defaultValue=""
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select customer</MenuItem>
                    <MenuItem value="Customer A" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Customer A</MenuItem>
                    <MenuItem value="Customer B" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Customer B</MenuItem>
                    <MenuItem value="Customer C" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Customer C</MenuItem>
                  </StyledSelect>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Due Date *</label>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Line Items</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs text-gray-600">Item</th>
                        <th className="text-center px-3 py-2 text-xs text-gray-600">Qty</th>
                        <th className="text-right px-3 py-2 text-xs text-gray-600">Rate</th>
                        <th className="text-right px-3 py-2 text-xs text-gray-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="px-3 py-2">
                          <StyledSelect
                            defaultValue=""
                            className="w-full"
                            style={{ fontSize: 'var(--text-sm)', height: '32px', border: 'none' }}
                          >
                            <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select item</MenuItem>
                            <MenuItem value="Product A" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Product A</MenuItem>
                            <MenuItem value="Product B" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Product B</MenuItem>
                          </StyledSelect>
                        </td>
                        <td className="px-3 py-2">
                          <TextField
                            type="number"
                            placeholder="0"
                            size="small"
                            variant="standard"
                            InputProps={{
                              disableUnderline: true,
                              style: { textAlign: 'center' }
                            }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <TextField
                            type="text"
                            placeholder="0.00"
                            size="small"
                            variant="standard"
                            InputProps={{
                              disableUnderline: true,
                              style: { textAlign: 'right' }
                            }}
                          />
                        </td>
                        <td className="px-3 py-2 text-right text-gray-900">₹0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    marginTop: 1,
                    color: '#5C1F3D',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#4A1831',
                    },
                  }}
                >
                  + Add Line Item
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">₹0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="text-gray-900">₹0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">₹0.00</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Notes</label>
                <TextField
                  placeholder="Add payment terms, notes, or instructions..."
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5C1F3D',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>
            </form>
          )}

          {/* Payment Form */}
          {actionType === 'payment' && (
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Payment Date *</label>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Payment Method *</label>
                  <StyledSelect
                    defaultValue=""
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select method</MenuItem>
                    <MenuItem value="Cash" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cash</MenuItem>
                    <MenuItem value="Bank Transfer" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Bank Transfer</MenuItem>
                    <MenuItem value="Check" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Check</MenuItem>
                    <MenuItem value="Credit Card" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Credit Card</MenuItem>
                    <MenuItem value="UPI" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>UPI</MenuItem>
                  </StyledSelect>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Payment Type *</label>
                  <StyledSelect
                    defaultValue="Payment Received"
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="Payment Received" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Payment Received</MenuItem>
                    <MenuItem value="Payment Made" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Payment Made</MenuItem>
                  </StyledSelect>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Amount *</label>
                  <TextField
                    placeholder="0.00"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Party Name *</label>
                  <StyledSelect
                    defaultValue=""
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select party</MenuItem>
                    <MenuItem value="Customer A" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Customer A</MenuItem>
                    <MenuItem value="Customer B" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Customer B</MenuItem>
                    <MenuItem value="Vendor A" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Vendor A</MenuItem>
                    <MenuItem value="Vendor B" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Vendor B</MenuItem>
                  </StyledSelect>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Reference Number</label>
                  <TextField
                    placeholder="Transaction/Check number"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Invoice Selection</label>
                <StyledSelect
                  defaultValue=""
                  className="w-full"
                  style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                >
                  <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select invoice (optional)</MenuItem>
                  <MenuItem value="INV-001" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>INV-001 - ₹15,000</MenuItem>
                  <MenuItem value="INV-002" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>INV-002 - ₹25,000</MenuItem>
                  <MenuItem value="INV-003" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>INV-003 - ₹8,500</MenuItem>
                </StyledSelect>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-sm text-gray-700 mb-2">Payment Allocation</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Invoice:</span>
                    <span className="text-gray-900">INV-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Amount:</span>
                    <span className="text-gray-900">₹15,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Outstanding:</span>
                    <span className="text-orange-600">₹15,000.00</span>
                  </div>
                  <div className="flex justify-between border-t border-orange-300 pt-2">
                    <span className="text-gray-900">Payment Amount:</span>
                    <span className="text-gray-900">₹0.00</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Notes</label>
                <TextField
                  placeholder="Add payment notes or instructions..."
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5C1F3D',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>
            </form>
          )}

          {/* Contact Form */}
          {actionType === 'contact' && (
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">First Name *</label>
                  <TextField
                    placeholder="Enter first name"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Last Name *</label>
                  <TextField
                    placeholder="Enter last name"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Email *</label>
                  <TextField
                    type="email"
                    placeholder="contact@email.com"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Phone</label>
                  <TextField
                    type="tel"
                    placeholder="+91 00000 00000"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Job Title</label>
                  <TextField
                    placeholder="e.g. Sales Manager"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Company</label>
                  <TextField
                    placeholder="Company name"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Building2 className="w-4 h-4 text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Address</label>
                <TextField
                  placeholder="Enter full address"
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5C1F3D',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">City</label>
                  <TextField
                    placeholder="City"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">State</label>
                  <TextField
                    placeholder="State"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">PIN Code</label>
                  <TextField
                    placeholder="000000"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '32px',
                        fontSize: '14px',
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#5C1F3D',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Contact Type</label>
                  <StyledSelect
                    defaultValue="Customer"
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="Customer" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Customer</MenuItem>
                    <MenuItem value="Vendor" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Vendor</MenuItem>
                    <MenuItem value="Partner" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Partner</MenuItem>
                    <MenuItem value="Lead" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Lead</MenuItem>
                  </StyledSelect>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Lead Source</label>
                  <StyledSelect
                    defaultValue="Website"
                    className="w-full"
                    style={{ height: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="Website" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Website</MenuItem>
                    <MenuItem value="Referral" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Referral</MenuItem>
                    <MenuItem value="Social Media" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Social Media</MenuItem>
                    <MenuItem value="Cold Call" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cold Call</MenuItem>
                    <MenuItem value="Advertisement" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Advertisement</MenuItem>
                  </StyledSelect>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Notes</label>
                <TextField
                  placeholder="Add any additional notes about this contact..."
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5C1F3D',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </div>
            </form>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-0 bg-white pt-6 pb-2 border-t border-gray-200 mt-6">
            <Button
              variant="contained"
              fullWidth
              startIcon={<Save className="w-4 h-4" />}
              sx={{
                backgroundColor: '#5C1F3D',
                textTransform: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#4A1831',
                },
              }}
            >
              Save & Create
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                padding: '10px 16px',
                borderColor: '#d1d5db',
                color: '#374151',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#d1d5db',
                },
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
        </>
      )}
      </div>
    </>
  );
}
