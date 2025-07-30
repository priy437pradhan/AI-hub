import { useCropOperations } from './useCropOperations';
import { useCropInteractions } from './useCropInteractions';

export const useCrop = (imageRef, setImagePreview, containerRef) => {
  const operations = useCropOperations(imageRef, setImagePreview);
  const interactions = useCropInteractions(operations.cropSettings, containerRef);

  return {
    ...operations,
    ...interactions
  };
};


