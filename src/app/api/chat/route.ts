import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Le chatbot n'est pas configuré côté serveur (clé OpenAI manquante). Contacte l'administrateur.",
        },
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => null);
    const message = body?.message as string | undefined;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Merci de saisir un message pour poser ta question." },
        { status: 400 },
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content:
            "Tu es un assistant francophone pour la plateforme EntreNousCours, " +
            "un site de mise en relation pour des cours entre étudiants et enseignants tunisiens. " +
            "Explique clairement le fonctionnement du site (création de cours, demandes pour rejoindre un cours, " +
            "paiement, échanges de services, Google Meet, présentiel, etc.). " +
            "Réponds toujours en français. Si la question n'a rien à voir avec EntreNousCours, " +
            'réponds poliment que tu es spécialisé sur la plateforme et propose d\'aider sur ce sujet.',
        },
        {
          role: "user",
          content: message,
        },
      ],
      store: false,
    });

    // SDK v6: text output is available via `output_text` on the top-level response
    const answer = (response as any).output_text ?? "Je n'ai pas pu générer de réponse pour le moment.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("[CHAT_API_ERROR]", error);
    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la génération de la réponse du chatbot. Réessaie dans quelques instants.",
      },
      { status: 500 },
    );
  }
}


