¦$"use client";

import { motion } from "framer-motion";
import { History, Award, Users } from "lucide-react";

const stats = [
    { icon: History, label: "20+", description: "Anos de ExperiÃªncia" },
    { icon: Award, label: "100%", description: "ProduÃ§Ã£o PrÃ³pria" },
    { icon: Users, label: "5.000+", description: "Clientes Satisfeitos" },
];

export default function About() {
    return (
        <section id="sobre" className="py-24 bg-brand-700 text-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-extrabold mb-8 text-brand-300">Sobre a Cortinas BrÃ¡s</h2>
                        <div className="space-y-6 text-brand-100 text-lg leading-relaxed">
                            <p>
                                Desde 2003, a <strong>Cortinas BrÃ¡s</strong> Ã© sinÃ´nimo de excelÃªncia em decoraÃ§Ã£o de ambientes. Fundada como empresa familiar no tradicional bairro do BrÃ¡s, em SÃ£o Paulo, crescemos junto com nossos clientes, sempre mantendo nossos valores de qualidade, honestidade e dedicaÃ§Ã£o.
                            </p>
                            <p>
                                Com produÃ§Ã£o 100% prÃ³pria e equipe especializada, transformamos cada projeto em uma experiÃªcia Ãºnica, do primeiro contato atÃ© a instalaÃ§Ã£o final.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
                                    <stat.icon className="text-brand-300 mb-4" size={32} />
                                    <p className="font-bold text-xl mb-1">{stat.label}</p>
                                    <p className="text-xs text-brand-100/60">{stat.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-square bg-brand-500/20 rounded-full blur-3xl absolute inset-0 animate-pulse" />
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                            <img
                                src="/static/hero-bg-3.jpg"
                                alt="Equipe Cortinas BrÃ¡s"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-brand-500/20 mix-blend-overlay" />
                        </div>
                        {/* Quote badge */}
                        <div className="absolute -bottom-6 -left-6 bg-brand-500 p-8 rounded-2xl shadow-xl z-20 hidden md:block max-w-[240px]">
                            <p className="text-sm italic font-medium">
                                "NÃ£o vendemos apenas cortinas, criamos o ambiente perfeito para seus melhores momentos."
                            </p>
                            <p className="text-xs mt-4 font-bold uppercase tracking-widest text-brand-100">Cortinas BrÃ¡s</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>
        </section>
    );
}
¯ ¯³*cascade08
³´ ´µ*cascade08
µ¶ ¶¸*cascade08
¸ã ãç*cascade08
çø øú*cascade08
úü ü*cascade08
ƒ ƒ‡*cascade08
‡ˆ ˆŠ*cascade08
Š« «¯*cascade08
¯Ë ËÌ*cascade08
Ì« «¬*cascade08
¬­ ­±*cascade08
±³ ³¸*cascade08
¸º ºÁ*cascade08
Áâ âå*cascade08
å	 	’	*cascade08
’	•	 •	›	*cascade08
›	 	  	¤	*cascade08
¤	¥	 ¥	¬	*cascade08
¬	­	 ­	®	*cascade08
®	¯	 ¯	²	*cascade08
²	³	 ³	´	*cascade08
´	»	 »	¼	*cascade08
¼	¾	 ¾	Ã	*cascade08
Ã	Å	 Å	È	*cascade08
È	É	 É	Í	*cascade08
Í	Î	 Î	Ï	*cascade08
Ï	Ñ	 Ñ	Ô	*cascade08
Ô	Ö	 Ö	Ù	*cascade08
Ù	Ü	 Ü	İ	*cascade08
İ	Ş	 Ş	ß	*cascade08
ß	à	 à	â	*cascade08
â	å	 å	ç	*cascade08
ç	î	 î	ï	*cascade08
ï	ñ	 ñ	ò	*cascade08
ò	ô	 ô	õ	*cascade08
õ	ö	 ö	ü	*cascade08
ü	ı	 ı	ş	*cascade08
ş	ÿ	 ÿ	„
*cascade08
„
…
 …
†
*cascade08
†
ˆ
 ˆ
‰
*cascade08
‰
Š
 Š
‹
*cascade08
‹

 

*cascade08

‘
 ‘
•
*cascade08
•
™
 ™
œ
*cascade08
œ
¡
 ¡
¢
*cascade08
¢
£
 £
¥
*cascade08
¥
¦
 ¦
¨
*cascade08
¨
ª
 ª
«
*cascade08
«
²
 ²
³
*cascade08
³
´
 ´
¶
*cascade08
¶
¸
 ¸
º
*cascade08
º
»
 »
¿
*cascade08
¿
Á
 Á
Ã
*cascade08
Ã
È
 È
É
*cascade08
É
Ë
 Ë
Ì
*cascade08
Ì
Î
 Î
Ï
*cascade08
Ï
Ò
 Ò
Ó
*cascade08
Ó
Ö
 Ö
Ø
*cascade08
Ø
Ú
 Ú
Û
*cascade08
Û
İ
 İ
ß
*cascade08
ß
à
 à
á
*cascade08
á
â
 â
æ
*cascade08
æ
è
 è
ê
*cascade08
ê
ë
 ë
í
*cascade08
í
ö
 ö
÷
*cascade08
÷
ø
 ø
ù
*cascade08
ù
û
 û
*cascade08
ä äå*cascade08
åæ æç*cascade08
çè èé*cascade08
éì ìñ*cascade08
ñó ó÷*cascade08
÷ø øü*cascade08
üş şÿ*cascade08
ÿ „*cascade08
„† †ˆ*cascade08
ˆŒ Œ*cascade08
 ‘*cascade08
‘’ ’”*cascade08
”• •–*cascade08
–— —˜*cascade08
˜š š›*cascade08
› *cascade08
¡ ¡¤*cascade08
¤§ §¨*cascade08
¨© ©ª*cascade08
ª« «­*cascade08
­® ®±*cascade08
±µ µ¶*cascade08
¶· ·¹*cascade08
¹¼ ¼¾*cascade08
¾À ÀÅ*cascade08
ÅÇ ÇÉ*cascade08
ÉË ËÑ*cascade08
Ñ× ×İ*cascade08
İß ßâ*cascade08
âã ãç*cascade08
çë ëï*cascade08
ï÷ ÷ù*cascade08
ù± ±¶
¶· ·½
½¾ ¾¿*cascade08¿À *cascade08ÀÅ
Åé éí
íî îï*cascade08
ïñ ñó *cascade08óõ*cascade08õö *cascade08ö÷*cascade08÷ø *cascade08øù*cascade08
ùû ûü*cascade08
üı ış*cascade08
ş‡ ‡ˆ*cascade08
ˆ‰ ‰
 ‘*cascade08
‘“ “”*cascade08
”• •–*cascade08–— *cascade08—˜*cascade08
˜™ ™›*cascade08
› *cascade08
Ÿ Ÿ *cascade08
 ¢ ¢£*cascade08£¤ *cascade08¤¥*cascade08¥¦*cascade08¦§*cascade08
§¨ ¨©*cascade08
©ª ª®®° *cascade08
°± ±³
³´ ´·*cascade08·¸ *cascade08¸¼¼½ *cascade08½¾*cascade08¾¿ *cascade08¿Â
Â¦$ "(3aaa15f6da881e5e1c3f791e24c6d9b44e3873122.file:///root/next-app/src/components/About.tsx:file:///root