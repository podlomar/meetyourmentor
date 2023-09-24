import { storePartyPrefs } from "db/exchange";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!Array.isArray(data)) {
      return new NextResponse("invalid-prefs", { status: 400 });
    }

    for (const pref of data) {
      if (typeof pref !== 'number') {
        return new NextResponse("invalid-prefs", { status: 400 });
      }
    }

    const newPrefs = data as number[];
    const partyUid = request.nextUrl.pathname.split('/')[2];
    const result = await storePartyPrefs(partyUid, newPrefs);

    if (result === 'not-found') {
      return new NextResponse("not-found", { status: 404 });
    }

    if (result === 'invalid-prefs') {
      return new NextResponse("invalid-prefs", { status: 400 });
    }

    if (result === 'db-fail') {
      return new NextResponse("db-fail", { status: 500 });
    }

    return new NextResponse("ok", { status: 200 });
  } catch (e) {
    if (e instanceof SyntaxError || e instanceof TypeError) {
      return new NextResponse("invalid-body", { status: 400 });
    }

    return new NextResponse("server-error", { status: 500 });
  }
}
