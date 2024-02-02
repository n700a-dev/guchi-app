'use client';

import React, { ReactNode } from 'react';
import MainLayout from './MainLayout';
import { Box, Text, Image, Flex, Heading } from '@chakra-ui/react';
import { StartButton } from './posts/StartButton';
import { PhotoZoomModal } from './posts/PhotoZoomModal';
import Link from 'next/link';
import { IconText } from './components/Elements/Texts';
import { PageIcons, Routes } from '@/config/routes';

// 焚火イラスト
// https://www.freepik.com/free-vector/cartoon-burning-camp-fire-flames-with-campfire-with-woods-long-tongues-game-animation-sprite-orange-yellow-shining-flare-blaze-inferno-ignition-isolated-black-background-vector-icons-set_21584902.htm#query=bonfire%20animation&position=14&from_view=search&track=ais&uuid=38ae5fcd-64e0-4bd3-9dc1-227ba6a9887c

const PresentationSection = ({
  title,
  description,
  src,
  isH1 = false,
  isShowStartButton = false,
  imageDescription,
  CopyRight,
}: {
  title?: string;
  description: ReactNode;
  src?: string;
  isH1?: boolean;
  isShowStartButton?: boolean;
  imageDescription?: string;
  CopyRight?: ReactNode;
}) => (
  <Flex w="100%" flexDirection="column" alignItems="center">
    <Flex w="100%" justifyContent="center">
      {title && (
        <Heading as={isH1 ? 'h1' : 'h2'} fontSize={isH1 ? '36px' : '28px'} color="gray">
          {title}
        </Heading>
      )}
    </Flex>
    <Text my={4} color="gray.dark" fontSize={16}>
      {description}
    </Text>
    {isShowStartButton && (
      <Flex w="100%" h="100%" my={8} justifyContent="center" alignItems="center">
        <StartButton buttonText="はじめる" />
      </Flex>
    )}
    {src && (
      <>
        {imageDescription ? (
          <PhotoZoomModal image={src} description={imageDescription}>
            <Flex justifyContent="center" w="100%" pointerEvents="none">
              <Box maxW="480px">
                <Image src={src} alt="fire" className="image-prohibited-drag" borderRadius="8px" />
              </Box>
            </Flex>
          </PhotoZoomModal>
        ) : (
          <Flex justifyContent="center" w="100%" p={6} pointerEvents="none">
            <Box maxW="480px">
              <Image src={src} alt="fire" className="image-prohibited-drag" borderRadius="8px" />
            </Box>
          </Flex>
        )}
      </>
    )}
    {CopyRight && (
      <Flex justifyContent="center" w="100%" fontSize={12} color="gray.dark">
        {CopyRight}
      </Flex>
    )}
  </Flex>
);

export default function Home() {
  return (
    <MainLayout>
      <Flex flexDirection="column" alignItems="center" m={4} mb={12} gap={12}>
        <PresentationSection
          title="さあ、人の目を気にせず、グチろう！"
          description={
            <>
              辛くなったとき、自分の気持ちを吐き出したいとき、グチをつぶやける場所はありますか？<br></br>
              「グチログ」は、自分一人だけでグチを吐き出せるサービスです！<br></br>
              SNSのように誰かを気にする必要はありません。自分だけのつぶやき場所としてご利用ください。
            </>
          }
          isH1
          isShowStartButton
          src="/fire_image.png"
          CopyRight={
            <>
              著作者：
              <Link
                href="https://www.freepik.com/free-vector/cartoon-burning-camp-fire-flames-with-campfire-with-woods-long-tongues-game-animation-sprite-orange-yellow-shining-flare-blaze-inferno-ignition-isolated-black-background-vector-icons-set_21584902.htm#query=bonfire%20animation&position=14&from_view=search&track=ais&uuid=38ae5fcd-64e0-4bd3-9dc1-227ba6a9887c"
                target="blank"
              >
                Freepik
              </Link>
            </>
          }
        />
        <PresentationSection
          title="グチをその場で燃やそう"
          description="つぶやいたグチはカードに変わります。カードを炎にドラッグすることでグチを燃やすことができます。"
          src="/screen_post_new.png"
          imageDescription="カードを上にドラッグすると燃やすことができます"
        />
        <PresentationSection
          title="グチは後から見返せる"
          description={
            <>
              グチを燃やすと、自動的に保存されます。燃やしたグチを後から見返すことで、自分のつぶやき、気持ちを客観的に振り返ることができます。
              日記のように使うこともできます。
            </>
          }
          src="/screen_post_list.png"
          imageDescription="燃やしたカードは後から見返すことができます"
        />
        <PresentationSection
          title="感情を振り返ろう"
          description={
            <>
              グチ分析画面では、日ごとの投稿数と感情の割合を確認できます。自分の感情の変化を客観的に振り返ることができます。
            </>
          }
          src="/screen_post_analysis.png"
          imageDescription="投稿数と感情の割合を確認できます"
        />
        <PresentationSection
          title="ログインは不要。今すぐはじめよう！"
          description="ユーザー登録やログインせずにお使いいただけます。ログインしない場合、グチはお使いの端末に保存されます。"
          isShowStartButton
        />
        <Flex gap={6} justifyContent="center" width="100%" mt={6}>
          <Link href={Routes.terms.root}>
            <IconText Icon={PageIcons.terms.root} text="利用規約" fontSize={14} />
          </Link>
          <Link href={Routes.inquiry.googleForm} target="_blank">
            <IconText Icon={PageIcons.inquiry.googleForm} text="お問い合わせ" fontSize={14} />
          </Link>
        </Flex>
        <Box h={4}></Box>
        <Flex
          h={8}
          w="100%"
          maxW="768px"
          position="fixed"
          bottom={2}
          bgColor="black.0"
          color="gray.dark"
          justifyContent="center"
          borderRadius={4}
          borderBottomWidth={2}
          borderColor="lightgray"
        >
          <Link href={Routes.install.root} style={{ width: '100%' }}>
            <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
              <IconText Icon={PageIcons.install.root} text="アプリインストールはこちら" fontSize={14} />
            </Flex>
          </Link>
        </Flex>
      </Flex>
    </MainLayout>
  );
}
