'use client';

import {
  Flex,
  Heading,
  Link,
  Image,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import MainLayout from '../MainLayout';
import { IconText } from '../components/Elements/Texts';
import { AiOutlineAndroid } from 'react-icons/ai';
import { RiAppleLine } from 'react-icons/ri';
import { MdLaptopChromebook } from 'react-icons/md';
import { PageIcons, Routes } from '@/config/routes';

const CustomAcordionButton = ({ children }: { children: React.ReactNode }) => (
  <AccordionButton>
    <Flex w="100%" p={2} py={3} alignItems="center" bgColor="lightgray">
      <Flex w="100%" alignItems="center">
        {children}
      </Flex>
      <AccordionIcon />
    </Flex>
  </AccordionButton>
);

const CustomAcordionPanel = ({ children }: { children: React.ReactNode }) => (
  <AccordionPanel p={4}>{children}</AccordionPanel>
);

const Page = () => {
  return (
    <MainLayout>
      <Flex>
        <Heading as="h2" color="gray" fontSize={28}>
          アプリインストール
        </Heading>
      </Flex>
      <Accordion allowToggle mt={6}>
        <AccordionItem>
          <CustomAcordionButton>
            <IconText Icon={RiAppleLine} text="iPhone / iPad はこちら" />
          </CustomAcordionButton>
          <CustomAcordionPanel>
            <Box>1. 画面下のアイコンをタップ</Box>
            <Box>2.「ホーム画面に追加」をタップ</Box>
            <Image mt={2} src="/install_iphone.png" alt="install_android" w="100%" className="image-prohibited-drag" />
          </CustomAcordionPanel>
        </AccordionItem>
        <AccordionItem>
          <CustomAcordionButton>
            <IconText Icon={AiOutlineAndroid} text="Android はこちら" />
          </CustomAcordionButton>
          <CustomAcordionPanel>
            <Box>1. 右上の三点リーダーをタップ</Box>
            <Box>2.「アプリをインストール」をタップ</Box>
            <Image mt={2} src="/install_android.png" alt="install_android" w="100%" className="image-prohibited-drag" />
          </CustomAcordionPanel>
        </AccordionItem>
        <AccordionItem>
          <CustomAcordionButton>
            <IconText Icon={MdLaptopChromebook} text="PC はこちら" />
          </CustomAcordionButton>
          <CustomAcordionPanel>
            <Box>1. 画面上部のアドレスバーのアイコンをクリック</Box>
            <Image mt={2} src="/install_pc.png" alt="install_pc" w="100%" className="image-prohibited-drag" />
          </CustomAcordionPanel>
        </AccordionItem>
      </Accordion>
      <Box mt={8}>
        <Link href={Routes.top}>
          <IconText Icon={PageIcons.top} text="トップページに戻る" fontSize={14} />
        </Link>
      </Box>
    </MainLayout>
  );
};

export default Page;
