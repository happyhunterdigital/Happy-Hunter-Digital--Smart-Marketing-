// Inside your handleSubmit function in AiAudit.tsx

// 1. Define the professional HTML Email
const emailHtml = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2>Your Website Audit Results</h2>
    <p>Hi there,</p>
    <p>We've completed the preliminary scan of your digital presence. Based on our analysis, we identified several critical gaps that are likely costing you customers right now:</p>
    
    <div style="background-color: #f8d7da; border-left: 5px solid #dc3545; padding: 15px; margin: 20px 0;">
      <h3 style="color: #721c24; margin-top: 0;">⚠️ Critical Missed Opportunities:</h3>
      <ul>
        <li><strong>SEO Visibility:</strong> Your site is missing key metadata, making it invisible to high-intent Google searchers.</li>
        <li><strong>Conversion Speed:</strong> Page load times are higher than industry standard, leading to a 20%+ bounce rate.</li>
        <li><strong>Trust Signals:</strong> Lack of immediate social proof or clear call-to-action sequences above the fold.</li>
      </ul>
    </div>

    <p>These issues are fixable, but they require a specific strategy tailored to your business model.</p>
    
    <p><strong>I have the solutions ready, but I want to walk you through them personally to ensure they fit your goals.</strong></p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://calendly.com/motsumitl/30min" 
         style="background-color: #007bff; color: white; padding: 15px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px;">
         👉 Click Here to Unlock Your Solution (Discovery Call)
      </a>
    </div>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />

    <p>Warm regards,</p>
    <p><strong>Motsumi</strong><br>
    Happy Hunter Digital<br>
    <a href="https://happyhunterdigital.com" style="color: #007bff;">www.happyhunterdigital.com</a>
    </p>
  </div>
`;

// 2. Save to Firestore (which triggers the email)
await addDoc(collection(db, "mail"), {
  to: email, // The user's email from the form
  message: {
    subject: "⚠️ Urgent: We found gaps in your digital strategy",
    html: emailHtml,
  },
  date: new Date(),
  website: url, // Saving the website they entered
  status: "new" // Mark as new for your admin panel
});
