import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSettings } from '../services/settingsService';

interface SettingsContextType {
  currency: string;
  currencySymbol: string;
  taxPercentage: number;
  stockAlertThreshold: number;
  invoicePrefix: string;
  setCurrency: (currency: string) => void;
  setTaxPercentage: (tax: number) => void;
  setStockAlertThreshold: (threshold: number) => void;
  setInvoicePrefix: (prefix: string) => void;
}

const currencySymbols: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: 'A$', CAD: 'C$',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState(
    () => localStorage.getItem('inventory_currency') || 'USD'
  );
  const [taxPercentage, setTaxPercentageState] = useState(
    () => Number(localStorage.getItem('inventory_tax')) || 10
  );
  const [stockAlertThreshold, setStockAlertThresholdState] = useState(
    () => Number(localStorage.getItem('inventory_stock_alert')) || 10
  );
  const [invoicePrefix, setInvoicePrefixState] = useState(
    () => localStorage.getItem('inventory_invoice_prefix') || 'INV'
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    getSettings().then((res) => {
      const d = res.data?.data;
      const currency_tax = d?.currency_tax || {};
      const stock = d?.stock || {};
      const invoice = d?.invoice || {};

      if (currency_tax.currency) setCurrencyState(currency_tax.currency);
      if (currency_tax.tax_percentage) setTaxPercentageState(Number(currency_tax.tax_percentage));
      if (stock.stock_alert_threshold) setStockAlertThresholdState(Number(stock.stock_alert_threshold));
      if (invoice.invoice_prefix) setInvoicePrefixState(invoice.invoice_prefix);
    }).catch(() => {});
  }, []);

  const setCurrency = (value: string) => {
    setCurrencyState(value);
    localStorage.setItem('inventory_currency', value);
  };
  const setTaxPercentage = (value: number) => {
    setTaxPercentageState(value);
    localStorage.setItem('inventory_tax', String(value));
  };
  const setStockAlertThreshold = (value: number) => {
    setStockAlertThresholdState(value);
    localStorage.setItem('inventory_stock_alert', String(value));
  };
  const setInvoicePrefix = (value: string) => {
    setInvoicePrefixState(value);
    localStorage.setItem('inventory_invoice_prefix', value);
  };

  return (
    <SettingsContext.Provider
      value={{
        currency,
        currencySymbol: currencySymbols[currency] || '$',
        taxPercentage,
        stockAlertThreshold,
        invoicePrefix,
        setCurrency,
        setTaxPercentage,
        setStockAlertThreshold,
        setInvoicePrefix,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
