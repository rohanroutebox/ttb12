import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  // Pass your existing Supabase client down as a prop
  supabase: any; 
  // A callback function to update your gallery's visible items state
  onSearchResults: (results: any[]) => void;
  // A callback function to toggle a loading spinner on/off
  setIsLoading: (loading: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ supabase, onSearchResults, setIsLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 1. Debounce Mechanism: Wait 300ms after the user stops typing before hitting Supabase
    const delayDebounceFn = setTimeout(() => {
      searchDatabase(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchDatabase = async (query: string) => {
    setIsLoading(true);
    try {
      let supabaseQuery = supabase
        .from('creations') // Double check if your table name is 'creations' or 'gallery'
        .select('*')
        .order('created_at', { ascending: false });

      // 2. If the user typed something, apply the case-insensitive partial match filter
      if (query.trim() !== '') {
        // This searches the 'title' column for the typed destination text
        supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;
      
      // 3. Send the matching database rows back up to the gallery state
      onSearchResults(data || []);
    } catch (error) {
      console.error('Error searching destinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-10 px-4">
      <div className="relative rounded-xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl transition-all duration-300 focus-within:border-teal-500/50 focus-within:shadow-teal-500/5">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by destination (e.g., Kyoto, Malibu)..."
          className="block w-full rounded-xl border-0 bg-transparent py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-0 sm:text-sm"
        />
      </div>
    </div>
  );
};