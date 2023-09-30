import { commitPartyPrefs, storePartyPrefs } from "db/exchange";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const partyUid = request.nextUrl.pathname.split('/')[2];
  const result = await commitPartyPrefs(partyUid);
  
  if (result === 'not-found') {
    return new NextResponse("not-found", { status: 404 });
  }

  if (result === 'not-pending') {
    return new NextResponse("not-pending", { status: 400 });
  }

  if (result === 'db-fail') {
    return new NextResponse("db-fail", { status: 500 });
  }

  return new NextResponse("ok", { status: 200 });
}
