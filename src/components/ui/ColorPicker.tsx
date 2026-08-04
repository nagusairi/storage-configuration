import { useState, useRef, useEffect } from 'react';
import { Pipette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  required?: boolean;
  helperText?: string;
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Convert HSV to RGB
function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// Convert RGB to HSV
function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;
  
  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / diff + 2) / 6;
    } else {
      h = ((r - g) / diff + 4) / 6;
    }
  }
  
  return { h: h * 360, s, v };
}

export function ColorPicker({ value, onChange, label, required, helperText }: ColorPickerProps) {
  // Initialize with current value or default (#277230)
  const initialColor = value || '#277230';
  const rgb = hexToRgb(initialColor);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  
  const [showPicker, setShowPicker] = useState(false);
  const [hexValue, setHexValue] = useState(initialColor.toUpperCase());
  const [rgbValues, setRgbValues] = useState(rgb);
  const [hue, setHue] = useState(hsv.h);
  const [saturation, setSaturation] = useState(hsv.s);
  const [brightness, setBrightness] = useState(hsv.v);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  
  // Update color when HSV changes
  useEffect(() => {
    const rgb = hsvToRgb(hue, saturation, brightness);
    setRgbValues(rgb);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexValue(hex.toUpperCase());
    onChange(hex);
  }, [hue, saturation, brightness]);
  
  // Draw the color gradient canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw hue background
    const hueColor = hsvToRgb(hue, 1, 1);
    ctx.fillStyle = `rgb(${hueColor.r}, ${hueColor.g}, ${hueColor.b})`;
    ctx.fillRect(0, 0, width, height);
    
    // Draw white gradient (left to right)
    const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
    whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw black gradient (top to bottom)
    const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
    blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, width, height);
  }, [hue]);
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const s = x / canvas.width;
    const v = 1 - (y / canvas.height);
    
    setSaturation(Math.max(0, Math.min(1, s)));
    setBrightness(Math.max(0, Math.min(1, v)));
  };
  
  const handleHueChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = hueSliderRef.current;
    if (!slider) return;
    
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newHue = (x / rect.width) * 360;
    
    setHue(Math.max(0, Math.min(360, newHue)));
  };
  
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value;
    
    // Allow user to type with or without #
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    
    setHexValue(hex.toUpperCase());
  };
  
  const handleHexBlur = () => {
    // Validate hex code on blur
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
      const rgb = hexToRgb(hexValue);
      setRgbValues(rgb);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setHue(hsv.h);
      setSaturation(hsv.s);
      setBrightness(hsv.v);
      onChange(hexValue);
    } else {
      // If invalid, revert to current valid color
      const hex = rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b);
      setHexValue(hex.toUpperCase());
    }
  };
  
  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(255, numValue));
    
    const newRgb = { ...rgbValues, [channel]: clampedValue };
    setRgbValues(newRgb);
    
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexValue(hex.toUpperCase());
    
    const hsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
    setHue(hsv.h);
    setSaturation(hsv.s);
    setBrightness(hsv.v);
    
    onChange(hex);
  };

  return (
    <div>
      {/* Label */}
      {label && (
        <label className="block text-sm text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Horizontal layout: Color square + Hex input */}
      <div className="flex items-center gap-2">
        {/* Color preview square - 40px × 33px */}
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="w-[40px] h-[33px] rounded-[3px] border border-gray-300 flex-shrink-0 cursor-pointer hover:border-gray-400 transition-colors"
          style={{ backgroundColor: hexValue }}
        />
        
        {/* Hex code input */}
        <input
          type="text"
          value={hexValue}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
          style={{ height: '33px' }}
          placeholder="#000000"
        />
      </div>
      
      {/* Helper text */}
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
      
      {/* Custom color picker popup */}
      {showPicker && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50"
            onClick={() => setShowPicker(false)}
          />
          
          {/* Popup */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl w-[280px]">
            <div className="p-4">
              {/* Color gradient canvas */}
              <canvas
                ref={canvasRef}
                width={232}
                height={180}
                onClick={handleCanvasClick}
                className="w-full h-[180px] rounded cursor-crosshair mb-3"
              />
              
              {/* Controls row: pipette icon, color preview, hue slider */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Pipette className="w-4 h-4 text-gray-600" />
                </button>
                
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: hexValue }}
                />
                
                <div
                  ref={hueSliderRef}
                  onClick={handleHueChange}
                  className="flex-1 h-6 rounded cursor-pointer relative"
                  style={{
                    background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                  }}
                >
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-400 shadow-md pointer-events-none"
                    style={{ left: `${(hue / 360) * 100}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
              </div>
              
              {/* RGB inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    value={rgbValues.r}
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                    min="0"
                    max="255"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 text-center mt-1">R</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={rgbValues.g}
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                    min="0"
                    max="255"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 text-center mt-1">G</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={rgbValues.b}
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                    min="0"
                    max="255"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 text-center mt-1">B</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
