import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { blogPosts } from '../constants';

export const BlogReader = () => {
  const { id } = useParams(); // Get the ID from the URL
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return <div className="pt-32 text-center">Article not found. <Link to="/earned-media">Go Back</Link></div>;
  }

  return (
    <article className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link 
          to="/earned-media"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-blue mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Articles</span>
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-brand-blue font-medium">
              <Tag size={14} />
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} />
              Motsumi
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-brand-yellow pl-6 italic">
            {post.summary}
          </p>
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-brand-dark prose-a:text-brand-blue"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Q&A Section */}
        {post.qa && post.qa.length > 0 && (
          <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-2">
              <span className="text-3xl">💡</span> Key Takeaways & Q/A
            </h3>
            <div className="space-y-6">
              {post.qa.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-bold text-lg text-brand-dark mb-3">
                    {item.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
