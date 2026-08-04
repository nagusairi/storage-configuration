import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle, Keyboard } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (value: string) => void;
  type?: 'barcode' | 'qrcode' | 'both';
}

export function BarcodeScanner({ isOpen, onClose, onScan, type = 'both' }: BarcodeScannerProps) {
  const [error, setError] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [showChoice, setShowChoice] = useState(true);
  const [manualValue, setManualValue] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-code-scanner-region';

  useEffect(() => {
    if (!isOpen || showManualInput || showChoice) return;

    const startScanner = async () => {
      try {
        setError('');
        setErrorDetails('');
        
        // Wait for DOM element to be ready
        const element = document.getElementById(qrCodeRegionId);
        if (!element) {
          console.error('Scanner element not found');
          return;
        }

        setIsScanning(true);

        // Initialize scanner
        const html5QrCode = new Html5Qrcode(qrCodeRegionId);
        scannerRef.current = html5QrCode;

        // Configure scanner settings based on type
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };

        // Start scanning
        await html5QrCode.start(
          { facingMode: 'environment' }, // Use back camera on mobile
          config,
          (decodedText) => {
            // Success callback - auto-close and return value
            onScan(decodedText);
            stopScanner();
            onClose();
          },
          (errorMessage) => {
            // Error callback - silent (continuous scanning)
            // Only log critical errors
          }
        );

        setIsScanning(true);
      } catch (err: any) {
        // Silently handle error - don't log to console unless needed
        let errorMsg = 'Camera Access Denied';
        let errorDetail = '';
        
        if (err.name === 'NotAllowedError') {
          errorMsg = 'Camera Permission Required';
          errorDetail = 'Please allow camera access in your browser settings, then click "Enter Manually" to type the code instead.';
        } else if (err.name === 'NotFoundError') {
          errorMsg = 'No Camera Found';
          errorDetail = 'Your device does not have a camera or it is not accessible. Please use manual entry below.';
        } else if (err.name === 'NotReadableError') {
          errorMsg = 'Camera In Use';
          errorDetail = 'Your camera is being used by another application. Close other apps and try again, or enter manually.';
        } else if (err.message && err.message.includes('secure')) {
          errorMsg = 'HTTPS Required';
          errorDetail = 'Camera access requires a secure connection (HTTPS). Please use manual entry instead.';
        } else {
          errorMsg = 'Camera Not Available';
          errorDetail = 'Unable to access camera. This may be due to browser permissions or security settings. Please use manual entry.';
        }
        
        setError(errorMsg);
        setErrorDetails(errorDetail);
        setIsScanning(false);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanner();
    }, 100);

    // Cleanup on unmount or close
    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen, showManualInput, showChoice]);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        // Silently handle cleanup errors
        setIsScanning(false);
      }
    }
  };

  const handleClose = async () => {
    await stopScanner();
    setError('');
    setErrorDetails('');
    setShowManualInput(false);
    setShowChoice(true);
    setManualValue('');
    onClose();
  };

  const handleManualInput = () => {
    setShowManualInput(true);
    setShowChoice(false);
    setError('');
    setErrorDetails('');
  };

  const handleUseScannerChoice = () => {
    setShowChoice(false);
    setShowManualInput(false);
  };

  const handleManualSubmit = () => {
    if (manualValue.trim()) {
      onScan(manualValue.trim());
      setManualValue('');
      setShowManualInput(false);
      setShowChoice(true);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50" 
        onClick={handleClose}
      />

      {/* Scanner Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[90vw] max-w-[500px] max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showManualInput ? (
              <Keyboard className="w-5 h-5 text-[#5C1F3D]" />
            ) : (
              <Camera className="w-5 h-5 text-[#5C1F3D]" />
            )}
            <div>
              <h3 className="text-base text-gray-900">
                {showManualInput 
                  ? `Enter ${type === 'barcode' ? 'Barcode' : type === 'qrcode' ? 'QR Code' : 'Code'} Manually`
                  : showChoice
                  ? `Add ${type === 'barcode' ? 'Barcode' : type === 'qrcode' ? 'QR Code' : 'Code'}`
                  : `Scan ${type === 'barcode' ? 'Barcode' : type === 'qrcode' ? 'QR Code' : 'Barcode/QR Code'}`
                }
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {showManualInput 
                  ? 'Type or paste the code value'
                  : showChoice
                  ? 'Choose how to add the code'
                  : 'Position the code within the frame'
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scanner Content */}
        <div className="p-6">
          {showChoice ? (
            // Choice Screen - Scan or Manual Entry
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center mb-6">
                Choose how you'd like to add the {type === 'barcode' ? 'barcode' : type === 'qrcode' ? 'QR code' : 'code'}:
              </p>

              <button
                onClick={handleUseScannerChoice}
                className="w-full px-6 py-4 text-sm rounded-lg transition-colors flex items-center gap-4 bg-[#5C1F3D] text-white hover:bg-[#4a1831] border-2 border-[#5C1F3D]"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Use Camera Scanner</div>
                  <div className="text-xs text-white/80 mt-1">Point your camera at the code</div>
                </div>
              </button>

              <button
                onClick={handleManualInput}
                className="w-full px-6 py-4 text-sm rounded-lg transition-colors flex items-center gap-4 bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Keyboard className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Enter Manually</div>
                  <div className="text-xs text-gray-500 mt-1">Type or paste the code value</div>
                </div>
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-xs text-blue-900">
                  💡 <strong>Tip:</strong> If camera scanning doesn't work or you prefer typing, choose manual entry.
                </p>
              </div>
            </div>
          ) : showManualInput ? (
            // Manual Input View
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  {type === 'barcode' ? 'Barcode' : type === 'qrcode' ? 'QR Code' : 'Code'} Value
                </label>
                <input
                  type="text"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleManualSubmit();
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                  style={{ height: '33px' }}
                  placeholder={`Enter ${type === 'barcode' ? 'barcode' : type === 'qrcode' ? 'QR code' : 'code'} value`}
                  autoFocus
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Tip:</strong> You can type or paste the code value here.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-sm rounded-[3px] transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  style={{ height: '33px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualValue.trim()}
                  className="flex-1 px-4 py-2 text-sm rounded-[3px] transition-colors bg-[#5C1F3D] text-white hover:bg-[#4a1831] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ height: '33px' }}
                >
                  Add Code
                </button>
              </div>
            </div>
          ) : error ? (
            // Error State with Manual Entry Option
            <div className="flex flex-col items-center justify-center py-8 px-6">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="text-sm text-gray-900 mb-2">{error}</h4>
              <p className="text-sm text-gray-600 text-center mb-6 max-w-md">
                {errorDetails}
              </p>

              {/* How to Enable Camera Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 w-full max-w-md">
                <p className="text-xs text-blue-900 mb-2">
                  <strong>To enable camera access:</strong>
                </p>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Click the camera icon in your browser's address bar</li>
                  <li>Select "Allow" for camera permissions</li>
                  <li>Refresh this page and try scanning again</li>
                </ol>
              </div>

              <button
                onClick={handleManualInput}
                className="w-full max-w-md px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                style={{ height: '33px' }}
              >
                <Keyboard className="w-4 h-4" />
                <span>Enter Manually Instead</span>
              </button>

              <button
                onClick={handleClose}
                className="mt-3 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            // Scanner View
            <div className="space-y-4">
              {/* Scanner Region */}
              <div 
                id={qrCodeRegionId}
                className="rounded-lg overflow-hidden bg-black"
                style={{ minHeight: '300px' }}
              />

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Tip:</strong> Hold your device steady and ensure good lighting for best results.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-sm rounded-[3px] transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  style={{ height: '33px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualInput}
                  className="flex-1 px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  style={{ height: '33px' }}
                >
                  <Keyboard className="w-4 h-4" />
                  <span>Enter Manually</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
