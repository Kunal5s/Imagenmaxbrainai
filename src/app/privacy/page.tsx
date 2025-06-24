export default function PrivacyPage() {
  const contentSectionClasses = "space-y-4 text-muted-foreground text-lg leading-relaxed";
  const headingClasses = "font-headline text-3xl font-bold text-foreground mt-12 mb-4";
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
        <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </header>
        <div className={contentSectionClasses}>
          <p>Welcome to Imagen Max BrainAi. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.</p>
          
          <h2 className={headingClasses}>1. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Service.</li>
            <li><strong>Usage Data:</strong> Information your browser sends whenever you visit our Service. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
            <li><strong>Generated Content:</strong> We collect the prompts you submit and the images you generate using our service. This is necessary to provide and improve the service.</li>
          </ul>

          <h2 className={headingClasses}>2. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Create and manage your account.</li>
            <li>Process your transactions and send you related information.</li>
            <li>Improve our website and services.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
            <li>Notify you about updates to the Service.</li>
          </ul>

          <h2 className={headingClasses}>3. Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
          </ul>
          
          <h2 className={headingClasses}>4. Security of Your Information</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
          
          <h2 className={headingClasses}>5. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@imagenmax.ai" className="text-primary hover:underline">privacy@imagenmax.ai</a></p>
        </div>
    </div>
  );
}
