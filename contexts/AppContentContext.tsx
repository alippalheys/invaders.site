import { useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';

export interface MerchItem {
  id: string;
  name: string;
  price: string;
  kidsPrice: string;
  image: string;
}

export interface Hero {
  id: string;
  name: string;
  position: string;
  number: string;
  image: string;
}

export interface BankTransferInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface SizeGuideAdult {
  size: string;
  chest: string;
  length: string;
  shoulder: string;
}

export interface SizeGuideKids {
  size: string;
  chest: string;
  length: string;
  age: string;
}

export interface SizeGuide {
  adult: SizeGuideAdult[];
  kids: SizeGuideKids[];
}

const DEFAULT_MERCH: MerchItem[] = [
  { id: '1', name: 'Invaders Jersey', price: 'MVR 450', kidsPrice: 'MVR 350', image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/178mqg61am4g21236pwuw' },
  { id: '2', name: 'Training Tee', price: 'MVR 350', kidsPrice: 'MVR 250', image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/34uyhij0bcupj5bflvvl4' },
  { id: '3', name: 'Classic Black', price: 'MVR 400', kidsPrice: 'MVR 300', image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/k8fftgqvhhmfvknwursfz' },
  { id: '4', name: 'Away Kit', price: 'MVR 500', kidsPrice: 'MVR 400', image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/whfnttw8z01twziof2p42' },
];

const DEFAULT_HEROES: Hero[] = [
  { id: '1', name: 'Ahmed Rasheed', position: 'Goalkeeper', number: '1', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
  { id: '2', name: 'Ibrahim Naseem', position: 'Defender', number: '4', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
  { id: '3', name: 'Hassan Ali', position: 'Defender', number: '5', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
  { id: '4', name: 'Mohamed Shifaz', position: 'Defender', number: '3', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face' },
  { id: '5', name: 'Yoosuf Shareef', position: 'Midfielder', number: '8', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face' },
  { id: '6', name: 'Ali Waheed', position: 'Midfielder', number: '10', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face' },
  { id: '7', name: 'Hussain Nizam', position: 'Midfielder', number: '6', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&h=200&fit=crop&crop=face' },
  { id: '8', name: 'Ismail Faisal', position: 'Midfielder', number: '14', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face' },
  { id: '9', name: 'Abdulla Shimaz', position: 'Forward', number: '9', image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop&crop=face' },
  { id: '10', name: 'Ahmed Nazim', position: 'Forward', number: '11', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face' },
  { id: '11', name: 'Mohamed Arif', position: 'Forward', number: '7', image: 'https://images.unsplash.com/photo-1480455624313-e29b44bbbd7a?w=200&h=200&fit=crop&crop=face' },
  { id: '12', name: 'Hussain Rasheed', position: 'Substitute', number: '12', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face' },
];

export const [AppContentProvider, useAppContent] = createContextHook(() => {
  const queryClient = useQueryClient();

  const merchQuery = trpc.merch.getAll.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: 0,
    retryDelay: 500,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  const heroesQuery = trpc.heroes.getAll.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: 0,
    retryDelay: 500,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  const settingsQuery = trpc.settings.get.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: 0,
    retryDelay: 500,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  const sizeGuideQuery = trpc.settings.getSizeGuide.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: 0,
    retryDelay: 500,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  const createMerchMutation = trpc.merch.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['merch', 'getAll']] });
    },
  });

  const updateMerchMutation = trpc.merch.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['merch', 'getAll']] });
    },
  });

  const deleteMerchMutation = trpc.merch.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['merch', 'getAll']] });
    },
  });

  const createHeroMutation = trpc.heroes.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['heroes', 'getAll']] });
    },
  });

  const updateHeroMutation = trpc.heroes.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['heroes', 'getAll']] });
    },
  });

  const deleteHeroMutation = trpc.heroes.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['heroes', 'getAll']] });
    },
  });

  const updateSettingsMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['settings', 'get']] });
    },
  });

  const updateSizeGuideMutation = trpc.settings.updateSizeGuide.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['settings', 'getSizeGuide']] });
    },
  });

  const addMerchItem = useCallback(async (item: Omit<MerchItem, 'id'>) => {
    try {
      console.log('[AppContentContext] Creating merch item...', item);
      const result = await createMerchMutation.mutateAsync(item);
      console.log('[AppContentContext] Merch item created successfully:', result);
      return result;
    } catch (error: any) {
      console.error('[AppContentContext] Failed to create merch:', error);
      throw error;
    }
  }, [createMerchMutation]);

  const updateMerchItem = useCallback(async (id: string, updates: Partial<MerchItem>) => {
    try {
      console.log('[AppContentContext] Updating merch item...', id, updates);
      const result = await updateMerchMutation.mutateAsync({ id, ...updates });
      console.log('[AppContentContext] Merch item updated successfully:', result);
      return result;
    } catch (error: any) {
      console.error('[AppContentContext] Failed to update merch:', error);
      throw error;
    }
  }, [updateMerchMutation]);

  const deleteMerchItem = useCallback(async (id: string) => {
    await deleteMerchMutation.mutateAsync({ id });
  }, [deleteMerchMutation]);

  const addHero = useCallback(async (hero: Omit<Hero, 'id'>) => {
    try {
      console.log('[AppContentContext] Creating hero...', hero);
      const result = await createHeroMutation.mutateAsync(hero);
      console.log('[AppContentContext] Hero created successfully:', result);
      return result;
    } catch (error: any) {
      console.error('[AppContentContext] Failed to create hero:', error);
      throw error;
    }
  }, [createHeroMutation]);

  const updateHeroItem = useCallback(async (id: string, updates: Partial<Hero>) => {
    try {
      console.log('[AppContentContext] Updating hero...', id, updates);
      const result = await updateHeroMutation.mutateAsync({ id, ...updates });
      console.log('[AppContentContext] Hero updated successfully:', result);
      return result;
    } catch (error: any) {
      console.error('[AppContentContext] Failed to update hero:', error);
      throw error;
    }
  }, [updateHeroMutation]);

  const deleteHeroItem = useCallback(async (id: string) => {
    await deleteHeroMutation.mutateAsync({ id });
  }, [deleteHeroMutation]);

  const updateBankInfo = useCallback(async (info: BankTransferInfo) => {
    try {
      console.log('[AppContentContext] Updating bank info...', info);
      const result = await updateSettingsMutation.mutateAsync(info);
      console.log('[AppContentContext] Bank info updated successfully:', result);
      return result;
    } catch (error: any) {
      console.error('[AppContentContext] Failed to update bank info:', error);
      throw error;
    }
  }, [updateSettingsMutation]);

  const updateSizeGuide = useCallback(async (guide: SizeGuide) => {
    try {
      console.log('[AppContentContext] Updating size guide...', guide);
      const result = await updateSizeGuideMutation.mutateAsync(guide);
      console.log('[AppContentContext] Size guide updated successfully:', result);
      return result;
    } catch (error: any) {
      console.error('[AppContentContext] Failed to update size guide:', error);
      throw error;
    }
  }, [updateSizeGuideMutation]);

  const merchItems = merchQuery.data && merchQuery.data.length > 0 
    ? merchQuery.data 
    : DEFAULT_MERCH;

  const heroes = heroesQuery.data && heroesQuery.data.length > 0 
    ? heroesQuery.data 
    : DEFAULT_HEROES;

  const bankInfo = settingsQuery.data || {
    bankName: 'Bank of Maldives (BML)',
    accountName: 'Club Invaders',
    accountNumber: '7730000123456',
  };

  const sizeGuide: SizeGuide = sizeGuideQuery.data || {
    adult: [
      { size: 'XS', chest: '34"', length: '26"', shoulder: '16"' },
      { size: 'S', chest: '36"', length: '27"', shoulder: '17"' },
      { size: 'M', chest: '38"', length: '28"', shoulder: '18"' },
      { size: 'L', chest: '40"', length: '29"', shoulder: '19"' },
      { size: 'XL', chest: '42"', length: '30"', shoulder: '20"' },
      { size: 'XXL', chest: '44"', length: '31"', shoulder: '21"' },
    ],
    kids: [
      { size: '4', chest: '22"', length: '16"', age: '3-4' },
      { size: '6', chest: '24"', length: '18"', age: '5-6' },
      { size: '8', chest: '26"', length: '20"', age: '7-8' },
      { size: '10', chest: '28"', length: '22"', age: '9-10' },
      { size: '12', chest: '30"', length: '24"', age: '11-12' },
      { size: '14', chest: '32"', length: '25"', age: '13-14' },
    ],
  };

  return {
    merchItems,
    heroes,
    bankInfo,
    sizeGuide,
    isLoading: merchQuery.isLoading || heroesQuery.isLoading,
    addMerchItem,
    updateMerchItem,
    deleteMerchItem,
    addHero,
    updateHero: updateHeroItem,
    deleteHero: deleteHeroItem,
    updateBankInfo,
    updateSizeGuide,
    refetch: () => {
      merchQuery.refetch();
      heroesQuery.refetch();
      settingsQuery.refetch();
      sizeGuideQuery.refetch();
    },
  };
});
