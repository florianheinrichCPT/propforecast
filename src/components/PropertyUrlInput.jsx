import React, { useState } from 'react';

const PropertyUrlInput = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateUrl = (inputUrl) => {
    // Basic validation for Property24 and PrivateProperty URLs
    const validDomains = ['property24.com', 'privateproperty.co.za'];
    
    try {
      const urlObj = new URL(inputUrl);
      const domain = urlObj.hostname;
      
      // Check if URL contains any of the valid domains
      const isValidDomain = validDomains.some(validDomain => domain.includes(validDomain));
      
      if (!isValidDomain) {
        setError('Please enter a URL from Property24 or PrivateProperty');
        setIsValid(false);
        return false;
      }
      
      // Check if URL path is likely a property listing
      const hasPropertyPath = urlObj.pathname.length > 1; // Simple check that path isn't just "/"
      
      if (!hasPropertyPath) {
        setError('This doesn\'t appear to be a property listing URL');
        setIsValid(false);
        return false;
      }
      
      // URL appears valid
      setError('');
      setIsValid(true);
      return true;
      
    } catch (e) {
      // Invalid URL format
      setError('Please enter a valid URL');
      setIsValid(false);
      return false;
    }
  };

  const handleChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    
    if (inputUrl.length > 10) { // Only validate if URL has some content
      validateUrl(inputUrl);
    } else {
      setError('');
      setIsValid(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateUrl(url)) {
      onSubmit(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Analyze Property Listing</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Listing URL
          </label>
          <input
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="https://www.property24.com/for-sale/sandton/johannesburg/gauteng/116/..."
            className={`w-full p-3 border rounded-md ${
              error ? 'border-red-300' : isValid ? 'border-green-300' : 'border-gray-300'
            }`}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Paste a property listing URL from Property24 or PrivateProperty
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className={`bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300 ${
              !isValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Property'}
          </button>
          
          {isLoading && (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-gray-600">This may take a few moments...</span>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Supported Property Portals:</h3>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Property24</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>PrivateProperty</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyUrlInput;