import { Button, Link, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { ReactNode, useCallback, useState } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';

const ButtonWrapper = ({ children, needAnimation }: { children: ReactNode; needAnimation: boolean }) => {
  const style = {
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <>
      {needAnimation ? (
        <motion.div
          style={style}
          animate={{
            scale: [1, 0.9, 1],
          }}
          transition={{
            ease: 'linear',
            duration: 3,
            repeat: Infinity,
          }}
        >
          {children}
        </motion.div>
      ) : (
        <div style={style}>{children}</div>
      )}
    </>
  );
};

const LinkWrapper = ({ children, href }: { children: ReactNode; href?: string }) => {
  return (
    <>
      {href ? (
        <Link href={href} width="100%">
          {children}
        </Link>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export const StartPostButton = ({
  onClick,
  href,
  needAnimation = false,
}: {
  onClick?: () => void;
  href?: string;
  needAnimation?: boolean;
}) => {
  const [isAnimating, setIsAnimating] = useState(needAnimation);
  const handleOnClick = useCallback(() => {
    setIsAnimating(false);
    onClick?.();
  }, [onClick]);

  return (
    <ButtonWrapper needAnimation={isAnimating}>
      <LinkWrapper href={href}>
        <Button onClick={handleOnClick} w="100%" p={6} bgColor="gray" color="black.0" _hover={{ bgColor: '#c1c1c1' }}>
          <Text mr={1} fontSize={16}>
            <FaRegCommentDots />
          </Text>
          グチをつぶやく
        </Button>
      </LinkWrapper>
    </ButtonWrapper>
  );
};
