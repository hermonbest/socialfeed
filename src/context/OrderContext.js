import React, {createContext, useContext, useState, useCallback} from 'react';

const OrderContext = createContext();

export function OrderProvider({children}) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [orders, setOrders] = useState([]);

  const selectPackage = useCallback(pkg => {
    setSelectedPackage(pkg);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPackage(null);
  }, []);

  const addOrder = useCallback(order => {
    setOrders(prev => [order, ...prev]);
  }, []);

  return (
    <OrderContext.Provider
      value={{selectedPackage, selectPackage, clearSelection, orders, addOrder}}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return ctx;
}
