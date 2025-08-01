
'use client';

import { useState, useEffect } from 'react';

export default function DisclaimerPage() {
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
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Disclaimer</h1>
          {currentDate && <p className="text-sm text-muted-foreground mt-2">Last updated: {currentDate}</p>}
        </header>
        <div className={contentSectionClasses}>
            <p>The information provided by Imagen Max BrainAi (“we,” “us,” or “our”) on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
            
            <h2 className={headingClasses}>1. No Guarantees of Accuracy</h2>
            <p>The images and content generated by our AI are for entertainment and informational purposes. While we strive for high-quality outputs, we cannot guarantee the factual accuracy, appropriateness, or quality of the generated content. The AI may produce unexpected or inaccurate results. Do not rely on the generated content as a sole source of information.</p>

            <h2 className={headingClasses}>2. External Links Disclaimer</h2>
            <p>The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties or links to websites and features. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.</p>

            <h2 className={headingClasses}>3. Professional Disclaimer</h2>
            <p>The site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of professional advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE IS SOLELY AT YOUR OWN RISK.</p>

            <h2 className={headingClasses}>4. AI-Generated Content</h2>
            <p>The images generated by Imagen Max BrainAi are created by an artificial intelligence model. These images may be fictional and should not be interpreted as factual representations. The AI's outputs are not endorsements and do not reflect the views or opinions of Imagen Max BrainAi or its staff.</p>
        </div>
    </div>
  );
}
