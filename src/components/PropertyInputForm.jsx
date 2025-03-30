import React, { useState } from 'react';

const PropertyInputForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    propertyType: 'apartment',
    purchasePrice: 1200000,
    deposit: 200000,
    interestRate: 10.75,
    loanTerm: 20,
    monthlyLevies: 1500,
    monthlyRates: 800,
    expectedRent: 9000,
    bedrooms: 2,
    bathrooms: 1,
    location: '',
    maintenancePercentage: 1,
    vacancyRate: 5,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Property Investment Details</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="townhouse">Townhouse</option>
              <option value="duplex">Duplex</option>
            </select>
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Sandton, Johannesburg"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Purchase Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (R)</label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              min="0"
              step="10000"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Deposit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (R)</label>
            <input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleChange}
              min="0"
              step="10000"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              min="0"
              step="0.25"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (years)</label>
            <select
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
            </select>
          </div>
          
          {/* Monthly Levies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Levies (R)</label>
            <input
              type="number"
              name="monthlyLevies"
              value={formData.monthlyLevies}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Monthly Rates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rates & Taxes (R)</label>
            <input
              type="number"
              name="monthlyRates"
              value={formData.monthlyRates}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Expected Monthly Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Monthly Rent (R)</label>
            <input
              type="number"
              name="expectedRent"
              value={formData.expectedRent}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <select
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          
          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <select
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          
          {/* Maintenance Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Maintenance (% of Property Value)</label>
            <input
              type="number"
              name="maintenancePercentage"
              value={formData.maintenancePercentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Vacancy Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vacancy Rate (%)</label>
            <input
              type="number"
              name="vacancyRate"
              value={formData.vacancyRate}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Calculating...' : 'Generate Property Forecast'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyInputForm;