import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { BlogPost } from "../types";
import { BLOG_POSTS } from "../constants";

// Collection reference name in Firestore
const BLOG_COLLECTION = "blog_posts";

/**
 * Fetches all blog posts. 
 * Falls back to local constants if DB connection fails or is not configured.
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // specific check to see if keys are configured
    if (db.app.options.apiKey === "YOUR_API_KEY") {
      console.warn("Firebase not configured. Serving local content.");
      return BLOG_POSTS;
    }

    const querySnapshot = await getDocs(collection(db, BLOG_COLLECTION));
    const posts: BlogPost[] = [];
    
    querySnapshot.forEach((doc) => {
      // We assume the data in DB matches the BlogPost interface
      posts.push({ id: doc.id, ...doc.data() } as BlogPost);
    });

    return posts.length > 0 ? posts : BLOG_POSTS;
  } catch (error) {
    console.error("Error fetching blog posts from Google Cloud:", error);
    return BLOG_POSTS; // Fallback to hardcoded data
  }
};

/**
 * Fetches a single blog post by ID
 */
export const fetchBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
  try {
    if (db.app.options.apiKey === "YOUR_API_KEY") {
      return BLOG_POSTS.find(p => p.id === id);
    }

    const docRef = doc(db, BLOG_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching single post:", error);
    return BLOG_POSTS.find(p => p.id === id);
  }
};