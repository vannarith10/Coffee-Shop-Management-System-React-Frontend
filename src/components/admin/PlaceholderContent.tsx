interface PlaceholderContentProps {
  title: string;
  description: string;
}

export default function PlaceholderContent({ title, description }: PlaceholderContentProps) {
  return (
    <section className="px-8 py-4">
      <div className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-[#142618] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl text-slate-400">construction</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-[#9db8a4] max-w-md mx-auto">{description}</p>
        <button className="mt-6 px-4 py-2 bg-[#14b83d] text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all">
          Coming Soon
        </button>
      </div>
    </section>
  );
}
