export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "AI Tools", "Templates", "Mobile App", "Pricing"]
    },
    {
      title: "Resources",
      links: ["Blog", "Tutorials", "Help Center", "API", "Status"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Contact Us", "Partners"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-bold">Fotor</div>
            <p className="mt-2 text-gray-400 text-sm">
              The all-in-one photo editing and design platform that makes creativity simple.
            </p>
            <div className="mt-4 flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social, index) => (
                <a key={index} href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">{social}</span>
                  <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xs">{social.charAt(0)}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((column, columnIndex) => (
            <div key={columnIndex}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Fotor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}