import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface Order {
  id: string;
  productName: string;
  productImage: string;
  price: string;
  customerName: string;
  customerPhone: string;
  size: string;
  sizeCategory: 'adult' | 'kids';
  transferSlipUri: string | null;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const ORDERS_STORAGE_KEY = 'club_invaders_orders';

export const [OrdersProvider, useOrders] = createContextHook(() => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrders = async (newOrders: Order[]) => {
    try {
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
    } catch (error) {
      console.log('Error saving orders:', error);
    }
  };

  const addOrder = (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveOrders(updated);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updated);
    saveOrders(updated);
  };

  const deleteOrder = (orderId: string) => {
    const updated = orders.filter((order) => order.id !== orderId);
    setOrders(updated);
    saveOrders(updated);
  };

  return {
    orders,
    isLoading,
    addOrder,
    updateOrderStatus,
    deleteOrder,
  };
});
