import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export const SeoHead = ({ 
  title = "Alif | Luxury Unstitched Experience", 
  description = "Precision longevity in unstitched luxury. Elevating the standard of structural elegance with Midnight Luxe aesthetics.",
  image = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000",
  url = "https://alif-luxury.com",
  type = "website"
}: SeoHeadProps) => {
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Component */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
