import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const processEntitySchema = onDocumentWritten("brand_identity/{docId}", async (event) => {
  console.log("CMS Data change detected. Recompiling Entity Schema...");
  try {
    const db = admin.firestore();
    const brandSnapshot = await db.collection("brand_identity").limit(1).get();
    if (brandSnapshot.empty) return null;
    
    const brandData = brandSnapshot.docs[0].data();
    const aeoSnapshot = await db.collection("aeo_knowledge").where("speakable", "==", true).get();
    const faqItems = aeoSnapshot.docs.map(doc => {
      const data = doc.data();
      return { "@type": "Question", "name": data.question, "acceptedAnswer": { "@type": "Answer", "text": data.answer } };
    });

    const claimsSnapshot = await db.collection("verified_claims").get();
    const offerItems = claimsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": data.serviceName || "Digital Protocol",
          "description": data.serviceDescription || "Verified AI Marketing Solutions",
          "subjectOf": {
            "@type": "ClaimReview",
            "claimReviewed": data.claim || "AI-Ready Digital Infrastructure",
            "reviewRating": { "@type": "Rating", "ratingValue": data.rating || "5", "bestRating": "5" },
            "author": { "@type": "Organization", "name": data.authorName || "Happy Hunter Systems Verification" },
            "itemReviewed": { "@type": "CreativeWork", "name": data.evidenceName || "System Audit", "url": data.evidenceUrl || "https://www.happyhunterdigital.com/audit" }
          }
        }
      };
    });

    const masterSchema: any = {
      "@context": "https://schema.org",
      "@graph":[
        {
          "@type": brandData.orgType || "LocalBusiness",
          "@id": `${brandData.websiteUrl || "https://www.happyhunterdigital.com"}#organization`,
          "name": brandData.legalName || "Happy Hunter Digital",
          "description": brandData.description || "",
          "url": brandData.websiteUrl || "https://www.happyhunterdigital.com",
          "telephone": brandData.telephone || "+27 60 101 6673",
          "logo": brandData.logo || "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
          "image": brandData.image || "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
          "priceRange": brandData.priceRange || "ZAR",
          "sameAs": brandData.sameAs ||["https://www.facebook.com/Happyhunterdigital/", "https://za.linkedin.com/in/thabomotsumi"]
        }
      ]
    };

    if (offerItems.length > 0) { masterSchema["@graph"][0]["hasOfferCatalog"] = { "@type": "OfferCatalog", "name": "Verified AI Marketing Solutions", "itemListElement": offerItems }; }
    if (faqItems.length > 0) { masterSchema["@graph"].push({ "@type": "FAQPage", "mainEntity": faqItems }); }

    await db.collection("public_seo").doc("master_schema").set({ compiled_json_ld: JSON.stringify(masterSchema), last_updated: FieldValue.serverTimestamp() });
    return null;
  } catch (error) {
    console.error("Critical Error compiling Entity Schema:", error);
    return null;
  }
});
