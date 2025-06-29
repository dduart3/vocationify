interface FeatureCardProps {
  icon: string
  title: string
  description: string
  delay?: string
}

export function FeatureCard({ icon, title, description, delay = '0s' }: FeatureCardProps) {
  return (
    <div 
      className="group bg-white border border-neutral-200 rounded-3xl p-8 text-center hover:border-neutral-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
      style={{ animationDelay: delay }}
    >
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-gradient-to-br group-hover:from-accent-100 group-hover:to-tech-100">
        <span className="text-2xl">{icon}</span>
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-neutral-900 group-hover:text-neutral-800 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-neutral-600 leading-relaxed font-light">
        {description}
      </p>
      
      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-0.5 bg-gradient-to-r from-accent-500 to-tech-600 rounded-full mx-auto"></div>
      </div>
    </div>
  )
}
