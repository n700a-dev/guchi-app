import { Box, Flex, Image } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { BsCamera } from 'react-icons/bs';
import { RxCrossCircled } from 'react-icons/rx';
import imageCompression, { Options } from 'browser-image-compression';
import { LoadingSpinner } from '../components/Elements/Loadings';

const ACCEPT_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const IMAGE_LIMIT_MB = 10; //MB
const MAX_IMAGE_SIZE = 1024 * 1024 * IMAGE_LIMIT_MB;

const compressionOptions: Options = {
  maxSizeMB: 1, // MB
  maxWidthOrHeight: 1200, // px
  // onProgress: Function, // optional, a function takes one progress argument (percentage from 0 to 100)
  // useWebWorker: boolean, // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
  // signal: AbortSignal, // optional, to abort / cancel the compression

  // following options are for advanced users
  // maxIteration: number, // optional, max number of iteration to compress the image (default: 10)
  // initialQuality: number, // optional, initial quality value between 0 and 1 (default: 1)
  //alwaysKeepResolution: boolean, // optional, only reduce quality, always keep width and height (default: false)
};

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box onClick={onClick} bgColor="black.0" borderRadius={12} color="gray" cursor="pointer">
      <RxCrossCircled size={32} />
    </Box>
  );
};

type TCameraInputProps = {
  imageSrc: string | undefined;
  setImageSrc: (image: string) => void;
  style: React.CSSProperties | undefined;
};

export const CameraInput = ({ imageSrc, setImageSrc, style }: TCameraInputProps) => {
  const imageRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const imageToBase64 = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPT_IMAGE_MIME_TYPES.includes(file.type)) {
        alert(`拡張子: ${file.type} の画像には対応していません。`);
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        alert(`画像サイズは、${IMAGE_LIMIT_MB}MB以下にしてください。`);
        return;
      }
      setIsLoading(true);
      const compressedFile = await imageCompression(file, compressionOptions);

      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onload = () => {
        setImageSrc(reader.result?.toString() ?? '');
        setIsLoading(false);
      };
    },
    [setImageSrc],
  );

  const openCamera = React.useCallback(() => {
    imageRef.current?.click();
  }, [imageRef]);

  const deleteImage = React.useCallback(() => {
    if (imageRef.current) imageRef.current.value = '';
    setImageSrc('');
  }, [setImageSrc]);

  return (
    <>
      <Flex
        boxSizing="border-box"
        cursor="pointer"
        _hover={{ borderColor: 'gray' }}
        p={2}
        style={style}
        borderColor="lightgray"
        borderWidth="1px"
        borderRadius={6}
      >
        <>
          {isLoading ? (
            <LoadingSpinner style={{ padding: '8px' }} />
          ) : (
            <>
              {imageSrc ? (
                <Flex w="100%" position="relative" justifyContent="center">
                  <Box right={0} position="absolute">
                    <CloseButton onClick={deleteImage} />
                  </Box>
                  <Image src={imageSrc} alt="投稿画像" />
                </Flex>
              ) : (
                <Flex w="100%" onClick={openCamera} justifyContent="center">
                  <BsCamera height={24} size={24} color="gray" />
                </Flex>
              )}
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => imageToBase64(e.target.files?.[0])}
              />
            </>
          )}
        </>
      </Flex>
    </>
  );
};

// TODO: capture="camera" でカメラを起動する
