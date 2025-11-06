import { notFound } from 'next/navigation';

const policyContent: Record<string, { title: string; content: string[] }> = {
  'terms-of-service': {
    title: 'Terms of Service',
    content: [
      'Welcome to CineStream. By using our service, you agree to these terms.',
      'You must be at least 18 years old to subscribe to our service.',
      'Content is for personal, non-commercial use only.',
      'We reserve the right to change our prices and subscription plans.',
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: [
      'We collect information you provide to us, such as your name and email address.',
      'We use cookies to operate and provide our services.',
      'We do not share your personal information with third parties for marketing purposes.',
      'You can access and update your information in your account settings.',
    ],
  },
  'refund-policy': {
    title: 'Refund Policy',
    content: [
      'Subscription payments are non-refundable.',
      'Token purchases are final and non-refundable.',
      'If you experience technical issues, please contact support for assistance.',
    ],
  },
};

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = policyContent[params.slug];

  if (!policy) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <article className="prose prose-invert lg:prose-xl prose-h1:font-headline prose-h1:text-4xl prose-h1:mb-8 prose-p:text-muted-foreground">
        <h1>{policy.title}</h1>
        {policy.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>
    </div>
  );
}

export function generateStaticParams() {
    return Object.keys(policyContent).map((slug) => ({
      slug,
    }))
  }