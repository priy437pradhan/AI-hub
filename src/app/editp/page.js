// "use client"
// import Editpt from '../../pages/EditingPlatform'
import dynamic from 'next/dynamic';
const Editpt  = dynamic(() => import('../../pages/EditingPlatform'), {
  ssr: false
});
export default function editpt() {
  return (
    <>
   
      <Editpt />
 
    </>
  );
}