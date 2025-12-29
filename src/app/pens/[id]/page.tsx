import { redirect } from 'next/navigation';

export default function PenPage({ params }: { params: { id: string } }) {
  redirect(`/pens/${params.id}/feeding`);
}
