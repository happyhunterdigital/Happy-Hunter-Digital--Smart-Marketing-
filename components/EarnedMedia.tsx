import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight } from 'lucide-react';
import { blogPosts } from '../constants';

export const EarnedMedia = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Newspaper className="text-brand-blue" size={24} />
            <span className="text-brand-blue font-bold uppercase tracking-wider">Press & Insights</span>
          </div>
          <h2 className="text-4xl font-bold text-brand-dark mb-4">Earned Media & Knowledge Base</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Industry insights, strategy breakdowns, and our featured press appearances.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
              <div className="p-6 flex-grow">
                <div className="text-xs font-bold text-brand-blue uppercase tracking-wide mb-2">
                  {post.category}
                </div>
                {/* --- FIX WAS HERE: Changed </div> to </h3> --- */}
                <h3 className="text-xl font-bold text-brand-dark mb-3 line-clamp-2">
                  {post.title}
                </h3>
                {/* --------------------------------------------- */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.summary}
                </p>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-brand-blue font-bold hover:text-blue-700 transition-colors"
                >
                  Read Full Article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
