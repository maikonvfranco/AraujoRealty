export default function Equipe() {
    return (
        <section id="sobre" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Nossos serviços</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">🏡</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Vendas</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Encontre o imóvel ideal com um processo de compra seguro, ágil e sob medida para o tamanho dos seus sonhos.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">📋</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Avaliação</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Descubra o real valor de mercado do seu patrimônio com análises técnicas precisas e baseadas na realidade da região.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">🤝</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Assessoria</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Cuidamos de toda a burocracia, contratos e financiamentos para que você conquiste suas chaves sem nenhuma dor de cabeça.
                    </p>
                </div>
            </div>
        </section>
    )
}