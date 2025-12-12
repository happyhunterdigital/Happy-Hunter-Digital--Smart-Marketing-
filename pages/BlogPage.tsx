import React, { useState } from 'react';
import { EarnedMedia } from '../components/EarnedMedia';
import { BlogReader } from '../components/BlogReader';

export const BlogPage: React.FC = () => {
  const [readingId, setReadingId] = useState<string | null>(null);

  if (readingId) {
    return <BlogReader blogId={readingId} onBack={() => setReadingId(null)} />;
  }

  return <EarnedMedia onReadBlog={(id) => setReadingId(id)} />;
};