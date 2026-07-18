const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Accountant", "LocalBusiness"],
      "@id": "https://gjaca.in/#business",
      name: "Gautam Jaiswal & Associates",
      alternateName: "GJA Chartered Accountants",
      description:
        "ICAI-registered Chartered Accountancy firm in Pune offering statutory audit, income tax, GST, TDS, Virtual CFO, and startup advisory services.",
      url: "https://gjaca.in/",
      telephone: "+917070716471",
      email: "support@gjaca.in",
      image: "https://gjaca.in/assets/og-image.jpg",
      logo: "https://gjaca.in/assets/og-image.jpg",
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Office 118, 4th Floor, Sky Pav, Gujarwadi Phata, Katraj Nagar",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411046",
        addressCountry: "IN",
      },
      areaServed: { "@type": "City", name: "Pune" },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:30",
          closes: "18:30",
        },
      ],
      identifier: {
        "@type": "PropertyValue",
        name: "ICAI Firm Registration Number",
        value: "163360W",
      },
      sameAs: ["https://www.linkedin.com/in/cagautamjaiswal"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Chartered Accountancy Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Statutory Audit",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Income Tax Filing & Planning",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "GST Compliance & Advisory",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "TDS Management",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Virtual CFO Services",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Startup Advisory",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Company Formation / MCA",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Bookkeeping & Accounting",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Fundraising & Valuation",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://gjaca.in/#website",
      url: "https://gjaca.in/",
      name: "Gautam Jaiswal & Associates",
      inLanguage: "en-IN",
      publisher: { "@id": "https://gjaca.in/#business" },
    },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
});
