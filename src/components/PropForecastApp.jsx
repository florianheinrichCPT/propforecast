import React, { useState } from 'react';
import PropertyInputForm from './PropertyInputForm';
import PropertyUrlInput from './PropertyUrlInput';
import PropertyForecastResults from './PropertyForecastResults';
import { generatePropertyForecast } from '../services/financial-calculator';

const PropForecastApp = () => {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input'); // 'input', 'url', or 'results'
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'url'
  
  const handlePropertySubmit = (propertyData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate the forecast
      const forecastResults = generatePropertyForecast(propertyData);
      
      // Update state
      setForecast(forecastResults);
      setActiveTab('results');
      setIsLoading(false);
    }, 1500);
  };
  
  const handleUrlSubmit = (url) => {
    setIsLoading(true);
    
    // In the real implementation, this would call the backend API
    // For MVP, we'll simulate with mock data
    setTimeout(() => {
      // Mock property data
      const mockPropertyData = {
        propertyType: 'apartment',
        purchasePrice: 1250000,
        deposit: 125000,
        interestRate: 10.5,
        loanTerm: 20,
        monthlyLevies: 1800,
        monthlyRates: 950,
        expectedRent: 8500,
        bedrooms: 2,
        bathrooms: 1,
        location: url.includes('property24') ? 'Sandton, Johannesburg' : 'Rondebosch, Cape Town',
        maintenancePercentage: 1,
        vacancyRate: 5
      };
      
      // Generate the forecast with mock data
      const forecastResults = generatePropertyForecast(mockPropertyData);
      
      // Update state
      setForecast(forecastResults);
      setActiveTab('results');
      setIsLoading(false);
    }, 2000);
  };
  
  const handleBackToInput = () => {
    setActiveTab('input');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">PropForecast</h1>
          <p className="text-gray-600 mt-2">South African Property Investment Analysis Tool</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex border-b border-gray-300">
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === 'input' && inputMethod === 'manual'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('input');
                setInputMethod('manual');
              }}
            >
              Manual Input
            </button>
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === 'input' && inputMethod === 'url'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('input');
                setInputMethod('url');
              }}
            >
              Property URL
            </button>
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === 'results'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => forecast && setActiveTab('results')}
              disabled={!forecast}
            >
              Forecast Results
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="mb-8">
          {activeTab === 'input' ? (
            inputMethod === 'manual' ? (
              <PropertyInputForm onSubmit={handlePropertySubmit} isLoading={isLoading} />
            ) : (
              <PropertyUrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} />
            )
          ) : (
            <div>
              <PropertyForecastResults forecast={forecast} />
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleBackToInput}
                  className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition duration-300 mr-4"
                >
                  Back to Input
                </button>
                <button
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300"
                >
                  Save Analysis
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Feature Highlights (Only show on input screen) */}
        {activeTab === 'input' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-xl font-semibold mb-3 text-blue-700">Manual Property Analysis</div>
              <p className="text-gray-600">
                Enter property details manually to get a comprehensive investment forecast
                including cash flow, yield, and ROI projections.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-xl font-semibold mb-3 text-blue-700">URL Property Analysis</div>
              <p className="text-gray-600">
                Paste a Property24 or PrivateProperty listing URL to automatically
                extract details and generate an investment forecast.
                <span className="block mt-2 text-sm italic">(MVP Demo Mode)</span>
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md opacity-60">
              <div className="text-xl font-semibold mb-3 text-blue-700">Premium Reports</div>
              <p className="text-gray-600">
                Unlock detailed PDF reports with comprehensive analysis and 
                neighborhood-specific insights for better investment decisions.
                <span className="block mt-2 text-sm italic">(Coming Soon)</span>
              </p>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 PropForecast. All rights reserved.</p>
          <p className="mt-1">Investment forecasts are estimates and should not be considered financial advice.</p>
        </div>
      </div>
    </div>
  );
};

export default PropForecastApp;