import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    return NextResponse.json({
      profile: user?.profile || null,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    const {
      bio,
      phone,
      location,
      videos,
      images,
      projectLinks,
      resumeUrl,
      certificates,
    } = body;

    // Validate and clean arrays
    const cleanVideos = Array.isArray(videos) ? videos.filter((v: string) => v.trim()) : [];
    const cleanImages = Array.isArray(images) ? images.filter((i: string) => i.trim()) : [];
    const cleanProjectLinks =
      Array.isArray(projectLinks) && projectLinks.length > 0
        ? projectLinks.filter((p: any) => p.name && p.url)
        : undefined;
    const cleanCertificates =
      Array.isArray(certificates) && certificates.length > 0
        ? certificates.filter((c: any) => c.name && c.issuer)
        : undefined;

    // Upsert profile
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        bio: bio || null,
        phone: phone || null,
        location: location || null,
        videos: cleanVideos,
        images: cleanImages,
      projectLinks: cleanProjectLinks ?? undefined,
        resumeUrl: resumeUrl || null,
      certificates: cleanCertificates ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        userId,
        bio: bio || null,
        phone: phone || null,
        location: location || null,
        videos: cleanVideos,
        images: cleanImages,
      projectLinks: cleanProjectLinks ?? undefined,
        resumeUrl: resumeUrl || null,
      certificates: cleanCertificates ?? undefined,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}

