import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Globe, Search, BarChart3, Folder, FileText, Loader2, Filter } from 'lucide-react';
import { fetchBlogPosts } from '../services/contentService';
import { BlogPost } from '../types';

interface EarnedMediaProps {
  onReadBlog: (id: string) => void;
}

export const EarnedMedia: React.FC<EarnedMediaProps> = ({ onReadBlog }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchBlogPosts();
        setPosts(data);
        // Default to expanding the first category found if not filtered
        if (data.length > 0) {
          const firstCategory = data[0].category;
          setExpandedCategory(firstCategory);
        }
      } catch (error) {
        console.error("Failed to load blog posts", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Extract unique categories from fetched posts
  const categories: string[] = Array.from<string>(new Set(posts.map(post => post.category))).sort();

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      // If switching to All, maybe collapse or expand first? 
      // Let's reset to first category expanded for better UX
      if (categories.length > 0) setExpandedCategory(categories[0]);
    } else {
      // Automatically expand the selected category
      setExpandedCategory(filter);
    }
  };

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // Determine which categories to display based on filter
  const displayedCategories = activeFilter === 'All' 
    ? categories 
    : categories.filter(c => c === activeFilter);

  return (
    <div className="bg-brand-dark min-h-screen animate-fade-in">
      {/* Header Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-brand-dark to-brand-dark pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6 border border-blue-500/20">
            Organic Growth Ecosystem
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Earned Media <span className="text-brand-yellow">Solutions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Stop renting your audience. Start owning it. We build systems that increase organic visibility, 
            establish brand authority, and drive traffic without paying a cent in ad spend.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-12 bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 mx-auto bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-brand-yellow">
                <Globe size={24} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Technical Foundation</h3>
              <p className="text-gray-400 text-sm">Site speed, crawlability, and schema markup that speaks the language of bots.</p>
            </div>
            <div className="p-6 border-l border-r border-gray-800">
              <div className="w-12 h-12 mx-auto bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-brand-yellow">
                <Search size={24} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Relevancy Matching</h3>
              <p className="text-gray-400 text-sm">Aligning content with user intent to answer questions before they are asked.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 mx-auto bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-brand-yellow">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Authority Building</h3>
              <p className="text-gray-400 text-sm">Earning trust through high-quality backlinks and engagement signals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Base Accordion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Search Everywhere Optimization</h2>
              <p className="text-gray-400">Explore our knowledge base by category.</p>
            </div>
          </div>

          {/* Filter Bar */}
          {!loading && (
            <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-gray-400 text-sm font-semibold mr-2">
                  <Filter size={16} className="mr-1" /> Filter:
                </div>
                <button
                  onClick={() => handleFilterChange('All')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === 'All'
                      ? 'bg-brand-yellow text-brand-dark'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  All Topics
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeFilter === category
                        ? 'bg-brand-yellow text-brand-dark'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="animate-spin mb-4 text-brand-yellow" size={32} />
              <p>Loading ecosystem content...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedCategories.map((category) => {
                const categoryPosts = posts.filter(p => p.category === category);
                const isOpen = expandedCategory === category;

                return (
                  <div key={category} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-700">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-gray-900 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${isOpen ? 'bg-brand-yellow text-brand-dark' : 'bg-gray-800 text-gray-400'}`}>
                          <Folder size={20} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                            {category}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{categoryPosts.length} Article{categoryPosts.length !== 1 && 's'}</p>
                        </div>
                      </div>
                      <div className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} />
                      </div>
                    </button>

                    {/* Category Content (Posts List) */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="p-6 pt-0 bg-gray-900 border-t border-gray-800/50">
                        <div className="grid gap-4 mt-4">
                          {categoryPosts.map((post) => (
                            <div 
                              key={post.id} 
                              onClick={() => onReadBlog(post.id)}
                              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800 border border-transparent hover:border-gray-700 cursor-pointer transition-all"
                            >
                              <div className="flex items-start gap-3">
                                <FileText size={18} className="text-gray-500 mt-1 group-hover:text-brand-yellow transition-colors" />
                                <div>
                                  <h4 className="text-base font-semibold text-gray-200 group-hover:text-white transition-colors">
                                    {post.title}
                                  </h4>
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                    {post.summary}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 sm:mt-0 flex items-center text-xs font-bold text-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap sm:ml-4">
                                Read Now <ArrowRight size={14} className="ml-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {displayedCategories.length === 0 && (
                 <div className="text-center py-12 text-gray-500">
                   No categories found matching filter.
                 </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};