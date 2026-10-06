export default function Equipe() {
    return (
        <section id="contato" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                    A experiência de uma mãe corretora unida à energia e visão do filho.
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-medium text-sm text-center mb-6">Mãe</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Maisa Aparecida Araújo De Souza</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        Mãe, avó e corretora: multiplico meus dias para realizar sonhos! Não apenas vendo paredes, mas ajudo famílias a construírem suas histórias e futuras gerações. Qual é o sonho da sua família hoje?
                    </p>
                    <span className="block text-sm text-slate-500 mb-4">(35) 99832-6808</span>
                    <a
                        href="https://wa.me/5535998326808"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                    >
                        Falar no WhatsApp
                    </a>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-medium text-sm text-center mb-6">Filho</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Alexsandro Vitor Araújo De Souza</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        Quem já me viu com a bola nos pés sabe: controle, precisão e criatividade sempre foram a minha marca como um dos melhores atletas de futebol freestyle de Minas Gerais. Agora, eu trouxe essa mesma energia e disciplina para o mercado imobiliário!
                    </p>
                    <span className="block text-sm text-slate-500 mb-4">(35) 99268-2896</span>
                    <a
                        href="https://wa.me/5535992682896"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                    >
                        Falar no WhatsApp
                    </a>
                </div>
            </div>
        </section>
    )
}