export default function Equipe() {
    return (
        <section id="sobre" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Por que escolher a Araújo Imóveis?</h2>
                <p className="mt-4 text-slate-600">
                    Fundada sobre os pilares da honestidade e do respeito, nossa missão é oferecer um atendimento humanizado e transparente em cada negociação.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">🤝</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Atendimento Familiar</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Aqui você não é apenas mais um número de contrato. Entendemos as reais necessidades da sua família.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">🏡</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">As Melhores Opções</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Uma curadoria selecionada de casas, apartamentos e lotes nas melhores localizações da região.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">🔍</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Transparência Total</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Contratos claros, documentação rigorosamente checada e segurança jurídica do início ao fim do processo.
                    </p>
                </div>
            </div>
        </section>
    )
}