interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    src: "https://res.cloudinary.com/dxstpixjr/image/upload/v1760911746/mtyhostal_logo_dark_apoeqv.png",
    alt: "MtyHostal logo",
    url: "#",
  },
  tagline = "Components made easy.",
  menuItems = [
    {
      title: "Product",
      links: [
        { text: "Overview", url: "#" },
        { text: "Pricing", url: "#" },
        { text: "Marketplace", url: "#" },
        { text: "Features", url: "#" },
        { text: "Integrations", url: "#" },
        { text: "Pricing", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#" },
        { text: "Team", url: "#" },
        { text: "Blog", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Contact", url: "#" },
        { text: "Privacy", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help", url: "#" },
        { text: "Sales", url: "#" },
        { text: "Advertise", url: "#" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "#" },
        { text: "Instagram", url: "#" },
        { text: "LinkedIn", url: "#" },
      ],
    },
  ],
  copyright = "© 2024 Shadcnblocks.com. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: Footer2Props) => {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <footer>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="md:w-1/3">
              <a href={logo.url} className="inline-flex items-center gap-3">
                <img src={logo.src} alt={logo.alt} className="h-40 w-auto" />
              </a>
              <p className="mt-4 text-gray-300">{tagline}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:w-2/3">
              {menuItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-3 font-semibold text-gray-100">
                    {section.title}
                  </h3>
                  <ul className="text-gray-400 space-y-2">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a
                          href={link.url}
                          className="hover:text-white transition-colors duration-150 block"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between text-gray-400 text-sm">
            <p>{copyright}</p>
            <ul className="flex gap-4 mt-3 md:mt-0">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a href={link.url} className="hover:text-white underline">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
