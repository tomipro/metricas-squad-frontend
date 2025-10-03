# Executive Summary Tests

This directory contains comprehensive unit tests for the "Resumen Ejecutivo" (Executive Summary) tab of the flight booking dashboard.

## 📁 Test Structure

```
src/__tests__/
├── components/           # Component tests
│   └── ExecutiveSummary.test.tsx
├── hooks/               # Hook tests
│   └── useExecutiveSummary.test.ts
├── services/            # Service tests
│   └── analyticsService.test.ts
├── integration/         # Integration tests
│   └── ExecutiveSummary.integration.test.tsx
├── mocks/               # Mock data and components
│   ├── mockData.ts
│   ├── mockHooks.ts
│   ├── mockComponents.tsx
│   └── fileMock.js
├── setupTests.ts        # Test setup configuration
├── jest.config.js       # Jest configuration
├── test-runner.js       # Test runner script
└── README.md           # This file
```

## 🧪 Test Coverage

### Component Tests (`ExecutiveSummary.test.tsx`)
- ✅ Loading state rendering
- ✅ Error state handling
- ✅ Success state with data
- ✅ Empty data handling
- ✅ Period parameter handling
- ✅ Data transformation
- ✅ Accessibility features

### Hook Tests (`useExecutiveSummary.test.ts`)
- ✅ Initial loading state
- ✅ Success state with data
- ✅ Error state handling
- ✅ Parameter passing
- ✅ Partial loading states
- ✅ Partial error states
- ✅ Default parameters
- ✅ Empty data responses
- ✅ Network error handling

### Service Tests (`analyticsService.test.ts`)
- ✅ API function calls with correct parameters
- ✅ Default parameter handling
- ✅ Error handling
- ✅ Data validation
- ✅ Network error scenarios
- ✅ Parameter validation

### Integration Tests (`ExecutiveSummary.integration.test.tsx`)
- ✅ Complete data flow
- ✅ Error handling integration
- ✅ Data transformation integration
- ✅ Performance scenarios
- ✅ Accessibility integration

## 🚀 Running Tests

### Run All Executive Summary Tests
```bash
npm test -- --testPathPattern="ExecutiveSummary"
```

### Run Specific Test Suites
```bash
# Component tests only
npm test -- --testPathPattern="components/ExecutiveSummary"

# Hook tests only
npm test -- --testPathPattern="hooks/useExecutiveSummary"

# Service tests only
npm test -- --testPathPattern="services/analyticsService"

# Integration tests only
npm test -- --testPathPattern="integration/ExecutiveSummary"
```

### Run with Coverage
```bash
npm test -- --coverage --testPathPattern="ExecutiveSummary"
```

### Run in Watch Mode
```bash
npm test -- --watch --testPathPattern="ExecutiveSummary"
```

## 📊 Test Data

### Mock Data Structure
The tests use comprehensive mock data that mirrors the real API responses:

- **FunnelData**: Search to payment conversion metrics
- **AverageFareData**: Average booking value
- **MonthlyRevenueData**: Revenue trends over time
- **LifetimeValueData**: Customer lifetime value
- **RevenuePerUserData**: Revenue per user metrics
- **PaymentSuccessData**: Payment success rates
- **AnticipationData**: Booking anticipation metrics

### Mock Scenarios
- ✅ **Success State**: All API calls succeed with valid data
- ✅ **Loading State**: All queries are in loading state
- ✅ **Error State**: API calls fail with errors
- ✅ **Empty State**: API returns empty/null data
- ✅ **Partial States**: Some queries succeed, others fail/load

## 🎯 Test Scenarios

### 1. Component Rendering
- Renders loading skeletons during data fetch
- Displays error message when API fails
- Shows all metrics when data loads successfully
- Handles empty data gracefully

### 2. Data Transformation
- Converts API data to component-friendly format
- Formats numbers and percentages correctly
- Handles missing or null data fields
- Transforms chart data appropriately

### 3. User Interactions
- Responds to period changes
- Handles invalid period values
- Maintains state during rapid changes

### 4. Error Handling
- Network errors
- API errors (404, 500, etc.)
- Timeout errors
- Partial failures

### 5. Performance
- Concurrent API calls
- Rapid period changes
- Memory management

## 🔧 Configuration

### Jest Configuration
- **Environment**: jsdom for DOM testing
- **Setup**: Custom setup file with mocks
- **Coverage**: 80% threshold for all files, 85% for Executive Summary
- **Transform**: TypeScript support with ts-jest

### Mock Configuration
- **API Services**: Mocked with jest.mock()
- **Components**: Mocked with custom implementations
- **Environment Variables**: Mocked for testing
- **Browser APIs**: IntersectionObserver, ResizeObserver mocked

## 📈 Coverage Goals

| Component | Branches | Functions | Lines | Statements |
|-----------|----------|-----------|-------|------------|
| ExecutiveSummary | 85% | 85% | 85% | 85% |
| useExecutiveSummary | 80% | 80% | 80% | 80% |
| analyticsService | 80% | 80% | 80% | 80% |

## 🐛 Debugging Tests

### Common Issues
1. **Mock not working**: Check jest.mock() placement
2. **Async issues**: Use waitFor() for async operations
3. **Component not rendering**: Verify QueryClient wrapper
4. **Data not loading**: Check mock service implementations

### Debug Commands
```bash
# Run with verbose output
npm test -- --verbose --testPathPattern="ExecutiveSummary"

# Run single test file
npm test -- --testNamePattern="should render loading state" --testPathPattern="ExecutiveSummary"

# Debug mode
npm test -- --detectOpenHandles --forceExit --testPathPattern="ExecutiveSummary"
```

## 📝 Adding New Tests

### For New Features
1. Add test cases to existing test files
2. Update mock data if needed
3. Ensure coverage thresholds are met
4. Update this README

### For New Components
1. Create new test file in appropriate directory
2. Add mocks if needed
3. Update jest.config.js if necessary
4. Add to coverage collection

## 🎉 Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how
2. **Use Descriptive Test Names**: Make it clear what each test verifies
3. **Mock External Dependencies**: Keep tests isolated and fast
4. **Test Edge Cases**: Empty data, errors, loading states
5. **Maintain Test Data**: Keep mocks up to date with real API
6. **Write Accessible Tests**: Include accessibility checks

## 📚 Resources

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TanStack Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
