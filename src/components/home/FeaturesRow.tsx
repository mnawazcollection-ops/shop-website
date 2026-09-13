export default function FeaturesRow() {
  const features = [
    {
      gradient: "from-emerald-500 via-teal-600 to-emerald-700",
      shadow: "shadow-emerald-500/25",
      badge: "Complimentary",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      title: "Insured Free Courier",
      description: "Complimentary armored courier delivery on orders above Rs. 50,000",
    },
    {
      gradient: "from-blue-500 via-indigo-600 to-blue-700",
      shadow: "shadow-blue-500/25",
      badge: "256-Bit SSL",
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
      icon: (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: "Encrypted Payment",
      description: "Bank-grade PCI security & buyer protection on all transactions",
    },
    {
      gradient: "from-amber-400 via-yellow-500 to-orange-500",
      shadow: "shadow-amber-500/30",
      badge: "BIS 750 Hallmarked",
      badgeColor: "text-amber-800 bg-amber-50 border-amber-200",
      icon: (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      title: "Artisan Quality Guarantee",
      description: "100% certified ethical 18K/24K solid gold & GIA natural diamonds",
    },
    {
      gradient: "from-rose-500 via-pink-600 to-rose-700",
      shadow: "shadow-rose-500/25",
      badge: "VIP Service",
      badgeColor: "text-rose-700 bg-rose-50 border-rose-200",
      icon: (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      title: "24/7 Concierge Care",
      description: "Dedicated jewelry consultants available via hotline & WhatsApp",
    },
  ];

  return (
    <section className="py-14 lg:py-18 bg-gradient-to-b from-white via-[#FCFAF8] to-white border-y border-[#eee]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-[#eee] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-13 h-13 rounded-xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${feature.badgeColor}`}
                >
                  {feature.badge}
                </span>
              </div>
              <h4 className="text-[16px] font-bold text-[#1A1A1A] mb-1.5 group-hover:text-[#D97706] transition-colors">
                {feature.title}
              </h4>
              <p className="text-[13px] text-[#666] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
