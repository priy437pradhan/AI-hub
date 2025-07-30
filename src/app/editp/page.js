'use client';

import dynamic from 'next/dynamic';

const Editpt = dynamic(() => import('../../components/EditingPlatform'), {
  ssr: false,
});

export default function EditPtPage() {
  return <Editpt />;
}
