import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
    title: "Cortinas Brás | Cortinas Sob Medida e Tecidos de Luxo em São Paulo",
    description: "Especialistas em cortinas sob medida com os tecidos mais nobres do mundo. Transforme seu ambiente com a tradição e sofisticação da Cortinas Brás no Brás, SP.",
    keywords: "cortinas sob medida, tecidos de luxo, cortinas brás, decoração de interiores são paulo, cortinas linho, cortinas blackout premium",
    openGraph: {
        title: "Cortinas Brás | Luxo e Sofisticação em Cortinas Sob Medida",
        description: "A escolha perfeita para quem busca elegância e precisão. Conheça nossa curadoria de tecidos premium.",
        type: "website",
        url: "https://cortinasbras.com.br",
    },
    twitter: {
        card: "summary_large_image",
        title: "Cortinas Brás | Cortinas Sob Medida",
        description: "Transforme seu lar com a nobreza dos tecidos e a precisão do corte.",
    },
};

export default function Page() {
    return <HomeClient />;
}
