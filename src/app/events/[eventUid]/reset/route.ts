import { resetEvent } from "db/exchange";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const eventUid = request.nextUrl.pathname.split('/')[2];
  const result = await resetEvent(eventUid);
  
  if (result === false) {
    return new NextResponse('bad request', { status: 400 });
  }

  return new NextResponse("ok", { status: 200 });
}
