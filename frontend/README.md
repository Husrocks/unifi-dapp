# UniFi Frontend

A comprehensive React-based frontend for UniFi, a decentralized student finance application targeting international and hostel students.

## 🚀 Features

- **Wallet Integration**: MetaMask and WalletConnect support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme toggle functionality
- **Real-time Updates**: Live data with React Query
- **Error Handling**: Comprehensive error management
- **Performance Optimized**: React.memo, useMemo, and lazy loading

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Hardhat blockchain running locally (for development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unifi/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   REACT_APP_MAINNET_RPC_URL=your_mainnet_rpc_url
   REACT_APP_POLYGON_RPC_URL=your_polygon_rpc_url
   REACT_APP_SEPOLIA_RPC_URL=your_sepolia_rpc_url
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Start Hardhat blockchain** (in another terminal)
   ```bash
   cd ../contracts
   npx hardhat node
   ```

6. **Deploy contracts** (in another terminal)
   ```bash
   cd ../contracts
   npx hardhat run scripts/deploy.js --network localhost
   ```

## 🏗️ Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/          # Reusable components
│   │   ├── WalletButton.js
│   │   ├── LoanCard.js
│   │   ├── ExpenseTable.js
│   │   ├── DAOProposalCard.js
│   │   ├── Layout.js
│   │   ├── ConnectWallet.js
│   │   └── Scenarios.js
│   ├── context/            # React Context providers
│   │   ├── WalletContext.js
│   │   └── ContractContext.js
│   ├── pages/              # Page components
│   │   ├── Dashboard.js
│   │   ├── ExpensePools.js
│   │   ├── Lending.js
│   │   ├── Remittances.js
│   │   ├── CreditScore.js
│   │   ├── Scholarships.js
│   │   └── Identity.js
│   ├── config/             # Configuration files
│   │   └── contracts.js
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json
├── tailwind.config.js
└── README.md
```

## 🧩 Components

### Reusable Components

#### WalletButton
A flexible wallet connection button with multiple variants and states.

```jsx
import { WalletButton } from './components';

<WalletButton
  onClick={handleConnect}
  isLoading={isConnecting}
  isConnected={active}
  account={account}
  error={error}
  variant="primary"
  size="md"
/>
```

**Props:**
- `onClick`: Connection handler function
- `isLoading`: Loading state
- `isConnected`: Connection status
- `account`: Wallet address
- `error`: Error message
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger'
- `size`: 'sm' | 'md' | 'lg'

#### LoanCard
Displays loan information with status indicators and actions.

```jsx
import { LoanCard } from './components';

<LoanCard
  loan={loanData}
  onAction={handleLoanAction}
  actionText="View Details"
  variant="default"
/>
```

#### ExpenseTable
Sortable and searchable table for expense pool data.

```jsx
import { ExpenseTable } from './components';

<ExpenseTable
  expenses={expenseData}
  onRowClick={handleRowClick}
  onAction={handleAction}
  sortable={true}
  searchable={true}
/>
```

#### DAOProposalCard
Displays scholarship proposals with voting functionality.

```jsx
import { DAOProposalCard } from './components';

<DAOProposalCard
  proposal={proposalData}
  onVote={handleVote}
  onView={handleView}
  variant="default"
/>
```

## 🎨 Styling

The project uses Tailwind CSS with custom configuration:

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Secondary**: Green (#22c55e)
- **Accent**: Orange (#f37415)
- **Dark**: Slate grays (#0f172a to #f8fafc)

### Custom Classes
- `.card`: Glass morphism card style
- `.btn-primary`: Primary button style
- `.btn-secondary`: Secondary button style
- `.btn-outline`: Outline button style
- `.input-field`: Form input styling
- `.status-success`: Success status badge
- `.status-warning`: Warning status badge
- `.status-error`: Error status badge
- `.status-info`: Info status badge

## 🔧 Development

### Adding New Components

1. Create component file in `src/components/`
2. Use React.memo for performance optimization
3. Add PropTypes for type checking
4. Export from `src/components/index.js`
5. Add to documentation

### State Management

- **Wallet State**: Managed by WalletContext
- **Contract State**: Managed by ContractContext
- **Local State**: Use useState and useReducer
- **Server State**: Use React Query

### Performance Optimization

- Use `React.memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers
- Implement lazy loading for routes
- Optimize bundle size with code splitting

### Error Handling

- Wallet connection errors
- Network errors
- Contract interaction errors
- User input validation
- Graceful fallbacks

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📦 Building for Production

```bash
# Build the app
npm run build

# Serve the build
npx serve -s build
```

## 🌐 Deployment

### Vercel
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Traditional Hosting
1. Run `npm run build`
2. Upload `build/` directory to your server
3. Configure server for SPA routing

## 🔒 Security

- Environment variables for sensitive data
- Input validation and sanitization
- HTTPS enforcement in production
- Content Security Policy headers
- Regular dependency updates

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review existing issues

## 🔄 Updates

- Keep dependencies updated
- Monitor for security vulnerabilities
- Follow React best practices
- Stay updated with Web3 standards 