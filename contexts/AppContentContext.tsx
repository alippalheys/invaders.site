import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

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

const MERCH_STORAGE_KEY = '@club_invaders_merch';
const HEROES_STORAGE_KEY = '@club_invaders_heroes';

export const [AppContentProvider, useAppContent] = createContextHook(() => {
  const [merchItems, setMerchItems] = useState<MerchItem[]>(DEFAULT_MERCH);
  const [heroes, setHeroes] = useState<Hero[]>(DEFAULT_HEROES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [merchData, heroesData] = await Promise.all([
        AsyncStorage.getItem(MERCH_STORAGE_KEY),
        AsyncStorage.getItem(HEROES_STORAGE_KEY),
      ]);
      
      if (merchData) {
        setMerchItems(JSON.parse(merchData));
      }
      if (heroesData) {
        setHeroes(JSON.parse(heroesData));
      }
    } catch (error) {
      console.log('Error loading app content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMerch = async (items: MerchItem[]) => {
    try {
      await AsyncStorage.setItem(MERCH_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.log('Error saving merch:', error);
    }
  };

  const saveHeroes = async (items: Hero[]) => {
    try {
      await AsyncStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.log('Error saving heroes:', error);
    }
  };

  const addMerchItem = useCallback((item: Omit<MerchItem, 'id'>) => {
    const newItem: MerchItem = {
      ...item,
      id: Date.now().toString(),
    };
    const updated = [...merchItems, newItem];
    setMerchItems(updated);
    saveMerch(updated);
  }, [merchItems]);

  const updateMerchItem = useCallback((id: string, updates: Partial<MerchItem>) => {
    const updated = merchItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setMerchItems(updated);
    saveMerch(updated);
  }, [merchItems]);

  const deleteMerchItem = useCallback((id: string) => {
    const updated = merchItems.filter((item) => item.id !== id);
    setMerchItems(updated);
    saveMerch(updated);
  }, [merchItems]);

  const addHero = useCallback((hero: Omit<Hero, 'id'>) => {
    const newHero: Hero = {
      ...hero,
      id: Date.now().toString(),
    };
    const updated = [...heroes, newHero];
    setHeroes(updated);
    saveHeroes(updated);
  }, [heroes]);

  const updateHero = useCallback((id: string, updates: Partial<Hero>) => {
    const updated = heroes.map((hero) =>
      hero.id === id ? { ...hero, ...updates } : hero
    );
    setHeroes(updated);
    saveHeroes(updated);
  }, [heroes]);

  const deleteHero = useCallback((id: string) => {
    const updated = heroes.filter((hero) => hero.id !== id);
    setHeroes(updated);
    saveHeroes(updated);
  }, [heroes]);

  const resetToDefaults = useCallback(async () => {
    setMerchItems(DEFAULT_MERCH);
    setHeroes(DEFAULT_HEROES);
    await Promise.all([
      AsyncStorage.removeItem(MERCH_STORAGE_KEY),
      AsyncStorage.removeItem(HEROES_STORAGE_KEY),
    ]);
  }, []);

  return {
    merchItems,
    heroes,
    isLoading,
    addMerchItem,
    updateMerchItem,
    deleteMerchItem,
    addHero,
    updateHero,
    deleteHero,
    resetToDefaults,
  };
});
