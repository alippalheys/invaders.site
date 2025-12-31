import { useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface MerchItem {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface Hero {
  id: string;
  name: string;
  position: string;
  number: string;
  image: string;
}

const DEFAULT_MERCH: MerchItem[] = [
  { id: '1', name: 'Invaders Jersey', price: 'MVR 450', image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/178mqg61am4g21236pwuw' },
  { id: '2', name: 'Training Tee', price: 'MVR 350', image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/34uyhij0bcupj5bflvvl4' },
  { id: '3', name: 'Classic Black', price: 'MVR 400', image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/k8fftgqvhhmfvknwursfz' },
  { id: '4', name: 'Away Kit', price: 'MVR 500', image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/whfnttw8z01twziof2p42' },
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

  const merchQuery = useQuery<MerchItem[]>({
    queryKey: ['merch'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('merch_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (!data) return [];
      return data.map((item): MerchItem => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      }));
    },
    staleTime: 1000 * 60 * 5,
    retry: 0,
    retryDelay: 500,
  });

  const heroesQuery = useQuery<Hero[]>({
    queryKey: ['heroes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (!data) return [];
      return data.map((hero): Hero => ({
        id: hero.id,
        name: hero.name,
        position: hero.position,
        number: hero.number,
        image: hero.image,
      }));
    },
    staleTime: 1000 * 60 * 5,
    retry: 0,
    retryDelay: 500,
  });

  const { mutate: createMerch } = useMutation({
    mutationFn: async (item: Omit<MerchItem, 'id'>) => {
      const { data, error } = await supabase
        .from('merch_items')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merch'] });
    },
  });

  const { mutate: updateMerch } = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<MerchItem>) => {
      const { data, error } = await supabase
        .from('merch_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merch'] });
    },
  });

  const { mutate: deleteMerch } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from('merch_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merch'] });
    },
  });

  const { mutate: createHero } = useMutation({
    mutationFn: async (hero: Omit<Hero, 'id'>) => {
      const { data, error } = await supabase
        .from('heroes')
        .insert(hero)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
    },
  });

  const { mutate: updateHero } = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Hero>) => {
      const { data, error } = await supabase
        .from('heroes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
    },
  });

  const { mutate: deleteHero } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from('heroes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
    },
  });

  const addMerchItem = useCallback((item: Omit<MerchItem, 'id'>) => {
    createMerch(item);
  }, [createMerch]);

  const updateMerchItem = useCallback((id: string, updates: Partial<MerchItem>) => {
    updateMerch({ id, ...updates });
  }, [updateMerch]);

  const deleteMerchItem = useCallback((id: string) => {
    deleteMerch({ id });
  }, [deleteMerch]);

  const addHero = useCallback((hero: Omit<Hero, 'id'>) => {
    createHero(hero);
  }, [createHero]);

  const updateHeroItem = useCallback((id: string, updates: Partial<Hero>) => {
    updateHero({ id, ...updates });
  }, [updateHero]);

  const deleteHeroItem = useCallback((id: string) => {
    deleteHero({ id });
  }, [deleteHero]);

  const merchItems = merchQuery.data && merchQuery.data.length > 0 
    ? merchQuery.data 
    : DEFAULT_MERCH;

  const heroes = heroesQuery.data && heroesQuery.data.length > 0 
    ? heroesQuery.data 
    : DEFAULT_HEROES;

  return {
    merchItems,
    heroes,
    isLoading: merchQuery.isLoading || heroesQuery.isLoading,
    addMerchItem,
    updateMerchItem,
    deleteMerchItem,
    addHero,
    updateHero: updateHeroItem,
    deleteHero: deleteHeroItem,
    refetch: () => {
      merchQuery.refetch();
      heroesQuery.refetch();
    },
  };
});
