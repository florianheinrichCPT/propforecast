/**
 * PropForecast Financial Calculator
 * 
 * This module contains functions for calculating various property investment metrics
 * specific to the South African real estate market.
 */

/**
 * Calculate transfer duty based on South African transfer duty rates (2023/2024).
 * @param {number} purchasePrice - The purchase price of the property in Rands.
 * @returns {number} - The transfer duty in Rands.
 */
export const calculateTransferDuty = (purchasePrice) => {
  // As of 2023/2024 tax year in South Africa
  if (purchasePrice <= 1000000) {
    return 0;
  } else if (purchasePrice <= 1375000) {
    return (purchasePrice - 1000000) * 0.03;
  } else if (purchasePrice <= 1925000) {
    return 11250 + (purchasePrice - 1375000) * 0.06;
  } else if (purchasePrice <= 2475000) {
    return 44250 + (purchasePrice - 1925000) * 0.08;
  } else if (purchasePrice <= 11000000) {
    return 88250 + (purchasePrice - 2475000) * 0.11;
  } else {
    return 1026000 + (purchasePrice - 11000000) * 0.13;
  }
};

/**
 * Calculate estimated attorney fees for property transfer.
 * @param {number} purchasePrice - The purchase price of the property in Rands.
 * @returns {number} - Estimated attorney fees in Rands.
 */
export const calculateAttorneyFees = (purchasePrice) => {
  // This is a simplified estimate
  let baseFee = 0;
  
  if (purchasePrice <= 100000) {
    baseFee = 4500;
  } else if (purchasePrice <= 500000) {
    baseFee = 4500 + (purchasePrice - 100000) * 0.015;
  } else if (purchasePrice <= 1000000) {
    baseFee = 10500 + (purchasePrice - 500000) * 0.01;
  } else if (purchasePrice <= 5000000) {
    baseFee = 15500 + (purchasePrice - 1000000) * 0.007;
  } else {
    baseFee = 43500 + (purchasePrice - 5000000) * 0.003;
  }
  
  // Add VAT (15%)
  return baseFee * 1.15;
};

/**
 * Calculate monthly bond repayment.
 * @param {number} principal - The loan amount (purchase price - deposit).
 * @param {number} annualInterestRate - Annual interest rate as a percentage.
 * @param {number} termYears - Loan term in years.
 * @returns {number} - Monthly bond repayment amount.
 */
export const calculateMonthlyBondRepayment = (principal, annualInterestRate, termYears) => {
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = termYears * 12;
  
  if (monthlyInterestRate === 0) {
    return principal / numberOfPayments;
  }
  
  return principal * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
};

/**
 * Calculate total purchase costs including transfer duties and attorney fees.
 * @param {number} purchasePrice - The purchase price of the property.
 * @returns {object} - Breakdown of costs and total.
 */
export const calculateTotalPurchaseCosts = (purchasePrice) => {
  const transferDuty = calculateTransferDuty(purchasePrice);
  const attorneyFees = calculateAttorneyFees(purchasePrice);
  const deedsOfficeRegistration = 1500; // Simplified estimate
  const electronicallyFacilitatedTransfer = 1800; // Simplified estimate
  
  return {
    transferDuty,
    attorneyFees,
    deedsOfficeRegistration,
    electronicallyFacilitatedTransfer,
    total: transferDuty + attorneyFees + deedsOfficeRegistration + electronicallyFacilitatedTransfer
  };
};

/**
 * Calculate monthly expenses for a property.
 * @param {object} params - Parameters object.
 * @param {number} params.purchasePrice - Property purchase price.
 * @param {number} params.monthlyLevies - Monthly levies (for apartments/complexes).
 * @param {number} params.monthlyRates - Monthly rates and taxes.
 * @param {number} params.maintenancePercentage - Annual maintenance as percentage of property value.
 * @returns {object} - Breakdown of monthly expenses.
 */
export const calculateMonthlyExpenses = ({ 
  purchasePrice, 
  monthlyLevies, 
  monthlyRates, 
  maintenancePercentage 
}) => {
  // Convert annual maintenance to monthly
  const monthlyMaintenance = (purchasePrice * (maintenancePercentage / 100)) / 12;
  
  return {
    levies: monthlyLevies,
    ratesAndTaxes: monthlyRates,
    maintenance: monthlyMaintenance,
    total: monthlyLevies + monthlyRates + monthlyMaintenance
  };
};

/**
 * Calculate the effective monthly rental income, accounting for vacancy rate.
 * @param {number} expectedRent - The expected monthly rent.
 * @param {number} vacancyRate - Expected vacancy rate as a percentage.
 * @returns {number} - The effective monthly rental income.
 */
export const calculateEffectiveRentalIncome = (expectedRent, vacancyRate) => {
  return expectedRent * (1 - vacancyRate / 100);
};

/**
 * Calculate various rental yield metrics.
 * @param {object} params - Parameters object.
 * @param {number} params.purchasePrice - Property purchase price.
 * @param {number} params.totalPurchaseCost - Total cost including purchase price and all fees.
 * @param {number} params.expectedRent - Monthly expected rent.
 * @param {number} params.effectiveRent - Monthly rent adjusted for vacancy.
 * @param {number} params.monthlyExpenses - Total monthly expenses.
 * @returns {object} - Various yield calculations.
 */
export const calculateYields = ({ 
  purchasePrice, 
  totalPurchaseCost, 
  expectedRent, 
  effectiveRent, 
  monthlyExpenses 
}) => {
  // Gross yield based on purchase price only
  const grossYieldOnPrice = (expectedRent * 12) / purchasePrice * 100;
  
  // Gross yield based on total investment (including purchase costs)
  const grossYieldOnInvestment = (expectedRent * 12) / totalPurchaseCost * 100;
  
  // Net yield based on purchase price
  const netYieldOnPrice = ((effectiveRent - monthlyExpenses) * 12) / purchasePrice * 100;
  
  // Net yield based on total investment
  const netYieldOnInvestment = ((effectiveRent - monthlyExpenses) * 12) / totalPurchaseCost * 100;
  
  return {
    grossYieldOnPrice,
    grossYieldOnInvestment,
    netYieldOnPrice,
    netYieldOnInvestment
  };
};

/**
 * Calculate cash flow for the property investment.
 * @param {object} params - Parameters object.
 * @param {number} params.effectiveRent - Monthly rent adjusted for vacancy.
 * @param {number} params.monthlyExpenses - Total monthly expenses.
 * @param {number} params.monthlyBondRepayment - Monthly bond payment.
 * @returns {object} - Cash flow calculations.
 */
export const calculateCashFlow = ({ 
  effectiveRent, 
  monthlyExpenses, 
  monthlyBondRepayment 
}) => {
  const monthlyCashFlow = effectiveRent - monthlyExpenses - monthlyBondRepayment;
  const annualCashFlow = monthlyCashFlow * 12;
  
  return {
    monthly: monthlyCashFlow,
    annual: annualCashFlow
  };
};

/**
 * Calculate return on investment (ROI) projections.
 * @param {object} params - Parameters object.
 * @param {number} params.deposit - Initial deposit amount.
 * @param {number} params.totalPurchaseCost - Total cost including purchase price and all fees.
 * @param {number} params.annualCashFlow - Annual cash flow.
 * @param {number} params.monthlyBondRepayment - Monthly bond payment.
 * @param {number} params.loanTermYears - Loan term in years.
 * @param {number} params.annualAppreciationRate - Annual property appreciation rate (%).
 * @returns {object} - ROI projections for 5 and 10 years.
 */
export const calculateROI = ({
  deposit,
  totalPurchaseCost,
  annualCashFlow,
  monthlyBondRepayment,
  loanTermYears,
  annualAppreciationRate = 5 // Default 5% annual appreciation
}) => {
  // Initial investment = deposit + purchase costs
  const initialInvestment = deposit + (totalPurchaseCost - deposit);
  
  // Calculate 5-year projection
  const fiveYearAppreciation = calculateAppreciation(totalPurchaseCost, annualAppreciationRate, 5);
  const fiveYearCashFlow = annualCashFlow * 5;
  const fiveYearEquityBuild = calculateEquityBuild(monthlyBondRepayment, loanTermYears, 5);
  
  const fiveYearTotalReturn = fiveYearAppreciation + fiveYearCashFlow + fiveYearEquityBuild;
  const fiveYearROI = (fiveYearTotalReturn / initialInvestment) * 100;
  const fiveYearAnnualizedROI = Math.pow(1 + fiveYearROI / 100, 1/5) - 1;
  
  // Calculate 10-year projection
  const tenYearAppreciation = calculateAppreciation(totalPurchaseCost, annualAppreciationRate, 10);
  const tenYearCashFlow = annualCashFlow * 10;
  const tenYearEquityBuild = calculateEquityBuild(monthlyBondRepayment, loanTermYears, 10);
  
  const tenYearTotalReturn = tenYearAppreciation + tenYearCashFlow + tenYearEquityBuild;
  const tenYearROI = (tenYearTotalReturn / initialInvestment) * 100;
  const tenYearAnnualizedROI = Math.pow(1 + tenYearROI / 100, 1/10) - 1;
  
  return {
    fiveYear: {
      appreciation: fiveYearAppreciation,
      cashFlow: fiveYearCashFlow,
      equityBuild: fiveYearEquityBuild,
      totalReturn: fiveYearTotalReturn,
      roi: fiveYearROI,
      annualizedROI: fiveYearAnnualizedROI * 100
    },
    tenYear: {
      appreciation: tenYearAppreciation,
      cashFlow: tenYearCashFlow,
      equityBuild: tenYearEquityBuild,
      totalReturn: tenYearTotalReturn,
      roi: tenYearROI,
      annualizedROI: tenYearAnnualizedROI * 100
    }
  };
};

/**
 * Calculate property appreciation over a period.
 * @param {number} propertyValue - Current property value.
 * @param {number} annualRate - Annual appreciation rate as a percentage.
 * @param {number} years - Number of years to project.
 * @returns {number} - The appreciation amount.
 */
const calculateAppreciation = (propertyValue, annualRate, years) => {
  const futureValue = propertyValue * Math.pow(1 + annualRate / 100, years);
  return futureValue - propertyValue;
};

/**
 * Calculate equity build through bond repayments over a period.
 * @param {number} monthlyPayment - Monthly bond payment.
 * @param {number} totalTermYears - Total loan term in years.
 * @param {number} yearsToCalculate - Number of years to calculate equity for.
 * @returns {number} - The equity built through payments.
 */
const calculateEquityBuild = (monthlyPayment, totalTermYears, yearsToCalculate) => {
  // Simplified calculation - we'd need an amortization schedule for exact figures
  const totalPayments = monthlyPayment * 12 * yearsToCalculate;
  // Roughly estimate the principal portion (increases over time)
  // This is a simplification - real calculation would use amortization table
  const principalPortion = totalPayments * 0.4; // Estimate 40% goes to principal in early years
  
  return principalPortion;
};

/**
 * Calculate the breakeven point.
 * @param {number} initialCashOutflow - Initial cash outflow (deposit + costs).
 * @param {number} monthlyCashFlow - Monthly cash flow.
 * @returns {object} - Breakeven point in months and years.
 */
export const calculateBreakeven = (initialCashOutflow, monthlyCashFlow) => {
  if (monthlyCashFlow <= 0) {
    return { months: Infinity, years: Infinity };
  }
  
  const months = Math.ceil(initialCashOutflow / monthlyCashFlow);
  return {
    months,
    years: months / 12
  };
};

/**
 * Generate the complete property investment forecast.
 * @param {object} propertyData - All property and investment parameters.
 * @returns {object} - Complete investment forecast.
 */
export const generatePropertyForecast = (propertyData) => {
  const {
    propertyType,
    purchasePrice,
    deposit,
    interestRate,
    loanTerm,
    monthlyLevies,
    monthlyRates,
    expectedRent,
    bedrooms,
    bathrooms,
    location,
    maintenancePercentage,
    vacancyRate
  } = propertyData;
  
  // Calculate loan amount
  const loanAmount = purchasePrice - deposit;
  
  // Calculate purchase costs
  const purchaseCosts = calculateTotalPurchaseCosts(purchasePrice);
  const totalPurchaseCost = purchasePrice + purchaseCosts.total;
  
  // Calculate monthly bond repayment
  const monthlyBondRepayment = calculateMonthlyBondRepayment(loanAmount, interestRate, loanTerm);
  
  // Calculate monthly expenses
  const expenses = calculateMonthlyExpenses({
    purchasePrice,
    monthlyLevies,
    monthlyRates,
    maintenancePercentage
  });
  
  // Calculate effective rental income
  const effectiveRent = calculateEffectiveRentalIncome(expectedRent, vacancyRate);
  
  // Calculate yields
  const yields = calculateYields({
    purchasePrice,
    totalPurchaseCost,
    expectedRent,
    effectiveRent,
    monthlyExpenses: expenses.total
  });
  
  // Calculate cash flow
  const cashFlow = calculateCashFlow({
    effectiveRent,
    monthlyExpenses: expenses.total,
    monthlyBondRepayment
  });
  
  // Calculate ROI projections
  const roi = calculateROI({
    deposit,
    totalPurchaseCost,
    annualCashFlow: cashFlow.annual,
    monthlyBondRepayment,
    loanTermYears: loanTerm
  });
  
  // Calculate breakeven point
  const breakeven = calculateBreakeven(deposit + purchaseCosts.total, cashFlow.monthly);
  
  // Return complete forecast
  return {
    propertyDetails: {
      propertyType,
      location,
      bedrooms,
      bathrooms,
      purchasePrice,
      totalPurchaseCost
    },
    financingDetails: {
      deposit,
      loanAmount,
      interestRate,
      loanTerm,
      monthlyBondRepayment
    },
    purchaseCosts,
    rentalDetails: {
      expectedRent,
      vacancyRate,
      effectiveRent
    },
    expenses,
    yields,
    cashFlow,
    roi,
    breakeven,
    investmentSummary: generateInvestmentSummary({
      cashFlow,
      yields,
      roi,
      breakeven
    })
  };
};

/**
 * Generate a natural language summary of the investment potential.
 * @param {object} forecastData - Key forecast metrics.
 * @returns {string} - Natural language summary.
 */
const generateInvestmentSummary = ({ cashFlow, yields, roi, breakeven }) => {
  let summary = '';
  
  // Cash flow assessment
  if (cashFlow.monthly > 500) {
    summary += 'This property is cash flow positive, generating a healthy monthly surplus. ';
  } else if (cashFlow.monthly > 0) {
    summary += 'This property is slightly cash flow positive, covering all expenses with a small margin. ';
  } else if (cashFlow.monthly > -500) {
    summary += 'This property is slightly cash flow negative, requiring a small monthly contribution. ';
  } else {
    summary += 'This property is significantly cash flow negative, requiring substantial monthly contributions. ';
  }
  
  // Yield assessment
  if (yields.netYieldOnInvestment > 8) {
    summary += 'The net yield is excellent compared to South African market averages. ';
  } else if (yields.netYieldOnInvestment > 6) {
    summary += 'The net yield is good for the South African market. ';
  } else if (yields.netYieldOnInvestment > 4) {
    summary += 'The net yield is average for the South African market. ';
  } else {
    summary += 'The net yield is below average for the South African market. ';
  }
  
  // ROI assessment
  if (roi.tenYear.annualizedROI > 15) {
    summary += 'The 10-year return on investment projection is very strong. ';
  } else if (roi.tenYear.annualizedROI > 10) {
    summary += 'The 10-year return on investment projection is good. ';
  } else if (roi.tenYear.annualizedROI > 7) {
    summary += 'The 10-year return on investment projection is moderate. ';
  } else {
    summary += 'The 10-year return on investment projection is below average. ';
  }
  
  // Breakeven assessment
  if (breakeven.years < 5) {
    summary += 'You should recover your initial investment relatively quickly. ';
  } else if (breakeven.years < 10) {
    summary += 'The breakeven period is reasonable for a long-term investment. ';
  } else if (breakeven.years < 20) {
    summary += 'The breakeven period is quite long, making this a very long-term investment. ';
  } else {
    summary += 'The breakeven period extends beyond 20 years, raising concerns about this investment. ';
  }
  
  // Overall assessment
  if (roi.tenYear.annualizedROI > 12 && yields.netYieldOnInvestment > 6) {
    summary += 'Overall, this property appears to be a strong investment opportunity.';
  } else if (roi.tenYear.annualizedROI > 8 && yields.netYieldOnInvestment > 4) {
    summary += 'Overall, this property appears to be a reasonable investment opportunity.';
  } else if (cashFlow.monthly > 0) {
    summary += 'This property may be worth considering primarily for its positive cash flow, despite modest long-term returns.';
  } else {
    summary += 'This property presents some investment challenges and may require careful consideration of future market trends and personal investment goals.';
  }
  
  return summary;
};