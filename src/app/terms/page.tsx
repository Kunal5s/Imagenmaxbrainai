
'use client';

import { useState, useEffect } from 'react';

export default function TermsPage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  const contentSectionClasses = "space-y-4 text-muted-foreground text-lg leading-relaxed";
  const headingClasses = "font-headline text-3xl font-bold text-primary mt-12 mb-4";
  
  return (
    <div className="container mx-auto py-16 md:py-24 px-4 max-w-4xl opacity-0 animate-fadeInUp">
        <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Terms of Service</h1>
            {currentDate && <p className="text-sm text-muted-foreground mt-2">Last updated: {currentDate}</p>}
        </header>
        <div className={contentSectionClasses}>
            <p>Please read these Terms of Service carefully before using the Imagen Max BrainAi service.</p>
            
            <h2 className={headingClasses}>1. Agreement to Terms</h2>
            <p>By using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.</p>

            <h2 className={headingClasses}>2. Changes to Terms or Services</h2>
            <p>We may modify the Terms at any time, in our sole discretion. If we do so, we’ll let you know either by posting the modified Terms on the Site or through other communications. It’s important that you review the Terms whenever we modify them because if you continue to use the Services after we have posted modified Terms on the Site, you are indicating to us that you agree to be bound by the modified Terms.</p>

            <h2 className={headingClasses}>3. Who May Use the Services</h2>
            <p>You may use the Services only if you are 13 years or older and are not barred from using the Services under applicable law.</p>

            <h2 className={headingClasses}>4. Content Ownership and Responsibility</h2>
            <p>You are responsible for the text, images, and other content that you provide and post on or through the Services (“Your Content”), and you represent and warrant that you have all rights necessary to do so. You retain ownership of Your Content, but by providing it to the Services, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, publish, transmit, display and distribute Your Content in any and all media or distribution methods.</p>
            <p>We are not responsible for the content that other users post. You are responsible for your use of the Services and for any content you provide, including compliance with applicable laws, rules, and regulations.</p>

            <h2 className={headingClasses}>5. Prohibited Conduct</h2>
            <p>You agree not to use the Services to create, upload, transmit, distribute, or store any content that is unlawful, infringing, defamatory, obscene, pornographic, invasive of privacy or publicity rights, harassing, threatening, abusive, inflammatory, or otherwise objectionable.</p>
            
            <h2 className={headingClasses}>6. Termination</h2>
            <p>We may terminate or suspend your access to and use of the Services, at our sole discretion, at any time and without notice to you, for any reason, including if you breach these Terms.</p>

            <h2 className={headingClasses}>7. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at: <a href="mailto:legal@imagenmax.ai" className="text-primary hover:underline">legal@imagenmax.ai</a></p>
        </div>
    </div>
  );
}
