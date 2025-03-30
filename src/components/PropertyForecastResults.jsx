import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PropertyForecastResults = ({ forecast }) => {
  if (!forecast) return null;
  
  const {
    propertyDetails,
    financingDetails,
    purchaseCosts,
    rentalDetails,
    expenses,
    yields,
    cashFlow,
    roi,
    breakeven,
    investmentSummary
  } = forecast;
  
  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', { 
      style: 'currency', 
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percentage values
  const formatPercent = (value) => {
    return value.toFixed(2) + '%';
  };
  
  // Generate data for the ROI projection chart
  const generateROIChartData = () => {
    const data = [];
    
    // Add initial investment point
    data.push({
      year: 0,
      value: -1 * (financingDetails.deposit + purchaseCosts.total)
    });
    
    // Calculate cumulative return for each year
    for (let year = 1; year <= 10; year++) {
      let cumulativeReturn = 0;
      
      // Add cash flow for each year
      cumulativeReturn += cashFlow.annual * year;
      
      // Add appreciation (simplified linear calculation)
      const annualAppreciationRate = 0.05; // 5% annual appreciation
      const totalAppreciation = propertyDetails.purchasePrice * 
        (Math.pow(1 + annualAppreciationRate, year) - 1);
      cumulativeReturn += totalAppreciation;
      
      // Add equity build (simplified)
      const equityBuild = financingDetails.monthlyBondRepayment * 12 * year * 0.4;
      cumulativeReturn += equityBuild;
      
      data.push({
        year,
        value: cumulativeReturn
      });
    }
    
    return data;
  };
  
  // Generate cash flow data for chart
  const generateCashFlowData = () => {
    return [
      { name: 'Rental Income', value: rentalDetails.effectiveRent },
      { name: 'Bond Payment', value: -financingDetails.monthlyBondRepayment },
      { name: 'Expenses', value: -expenses.total },
      { name: 'Net Cash Flow', value: cashFlow.monthly }
    ];
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Investment Summary</h2>
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-gray-700">{investmentSummary}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Key Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Cash Flow:</span>
              <span className={`font-medium ${cashFlow.monthly >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(cashFlow.monthly)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Net Yield:</span>
              <span className="font-medium text-blue-600">{formatPercent(yields.netYieldOnInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">10-Year ROI:</span>
              <span className="font-medium text-blue-600">{formatPercent(roi.tenYear.roi)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Breakeven:</span>
              <span className="font-medium text-gray-800">
                {breakeven.years < 100 
                  ? `${breakeven.years.toFixed(1)} years`
                  : 'Not within projection period'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Property Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Property Type:</span>
              <span className="font-medium text-gray-800">
                {propertyDetails.propertyType.charAt(0).toUpperCase() + propertyDetails.propertyType.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-800">{propertyDetails.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms/Bathrooms:</span>
              <span className="font-medium text-gray-800">{propertyDetails.bedrooms} / {propertyDetails.bathrooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Purchase Price:</span>
              <span className="font-medium text-gray-800">{formatCurrency(propertyDetails.purchasePrice)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Financial Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left text-gray-600">Category</th>
                <th className="py-2 px-4 text-right text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2 px-4 text-gray-700">Purchase Price</td>
                <td className="py-2 px-4 text-right text-gray-700">{formatCurrency(propertyDetails.purchasePrice)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4 text-gray-700">Transfer Duty</td>
                <td className="py-2 px-4 text-right text-gray-700">{formatCurrency(purchaseCosts.transferDuty)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4 text-gray-700">Attorney Fees</td>
                <td className="py-2 px-4 text-right text-gray-700">{formatCurrency(purchaseCosts.attorneyFees)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4 text-gray-700">Other Costs</td>
                <td className="py-2 px-4 text-right text-gray-700">
                  {formatCurrency(purchaseCosts.deedsOfficeRegistration + purchaseCosts.electronicallyFacilitatedTransfer)}
                </td>
              </tr>
              <tr className="border-t font-semibold">
                <td className="py-2 px-4 text-gray-700">Total Purchase Cost</td>
                <td className="py-2 px-4 text-right text-gray-700">{formatCurrency(propertyDetails.totalPurchaseCost)}</td>
              </tr>
              <tr className="border-t border-gray-300">
                <td className="py-2 px-4 text-gray-700">Deposit</td>
                <td className="py-2 px-4 text-right text-gray-700">{formatCurrency(financingDetails.deposit)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4 text-gray-700">Loan Amount</td>
                <td className="py-2 px-4 text-right text-gray-700">{formatCurrency(financingDetails.loanAmount)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4 text-gray-700">Interest Rate</td>
                <td className="py-2 px-4 text-right text-gray-700">{formatPercent(financingDetails.interestRate)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4 text-gray-700">Loan Term</td>
                <td className="py-2 px-4 text-right text-gray-700">{financingDetails.loanTerm} years</td>
              </tr>
              <tr className="border-t font-semibold">
                <td className="py-2 px-4 text-gray-700">Monthly Bond Payment</td>
                <td className="py-2 px-4 text-right text-gray-700">{formatCurrency(financingDetails.monthlyBondRepayment)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Cash Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="text-base font-medium mb-1 text-green-700">Income</h4>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(rentalDetails.effectiveRent)}</div>
            <div className="text-sm text-gray-600 mt-1">
              Expected Rent: {formatCurrency(rentalDetails.expectedRent)}
              <br />
              Vacancy: {formatPercent(rentalDetails.vacancyRate)}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-md">
            <h4 className="text-base font-medium mb-1 text-red-700">Expenses</h4>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(expenses.total + financingDetails.monthlyBondRepayment)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Bond: {formatCurrency(financingDetails.monthlyBondRepayment)}
              <br />
              Levies: {formatCurrency(expenses.levies)}
              <br />
              Rates: {formatCurrency(expenses.ratesAndTaxes)}
              <br />
              Maintenance: {formatCurrency(expenses.maintenance)}
            </div>
          </div>
          <div className={`p-4 rounded-md ${cashFlow.monthly >= 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
            <h4 className="text-base font-medium mb-1 text-gray-700">Net Cash Flow</h4>
            <div className={`text-2xl font-bold ${cashFlow.monthly >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
              {formatCurrency(cashFlow.monthly)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Annual: {formatCurrency(cashFlow.annual)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Investment Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-base font-medium mb-2 text-gray-700">Rental Yields</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Yield:</span>
                <span className="font-medium text-blue-600">{formatPercent(yields.grossYieldOnPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Yield:</span>
                <span className="font-medium text-blue-600">{formatPercent(yields.netYieldOnPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Yield (On Total Investment):</span>
                <span className="font-medium text-blue-600">{formatPercent(yields.netYieldOnInvestment)}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-base font-medium mb-2 text-gray-700">Return on Investment</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">5-Year ROI:</span>
                <span className="font-medium text-blue-600">{formatPercent(roi.fiveYear.roi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">5-Year Annualized Return:</span>
                <span className="font-medium text-blue-600">{formatPercent(roi.fiveYear.annualizedROI)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">10-Year ROI:</span>
                <span className="font-medium text-blue-600">{formatPercent(roi.tenYear.roi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">10-Year Annualized Return:</span>
                <span className="font-medium text-blue-600">{formatPercent(roi.tenYear.annualizedROI)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Projected ROI Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={generateROIChartData()}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
              <YAxis 
                tickFormatter={(value) => `R${Math.abs(value) >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : Math.abs(value) >= 1000 ? (value / 1000).toFixed(0) + 'K' : value}`}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Cumulative Return']}
                labelFormatter={(value) => `Year ${value}`}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" activeDot={{ r: 8 }} name="Cumulative Return" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
          type="button"
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default PropertyForecastResults;