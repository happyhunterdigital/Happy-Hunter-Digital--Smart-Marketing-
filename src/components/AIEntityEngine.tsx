import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this path correctly points to your Firebase config

export const AIEntityEngine = () => {
  const [jsonLd, setJsonLd] = useState('');

  useEffect(() => {
    // Listen to the compiled output from your Cloud Function
    const unsubscribe = onSnapshot(doc(db, "public_seo", "master_schema"), (snapshot) => {
      if (snapshot.exists()) {
        setJsonLd(snapshot.data().compiled_json_ld);
      }
    });
    return () => unsubscribe();
  }, []);

  return jsonLd ? (
    <script type="application/ld+json">
      {jsonLd}
    </script>
  ) : null;
};
