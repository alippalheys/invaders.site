import { useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Order {
  id: string;
  productName: string;
  productImage: string;
  price: string;
  customerName: string;
  customerPhone: string;
  size: string;
  sizeCategory: 'adult' | 'kids';
  sleeveType: 'short' | 'long';
  transferSlipUri: string | null;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export const [OrdersProvider, useOrders] = createContextHook(() => {
  const queryClient = useQueryClient();
  
  const ordersQuery = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (!data) return [];
      return data.map((order): Order => ({
        id: order.id,
        productName: order.product_name,
        productImage: order.product_image,
        price: order.price,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        size: order.size,
        sizeCategory: order.size_category as 'adult' | 'kids',
        sleeveType: order.sleeve_type as 'short' | 'long',
        transferSlipUri: order.transfer_slip_uri,
        status: order.status as Order['status'],
        createdAt: order.created_at,
      }));
    },
    staleTime: 1000 * 60,
    retry: 0,
    retryDelay: 500,
  });

  const { mutate: createOrder } = useMutation({
    mutationFn: async (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          product_name: order.productName,
          product_image: order.productImage,
          price: order.price,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          size: order.size,
          size_category: order.sizeCategory,
          sleeve_type: order.sleeveType,
          transfer_slip_uri: order.transferSlipUri,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const { mutate: deleteOrderMutation } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const addOrder = useCallback((order: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    createOrder(order);
  }, [createOrder]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    updateStatus({ id: orderId, status });
  }, [updateStatus]);

  const deleteOrder = useCallback((orderId: string) => {
    deleteOrderMutation({ id: orderId });
  }, [deleteOrderMutation]);

  const orders = ordersQuery.data ?? [];

  return {
    orders,
    isLoading: ordersQuery.isLoading,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    refetch: () => ordersQuery.refetch(),
  };
});
