IF OBJECT_ID(N'dbo.faqs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.faqs (
        id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        question NVARCHAR(300) NOT NULL,
        answer NVARCHAR(MAX) NOT NULL,
        category NVARCHAR(80) NOT NULL DEFAULT ('GENERAL'),
        display_order INT NOT NULL DEFAULT (1),
        published BIT NOT NULL DEFAULT (1),
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.faqs)
BEGIN
    INSERT INTO dbo.faqs (id, question, answer, category, display_order, published)
    VALUES
        (NEWID(),
         N'What is the starting cost for a business website at WEBORA?',
         N'Static websites start at ₹4,000, multi-page business websites with dynamic CMS control start at ₹5,000 – ₹6,000, and advanced websites with custom modules start at ₹8,000 – ₹10,000. E-commerce and custom web applications are quoted transparently based on features.',
         N'Pricing', 1, 1),
        (NEWID(),
         N'Are domain name and web hosting included in the package prices?',
         N'No. Domain registration, cloud hosting, SSL/CDN renewals beyond free tiers, and third-party APIs or payment gateway charges are billed separately so ownership stays 100% in your name.',
         N'Billing', 2, 1),
        (NEWID(),
         N'How does the 6-month basic support work after launch?',
         N'Every launched website includes 6 months of basic post-launch support covering minor text or image guidance, CMS usage help, and bug fixes within the original scope. Major new modules or full redesigns are scoped separately.',
         N'Support', 3, 1),
        (NEWID(),
         N'How long does it typically take to build and launch a website?',
         N'Static and starter websites typically launch within 1 – 2 weeks once content is finalized. Business and advanced websites usually take 2 – 4 weeks, while custom platforms follow milestone-based timelines.',
         N'Timeline', 4, 1),
        (NEWID(),
         N'Will I be able to update text, projects, pricing, and images myself?',
         N'Yes. Your website is backed by the WEBORA Admin CMS so you can publish or edit projects, services, pricing tiers, FAQs, testimonials, and quote inquiries anytime without needing developer intervention.',
         N'CMS', 5, 1),
        (NEWID(),
         N'How do we start a project or request a custom quote?',
         N'Submit your goals through the Request a Quote page or message us directly via WhatsApp or email from the Contact page. We review your brief and send back a clear scope, cost breakdown, and timeline.',
         N'Process', 6, 1);
END;
GO
