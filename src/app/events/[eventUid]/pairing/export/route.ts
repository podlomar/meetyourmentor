import { loadEvent } from "db/exchange";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const eventUid = request.nextUrl.pathname.split('/')[2];
  const event = await loadEvent(eventUid);
  if (event === null) {
    return new Response('Event not found', { status: 404 });
  }
  
  if (event.status.phase !== 'published' && event.status.phase !== 'computed') {
    return new Response('Pairing is not finished yet', { status: 400 });
  }

  const result = event.status.pairing.mentees.map((menteeIndex, mentorIndex) => {
    const mentor = event.mentors[mentorIndex];
    const mentee = event.mentees[menteeIndex];
    return `"${mentor.company}","${mentor.names}","${mentee.project}","${mentee.names}"`;
  }).join('\n');
  
  return new NextResponse(result, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${event.uid}.csv"`,
    },
  });
}
